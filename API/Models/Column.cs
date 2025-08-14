namespace API.Models
{
    public class Column
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Name of the column (e.g., "To Do", "In Progress", "Done")
        public int ProjectId { get; set; } // Foreign key to Project
        public Project Project { get; set; }  // Navigation property
        public ICollection<Task> Tasks { get; set; } = new List<Task>(); // Collection of tasks in this column
    }
}
