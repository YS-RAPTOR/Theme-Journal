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
        public IActionResult UpsertGratitude(Guid id, GratitudeModel gratitude)
        {
            // Transform the Dates according to User Start time
            // Set sentiment to null since the user cannot set it
            gratitude.CreatedAt = _userService.TrasformDate(gratitude.CreatedAt);
            gratitude.Sentiment = null;

            if (gratitude.CreatedAt != _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Can only create gratitudes for today");
            }
            // TODO: Fix everything about TimeOfDay Field introduced

            var userId = _userService.GetUserId();

            _gratitudeData.UpsertGratitude(userId, id, gratitude);
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<GetGratitudeModel>), 200)]
        public IActionResult GetGratitudes()
        {
            string? sentiment = HttpContext.Request.Query["sentiment"];

            if (sentiment != null && !float.TryParse(sentiment, out float _))
            {
                return BadRequest("Sentiment must be a float");
            }

            float? sentimentCorrect = sentiment == null ? null : float.Parse(sentiment);

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

            var output = _gratitudeData.GetGratitudes(
                userId,
                sentimentCorrect,
                upperDateCorrect,
                lowerDateCorrect
            );

            return Ok(output);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(GratitudeModel), 200)]
        public IActionResult GetGratitudeById(Guid id)
        {
            var userId = _userService.GetUserId();
            var output = _gratitudeData.GetGratitudeById(userId, id);
            return Ok(output[0]);
        }
    }
}
