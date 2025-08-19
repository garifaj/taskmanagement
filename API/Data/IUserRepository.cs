using API.Models;

namespace API.Data
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByResetTokenAsync(string token);
        Task<User?> GetByVerificationTokenAsync(string token);
        Task<User> UpdateAsync(User user);
    }
}
