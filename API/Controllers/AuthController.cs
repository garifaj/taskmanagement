using API.Data;
using API.DTOs.user;
using API.Helpers;
using API.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

namespace API.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IUserRepository _repository;
        private readonly JwtService _jwtService;
        private readonly EmailService _emailService;

        public AuthController(IUserRepository repository, JwtService jwtService, EmailService emailService)
        {
            _repository = repository;
            _jwtService = jwtService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                isSuperAdmin = false,
                IsEmailVerified = false,
                VerificationToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)), // Generate verification token
                VerificationTokenExpiry = DateTime.UtcNow.AddHours(24) // Set expiry date
            };
            _repository.Create(user);

            //Send verification email
            _emailService.SendVerificationEmail(user.Email, user.VerificationToken);

            return Ok(new { message = "Registration successful! Please check your email to verify your account." });
        }


        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var user = _repository.GetByEmail(dto.Email);

            if (user == null)
            {
                return BadRequest(new { message = "Incorrect email or password." });
            }

            if (!user.IsEmailVerified)
            {
                return BadRequest(new { message = "Email not verified. Please check your inbox." });
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                return BadRequest(new { message = "Incorrect email or password." });
            }

            var jwt = _jwtService.Generate(user.Id);

            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true
            });

            return Ok(new
            {
                message = "success",
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    surname = user.Surname,
                    email = user.Email,
                    isSuperAdmin = user.isSuperAdmin
                }
            });
        }


        [HttpGet("user")]
        public IActionResult User()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];

                var token = _jwtService.Verify(jwt);

                int userId = int.Parse(token.Issuer);

                var user = _repository.GetById(userId);

                return Ok(user);
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }



        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new
            {
                message = "success"
            });
        }

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword(ForgotPasswordDto dto)
        {
            var user = _repository.GetByEmail(dto.Email);

            if (user == null) return BadRequest(new { message = "User not found!" }); // Don't reveal user existence

            // Generate reset token (valid for 1 hour)
            var resetToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            user.ResetToken = resetToken; // Store without encoding
            user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);

            _repository.Update(user);

            _emailService.SendPasswordResetEmail(user.Email, resetToken);

            return Ok(new { message = "Password reset email sent" });
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordDto dto)
        {
            var user = _repository.GetByResetToken(dto.Token); // Use token directly

            if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired token" });

            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            _repository.Update(user);

            return Ok(new { message = "Password reset successful" });
        }

        [HttpPost("verify-email")]
        public IActionResult VerifyEmail(VerifyEmailDto dto)
        {
            var user = _repository.GetByVerificationToken(dto.Token);

            if (user == null || user.VerificationTokenExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired token" });

            user.IsEmailVerified = true;
            user.VerificationToken = null;
            user.VerificationTokenExpiry = null;

            _repository.Update(user);

            return Ok(new { message = "Email verified successfully!" });
        }
    }
}
