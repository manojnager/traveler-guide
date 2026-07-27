import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";

import { getImageUrl } from "../../utils/image";

export default function ImageUploader({ label, value, onChange, uploadFn, hint }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const result = await uploadFn(file);
      onChange(result.path);
      toast.success("Image uploaded.");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to upload image.";
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => onChange("");

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>

      <div className="d-flex align-items-center gap-3">
        <div
          className="border rounded d-flex align-items-center justify-content-center overflow-hidden"
          style={{ width: "120px", height: "90px", backgroundColor: "var(--tblr-bg-surface-secondary, #f4f6f8)", flexShrink: 0 }}
        >
          {uploading ? (
            <ClipLoader size={20} color="#206bc4" />
          ) : value ? (
            <img src={getImageUrl(value)} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <IconPhoto size={28} className="text-secondary" />
          )}
        </div>

        <div>
          <input ref={inputRef} type="file" accept="image/*" className="d-none" onChange={handleFileSelect} />

          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <IconUpload size={16} />
            {value ? "Replace" : "Upload"}
          </button>

          {value && (
            <button type="button" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 mt-2" onClick={handleRemove}>
              <IconX size={16} />
              Remove
            </button>
          )}

          {hint && <div className="text-secondary small mt-1">{hint}</div>}
        </div>
      </div>
    </div>
  );
}