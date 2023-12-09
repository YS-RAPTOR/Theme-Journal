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
    public class ProgressController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IProgressData _progressData;

        public ProgressController(IUserService userService, IProgressData progressData)
        {
            _userService = userService;
            _progressData = progressData;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpsertProgress(Guid id, PostProgressModel progress)
        {
            // Transform the Dates according to User Start time
            progress.CompletionDate = _userService.TrasformDate(progress.CompletionDate);

            var userId = _userService.GetUserId();

            if (progress.CompletionDate != _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Can only update/insert today's progress.");
            }

            BitArray bits = new(2);

            switch (progress.Progress)
            {
                case 0:
                    bits[0] = false;
                    bits[1] = false;
                    break;
                case 1:
                    bits[0] = true;
                    bits[1] = false;
                    break;
                case 2:
                    bits[0] = true;
                    bits[1] = true;
                    break;
                default:
                    return BadRequest("Invalid Progress. Must be between 0-2.");
            }

            //Make sure the user has not already submitted progress for today under different Id for same task
            var progresses = await _progressData.GetProgress(
                userId,
                [progress.TaskId],
                progress.CompletionDate.AddDays(1),
                progress.CompletionDate
            );

            if (progresses.Count == 1 && progresses[0].Id != id)
            {
                return BadRequest("Can only create one progress per day of specific task");
            }
            else if (progresses.Count > 1)
            {
                return BadRequest("Can only create one progress per day of specific task");
            }

            await _progressData.UpsertProgress(userId, id, progress, bits);
            return Ok();
        }
    }
}
