namespace API.DTOs.attachment
{
    public class UploadAttachmentDto
    {
        public int TaskId { get; set; }
        public IFormFile File { get; set; }
    }
}
