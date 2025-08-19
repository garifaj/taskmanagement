using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using System.Security.Cryptography;
using NuGet.Protocol.Core.Types;
using API.Helpers;
using API.DTOs.user;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserRepository _repository;
        private readonly EmailService _emailService;

        public UsersController(ApplicationDbContext context, IUserRepository repository, EmailService emailService)
        {
            _context = context;
            _repository = repository;
            _emailService = emailService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Surname,
                u.Email,
                u.isSuperAdmin,
                u.IsEmailVerified,
                Projects = _context.ProjectUsers
                    .Where(pu => pu.UserId == u.Id)
                    .Include(pu => pu.Project)
                    .Select(pu => new
                    {
                        pu.Project!.Id,
                        pu.Project.Title,
                        pu.Role // User's role in the project
                    })
                    .ToList()
            })
            .ToListAsync();

                return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Surname,
                    u.Email,
                    u.isSuperAdmin,
                    u.IsEmailVerified,
                    Projects = _context.ProjectUsers
                        .Where(pu => pu.UserId == u.Id)
                        .Include(pu => pu.Project)
                        .Select(pu => new
                        {
                            pu.Project!.Id,
                            pu.Project.Title,
                            pu.Role
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("exists")]
        public async Task<IActionResult> CheckUserExists([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required.");

            var exists = await _context.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());

            return Ok(new { exists });
        }


        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserUpdateDto userUpdateDto)
        {

            var existingUser = _context.Users.Find(id);

            if (existingUser == null)
            {
                return NotFound(); // Handle the case where the user is not found
            }

            // Update other fields
            existingUser.Name = userUpdateDto.Name;
            existingUser.Surname = userUpdateDto.Surname;
            existingUser.Email = userUpdateDto.Email;
            existingUser.isSuperAdmin = userUpdateDto.isSuperAdmin;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("User edited successfully.");
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(RegisterDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                isSuperAdmin = dto.isSuperAdmin,
                IsEmailVerified = false,
                VerificationToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                VerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
            };

            await _repository.UpdateAsync(user);

            // ✅ Send email asynchronously
            await _emailService.SendVerificationEmailAsync(user.Email, user.VerificationToken);

            return Ok(new { message = "User created successfully." });
        }


        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
