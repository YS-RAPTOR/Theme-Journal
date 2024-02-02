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
    public class ThemeObjectiveController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IObjectiveData _objectiveData;
        private readonly IThemeData _themeData;

        public ThemeObjectiveController(
            IUserService userService,
            IObjectiveData objectiveData,
            IThemeData themeData
        )
        {
            _userService = userService;
            _objectiveData = objectiveData;
            _themeData = themeData;
        }

        [HttpGet("{themeId}")]
        [ProducesResponseType(typeof(ObjectiveModel), 200)]
        public async Task<IActionResult> Get(Guid themeId)
        {
            var userId = _userService.GetUserId();
            var objectives = await _objectiveData.GetObjectiveByThemeId(userId, themeId);
            return Ok(objectives);
        }

        [HttpPost("{themeId}")]
        public async Task<IActionResult> Post(Guid themeId, List<ObjectiveModel> objectives)
        {
            // Can create a theme objective only if the theme has not been completed
            var userId = _userService.GetUserId();
            var theme = await _themeData.GetThemeByID(userId, themeId);

            if (theme.Count == 0)
            {
                return NotFound();
            }

            if (theme[0].EndDate <= await _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Theme has already been completed.");
            }

            await _objectiveData.CreateObjective(userId, themeId, objectives);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] int colorId)
        {
            // Can update color any time
            var userId = _userService.GetUserId();
            await _objectiveData.UpdateObjective(userId, id, colorId);
            return Ok();
        }

        [HttpDelete("{themeId}/{id}")]
        public async Task<IActionResult> Delete(Guid themeId, Guid id)
        {
            // Can only delete a theme if it has not started yet
            var userId = _userService.GetUserId();
            var theme = await _themeData.GetThemeByID(userId, themeId);

            if (theme.Count == 0)
            {
                return NotFound();
            }

            if (theme[0].StartDate <= await _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest(
                    "Cannot update an objective of a theme that has/had already started"
                );
            }

            await _objectiveData.DeleteObjective(userId, themeId, id);
            return Ok();
        }
    }
}
