namespace API.DTOs.user
{
    public class ConfirmInviteDto
    {
        public string Email { get; set; }
        public int ProjectId { get; set; }
        public string InviteToken { get; set; }
    }
}
