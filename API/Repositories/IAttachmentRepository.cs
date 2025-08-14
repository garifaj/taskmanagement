using API.Models;
using Task = System.Threading.Tasks.Task;

namespace API.Repositories
{
    public interface IAttachmentRepository
    {
        Task<Attachment> GetByIdAsync(int id);
        Task AddAsync(Attachment attachment);
        Task DeleteAsync(Attachment attachment);
        Task SaveChangesAsync();
    }
}
