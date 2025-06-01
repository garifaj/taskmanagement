using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.EntityFrameworkCore;
using API.DTOs;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttachmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AttachmentController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadAttachment([FromForm] UploadAttachmentDto dto)
        {
            // 1. Null or empty check
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("No file was uploaded.");

            // 2. Extension and MIME type check
            var permittedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".xlsx", ".docx" };
            var permittedMimeTypes = new[] {
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            };

            var ext = Path.GetExtension(dto.File.FileName).ToLowerInvariant();
            if (!permittedExtensions.Contains(ext))
                return BadRequest("Unsupported file extension.");

            if (!permittedMimeTypes.Contains(dto.File.ContentType))
                return BadRequest("Invalid MIME type.");

            // 3. (Optional) Max file size check (10MB)
            const long maxSize = 10 * 1024 * 1024;
            if (dto.File.Length > maxSize)
                return BadRequest("File size exceeds the 10MB limit.");

            // 4. Save file to "uploads" folder
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads");
            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}{ext}";
            var savedPath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(savedPath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            // 5. Save to DB
            var attachment = new Attachment
            {
                FileName = dto.File.FileName,
                FileType = dto.File.ContentType,
                FilePath = Path.Combine("Uploads", uniqueFileName),
                TaskId = dto.TaskId
            };

            _context.Attachments.Add(attachment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                attachment.Id,
                attachment.FileName,
                attachment.FileType,
                Url = $"/Uploads/{uniqueFileName}"
            });
        }

        [HttpGet("download-attachment/{id}")]
        public async Task<IActionResult> DownloadAttachment(int id)
        {
            var attachment = await _context.Attachments.FindAsync(id);
            if (attachment == null) return NotFound();

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), attachment.FilePath);

            if (!System.IO.File.Exists(fullPath))
                return NotFound("File does not exist on server.");

            var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            return File(fileBytes, attachment.FileType, attachment.FileName);
        }

    }
}
