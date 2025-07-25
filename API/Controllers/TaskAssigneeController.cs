﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.DTOs.task;

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

        // ✅ Assign a user to a task
        [HttpPost("update-assignees")]
        public async Task<IActionResult> UpdateTaskAssignees([FromBody] UpdateAssigneesDto dto)
        {
            var task = await _context.Tasks
                .Include(t => t.Column)
                .FirstOrDefaultAsync(t => t.Id == dto.TaskId);

            if (task == null)
                return NotFound("Task not found");

            var projectId = task.Column?.ProjectId;
            if (projectId == null)
                return NotFound("Invalid task-project relation");

            var validUserIds = await _context.ProjectUsers
                .Where(pu => pu.ProjectId == projectId)
                .Select(pu => pu.UserId)
                .ToListAsync();

            var currentAssignees = await _context.TaskAssignees
                .Where(ta => ta.TaskId == dto.TaskId)
                .ToListAsync();

            var toAssign = dto.UserIds.Except(currentAssignees.Select(a => a.UserId));
            var toUnassign = currentAssignees
                .Where(a => !dto.UserIds.Contains(a.UserId))
                .ToList();

            var newAssignees = toAssign.Select(uid => new TaskAssignee { TaskId = dto.TaskId, UserId = uid });

            await _context.TaskAssignees.AddRangeAsync(newAssignees);
            _context.TaskAssignees.RemoveRange(toUnassign);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Assignees updated",
                assigned = toAssign,
                unassigned = toUnassign.Select(u => u.UserId)
            });
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
