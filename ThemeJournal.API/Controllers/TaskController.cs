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
    public class TaskController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITaskData _taskData;
        private readonly IProgressData _progressData;

        public TaskController(
            IUserService userService,
            ITaskData taskData,
            IProgressData progressData
        )
        {
            _userService = userService;
            _taskData = taskData;
            _progressData = progressData;
        }

        [HttpPost]
        public IActionResult CreateTask(PostTaskModel task)
        {
            // Transform the Dates according to User Start time
            task.StartDate = _userService.TrasformDate(task.StartDate);
            task.EndDate = _userService.TrasformDate(task.EndDate);

            var userId = _userService.GetUserId();
            _taskData.CreateTask(userId, task);
            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTask(Guid id, PutTaskModel task)
        {
            // Can only update Task if it has not started yet
            var userId = _userService.GetUserId();
            var taskToUpdate = _taskData.GetTaskById(userId, id);
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

            _taskData.UpdateTask(userId, id, task);
            return Ok();
        }

        [HttpPut("{id}/extend")]
        public IActionResult ExtendTask(Guid id, DateTime endDate)
        {
            // Can only extend Task if it has started
            // Cannot extend a task that has completed
            var userId = _userService.GetUserId();
            var taskToExtend = _taskData.GetTaskById(userId, id);
            if (taskToExtend.Count == 0)
            {
                return NotFound();
            }

            if (taskToExtend[0].StartDate >= _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot extend a task that has not started");
            }

            if (taskToExtend[0].EndDate < _userService.TrasformDate(DateTime.UtcNow))
            {
                return BadRequest("Cannot extend a task that has already completed");
            }

            // Transform the Dates according to User Start time
            endDate = _userService.TrasformDate(endDate);
            _taskData.ExtendTask(userId, id, endDate);
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<TaskModel>), 200)]
        public IActionResult GetTasks()
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
            List<TaskModel> tasks = _taskData.GetTasks(userId, upperDateCorrect);

            var TaskMap = new Dictionary<Guid, TaskModel>(tasks.Count);
            var listOfTaskIds = new List<Guid>(tasks.Count);

            foreach (var task in tasks)
            {
                TaskMap.Add(task.Id, task);
                listOfTaskIds.Add(task.Id);
            }

            var progresses = _progressData.GetProgress(
                userId,
                listOfTaskIds,
                lowerDateCorrect,
                upperDateCorrect
            );

            foreach (var progress in progresses)
            {
                TaskMap[progress.TaskId]
                    .Progress
                    .Add(new TaskProgress(progress.Id, progress.CompletionDate, progress.Progress));
            }

            return Ok(TaskMap.Values.ToList());
        }
    }
}
