import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, Tab } from "react-bootstrap";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import PageHeader from "../components/common/PageHeader";
import PageLoader from "../components/loader/PageLoader";
import ImageUploader from "../components/form/ImageUploader";

import { getSettings, updateSettings } from "../services/settingsService";
import { uploadThumbnail } from "../services/uploadService";

const DEFAULT_VALUES = {
  general: {
    site_name: "",
    site_logo: "",
    contact_email: "",
    contact_phone: "",
    address: ""
  },
  social: {
    facebook_url: "",
    instagram_url: "",
    twitter_url: ""
  },
  seo: {
    default_meta_title: "",
    default_meta_description: ""
  },
  booking: {
    default_cancellation_policy: "",
    currency: "USD"
  }
};

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: DEFAULT_VALUES
  });

  const logoValue = watch("general.site_logo");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        reset({
          general: { ...DEFAULT_VALUES.general, ...data.general },
          social: { ...DEFAULT_VALUES.social, ...data.social },
          seo: { ...DEFAULT_VALUES.seo, ...data.seo },
          booking: { ...DEFAULT_VALUES.booking, ...data.booking }
        });
      } catch {
        toast.error("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      await updateSettings(data);
      toast.success("Settings saved successfully.");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save settings.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage site-wide configuration." />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          <div className="card-body">
            <Tabs defaultActiveKey="general" className="mb-3">
              <Tab eventKey="general" title="General">
                <div className="mb-3">
                  <label className="form-label">Site Name</label>
                  <input type="text" className="form-control" {...register("general.site_name")} />
                </div>

                <ImageUploader
                  label="Site Logo"
                  value={logoValue}
                  onChange={(path) => setValue("general.site_logo", path)}
                  uploadFn={uploadThumbnail}
                  hint="Displayed in the site header and admin sidebar."
                />

                <div className="mb-3">
                  <label className="form-label">Contact Email</label>
                  <input type="email" className="form-control" {...register("general.contact_email")} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact Phone</label>
                  <input type="text" className="form-control" {...register("general.contact_phone")} />
                </div>

                <div className="mb-0">
                  <label className="form-label">Address</label>
                  <textarea rows={2} className="form-control" {...register("general.address")} />
                </div>
              </Tab>

              <Tab eventKey="social" title="Social Links">
                <div className="mb-3">
                  <label className="form-label">Facebook URL</label>
                  <input type="text" className="form-control" {...register("social.facebook_url")} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Instagram URL</label>
                  <input type="text" className="form-control" {...register("social.instagram_url")} />
                </div>

                <div className="mb-0">
                  <label className="form-label">Twitter / X URL</label>
                  <input type="text" className="form-control" {...register("social.twitter_url")} />
                </div>
              </Tab>

              <Tab eventKey="seo" title="SEO Defaults">
                <div className="mb-3">
                  <label className="form-label">Default Meta Title</label>
                  <input type="text" className="form-control" {...register("seo.default_meta_title")} />
                </div>

                <div className="mb-0">
                  <label className="form-label">Default Meta Description</label>
                  <textarea rows={3} className="form-control" {...register("seo.default_meta_description")} />
                </div>
              </Tab>

              <Tab eventKey="booking" title="Booking Rules">
                <div className="mb-3">
                  <label className="form-label">Currency</label>
                  <select className="form-select" {...register("booking.currency")}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>

                <div className="mb-0">
                  <label className="form-label">Default Cancellation Policy</label>
                  <textarea rows={4} className="form-control" {...register("booking.default_cancellation_policy")} />
                </div>
              </Tab>
            </Tabs>
          </div>

          <div className="card-footer text-end">
            <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 ms-auto" disabled={saving}>
              {saving ? <ClipLoader size={18} color="#ffffff" /> : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}