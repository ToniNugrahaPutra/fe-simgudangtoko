import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchCategory, useUpdateCategory } from "../../hooks/useCategories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormData, categorySchema } from "../../schemas/categorySchema";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const { data: category, isPending } = useFetchCategory(Number(id));
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState(
    "/assets/images/icons/gallery-grey.svg"
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("tagline", category.tagline);

      if (category.photo) {
        setImagePreview(category.photo);
      }
    }
  }, [category, setValue]);

  const onSubmit = (data: CategoryFormData) => {
    updateCategory(
      { id: Number(id), ...data },
      {
        onError: (error: AxiosError<ApiErrorResponse>) => {
          const { message, errors: fieldErrors } = error.response?.data || {};

          if (message) {
            setError("root", { type: "server", message });
          }
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([key, value]) => {
              setError(key as keyof CategoryFormData, {
                type: "server",
                message: value[0],
              });
            });
          }
        },
      }
    );
  };

  if (isPending) return <p>Loading...</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        
        {/* Top Bar */}
        <div id="Top-Bar" className="flex items-center w-full gap-5 mt-5 mb-5">
          <UserProfileCard title="Edit Kategori" backLink="/categories" />
        </div>

        <main className="flex flex-col gap-5 flex-1">
          <div className="flex gap-5">
            
            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full rounded-3xl p-5 gap-5 bg-white"
            >
              {/* Upload Foto */}
              <div className="col-span-full flex justify-center">
                <div className="w-full max-w-md">
                  <div
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-5 py-10 relative bg-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview &&
                    imagePreview !== "/assets/images/icons/gallery-grey.svg" ? (
                      <div className="relative aspect-video w-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-3 py-1 rounded-lg hover:bg-black transition"
                        >
                          Ganti Foto
                        </button>
                      </div>
                    ) : (
                      <div className="text-center cursor-pointer aspect-video w-full flex flex-col justify-center items-center">
                        <svg
                          className="mx-auto h-12 w-12 text-border mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <p className="text-sm text-gray-500">
                          Upload a file or drag and drop
                        </p>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue("photo", file);
                          setImagePreview(URL.createObjectURL(file));
                        } else {
                          setImagePreview(
                            "/assets/images/icons/gallery-grey.svg"
                          );
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {errors.photo && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.photo.message}
                    </p>
                  )}
                </div>
              </div>

              {/* FORM 2 kolom */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-font">
                    Nama Kategori
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-border outline-1 -outline-offset-1 focus:outline-2 focus:outline-primary sm:text-sm"
                    placeholder="Masukkan nama kategori"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-font">
                    Tagline Kategori
                  </label>
                  <input
                    {...register("tagline")}
                    id="tagline"
                    type="text"
                    className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-border outline-1 -outline-offset-1 focus:outline-2 focus:outline-primary sm:text-sm"
                    placeholder="Masukkan tagline"
                  />
                  {errors.tagline && (
                    <p className="text-red-500 text-sm">{errors.tagline.message}</p>
                  )}
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex items-center justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="cursor-pointer font-semibold bg-primary text-white h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary border transition"
                >
                  {isUpdating ? "Saving..." : "Simpan"}
                </button>
              </div>
            </form>

          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCategory;
