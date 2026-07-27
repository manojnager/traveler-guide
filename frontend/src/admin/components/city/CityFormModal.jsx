import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";

export default function CityFormModal({ show, onClose, onSaved, city, saveFn, countries }) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: "", countryId: "" }
  });

  useEffect(() => {
    if (show) {
      reset({
        name: city?.name || "",
        countryId: city?.countryId ? String(city.countryId) : ""
      });
    }
  }, [show, city, reset]);

  const countryOptions = countries.map((c) => ({ value: String(c.id), label: c.name }));

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      await saveFn({ name: data.name, countryId: Number(data.countryId) });
      toast.success(city ? "City updated." : "City created.");
      onSaved();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save city.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{city ? "Edit City" : "Add City"}</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Country</label>
            <Controller
              name="countryId"
              control={control}
              rules={{ required: "Country is required." }}
              render={({ field }) => (
                <Select
                  options={countryOptions}
                  value={countryOptions.find((o) => o.value === field.value) || null}
                  onChange={(opt) => field.onChange(opt.value)}
                  classNamePrefix="react-select"
                  placeholder="Select country..."
                />
              )}
            />
            {errors.countryId && <div className="text-danger small mt-1">{errors.countryId.message}</div>}
          </div>

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
            {saving ? "Saving..." : city ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}