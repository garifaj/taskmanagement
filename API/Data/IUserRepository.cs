﻿using API.Models;

namespace API.Data
{
    public interface IUserRepository
    {
        User Create(User user);
        User GetByEmail(string email);
        User GetById(int id);
        User GetByResetToken(string token);
        User GetByVerificationToken(string token);
        User Update(User user);
    }
}
