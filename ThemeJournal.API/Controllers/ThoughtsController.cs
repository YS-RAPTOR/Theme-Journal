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
        public IActionResult UpsertThought(Guid id, ThoughtModel thought)
        {
            // Transform the Dates according to User Start time
            thought.CreatedAt = _userService.TrasformDate(thought.CreatedAt);
            if (thought.CreatedAt != _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Can only create thoughts for today");
            }

            var userId = _userService.GetUserId();
            _thoughtData.UpsertThought(userId, id, thought);
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<GetThoughtModel>), 200)]
        public IActionResult GetThoughts()
        {
            string? upperDate = HttpContext.Request.Query["upperDate"];

            if (upperDate != null && !DateTime.TryParse(upperDate, out DateTime _))
            {
                return BadRequest("UpperDate must be a DateTime");
            }

            DateTime? upperDateCorrect =
                upperDate == null ? null : _userService.TrasformDate(DateTime.Parse(upperDate));

            string? lowerDate = HttpContext.Request.Query["lowerDate"];

            if (lowerDate != null && !DateTime.TryParse(lowerDate, out DateTime _))
            {
                return BadRequest("LowerDate must be a DateTime");
            }

            DateTime? lowerDateCorrect =
                lowerDate == null ? null : _userService.TrasformDate(DateTime.Parse(lowerDate));

            var userId = _userService.GetUserId();
            var output = _thoughtData.GetThoughts(userId, upperDateCorrect, lowerDateCorrect);
            return Ok(output);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ThoughtModel), 200)]
        public IActionResult GetThoughtById(Guid id)
        {
            var userId = _userService.GetUserId();
            var output = _thoughtData.GetThoughtById(userId, id);
            return Ok(output[0]);
        }
    }
}
