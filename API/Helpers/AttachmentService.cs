using API.DTOs.attachment;
using API.Models;
using API.Repositories;
using Task = System.Threading.Tasks.Task;

namespace API.Helpers
{
    public class AttachmentService : IAttachmentService
    {
        private readonly IAttachmentRepository _repo;
        private readonly IWebHostEnvironment _env;

        public AttachmentService(IAttachmentRepository repo, IWebHostEnvironment env)
        {
            _repo = repo;
            _env = env;
        }

        public async Task<AttachmentResponseDto> UploadAsync(UploadAttachmentDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                throw new ArgumentException("No file uploaded.");

            ValidateFile(dto.File);

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads");
            Directory.CreateDirectory(uploadsFolder);

            var ext = Path.GetExtension(dto.File.FileName).ToLowerInvariant();
            var uniqueFileName = $"{Guid.NewGuid()}{ext}";
            var savedPath = Path.Combine(uploadsFolder, uniqueFileName);

            await using (var stream = new FileStream(savedPath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            var attachment = new Attachment
            {
                FileName = dto.File.FileName,
                FileType = dto.File.ContentType,
                FilePath = Path.Combine("Uploads", uniqueFileName),
                TaskId = dto.TaskId
            };

            await _repo.AddAsync(attachment);
            await _repo.SaveChangesAsync();

            return new AttachmentResponseDto
            {
                Id = attachment.Id,
                FileName = attachment.FileName,
                FileType = attachment.FileType,
                FilePath = attachment.FilePath,
                UploadedAt = attachment.UploadedAt,
                TaskId = attachment.TaskId
            };
        }

        public async Task<(Stream FileStream, string ContentType, string FileName)> DownloadAsync(int id)
        {
            var attachment = await _repo.GetByIdAsync(id);
            if (attachment == null)
                throw new FileNotFoundException("Attachment not found.");

            var fullPath = Path.Combine(_env.ContentRootPath, attachment.FilePath);
            if (!File.Exists(fullPath))
                throw new FileNotFoundException("File does not exist on server.");

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return (stream, attachment.FileType, attachment.FileName);
        }

        public async Task DeleteAsync(int id)
        {
            var attachment = await _repo.GetByIdAsync(id);
            if (attachment == null)
                throw new FileNotFoundException("Attachment not found.");

            var fullPath = Path.Combine(_env.ContentRootPath, attachment.FilePath);
            if (File.Exists(fullPath))
                File.Delete(fullPath);

            await _repo.DeleteAsync(attachment);
            await _repo.SaveChangesAsync();
        }

        private void ValidateFile(IFormFile file)
        {
            var permittedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".xlsx", ".docx" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!permittedExtensions.Contains(ext))
                throw new ArgumentException("Unsupported file extension.");

            const long maxSize = 10 * 1024 * 1024;
            if (file.Length > maxSize)
                throw new ArgumentException("File size exceeds the 10MB limit.");
        }
    }
}
