import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function AmenityFormModal({ show, onClose, onSaved, amenity, saveFn }) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: "" }
  });

  useEffect(() => {
    if (show) {
      reset({ name: amenity?.name || "" });
    }
  }, [show, amenity, reset]);

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      await saveFn(data);
      toast.success(amenity ? "Amenity updated." : "Amenity created.");
      onSaved();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save amenity.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{amenity ? "Edit Amenity" : "Add Amenity"}</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              {...register("name", { required: "Name is required." })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : amenity ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}