namespace API.DTOs
{
    public class UpdateAssigneesDto
    {
        public int TaskId { get; set; }
        public List<int> UserIds { get; set; } = new();
    }
}
