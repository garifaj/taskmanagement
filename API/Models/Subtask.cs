namespace API.Models
{
    public class Subtask
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public Task? Task { get; set; } // Navigation property to the parent task
        public string? Title { get; set; }
        public bool IsCompleted { get; set; } = false; // Default to not done
        public string? CompletedBy { get; set; } // Optional, can be null if not done
        public DateTime? CompletedAt { get; set; } // Date when the subtask was completed, can be null if not done
    }
}
