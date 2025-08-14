namespace API.Models
{
    public class Attachment
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty; // Path to the file in the storage
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public int TaskId { get; set; }
        public Task? Task { get; set; } // Navigation property to the Task this attachment belongs to
    }
}
