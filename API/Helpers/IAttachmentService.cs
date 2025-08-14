using API.DTOs.attachment;

namespace API.Helpers
{
    public interface IAttachmentService
    {
        Task<AttachmentResponseDto> UploadAsync(UploadAttachmentDto dto);
        Task<(Stream FileStream, string ContentType, string FileName)> DownloadAsync(int id);
        Task DeleteAsync(int id);
    }
}
