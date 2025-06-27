namespace API.DTOs.project
{
    public class InviteUserDto
    {
        public string Email { get; set; }
        public int ProjectId { get; set; }
        public string Role { get; set; }
    }
}
