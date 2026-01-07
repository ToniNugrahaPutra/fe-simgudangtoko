import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchProduct, useUpdateProduct } from "../../hooks/useProducts";
import { useFetchCategories } from "../../hooks/useCategories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormData, productSchema } from "../../schemas/productSchema";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isPending } = useFetchProduct(Number(id));
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { data: categories, isPending: categoriesLoading } =
    useFetchCategories();

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
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("about", product.about);
      setValue("category_id", product.category_id);
      setValue("is_popular", product.is_popular);
      if (product.thumbnail) {
        setImagePreview(product.thumbnail);
      }
    }
  }, [product, setValue]);

  const onSubmit = (data: ProductFormData) => {
    updateProduct(
      { id: Number(id), ...data },
      {
        onError: (error: AxiosError<ApiErrorResponse>) => {
          const { message, errors: fieldErrors } = error.response?.data || {};
          if (message) {
            setError("root", { type: "server", message });
          }
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([key, value]) => {
              setError(key as keyof ProductFormData, {
                type: "server",
                message: value[0],
              });
            });
          }
        },
      }
    );
  };

  if (isPending) return <p>Loading product details...</p>;

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-5 mt-5 mb-5"
        >
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <UserProfileCard title="Tambah Produk" backLink="/products" />
          </div>
        </div>
        <main className="flex flex-col gap-5 flex-1">
          <div className="flex gap-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
            >
              <div className="col-span-full flex justify-center">
                <div className="w-full max-w-md">
                  <div
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-5 py-10 relative bg-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview &&
                    imagePreview !== "/assets/images/icons/gallery-grey.svg" ? (
                      <div className="relative aspect-video w-full max-w-full">
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
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <div className="text-center cursor-pointer aspect-video w-full flex flex-col justify-center items-center">
                        <svg
                          className="mx-auto h-12 w-12 text-border mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-500 justify-center">
                          <span className="relative cursor-pointer rounded-lg font-semibold text-primary">
                            Upload a file
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}

                    <input
                      type="file"
                      id="thumbnail"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setValue("thumbnail", file);
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
                  {errors.thumbnail && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.thumbnail.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium text-font"
                  >
                    Product Name
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("name")}
                      id="name"
                      type="text"
                      className="block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                      placeholder="Enter product name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm/6 font-medium text-font"
                  >
                    Product Price
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      {...register("price")}
                      id="price"
                      className="block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                      placeholder="Enter product price"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm/6 font-medium text-font"
                  >
                    Product Category
                  </label>
                  <div className="mt-1 relative">
                    <div className="grid grid-cols-1">
                      {categoriesLoading ? (
                        <div className="col-start-1 row-start-1 w-full rounded-lg bg-white p-3 text-base text-font outline-1 -outline-offset-1 outline-border flex items-center justify-center">
                          Loading categories...
                        </div>
                      ) : (
                        <select
                          id="category_id"
                          {...register("category_id")}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-lg bg-white p-3 text-base text-font outline-1 -outline-offset-1 outline-border focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:text-sm/6"
                        >
                          <option value="">--- Select Category ---</option>
                          {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 h-5 w-5 self-center justify-self-end text-gray-500 sm:h-4 sm:w-4" />
                    </div>
                  </div>
                  {errors.category_id && (
                    <p className="text-red-500">{errors.category_id.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="is_popular"
                    className="block text-sm/6 font-medium text-font"
                  >
                    Select Popularity
                  </label>
                  <div className="mt-1 relative">
                    <div className="grid grid-cols-1">
                      <select
                        id="is_popular"
                        {...register("is_popular")}
                        className="col-start-1 row-start-1 w-full appearance-none rounded-lg bg-white p-3 text-base text-font outline-1 -outline-offset-1 outline-border focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:text-sm/6"
                      >
                        <option value="">--- Select Popularity ---</option>
                        <option value="true">Popular</option>
                        <option value="false">Not Popular</option>
                      </select>
                      <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 h-5 w-5 self-center justify-self-end text-gray-500 sm:h-4 sm:w-4" />
                    </div>
                  </div>
                  {errors.is_popular && (
                    <p className="text-red-500">{errors.is_popular.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="block text-sm/6 font-medium text-font"
                >
                  Product About
                </label>
                <div className="mt-1 relative">
                  <textarea
                    id="about"
                    {...register("about")}
                    rows={5}
                    className="block w-full rounded-lg bg-white p-3 text-base text-font outline-1 -outline-offset-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                    defaultValue={""}
                    placeholder="Enter product description"
                  />
                </div>
                {errors.about && (
                  <p className="text-red-500">{errors.about.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary ease-in-out duration-300 transition"
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

export default EditProduct;
