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
using API.Helpers;
using NuGet.Protocol.Core.Types;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IUserRepository _repository;

        public ProjectsController(ApplicationDbContext context, JwtService jwtService, IUserRepository repository)
        {
            _context = context;
            _jwtService = jwtService;
            _repository = repository;
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var projects = await _context.Projects
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Description,
                p.CreatedAt,
                Users = _context.ProjectUsers
                    .Where(pu => pu.ProjectId == p.Id)
                    .Include(pu => pu.User)
                    .Select(pu => new
                    {
                        pu.User.Id,
                        pu.User.Name,
                        pu.User.Surname,
                        pu.User.Email,
                        pu.Role // User's role in the project
                    })
                    .ToList()
            })
            .ToListAsync();

            return Ok(projects);
        }

        // Get projects for logged in user
        [HttpGet("user-projects")]
        public IActionResult GetProjectsForUser()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];
                var token = _jwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);

                var projectUsers = _context.ProjectUsers
                    .Include(pu => pu.Project)
                    .Where(pu => pu.UserId == userId)
                    .Select(pu => new
                    {
                        pu.Project.Id,
                        pu.Project.Title,
                        pu.Project.Description,
                        pu.Project.CreatedAt
                    })
                    .ToList();

                return Ok(projectUsers);
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }


        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.CreatedAt,
                    Users = _context.ProjectUsers
                    .Where(pu => pu.ProjectId == p.Id)
                        .Include(pu => pu.User)
                        .Select(pu => new
                        {
                            pu.User.Id,
                            pu.User.Name,
                            pu.User.Surname,
                            pu.User.Email,
                            pu.Role // User's role in the project
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound();
            }

                return Ok(project);
        }

        // PUT: api/Projects/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, ProjectUpdateDto projectUpdateDto)
        {
            var existingProject = _context.Projects.Find(id);

            if(existingProject == null)
            {
                return NotFound();
            }

            existingProject.Title = projectUpdateDto.Title;
            existingProject.Description = projectUpdateDto.Description;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch(DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok("Project edited successfully.");
        }

        // POST: api/Projects
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Project>> PostProject(CreateProjectDto projectDto)
        {
            try
            {
                //  Retrieve JWT from cookies
                var jwt = Request.Cookies["jwt"];

                //  Verify token and extract user ID
                var token = _jwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);

                //  Fetch the user from the repository
                var user = _repository.GetById(userId);
                if (user == null) return Unauthorized("User not found");

                //  Create the new project
                var project = new Project
                {
                    Title = projectDto.Title,
                    Description = projectDto.Description,
                    CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
                };

                _context.Projects.Add(project);
                await _context.SaveChangesAsync(); // Save first to generate project ID

                //  Associate user with the project (as Admin)
                var projectUser = new ProjectUser
                {
                    ProjectId = project.Id,
                    UserId = user.Id,
                    Role = "Admin" // Assign the creator as Admin
                };

                _context.ProjectUsers.Add(projectUser);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating project: {ex.Message}");
            }
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}
