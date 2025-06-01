using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.DTOs;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskAssigneeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaskAssigneeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Assign multiple users to a task
        [HttpPost("assign-multiple")]
        public async Task<IActionResult> AssignMultipleUsersToTask([FromBody] AssignUsersDto dto)
        {
            var task = await _context.Tasks
                .Include(t => t.Column)
                .FirstOrDefaultAsync(t => t.Id == dto.TaskId);

            if (task == null)
                return NotFound("Task not found");

            var projectId = task.Column?.ProjectId;
            if (projectId == null)
                return NotFound("Task is not associated with a column or project");

            var validUserIds = await _context.ProjectUsers
                .Where(pu => pu.ProjectId == projectId && dto.UserIds.Contains(pu.UserId))
                .Select(pu => pu.UserId)
                .ToListAsync();

            if (!validUserIds.Any())
                return BadRequest("None of the provided users are part of the project");

            var alreadyAssignedIds = await _context.TaskAssignees
                .Where(ta => ta.TaskId == dto.TaskId && validUserIds.Contains(ta.UserId))
                .Select(ta => ta.UserId)
                .ToListAsync();

            var newAssignees = validUserIds
                .Except(alreadyAssignedIds)
                .Select(userId => new TaskAssignee
                {
                    TaskId = dto.TaskId,
                    UserId = userId
                })
                .ToList();

            if (!newAssignees.Any())
                return BadRequest("All users are already assigned to this task");

            await _context.TaskAssignees.AddRangeAsync(newAssignees);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Users assigned successfully",
                assignedUserIds = newAssignees.Select(na => na.UserId)
            });
        }



        // ❌ Remove a user from a task
        [HttpDelete("unassign")]
        public async Task<IActionResult> RemoveUserFromTask([FromQuery] int taskId, [FromQuery] int userId)
        {
            var assignee = await _context.TaskAssignees
                .FirstOrDefaultAsync(ta => ta.TaskId == taskId && ta.UserId == userId);

            if (assignee == null)
                return NotFound("Assignment not found");

            _context.TaskAssignees.Remove(assignee);
            await _context.SaveChangesAsync();

            return Ok("User removed from task");
        }

        // 👥 Get all assignees for a task
        [HttpGet("task/{taskId}")]
        public async Task<IActionResult> GetAssigneesForTask(int taskId)
        {
            var assignees = await _context.TaskAssignees
                .Where(ta => ta.TaskId == taskId)
                .Include(ta => ta.User)
                .Select(ta => new
                {
                    ta.UserId,
                    ta.User.Name,
                    ta.User.Surname,
                    ta.User.Email
                })
                .ToListAsync();

            return Ok(assignees);
        }
    }
}
