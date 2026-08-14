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

import { IconMailForward } from "@tabler/icons-react";
import { testSmtpEmail } from "../services/settingsService";

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
  },
  smtp: {
    smtp_host: "",
    smtp_port: "587",
    smtp_security: "tls",
    smtp_username: "",
    smtp_password: "",
    smtp_password_is_set: false,
    smtp_from_name: "",
    smtp_from_email: "",
    smtp_notify_email: ""
  },
  stripe: {
    stripe_enabled: "false",
    stripe_publishable_key: "",
    stripe_secret_key: "",
    stripe_secret_key_is_set: false
  }
};

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [testingEmail, setTestingEmail] = useState(false);

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
          booking: { ...DEFAULT_VALUES.booking, ...data.booking },
          smtp: { ...DEFAULT_VALUES.smtp, ...data.smtp },
          stripe: { ...DEFAULT_VALUES.stripe, ...data.stripe }
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

  const handleTestEmail = async () => {
    if (!testEmailAddress) {
      toast.error("Enter an email address to send the test to.");
      return;
    }

    setTestingEmail(true);

    try {
      await testSmtpEmail(testEmailAddress);
      toast.success("Test email sent successfully! Check the inbox.");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send test email. Save your SMTP settings first.";
      toast.error(message);
    } finally {
      setTestingEmail(false);
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

              <Tab eventKey="smtp" title="Email (SMTP)">
                <div className="row g-3 mb-3">
                  <div className="col-md-8">
                    <label className="form-label">SMTP Host</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="smtp-relay.brevo.com"
                      {...register("smtp.smtp_host")}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Port</label>
                    <input type="text" className="form-control" placeholder="587" {...register("smtp.smtp_port")} />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Security</label>
                    <select className="form-select" {...register("smtp.smtp_security")}>
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" {...register("smtp.smtp_username")} />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Password {watch("smtp.smtp_password_is_set") && (
                        <span className="badge bg-green-lt text-green ms-1">Configured</span>
                      )}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder={watch("smtp.smtp_password_is_set") ? "Leave blank to keep current" : ""}
                      {...register("smtp.smtp_password")}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">From Name</label>
                    <input type="text" className="form-control" placeholder="TravelerGuide" {...register("smtp.smtp_from_name")} />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">From Email</label>
                    <input type="email" className="form-control" {...register("smtp.smtp_from_email")} />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Admin Notification Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Where new contact form submissions are sent"
                      {...register("smtp.smtp_notify_email")}
                    />
                    <div className="form-hint">Every new Contact Us submission will be emailed here.</div>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <label className="form-label">Send a Test Email</label>
                  <div className="d-flex gap-2">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary d-flex align-items-center gap-2 flex-shrink-0"
                      onClick={handleTestEmail}
                      disabled={testingEmail}
                    >
                      {testingEmail ? <ClipLoader size={16} /> : <IconMailForward size={16} />}
                      Send Test
                    </button>
                  </div>
                  <div className="form-hint">Save your SMTP settings first, then send a test to confirm they work.</div>
                </div>
              </Tab>

              <Tab eventKey="stripe" title="Payments (Stripe)">
                <div className="mb-3">
                  <label className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      {...register("stripe.stripe_enabled", {
                        setValueAs: (v) => (v ? "true" : "false")
                      })}
                    />
                    <span className="form-check-label">Enable Stripe Payments</span>
                  </label>
                  <div className="form-hint">When disabled, card payment is hidden from checkout.</div>
                </div>

                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label">Publishable Key</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="pk_test_..."
                      {...register("stripe.stripe_publishable_key")}
                    />
                    <div className="form-hint">Safe to expose publicly — used by the checkout page.</div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">
                      Secret Key {watch("stripe.stripe_secret_key_is_set") && (
                        <span className="badge bg-green-lt text-green ms-1">Configured</span>
                      )}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder={watch("stripe.stripe_secret_key_is_set") ? "Leave blank to keep current" : "sk_test_..."}
                      {...register("stripe.stripe_secret_key")}
                    />
                    <div className="form-hint">Never shown after saving. Used only on the backend to create charges.</div>
                  </div>
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