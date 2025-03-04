namespace API.Models
{
    public class ProjectInvitation
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int ProjectId { get; set; }
        public string InviteToken { get; set; }
        public string Role { get; set; }
        public DateTime Expiration { get; set; }
    }
}
