namespace API.DTOs.task
{
    public class UpdateAssigneesDto
    {
        public int TaskId { get; set; }
        public List<int> UserIds { get; set; } = new();
    }
}
