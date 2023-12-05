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
    public class ThemeController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IThemeData _themeData;

        public ThemeController(IUserService userService, IThemeData themeData)
        {
            _userService = userService;
            _themeData = themeData;
        }

        [HttpPost]
        public IActionResult CreateTheme(PostThemeModel theme)
        {
            // Transform the Dates according to User Start time
            theme.StartDate = _userService.TrasformDate(theme.StartDate);
            theme.EndDate = _userService.TrasformDate(theme.EndDate);

            // Start Date should be greater than or equal to today
            if (theme.StartDate < _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Start Date should be greater than or equal to today");
            }

            var userId = _userService.GetUserId();
            _themeData.CreateTheme(userId, theme);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTheme(Guid id, ThemeModel theme)
        {
            // Can only update if the theme has not started yet
            var userId = _userService.GetUserId();
            var themeToUpdate = _themeData.GetThemeByID(userId, id);
            if (themeToUpdate.Count == 0)
            {
                return NotFound();
            }

            if (themeToUpdate[0].StartDate < _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot update a theme that has already started");
            }

            // Transform the Dates according to User Start time
            theme.StartDate = _userService.TrasformDate(theme.StartDate);
            theme.EndDate = _userService.TrasformDate(theme.EndDate);

            _themeData.UpdateTheme(userId, id, theme);
            return Ok();
        }

        [HttpPut("{id}/extend")]
        public IActionResult ExtendTheme(Guid id, DateTime endDate)
        {
            // Can only extend if the theme has started
            // Cannot extend a theme that has completed
            var userId = _userService.GetUserId();
            var themeToUpdate = _themeData.GetThemeByID(userId, id);
            if (themeToUpdate.Count == 0)
            {
                return NotFound();
            }

            if (themeToUpdate[0].StartDate >= _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot extend a theme that hasn't started");
            }

            if (themeToUpdate[0].EndDate < _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot extend a theme that has completed");
            }

            // Transform the Dates according to User Start time
            endDate = _userService.TrasformDate(endDate);

            _themeData.ExtendTheme(userId, id, endDate);
            return Ok();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ThemeModel), 200)]
        public IActionResult GetTheme(Guid id)
        {
            var userId = _userService.GetUserId();
            var theme = _themeData.GetThemeByID(userId, id);
            if (theme.Count == 0)
            {
                return NotFound();
            }
            return Ok(theme[0]);
        }

        [HttpGet]
        [ProducesResponseType(typeof(GetThemeModel), 200)]
        public IActionResult GetThemes()
        {
            // TODO: Add Html parameters to filter theme with dates (Start Date)
            var userId = _userService.GetUserId();
            var themes = _themeData.GetThemes(userId);
            return Ok(themes);
        }
    }
}
