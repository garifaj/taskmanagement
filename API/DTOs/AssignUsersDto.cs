namespace API.DTOs
{
    public class AssignUsersDto
    {
        public int TaskId { get; set; }
        public List<int> UserIds { get; set; }
    }
}
