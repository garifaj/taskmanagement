namespace API.Models
{
    public class ProjectInvitation
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public int ProjectId { get; set; }
        public string InviteToken { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
    }
}
