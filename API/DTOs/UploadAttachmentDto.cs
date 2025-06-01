namespace API.DTOs
{
    public class UploadAttachmentDto
    {
        public int TaskId { get; set; }
        public IFormFile File { get; set; }
    }
}
