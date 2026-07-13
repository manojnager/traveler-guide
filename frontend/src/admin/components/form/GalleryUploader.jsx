import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { IconUpload, IconX } from "@tabler/icons-react";

import { getImageUrl } from "../../utils/image";

export default function GalleryUploader({ value = [], onChange, uploadFn, hint }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFilesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);

    try {
      const results = await uploadFn(files);
      const newPaths = results.map((r) => r.path);
      onChange([...value, ...newPaths]);
      toast.success(`${newPaths.length} image(s) uploaded.`);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to upload images.";
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="mb-3">
      <label className="form-label">Gallery</label>

      <div className="d-flex flex-wrap gap-2 mb-2">
        {value.map((imagePath, index) => (
          <div key={imagePath + index} className="position-relative border rounded overflow-hidden" style={{ width: "100px", height: "80px" }}>
            <img src={getImageUrl(imagePath)} alt={`Gallery ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              type="button"
              className="btn btn-icon btn-sm btn-danger position-absolute top-0 end-0 m-1"
              style={{ padding: "2px", lineHeight: 1 }}
              onClick={() => handleRemove(index)}
              title="Remove"
            >
              <IconX size={12} />
            </button>
          </div>
        ))}

        {uploading && (
          <div
            className="border rounded d-flex align-items-center justify-content-center"
            style={{ width: "100px", height: "80px", backgroundColor: "var(--tblr-bg-surface-secondary, #f4f6f8)" }}
          >
            <ClipLoader size={18} color="#206bc4" />
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple className="d-none" onChange={handleFilesSelect} />

      <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={() => inputRef.current?.click()} disabled={uploading}>
        <IconUpload size={16} />
        Add Images
      </button>

      {hint && <div className="text-secondary small mt-1">{hint}</div>}
    </div>
  );
}