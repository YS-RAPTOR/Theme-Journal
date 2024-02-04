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
    public class UserController : ControllerBase
    {
        private readonly IUserData _userData;
        private readonly IUserService _userService;
        private readonly IThemeData _themeData;

        public UserController(IUserData userData, IUserService userService, IThemeData themeData)
        {
            _userData = userData;
            _userService = userService;
            _themeData = themeData;
        }

        [HttpPut("time")]
        public async Task<IActionResult> EditTime(TimeModel time)
        {
            var userId = _userService.GetUserId();
            await _userData.UpsertTime(userId, time);
            // Update current theme end time to match. Update the theme startDate and endDate  for themes that have not yet started.
            var today = await _userService.TrasformDate(DateTime.UtcNow);
            var uncompletedThemes = await _themeData.GetThemes(
                _userService.GetUserId(),
                today,
                null
            );

            // sort the themes by start date
            uncompletedThemes.Sort((x, y) => x.StartDate.CompareTo(y.StartDate));

            // enumerate through the themes and update the start and end dates
            for (int i = 0; i < uncompletedThemes.Count; i++)
            {
                var theme = new ThemeModel
                {
                    Title = uncompletedThemes[i].Title
                };

                if (i == 0)
                {
                    theme.StartDate = uncompletedThemes[i].StartDate;
                    theme.EndDate = await _userService.TrasformDate(uncompletedThemes[i].EndDate, false);
                }
                else
                {
                    theme.StartDate = await _userService.TrasformDate(uncompletedThemes[i].StartDate, false);
                    theme.EndDate = await _userService.TrasformDate(uncompletedThemes[i].EndDate, false);
                }
                await _themeData.UpdateTheme(userId, uncompletedThemes[i].Id, theme);
            }
            return Ok();
        }

        [HttpGet("time")]
        [ProducesResponseType(typeof(GetTimeModel), 200)]
        public async Task<IActionResult> GetTime()
        {
            var userId = _userService.GetUserId();
            var time = await _userData.GetTime(userId);
            if (time.Count == 0)
            {
                return Ok(new GetTimeModel());
            }

            return Ok(time[0]);
        }
    }
}
