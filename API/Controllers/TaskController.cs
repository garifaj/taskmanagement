using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.Helpers;
using API.DTOs.task;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IUserRepository _repository;

        public TaskController(ApplicationDbContext context, JwtService jwtService, IUserRepository repository)
        {
            _context = context;
            _jwtService = jwtService;
            _repository = repository;
        }

        // Create Task
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            try
            {
                // 1. Retrieve JWT from cookies
                var jwt = Request.Cookies["jwt"];
                if (jwt == null) return Unauthorized("JWT token missing");

                // 2. Verify token and extract user ID
                var token = _jwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);

                // 3. Fetch the user
                var user = _repository.GetById(userId);
                if (user == null) return Unauthorized("User not found");

                var columnExists = await _context.Columns.AnyAsync(c => c.Id == dto.ColumnId);
                if (!columnExists)
                {
                    return BadRequest("Invalid ColumnId: Column does not exist.");
                }

                // 4. Create task
                var task = new Models.Task
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    DueDate = dto.DueDate,
                    Priority = dto.Priority,
                    ColumnId = dto.ColumnId,
                    OwnerId = userId
                };

                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTaskInColumn), new { columnId = dto.ColumnId, taskId = task.Id }, task);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating task: {ex.Message}");
            }
        }

        // Delete Task
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Edit Task
        [HttpPut("{id}")]
        public async Task<IActionResult> EditTask(int id, [FromBody] UpdateTaskDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            if (dto.Title != null)
                task.Title = dto.Title;

            if (dto.Description != null)
                task.Description = dto.Description;

            if (dto.DueDate.HasValue)
                task.DueDate = dto.DueDate;

            if (dto.Priority != null)
                task.Priority = dto.Priority;

            if (dto.ColumnId.HasValue)
                task.ColumnId = dto.ColumnId.Value;

            await _context.SaveChangesAsync();
            return Ok(task);
        }


        // Get all tasks for a column
        [HttpGet("column/{columnId}")]
        public async Task<IActionResult> GetTasksByColumn(int columnId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.ColumnId == columnId)
                .Include(t => t.Attachments)
                .Include(t => t.TaskAssignees)
                .ToListAsync();

            return Ok(tasks);
        }

        // Get specific task inside a column
        [HttpGet("column/{columnId}/task/{taskId}")]
        public async Task<IActionResult> GetTaskInColumn(int columnId, int taskId)
        {
            var task = await _context.Tasks
                .Include(t => t.Attachments)
                .Include(t => t.TaskAssignees)
                .FirstOrDefaultAsync(t => t.ColumnId == columnId && t.Id == taskId);

            if (task == null) return NotFound();
            return Ok(task);
        }
    }
}
