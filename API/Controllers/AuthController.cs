using API.Data;
using API.DTOs.user;
using API.Helpers;
using API.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IUserRepository _repository;
        private readonly JwtService _jwtService;
        private readonly EmailService _emailService;
        private readonly string _frontendUrl;


        public AuthController(IUserRepository repository, JwtService jwtService, EmailService emailService, IConfiguration config)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _jwtService = jwtService ?? throw new ArgumentNullException(nameof(jwtService));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            _frontendUrl = config["FrontendGoogle:BaseUrl"] ?? throw new ArgumentNullException("FrontendGoogle:BaseUrl");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                isSuperAdmin = false,
                IsEmailVerified = false,
                VerificationToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                VerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
            };

            await _repository.CreateAsync(user);

            // ✅ Send verification email asynchronously
            await _emailService.SendVerificationEmailAsync(user.Email, user.VerificationToken);

            return Ok(new { message = "Registration successful! Please check your email to verify your account." });
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _repository.GetByEmailAsync(dto.Email);

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
        public async Task<IActionResult> User()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];

                if (string.IsNullOrEmpty(jwt))
                {
                    return Unauthorized(new { message = "JWT token is missing or invalid." });
                }

                var token = _jwtService.Verify(jwt);

                int userId = int.Parse(token.Issuer);

                var user = await _repository.GetByIdAsync(userId);

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
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _repository.GetByEmailAsync(dto.Email);

            if (user == null)
                return BadRequest(new { message = "User not found!" }); // Optional: generic message to avoid info disclosure

            // Generate reset token (valid for 1 hour)
            var resetToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            user.ResetToken = resetToken;
            user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);

            await _repository.UpdateAsync(user);

            // ✅ Send email asynchronously
            await _emailService.SendPasswordResetEmailAsync(user.Email, resetToken);

            return Ok(new { message = "Password reset email sent" });
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await _repository.GetByResetTokenAsync(dto.Token); // Use token directly

            if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired token" });

            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _repository.UpdateAsync(user);

            return Ok(new { message = "Password reset successful" });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(VerifyEmailDto dto)
        {
            var user = await _repository.GetByVerificationTokenAsync(dto.Token);

            if (user == null || user.VerificationTokenExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired token" });

            user.IsEmailVerified = true;
            user.VerificationToken = null;
            user.VerificationTokenExpiry = null;

            await _repository.UpdateAsync(user);

            return Ok(new { message = "Email verified successfully!" });
        }

        [AllowAnonymous]
        [HttpGet("login-google")]
        public IActionResult LoginWithGoogle()
        {
            // After Google completes (to /signin-google), the cookie handler will
            // sign the principal and then redirect here:
            var redirectUrl = Url.Action(nameof(GoogleCallback), "Auth");
            var props = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(props, GoogleDefaults.AuthenticationScheme);
        }

        [AllowAnonymous]
        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            // Read the signed-in principal (issued by the Cookie handler after Google)
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!result.Succeeded || result.Principal is null)
            {
                return Redirect($"{_frontendUrl}/login?error=google-auth-failed");
            }

            // Claims you typically get from Google:
            var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
            var givenName = result.Principal.FindFirst(ClaimTypes.GivenName)?.Value ?? "";
            var familyName = result.Principal.FindFirst(ClaimTypes.Surname)?.Value ?? "";
            var displayName = result.Principal.FindFirst(ClaimTypes.Name)?.Value ?? "";

            if (string.IsNullOrWhiteSpace(email))
            {
                // Some enterprise Google accounts may hide email; handle gracefully
                 return Redirect($"{_frontendUrl}/login?error=no-email-returned");
            }

            // If not found → create user with blank password & verified email
            var user = await _repository.GetByEmailAsync(email);
            if (user == null)
            {
                // Fallback if given/surname are empty: try to split the displayName
                if (string.IsNullOrWhiteSpace(givenName) && string.IsNullOrWhiteSpace(familyName) && !string.IsNullOrWhiteSpace(displayName))
                {
                    var parts = displayName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length > 0) givenName = parts[0];
                    if (parts.Length > 1) familyName = string.Join(' ', parts.Skip(1));
                }

                user = new User
                {
                    Name = givenName,
                    Surname = familyName,
                    Email = email,
                    Password = "",                 // blank password for Google users
                    isSuperAdmin = false,
                    IsEmailVerified = true,        // Google verified
                    VerificationToken = null,
                    VerificationTokenExpiry = null
                };

                await _repository.CreateAsync(user);
            }

            // Issue your own JWT
            var jwt = _jwtService.Generate(user.Id);

            // Store as HttpOnly cookie for your React app to use
            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true,
                //Secure = true,          // requires HTTPS; set false only if testing on plain http
                //SameSite = SameSiteMode.None, // needed if your frontend is a different origin
                Expires = DateTimeOffset.UtcNow.AddHours(6)
            });

            // Redirect the user back to your frontend (could also include token as a query if you prefer)
            return Redirect($"{_frontendUrl}/");
        }
    }
}
