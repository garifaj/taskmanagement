namespace API.Models
{
    public class TaskAssignee
    {
        public int Id { get; set; }
        public int TaskId { get; set; } // Foreign key to Task
        public Task Task { get; set; } // Navigation property to Task
        public int UserId { get; set; } // Foreign key to User
        public User User { get; set; } // Navigation property to User
    }
}
