using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using Microsoft.Build.Framework;
using API.DTOs.column;

namespace API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class ColumnsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ColumnsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: All columns for a specific project
        [HttpGet("project/{projectId}/columns")]
        public async Task<IActionResult> GetAllColumns(int projectId)
        {
            var columns = await _context.Columns
                .Where(c => c.ProjectId == projectId)
                .Include(c => c.Tasks)
                    .ThenInclude(t => t.Attachments) // <-- include attachments here
                .Include(c => c.Tasks)
                    .ThenInclude(t => t.TaskAssignees!)
                        .ThenInclude(ta => ta.User)
                .Include(c => c.Tasks)
                    .ThenInclude(t => t.Owner)    // <-- Add this line to include the owner
                .Include(c => c.Tasks)
                    .ThenInclude(t => t.Subtasks) 
                .Include(c => c.Project)
                .AsNoTracking()
                .ToListAsync();

            return Ok(columns);
        }

        // GET: Specific column for a specific project
        [HttpGet("project/{projectId}/columns/{columnId}")]
        public async Task<IActionResult> GetColumn(int projectId, int columnId)
        {
            var column = await _context.Columns
            .Include(c => c.Tasks)
                .ThenInclude(t => t.Attachments)
            .Include(c => c.Tasks)
                .ThenInclude(t => t.TaskAssignees!)
                    .ThenInclude(ta => ta.User)
            .Include(c => c.Tasks)
                .ThenInclude(t => t.Owner)    // <-- Add this line to include the owner
            .Include(c => c.Tasks)
                .ThenInclude(t => t.Subtasks) 
            .Include(c => c.Project)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == columnId && c.ProjectId == projectId);

            if (column == null)
                return NotFound("Column not found for this project.");

            return Ok(column);
        }


        // PUT: Change the name of a specific column

        [HttpPut("columns/{columnId}")]
        public async Task<IActionResult> UpdateColumn(int columnId, [FromBody] ColumnDto request)
        {
            var column = await _context.Columns.FindAsync(columnId);
            if (column == null) return NotFound("Column not found.");

            column.Name = request.Name;
            await _context.SaveChangesAsync();

            return Ok("Column updated.");
        }

        // POST: Create a new column for a specific project

        [HttpPost("project/{projectId}/columns")]
        public async Task<IActionResult> AddColumn(int projectId, [FromBody] ColumnDto request)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) return NotFound("Project not found.");

            var column = new Column
            {
                Name = request.Name,
                ProjectId = projectId
            };

            _context.Columns.Add(column);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                column.Id,
                column.Name,
                column.ProjectId,
                Tasks = new List<object>() // or List<TaskDto>
            });
        }

        // DELETE: api/Columns/5
        [HttpDelete("columns/{columnId}")]
        public async Task<IActionResult> DeleteColumn(int columnId)
        {
            var column = await _context.Columns.FindAsync(columnId);
            if (column == null) return NotFound("Column not found.");

            _context.Columns.Remove(column);
            await _context.SaveChangesAsync();

            return Ok("Column deleted.");
        }   

        private bool ColumnExists(int id)
        {
            return _context.Columns.Any(e => e.Id == id);
        }
    }
}
