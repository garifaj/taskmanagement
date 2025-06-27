namespace API.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public string? Priority { get; set; } = "Medium"; // e.g., "Low", "Medium", "High"
        public ICollection<Attachment>? Attachments { get; set; } = new List<Attachment>();
        public int OwnerId { get; set; }
        public User Owner { get; set; }
        public ICollection<TaskAssignee>? TaskAssignees { get; set; } = new List<TaskAssignee>();
        public int ColumnId { get; set; }
        public Column Column { get; set; } // Column name will serve as status
        public ICollection<Subtask>? Subtasks { get; set; } = new List<Subtask>();
    }
}
