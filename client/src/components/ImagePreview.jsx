import { HiOutlineDownload, HiOutlineX } from 'react-icons/hi';

export default function ImagePreview({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  const handleDownload = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexusai-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Generated preview" />
        <div className="image-modal-actions">
          <button className="image-modal-btn" onClick={handleDownload}>
            <HiOutlineDownload size={16} /> Download
          </button>
          <button className="image-modal-btn" onClick={onClose}>
            <HiOutlineX size={16} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}
