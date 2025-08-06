using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.Helpers;
using API.DTOs.user;
using API.DTOs.project;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectUsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public ProjectUsersController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // Invite a user to a project - api/ProjectUsers/invite
        [HttpPost("invite")]
        public async Task<IActionResult> InviteUserToProject([FromBody] InviteUserDto request)
        {
            var project = await _context.Projects.FindAsync(request.ProjectId);
            if (project == null) return NotFound("Project not found.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            string inviteToken = Guid.NewGuid().ToString(); // Generate unique token

            // Save invite token in database
            var invitation = new ProjectInvitation
            {
                Email = request.Email,
                ProjectId = request.ProjectId,
                InviteToken = inviteToken,
                Role = request.Role,
                Expiration = DateTime.UtcNow.AddHours(24)
            };
            _context.ProjectInvitations.Add(invitation);
            await _context.SaveChangesAsync();

            // ✅ Use async email sending
            await _emailService.SendProjectInvitationEmailAsync(request.Email, request.ProjectId, inviteToken, request.Role);

            return Ok("Invitation sent.");
        }


        //  Confirm invitation - api/ProjectUsers/confirm-invite
        [HttpPost("confirm-invite")]
        public async Task<IActionResult> ConfirmInvite([FromBody] ConfirmInviteDto request)
        {
            var invite = await _context.ProjectInvitations.FirstOrDefaultAsync(i =>
                i.Email == request.Email && i.ProjectId == request.ProjectId && i.InviteToken == request.InviteToken);

            if (invite == null || invite.Expiration < DateTime.UtcNow)
                return BadRequest("Invalid or expired invitation.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return BadRequest("User must register before accepting the invite.");

            // Add user to project
            var projectUser = new ProjectUser
            {
                UserId = user.Id,
                ProjectId = request.ProjectId,
                Role = invite.Role
            };
            _context.ProjectUsers.Add(projectUser);

            // Remove invitation
            _context.ProjectInvitations.Remove(invite);
            await _context.SaveChangesAsync();

            return Ok("You have joined the project.");
        }

        //  Remove user from project (Admin only) - api/ProjectUsers/{projectId}/remove-user/{userId}
        [HttpDelete("{projectId}/remove-user/{userId}")]
        public async Task<IActionResult> RemoveUserFromProject(int projectId, int userId)
        {
            var projectUser = await _context.ProjectUsers
                .FirstOrDefaultAsync(pu => pu.ProjectId == projectId && pu.UserId == userId);

            if (projectUser == null) return NotFound("User not found in project.");

            _context.ProjectUsers.Remove(projectUser);
            await _context.SaveChangesAsync();

            return Ok("User removed from project.");
        }

        //  Update user role in project (Admin only) - api/ProjectUsers/{projectId}/update-role/{userId}
        [HttpPut("{projectId}/update-role/{userId}")]
        public async Task<IActionResult> UpdateUserRole(int projectId, int userId, [FromBody] string newRole)
        {
            var projectUser = await _context.ProjectUsers
                .FirstOrDefaultAsync(pu => pu.ProjectId == projectId && pu.UserId == userId);

            if (projectUser == null) return NotFound("User not found in project.");

            projectUser.Role = newRole;
            await _context.SaveChangesAsync();

            return Ok("User role updated.");
        }

        [HttpGet("role")]
        public async Task<IActionResult> GetUserRoleInProject([FromQuery] int projectId, [FromQuery] int userId)
        {
            var projectUser = await _context.ProjectUsers
                .FirstOrDefaultAsync(pu => pu.ProjectId == projectId && pu.UserId == userId);

            if (projectUser == null)
                return NotFound("User not part of this project.");

            return Ok(new { role = projectUser.Role });
        }
    }



}


