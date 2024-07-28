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
        public async Task<IActionResult> CreateTheme(PostThemeModel theme)
        {
            // Transform the Dates according to User Start time
            theme.StartDate = await _userService.TrasformDate(theme.StartDate);
            theme.EndDate = await _userService.TrasformDate(theme.EndDate);

            // Start Date should be greater than or equal to today
            if (theme.StartDate < await _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Start Date should be greater than or equal to today");
            }
            // End date should be greater than start date
            if (theme.EndDate <= theme.StartDate)
            {
                return BadRequest("End Date should be greater than Start Date");
            }

            // Theme cannot intersect with another theme
            var userId = _userService.GetUserId();
            var currentTheme = await _themeData.GetThemes(userId, theme.StartDate, theme.EndDate);
            if (currentTheme.Count > 0)
            {
                return BadRequest("Cannot create a theme that intersects with another theme");
            }

            await _themeData.CreateTheme(userId, theme);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTheme(Guid id, ThemeModel theme)
        {
            // Can only update if the theme has not started yet
            var userId = _userService.GetUserId();
            var themeToUpdate = await _themeData.GetThemeByID(userId, id);
            if (themeToUpdate.Count == 0)
            {
                return NotFound();
            }

            if (themeToUpdate[0].StartDate <= await _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot update a theme that has/had already started");
            }

            // Transform the Dates according to User Start time
            theme.StartDate = await _userService.TrasformDate(theme.StartDate);
            theme.EndDate = await _userService.TrasformDate(theme.EndDate);

            // Start Date should be greater than or equal to today
            if (theme.StartDate < await _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Start Date should be greater than or equal to today");
            }
            // End date should be greater than start date
            if (theme.EndDate <= theme.StartDate)
            {
                return BadRequest("End Date should be greater than Start Date");
            }

            // Check intersection with other themes
            var themesWithIntersection = await _themeData.GetThemes(
                userId,
                theme.StartDate,
                theme.EndDate
            );
            if (themesWithIntersection.Count == 1 && themesWithIntersection[0].Id != id)
            {
                return BadRequest("Cannot update a theme that intersects with another theme");
            }
            else if (themesWithIntersection.Count > 1)
            {
                return BadRequest("Cannot update a theme that intersects with another theme");
            }

            await _themeData.UpdateTheme(userId, id, theme);
            return Ok();
        }

        [HttpPut("{id}/extend")]
        public async Task<IActionResult> ExtendTheme(Guid id, [FromBody] DateTime endDate)
        {
            // Can only extend if the theme has started
            // Cannot extend a theme that has completed
            var userId = _userService.GetUserId();
            var themeToUpdate = await _themeData.GetThemeByID(userId, id);
            if (themeToUpdate.Count == 0)
            {
                return NotFound();
            }

            if (themeToUpdate[0].StartDate > await _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot extend a theme that hasn't started");
            }

            if (themeToUpdate[0].EndDate <= await _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot extend a theme that has completed");
            }

            if (themeToUpdate[0].EndDate >= endDate)
            {
                return BadRequest(
                    "Cannot extend a theme to a date that is before the current end date"
                );
            }

            // Transform the Dates according to User Start time
            endDate = await _userService.TrasformDate(endDate);
            themeToUpdate[0].StartDate = await _userService.TrasformDate(
                themeToUpdate[0].StartDate
            );

            // Check Intersection with other themes
            var themesWithIntersection = await _themeData.GetThemes(
                userId,
                themeToUpdate[0].StartDate,
                endDate
            );
            if (themesWithIntersection.Count == 1 && themesWithIntersection[0].Id != id)
            {
                return BadRequest("Cannot update a theme that intersects with another theme");
            }
            else if (themesWithIntersection.Count > 1)
            {
                return BadRequest("Cannot update a theme that intersects with another theme");
            }

            await _themeData.ExtendTheme(userId, id, endDate);
            return Ok();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ThemeModel), 200)]
        public async Task<IActionResult> GetTheme(Guid id)
        {
            var userId = _userService.GetUserId();
            var theme = await _themeData.GetThemeByID(userId, id);
            if (theme.Count == 0)
            {
                return NotFound();
            }
            return Ok(theme[0]);
        }

        [HttpGet]
        [ProducesResponseType(typeof(GetThemeModel), 200)]
        public async Task<IActionResult> GetThemes(
            [FromQuery] DateTime? upperDate,
            [FromQuery] DateTime? lowerDate
        )
        {
            DateTime? upperDateCorrect = !upperDate.HasValue
                ? null
                : await _userService.TrasformDate(upperDate.Value);

            DateTime? lowerDateCorrect = !lowerDate.HasValue
                ? null
                : await _userService.TrasformDate(lowerDate.Value);

            if (upperDateCorrect.HasValue && lowerDateCorrect.HasValue)
            {
                if (upperDateCorrect.Value <= lowerDateCorrect.Value)
                {
                    return BadRequest("Upper Date should be greater than Lower Date");
                }
            }

            var userId = _userService.GetUserId();
            var themes = await _themeData.GetThemes(userId, lowerDateCorrect, upperDateCorrect);
            return Ok(themes);
        }
    }
}
