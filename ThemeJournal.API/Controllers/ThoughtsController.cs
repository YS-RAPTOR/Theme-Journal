using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using ThemeJournal.Api.Services;
using ThemeJournal.ServiceLibrary.Data;
using ThemeJournal.ServiceLibrary.Models;

namespace ThemeJournal.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    [RequiredScope(AcceptedScope = ["access_as_user"])]
    public class ThoughtsController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IThoughtData _thoughtData;

        public ThoughtsController(IUserService userService, IThoughtData thoughtData)
        {
            _userService = userService;
            _thoughtData = thoughtData;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpsertThought(Guid id, ThoughtModel thought)
        {
            // Transform the Dates according to User Start time
            thought.CreatedAt = _userService.TrasformDate(thought.CreatedAt);

            if (thought.CreatedAt != _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Can only create/update thoughts for today");
            }

            // Has to be the only theme today
            var userId = _userService.GetUserId();
            var thoughts = await _thoughtData.GetThoughts(
                userId,
                thought.CreatedAt.AddDays(1),
                thought.CreatedAt
            );

            if (thoughts.Count == 1 && thoughts[0].Id != id)
            {
                return BadRequest("Can only create one thought per day");
            }
            else if (thoughts.Count > 1)
            {
                return BadRequest("Can only create one thought per day");
            }

            await _thoughtData.UpsertThought(userId, id, thought);
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<GetThoughtModel>), 200)]
        public async Task<IActionResult> GetThoughts(
            [FromQuery] DateTime? upperDate,
            [FromQuery] DateTime? lowerDate
        )
        {
            DateTime? upperDateCorrect = !upperDate.HasValue
                ? null
                : _userService.TrasformDate(upperDate.Value);

            DateTime? lowerDateCorrect = !lowerDate.HasValue
                ? null
                : _userService.TrasformDate(lowerDate.Value);

            var userId = _userService.GetUserId();
            var output = await _thoughtData.GetThoughts(userId, upperDateCorrect, lowerDateCorrect);
            return Ok(output);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ThoughtModel), 200)]
        public async Task<IActionResult> GetThoughtById(Guid id)
        {
            var userId = _userService.GetUserId();
            var output = await _thoughtData.GetThoughtById(userId, id);

            return Ok(output[0]);
        }
    }
}
