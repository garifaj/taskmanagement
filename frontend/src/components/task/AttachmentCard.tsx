import { Attachment } from "../../context/types";
import API_BASE_URL from "../../utils/config";

type AttachmentCardProps = {
  attachment: Attachment;
  onDelete: (id: number) => void;
};

const AttachmentCard = ({ attachment, onDelete }: AttachmentCardProps) => {
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.fileName ?? "");
  const normalizedUrl = attachment.filePath
    ? attachment.filePath.replace(/\\/g, "/")
    : "";
  const imageUrl = `http://localhost:5070/${normalizedUrl}`;
  const downloadUrl = `${API_BASE_URL}/attachment/download-attachment/${attachment.id}`;

  return (
    <div className="relative border border-gray-300 rounded-lg shadow-sm p-2 flex flex-col h-35 w-35 ">
      <div className="h-30 w-30 overflow-hidden rounded-md border border-gray-300 bg-white flex items-center justify-center">
        {isImage ? (
          <img
            src={`${imageUrl}?t=${Date.now()}`}
            alt={attachment.fileName}
            className="object-cover h-full w-full"
          />
        ) : (
          <div className="flex items-center justify-center text-gray-400 text-4xl">
            📄
          </div>
        )}
      </div>
      <div className="mt-2 px-1 text-sm">
        <p className="font-medium text-gray-800 truncate">
          {attachment.fileName}
        </p>
        <p className="text-gray-500 text-xs">
          {new Date(attachment.uploadedAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={attachment.fileName}
          className="text-blue-600 text-xs hover:underline mt-1 inline-block"
        >
          Download
        </a>
      </div>
      <button
        onClick={() => onDelete(attachment.id)}
        className="absolute bottom-1 right-1 bg-red-600 text-white rounded-full px-1 text-xs hover:bg-red-700 hover:cursor-pointer"
        title="Delete attachment"
      >
        −
      </button>
    </div>
  );
};

export default AttachmentCard;
