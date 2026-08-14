import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill-new";
import Select from "react-select";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import PageHeader from "../components/common/PageHeader";
import ImageUploader from "../components/form/ImageUploader";
import { uploadThumbnail } from "../services/uploadService";
import { createBlogPost } from "../services/blogService";

import "react-quill-new/dist/quill.snow.css";

const CATEGORY_OPTIONS = [
  { value: "Guides", label: "Guides" },
  { value: "Inspiration", label: "Inspiration" },
  { value: "Tips", label: "Tips" },
  { value: "Culture", label: "Culture" },
  { value: "Destinations", label: "Destinations" },
  { value: "Adventure", label: "Adventure" },
  { value: "Food & Travel", label: "Food & Travel" },
  { value: "Beaches & Islands", label: "Beaches & Islands" },
  { value: "Nature & Wildlife", label: "Nature & Wildlife" },
  { value: "City Breaks", label: "City Breaks" },
  { value: "Family Travel", label: "Family Travel" },
  { value: "Solo Travel", label: "Solo Travel" },
  { value: "Luxury Travel", label: "Luxury Travel" },
  { value: "Budget Travel", label: "Budget Travel" },
  { value: "Road Trips", label: "Road Trips" },
  { value: "Weekend Getaways", label: "Weekend Getaways" },
  { value: "Honeymoon", label: "Honeymoon" },
  { value: "Seasonal Travel", label: "Seasonal Travel" },
  { value: "Travel Stories", label: "Travel Stories" },
  { value: "Things to Do", label: "Things to Do" },
  { value: "Hotels & Stays", label: "Hotels & Stays" },
  { value: "Travel Planning", label: "Travel Planning" }
];

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" }
];

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link", "image"],
    ["clean"]
  ]
};

export default function CreateBlogPost() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "",
      status: "DRAFT"
    }
  });

  const titleValue = watch("title");
  const coverImageValue = watch("coverImage");

  if (!slugTouched && titleValue) {
    const generated = slugify(titleValue);
    if (watch("slug") !== generated) {
      setValue("slug", generated);
    }
  }

  const onSubmit = async (data) => {
    if (!data.coverImage) {
      toast.error("Please upload a cover image.");
      return;
    }

    setSubmitting(true);

    try {
      await createBlogPost(data);
      toast.success("Post created successfully.");
      navigate("/admin/blog");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create post.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="New Blog Post" subtitle="Create a new article for the Travel Journal." />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-3">
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    {...register("title", { required: "Title is required." })}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Slug</label>
                  <input
                    type="text"
                    className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                    {...register("slug", { required: "Slug is required." })}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setValue("slug", e.target.value);
                    }}
                  />
                  {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
                  <div className="form-hint">Used in the URL: /travel-journal/your-slug</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Excerpt</label>
                  <textarea
                    rows={2}
                    className={`form-control ${errors.excerpt ? "is-invalid" : ""}`}
                    {...register("excerpt", { required: "Excerpt is required." })}
                  />
                  {errors.excerpt && <div className="invalid-feedback">{errors.excerpt.message}</div>}
                  <div className="form-hint">Short summary shown on the listing page card.</div>
                </div>

                <div className="mb-0">
                  <label className="form-label">Content</label>
                  <Controller
                    name="content"
                    control={control}
                    rules={{ required: "Content is required." }}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        modules={QUILL_MODULES}
                        style={{ minHeight: "300px" }}
                      />
                    )}
                  />
                  {errors.content && <div className="text-danger small mt-1">{errors.content.message}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-3">
              <div className="card-body">
                <ImageUploader
                  label="Cover Image"
                  value={coverImageValue}
                  onChange={(path) => setValue("coverImage", path)}
                  uploadFn={uploadThumbnail}
                  hint="Shown on the listing card and article header."
                />

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required." }}
                    render={({ field }) => (
                      <Select
                        options={CATEGORY_OPTIONS}
                        value={CATEGORY_OPTIONS.find((o) => o.value === field.value) || null}
                        onChange={(opt) => field.onChange(opt.value)}
                        classNamePrefix="react-select"
                        placeholder="Select category..."
                      />
                    )}
                  />
                  {errors.category && <div className="text-danger small mt-1">{errors.category.message}</div>}
                </div>

                <div className="mb-0">
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
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body d-flex flex-column gap-2">
                <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center gap-2" disabled={submitting}>
                  {submitting ? <ClipLoader size={18} color="#ffffff" /> : "Create Post"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/admin/blog")}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}