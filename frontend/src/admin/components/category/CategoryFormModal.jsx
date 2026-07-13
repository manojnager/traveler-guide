import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CategoryFormModal({ show, onClose, onSaved, category, saveFn }) {
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: "", slug: "" }
  });

  const nameValue = watch("name");
  const slugField = register("slug", { required: "Slug is required." });

  useEffect(() => {
    if (show) {
      reset({
        name: category?.name || "",
        slug: category?.slug || ""
      });
      setSlugTouched(Boolean(category));
    }
  }, [show, category, reset]);

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(nameValue || ""));
    }
  }, [nameValue, slugTouched, setValue]);

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      await saveFn(data);
      toast.success(category ? "Category updated." : "Category created.");
      onSaved();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save category.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{category ? "Edit Category" : "Add Category"}</Modal.Title>
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
            <label className="form-label">Slug</label>
            <input
              type="text"
              className={`form-control ${errors.slug ? "is-invalid" : ""}`}
              {...slugField}
              onChange={(e) => {
                setSlugTouched(true);
                slugField.onChange(e);
              }}
            />
            {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
            <div className="form-hint">Auto-fills from name — edit manually if you need something different.</div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : category ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}