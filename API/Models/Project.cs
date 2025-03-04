namespace API.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateOnly CreatedAt { get; set; }
        public ICollection<ProjectUser> ProjectUsers { get; set; }
    }
}
