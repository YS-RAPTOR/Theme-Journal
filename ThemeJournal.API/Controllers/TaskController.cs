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
    public class TaskController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITaskData _taskData;
        private readonly IProgressData _progressData;
        private readonly IThemeData _themeData;

        public TaskController(
            IUserService userService,
            ITaskData taskData,
            IProgressData progressData,
            IThemeData themeData
        )
        {
            _userService = userService;
            _taskData = taskData;
            _progressData = progressData;
            _themeData = themeData;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(PostTaskModel task)
        {
            // Transform the Dates according to User Start time
            task.StartDate = _userService.TrasformDate(task.StartDate);
            task.EndDate = _userService.TrasformDate(task.EndDate);

            // Start Date must be today or in the future
            if (task.StartDate < _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Start Date should be greater than or equal to today");
            }
            // End date should be greater than start date
            if (task.EndDate <= task.StartDate)
            {
                return BadRequest("End Date should be greater than Start Date");
            }
            // Maximum End Date is the end date of the current theme
            var today = _userService.TrasformDate(DateTime.UtcNow);
            var currentTheme = await _themeData.GetThemes(
                _userService.GetUserId(),
                today,
                today.AddDays(1)
            );


            if (task.EndDate > currentTheme[0].EndDate)
            {
                return BadRequest(
                    "End Date of the task cannot be greater than the end date of the current theme"
                );
            }

            var userId = _userService.GetUserId();
            await _taskData.CreateTask(userId, task);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(Guid id, PutTaskModel task)
        {
            // Can only update Task if it has not started yet
            var userId = _userService.GetUserId();
            var taskToUpdate = await _taskData.GetTaskById(userId, id);
            if (taskToUpdate.Count == 0)
            {
                return NotFound();
            }

            if (taskToUpdate[0].StartDate < _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot update a task that has already started");
            }

            // Transform the Dates according to User Start time
            task.StartDate = _userService.TrasformDate(task.StartDate);
            task.EndDate = _userService.TrasformDate(task.EndDate);

            // Start Date should be greater than or equal to today
            if (task.StartDate < _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Start Date should be greater than or equal to today");
            }
            // End date should be greater than start date
            if (task.EndDate <= task.StartDate)
            {
                return BadRequest("End Date should be greater than Start Date");
            }

            await _taskData.UpdateTask(userId, id, task);
            return Ok();
        }

        [HttpPut("{id}/extend")]
        public async Task<IActionResult> ExtendTask(Guid id, [FromBody] DateTime endDate)
        {
            // Can only extend Task if it has started
            // Cannot extend a task that has completed
            var userId = _userService.GetUserId();
            var taskToExtend = await _taskData.GetTaskById(userId, id);
            if (taskToExtend.Count == 0)
            {
                return NotFound();
            }

            if (taskToExtend[0].StartDate > _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot extend a task that hasn't started");
            }

            if (taskToExtend[0].EndDate <= _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot extend a task that has completed");
            }

            if (taskToExtend[0].EndDate >= endDate)
            {
                return BadRequest(
                    "Cannot extend a task to a date that is before the current end date"
                );
            }

            // Transform the Dates according to User Start time
            endDate = _userService.TrasformDate(endDate);
            await _taskData.ExtendTask(userId, id, endDate);
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<TaskModel>), 200)]
        public async Task<IActionResult> GetTasks(
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
            List<TaskModel> tasks = await _taskData.GetTasks(
                userId,
                upperDateCorrect,
                lowerDateCorrect
            );

            if (upperDateCorrect.HasValue && lowerDateCorrect.HasValue)
            {
                if (upperDateCorrect.Value <= lowerDateCorrect.Value)
                {
                    return BadRequest("Upper Date should be greater than Lower Date");
                }
            }

            var TaskMap = new Dictionary<Guid, TaskModel>(tasks.Count);
            var listOfTaskIds = new List<Guid>(tasks.Count);

            foreach (var task in tasks)
            {
                TaskMap.Add(task.Id, task);
                listOfTaskIds.Add(task.Id);
            }

            var progresses = await _progressData.GetProgress(
                userId,
                listOfTaskIds,
                upperDateCorrect,
                lowerDateCorrect
            );

            foreach (var progress in progresses)
            {
                if (TaskMap[progress.TaskId].Progress == null)
                {
                    TaskMap[progress.TaskId].Progress = [];
                }
                TaskMap[progress.TaskId]
                    .Progress
                    .Add(new TaskProgress(progress.Id, progress.CompletionDate, progress.Progress));
            }

            return Ok(TaskMap.Values.ToList());
        }
    }
}
