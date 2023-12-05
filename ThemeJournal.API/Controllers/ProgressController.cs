using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using ThemeJournal.Api.Services;
using ThemeJournal.ServiceLibrary.Data;

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
        public IActionResult Put(Guid id, int progress)
        {
            // Can only update progress for today
            var userId = _userService.GetUserId();
            var progressData = _progressData.GetProgress(userId, [id], null, null);

            if (progressData.Count == 0)
            {
                return NotFound();
            }

            if (progressData[0].CompletionDate != _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Can only update today's progress.");
            }

            BitArray bits = new(2);

            switch (progress)
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
                    return BadRequest();
            }
            _progressData.UpdateProgress(userId, id, bits);
            return Ok(bits);
        }
    }
}
