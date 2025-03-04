namespace API.DTOs
{
    public class InviteUserDto
    {
        public string Email { get; set; }
        public int ProjectId { get; set; }
        public string Role { get; set; }
    }
}
