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
    public class GratitudeController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IGratitudeData _gratitudeData;

        public GratitudeController(IUserService userService, IGratitudeData gratitudeData)
        {
            _userService = userService;
            _gratitudeData = gratitudeData;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpsertGratitude(Guid id, GratitudeModel gratitude)
        {
            // Transform the Dates according to User Start time
            // Set sentiment to null since the user cannot set it
            gratitude.CreatedAt = await _userService.TrasformDate(gratitude.CreatedAt);
            gratitude.Sentiment = null;

            if (gratitude.CreatedAt != await _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Can only create/update gratitudes for today");
            }

            // Has to be the only gratitude of a specific type for today
            var userId = _userService.GetUserId();
            var gratitudes = await _gratitudeData.GetGratitudes(
                userId,
                null,
                gratitude.CreatedAt.AddDays(1),
                gratitude.CreatedAt,
                gratitude.Time
            );

            if (gratitudes.Count == 1 && gratitudes[0].Id != id)
            {
                return BadRequest("Can only create one gratitude per day of specific type");
            }
            else if (gratitudes.Count > 1)
            {
                return BadRequest("Can only create one gratitude per day of specific type");
            }

            await _gratitudeData.UpsertGratitude(userId, id, gratitude);
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<GetGratitudeModel>), 200)]
        public async Task<IActionResult> GetGratitudes(
            [FromQuery] DateTime? upperDate,
            [FromQuery] DateTime? lowerDate,
            [FromQuery] float? sentiment,
            [FromQuery] TimeOfDay? time
        )
        {
            DateTime? upperDateCorrect = !upperDate.HasValue
                ? null
                : await _userService.TrasformDate(upperDate.Value);

            DateTime? lowerDateCorrect = !lowerDate.HasValue
                ? null
                : await _userService.TrasformDate(lowerDate.Value);

            float? sentimentCorrect = !sentiment.HasValue ? null : sentiment;

            TimeOfDay? timeCorrect = !time.HasValue ? null : time;

            var userId = _userService.GetUserId();

            var output = await _gratitudeData.GetGratitudes(
                userId,
                sentimentCorrect,
                upperDateCorrect,
                lowerDateCorrect,
                timeCorrect
            );

            return Ok(output);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(GratitudeModel), 200)]
        public async Task<IActionResult> GetGratitudeById(Guid id)
        {
            var userId = _userService.GetUserId();
            var output = await _gratitudeData.GetGratitudeById(userId, id);
            return Ok(output[0]);
        }
    }
}
