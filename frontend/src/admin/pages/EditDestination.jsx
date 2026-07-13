import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import PageHeader from "../components/common/PageHeader";
import PageLoader from "../components/loader/PageLoader";
import ImageUploader from "../components/form/ImageUploader";
import GalleryUploader from "../components/form/GalleryUploader";

import {
  getAdminDestinationById,
  updateDestination
} from "../services/destinationService";
import { getAllCategories } from "../services/categoryService";
import { getAllCountries } from "../services/countryService";
import { getAllCities } from "../services/cityService";
import { getAllAmenities } from "../services/amenityService";
import {
  uploadThumbnail,
  uploadHero,
  uploadGallery
} from "../services/uploadService";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function EditDestination() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [slugTouched, setSlugTouched] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      categoryId: null,
      countryId: null,
      cityId: null,
      shortDescription: "",
      description: "",
      thumbnail: "",
      heroImage: "",
      gallery: [],
      price: "",
      duration: "",
      rating: 5,
      maxGuests: 2,
      checkIn: "14:00",
      checkOut: "11:00",
      cancellationPolicy: "",
      metaTitle: "",
      metaDescription: "",
      displayOrder: 0,
      featured: false,
      isPublished: true,
      amenities: [],
      highlights: [{ value: "" }],
      itinerary: [{ day: 1, title: "", description: "" }]
    }
  });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight
  } = useFieldArray({ control, name: "highlights" });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary
  } = useFieldArray({ control, name: "itinerary" });

  const titleValue = watch("title");
  const countryIdValue = watch("countryId");
  const thumbnailValue = watch("thumbnail");
  const heroImageValue = watch("heroImage");
  const galleryValue = watch("gallery");

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(titleValue || ""));
    }
  }, [titleValue, slugTouched, setValue]);

  useEffect(() => {
    const loadDestination = async () => {
      try {
        const destination = await getAdminDestinationById(
          id
        );

        reset({
          title: destination.title,
          slug: destination.slug,
          categoryId: destination.categoryId,
          countryId: destination.countryId,
          cityId: destination.cityId,
          shortDescription: destination.shortDescription,
          description: destination.description,
          thumbnail: destination.thumbnail || "",
          heroImage: destination.heroImage || "",
          gallery: (destination.images || []).map(
            (img) => img.image
          ),
          price: Number(destination.price),
          duration: destination.duration,
          rating: Number(destination.rating),
          maxGuests: destination.maxGuests,
          checkIn: destination.checkIn || "",
          checkOut: destination.checkOut || "",
          cancellationPolicy:
            destination.cancellationPolicy || "",
          metaTitle: destination.metaTitle || "",
          metaDescription:
            destination.metaDescription || "",
          displayOrder: destination.displayOrder,
          featured: destination.featured,
          isPublished: destination.isPublished,
          amenities: (destination.amenities || []).map(
            (a) => a.amenityId
          ),
          highlights: destination.highlights?.length
            ? destination.highlights.map((h) => ({
                value: h.title
              }))
            : [{ value: "" }],
          itinerary: destination.itineraries?.length
            ? destination.itineraries.map((item) => ({
                day: item.day,
                title: item.title,
                description: item.description
              }))
            : [
                {
                  day: 1,
                  title: "",
                  description: ""
                }
              ]
        });
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load destination.";
        toast.error(message);
        navigate("/admin/destinations");
      } finally {
        setInitialLoading(false);
      }
    };

    loadDestination();
  }, [id, reset, navigate]);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [categoryData, countryData, amenityData] =
          await Promise.all([
            getAllCategories(),
            getAllCountries(),
            getAllAmenities()
          ]);

        setCategories(categoryData);
        setCountries(countryData);
        setAmenities(amenityData);
      } catch {
        toast.error("Failed to load form options.");
      }
    };

    loadDropdowns();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (!countryIdValue) {
        setCities([]);
        return;
      }

      try {
        const cityData = await getAllCities(
          countryIdValue
        );
        setCities(cityData);
      } catch {
        toast.error("Failed to load cities.");
      }
    };

    loadCities();
  }, [countryIdValue]);

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name
  }));

  const countryOptions = countries.map((c) => ({
    value: c.id,
    label: c.name
  }));

  const cityOptions = cities.map((c) => ({
    value: c.id,
    label: c.name
  }));

  const amenityOptions = amenities.map((a) => ({
    value: a.id,
    label: a.name
  }));

  const onSubmit = async (data) => {
    if (!data.thumbnail) {
      toast.error("Please upload a thumbnail image.");
      return;
    }

    if (!data.heroImage) {
      toast.error("Please upload a hero image.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        categoryId: Number(data.categoryId),
        countryId: Number(data.countryId),
        cityId: Number(data.cityId),
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        thumbnail: data.thumbnail,
        heroImage: data.heroImage,
        price: Number(data.price),
        duration: data.duration,
        rating: Number(data.rating),
        featured: data.featured,
        maxGuests: Number(data.maxGuests),
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        cancellationPolicy: data.cancellationPolicy,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        displayOrder: Number(data.displayOrder),
        isPublished: data.isPublished,
        gallery: data.gallery,
        amenities: data.amenities,
        highlights: data.highlights
          .map((h) => h.value.trim())
          .filter(Boolean),
        itinerary: data.itinerary
          .filter((i) => i.title.trim())
          .map((i) => ({
            day: Number(i.day),
            title: i.title,
            description: i.description
          }))
      };

      await updateDestination(id, payload);

      toast.success("Destination updated successfully.");
      navigate("/admin/destinations");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update destination.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <PageHeader
        title="Edit Destination"
        subtitle="Update this destination's details."
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">
                  Basic Information
                </h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    {...register("title", {
                      required: "Title is required.",
                      minLength: {
                        value: 3,
                        message:
                          "Title must be at least 3 characters."
                      }
                    })}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Slug
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.slug ? "is-invalid" : ""
                    }`}
                    {...register("slug", {
                      required: "Slug is required.",
                      onChange: () =>
                        setSlugTouched(true)
                    })}
                  />
                  {errors.slug && (
                    <div className="invalid-feedback">
                      {errors.slug.message}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Category
                    </label>
                    <Controller
                      name="categoryId"
                      control={control}
                      rules={{
                        required: "Category is required."
                      }}
                      render={({ field }) => (
                        <Select
                          options={categoryOptions}
                          value={categoryOptions.find(
                            (o) =>
                              o.value === field.value
                          )}
                          onChange={(opt) =>
                            field.onChange(opt.value)
                          }
                          classNamePrefix="react-select"
                        />
                      )}
                    />
                    {errors.categoryId && (
                      <div className="text-danger small mt-1">
                        {errors.categoryId.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Country
                    </label>
                    <Controller
                      name="countryId"
                      control={control}
                      rules={{
                        required: "Country is required."
                      }}
                      render={({ field }) => (
                        <Select
                          options={countryOptions}
                          value={countryOptions.find(
                            (o) =>
                              o.value === field.value
                          )}
                          onChange={(opt) => {
                            field.onChange(opt.value);
                            setValue("cityId", null);
                          }}
                          classNamePrefix="react-select"
                        />
                      )}
                    />
                    {errors.countryId && (
                      <div className="text-danger small mt-1">
                        {errors.countryId.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      City
                    </label>
                    <Controller
                      name="cityId"
                      control={control}
                      rules={{
                        required: "City is required."
                      }}
                      render={({ field }) => (
                        <Select
                          options={cityOptions}
                          value={cityOptions.find(
                            (o) =>
                              o.value === field.value
                          )}
                          onChange={(opt) =>
                            field.onChange(opt.value)
                          }
                          isDisabled={!countryIdValue}
                          placeholder={
                            countryIdValue
                              ? "Select city..."
                              : "Select country first"
                          }
                          classNamePrefix="react-select"
                        />
                      )}
                    />
                    {errors.cityId && (
                      <div className="text-danger small mt-1">
                        {errors.cityId.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    className={`form-control ${
                      errors.shortDescription
                        ? "is-invalid"
                        : ""
                    }`}
                    {...register("shortDescription", {
                      required:
                        "Short description is required.",
                      minLength: {
                        value: 10,
                        message:
                          "Must be at least 10 characters."
                      },
                      maxLength: {
                        value: 500,
                        message:
                          "Must be under 500 characters."
                      }
                    })}
                  />
                  {errors.shortDescription && (
                    <div className="invalid-feedback">
                      {errors.shortDescription.message}
                    </div>
                  )}
                </div>

                <div className="mb-0">
                  <label className="form-label">
                    Full Description
                  </label>
                  <textarea
                    rows={6}
                    className={`form-control ${
                      errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                    {...register("description", {
                      required:
                        "Description is required.",
                      minLength: {
                        value: 20,
                        message:
                          "Must be at least 20 characters."
                      }
                    })}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">Images</h3>
              </div>
              <div className="card-body">
                <ImageUploader
                  label="Thumbnail"
                  value={thumbnailValue}
                  onChange={(path) =>
                    setValue("thumbnail", path, {
                      shouldValidate: true
                    })
                  }
                  uploadFn={uploadThumbnail}
                  hint="Used in listing cards. Recommended: landscape image."
                />

                <ImageUploader
                  label="Hero Image"
                  value={heroImageValue}
                  onChange={(path) =>
                    setValue("heroImage", path, {
                      shouldValidate: true
                    })
                  }
                  uploadFn={uploadHero}
                  hint="Large banner shown on the destination detail page."
                />

                <GalleryUploader
                  value={galleryValue}
                  onChange={(paths) =>
                    setValue("gallery", paths)
                  }
                  uploadFn={uploadGallery}
                  hint="Additional photos shown in the gallery section."
                />
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">
                  Stay Details
                </h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`form-control ${
                        errors.price ? "is-invalid" : ""
                      }`}
                      {...register("price", {
                        required: "Price is required.",
                        valueAsNumber: true,
                        min: {
                          value: 0.01,
                          message:
                            "Price must be greater than 0."
                        }
                      })}
                    />
                    {errors.price && (
                      <div className="invalid-feedback">
                        {errors.price.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Days 4 Nights"
                      className={`form-control ${
                        errors.duration
                          ? "is-invalid"
                          : ""
                      }`}
                      {...register("duration", {
                        required: "Duration is required."
                      })}
                    />
                    {errors.duration && (
                      <div className="invalid-feedback">
                        {errors.duration.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Max Guests
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      {...register("maxGuests", {
                        valueAsNumber: true,
                        min: 1
                      })}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Check In
                    </label>
                    <input
                      type="text"
                      placeholder="14:00"
                      className={`form-control ${
                        errors.checkIn
                          ? "is-invalid"
                          : ""
                      }`}
                      {...register("checkIn", {
                        required:
                          "Check-in time is required."
                      })}
                    />
                    {errors.checkIn && (
                      <div className="invalid-feedback">
                        {errors.checkIn.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Check Out
                    </label>
                    <input
                      type="text"
                      placeholder="11:00"
                      className={`form-control ${
                        errors.checkOut
                          ? "is-invalid"
                          : ""
                      }`}
                      {...register("checkOut", {
                        required:
                          "Check-out time is required."
                      })}
                    />
                    {errors.checkOut && (
                      <div className="invalid-feedback">
                        {errors.checkOut.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="form-control"
                      {...register("rating", {
                        valueAsNumber: true,
                        min: 0,
                        max: 5
                      })}
                    />
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label">
                    Cancellation Policy
                  </label>
                  <textarea
                    rows={3}
                    className={`form-control ${
                      errors.cancellationPolicy
                        ? "is-invalid"
                        : ""
                    }`}
                    {...register("cancellationPolicy", {
                      required:
                        "Cancellation policy is required."
                    })}
                  />
                  {errors.cancellationPolicy && (
                    <div className="invalid-feedback">
                      {errors.cancellationPolicy.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">
                  Amenities
                </h3>
              </div>
              <div className="card-body">
                <Controller
                  name="amenities"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isMulti
                      options={amenityOptions}
                      value={amenityOptions.filter((o) =>
                        field.value.includes(o.value)
                      )}
                      onChange={(opts) =>
                        field.onChange(
                          opts.map((o) => o.value)
                        )
                      }
                      classNamePrefix="react-select"
                      placeholder="Select amenities..."
                    />
                  )}
                />
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">
                  Highlights
                </h3>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary ms-auto d-flex align-items-center gap-1"
                  onClick={() =>
                    appendHighlight({ value: "" })
                  }
                >
                  <IconPlus size={16} />
                  Add
                </button>
              </div>
              <div className="card-body">
                {highlightFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="d-flex gap-2 mb-2"
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Highlight ${
                        index + 1
                      }`}
                      {...register(
                        `highlights.${index}.value`
                      )}
                    />

                    {highlightFields.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-icon btn-outline-danger"
                        onClick={() =>
                          removeHighlight(index)
                        }
                      >
                        <IconTrash size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">
                  Itinerary
                </h3>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary ms-auto d-flex align-items-center gap-1"
                  onClick={() =>
                    appendItinerary({
                      day: itineraryFields.length + 1,
                      title: "",
                      description: ""
                    })
                  }
                >
                  <IconPlus size={16} />
                  Add Day
                </button>
              </div>
              <div className="card-body">
                {itineraryFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded p-3 mb-3"
                  >
                    <div className="row">
                      <div className="col-md-2 mb-2">
                        <label className="form-label">
                          Day
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register(
                            `itinerary.${index}.day`,
                            { valueAsNumber: true }
                          )}
                        />
                      </div>

                      <div className="col-md-8 mb-2">
                        <label className="form-label">
                          Title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register(
                            `itinerary.${index}.title`
                          )}
                        />
                      </div>

                      <div className="col-md-2 mb-2 d-flex align-items-end">
                        {itineraryFields.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-icon btn-outline-danger w-100"
                            onClick={() =>
                              removeItinerary(index)
                            }
                          >
                            <IconTrash size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        className="form-control"
                        {...register(
                          `itinerary.${index}.description`
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">
                  Publishing
                </h3>
              </div>
              <div className="card-body">
                <label className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register("isPublished")}
                  />
                  <span className="form-check-label">
                    Published
                  </span>
                </label>

                <label className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register("featured")}
                  />
                  <span className="form-check-label">
                    Featured
                  </span>
                </label>

                <div className="mb-0">
                  <label className="form-label">
                    Display Order
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    {...register("displayOrder", {
                      valueAsNumber: true
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header">
                <h3 className="card-title">SEO</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.metaTitle
                        ? "is-invalid"
                        : ""
                    }`}
                    {...register("metaTitle", {
                      required:
                        "Meta title is required."
                    })}
                  />
                  {errors.metaTitle && (
                    <div className="invalid-feedback">
                      {errors.metaTitle.message}
                    </div>
                  )}
                </div>

                <div className="mb-0">
                  <label className="form-label">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    className={`form-control ${
                      errors.metaDescription
                        ? "is-invalid"
                        : ""
                    }`}
                    {...register("metaDescription", {
                      required:
                        "Meta description is required."
                    })}
                  />
                  {errors.metaDescription && (
                    <div className="invalid-feedback">
                      {errors.metaDescription.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body d-flex flex-column gap-2">
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <ClipLoader
                      size={18}
                      color="#ffffff"
                    />
                  ) : (
                    "Update Destination"
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    navigate("/admin/destinations")
                  }
                >
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