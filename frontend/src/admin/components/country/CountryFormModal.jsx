import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CountryFormModal({ show, onClose, onSaved, country, saveFn }) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: "", code: "" }
  });

  useEffect(() => {
    if (show) {
      reset({
        name: country?.name || "",
        code: country?.code || ""
      });
    }
  }, [show, country, reset]);

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      await saveFn({ ...data, code: data.code.toUpperCase() });
      toast.success(country ? "Country updated." : "Country created.");
      onSaved();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save country.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{country ? "Edit Country" : "Add Country"}</Modal.Title>
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

          <div className="mb-3">
            <label className="form-label">Code</label>
            <input
              type="text"
              maxLength={5}
              className={`form-control text-uppercase ${errors.code ? "is-invalid" : ""}`}
              {...register("code", { required: "Code is required." })}
            />
            {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
            <div className="form-hint">Short ISO-style code, e.g. US, IN, UK.</div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : country ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}