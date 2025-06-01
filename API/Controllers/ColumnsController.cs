using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.DTOs;

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
                .Include(t => t.Tasks)
                .Include(p => p.Project)
                .ToListAsync();

            return Ok(columns);
        }

        // GET: Specific column for a specific project
        [HttpGet("project/{projectId}/columns/{columnId}")]
        public async Task<IActionResult> GetColumn(int projectId, int columnId)
        {
            var column = await _context.Columns
                .Include(c => c.Tasks)
                .Include(c => c.Project)
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

            return Ok(column);
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
