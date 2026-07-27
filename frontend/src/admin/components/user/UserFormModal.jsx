import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" }
];

export default function UserFormModal({ show, onClose, onSaved, user, saveFn, roles, isSelf }) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      roleId: "",
      status: "ACTIVE"
    }
  });

  useEffect(() => {
    if (show) {
      reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        password: "",
        phone: user?.phone || "",
        roleId: user?.roleId ? String(user.roleId) : "",
        status: user?.status || "ACTIVE"
      });
    }
  }, [show, user, reset]);

  const roleOptions = roles.map((r) => ({ value: String(r.id), label: r.name }));

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        roleId: Number(data.roleId),
        status: data.status
      };

      if (data.password) {
        payload.password = data.password;
      } else if (!user) {
        toast.error("Password is required for new users.");
        setSaving(false);
        return;
      }

      await saveFn(payload);
      toast.success(user ? "User updated." : "User created.");
      onSaved();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save user.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{user ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                {...register("firstName", { required: "First name is required." })}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                {...register("lastName", { required: "Last name is required." })}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
            </div>

            <div className="col-md-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                {...register("email", { required: "Email is required." })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <div className="col-md-12">
              <label className="form-label">
                Password {user && <span className="text-secondary">(leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                {...register("password", {
                  minLength: { value: 8, message: "Password must be at least 8 characters." }
                })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input type="text" className="form-control" {...register("phone")} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Role</label>
              <Controller
                name="roleId"
                control={control}
                rules={{ required: "Role is required." }}
                render={({ field }) => (
                  <Select
                    options={roleOptions}
                    value={roleOptions.find((o) => o.value === field.value) || null}
                    onChange={(opt) => field.onChange(opt.value)}
                    classNamePrefix="react-select"
                    isDisabled={isSelf}
                    placeholder="Select role..."
                  />
                )}
              />
              {errors.roleId && <div className="text-danger small mt-1">{errors.roleId.message}</div>}
              {isSelf && <div className="form-hint">You cannot change your own role.</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    options={STATUS_OPTIONS}
                    value={STATUS_OPTIONS.find((o) => o.value === field.value)}
                    onChange={(opt) => field.onChange(opt.value)}
                    classNamePrefix="react-select"
                    isDisabled={isSelf}
                  />
                )}
              />
              {isSelf && <div className="form-hint">You cannot deactivate your own account.</div>}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : user ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}