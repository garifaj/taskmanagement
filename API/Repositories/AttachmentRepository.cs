using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace API.Repositories
{
    public class AttachmentRepository : IAttachmentRepository
    {
        private readonly ApplicationDbContext _context;
        public AttachmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Attachment> GetByIdAsync(int id) =>
            await _context.Attachments.FirstOrDefaultAsync(a => a.Id == id);

        public async Task AddAsync(Attachment attachment) =>
            await _context.Attachments.AddAsync(attachment);

        public async Task DeleteAsync(Attachment attachment)
        {
            _context.Attachments.Remove(attachment);
            await Task.CompletedTask;
        }

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }
}
