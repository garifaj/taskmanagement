﻿namespace API.DTOs.user
{
    public class RegisterDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool isSuperAdmin { get; set; }
    }
}
