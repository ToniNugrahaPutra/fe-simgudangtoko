import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  useFetchWarehouse,
  useUpdateWarehouse,
} from "../../hooks/useWarehouses";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WarehouseFormData,
  warehouseSchema,
} from "../../schemas/warehouseSchema";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";

const EditWarehouse = () => {
  const { id } = useParams<{ id: string }>();
  const { data: warehouse, isPending: isWarehouseLoading } = useFetchWarehouse(
    Number(id)
  );
  const { mutate: updateWarehouse, isPending: isUpdating } =
    useUpdateWarehouse();

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
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
  });

  useEffect(() => {
    if (warehouse) {
      setValue("name", warehouse.name);
      setValue("phone", warehouse.phone);
      setValue("address", warehouse.address);
      if (warehouse.photo) {
        setImagePreview(warehouse.photo);
      }
    }
  }, [warehouse, setValue]);

  const onSubmit = (data: WarehouseFormData) => {
    updateWarehouse(
      { id: Number(id), ...data },
      {
        onError: (error: AxiosError<ApiErrorResponse>) => {
          const { message, errors: fieldErrors } = error.response?.data || {};
          if (message) setError("root", { type: "server", message });
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([key, value]) => {
              setError(key as keyof WarehouseFormData, {
                type: "server",
                message: value[0],
              });
            });
          }
        },
      }
    );
  };

  if (isWarehouseLoading) return <p>Loading warehouse details...</p>;

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        {/* Top Bar */}
        <div id="Top-Bar" className="flex items-center w-full gap-5 mt-5 mb-5">
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <UserProfileCard title="Edit Gudang" backLink="/warehouses" />
          </div>
        </div>

        {/* Main Form */}
        <main className="flex flex-col gap-5 flex-1">
          <div className="flex gap-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
            >
              {/* Upload Section */}
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
                      id="photo"
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

              {/* Input Fields */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium text-font"
                  >
                    Nama Gudang
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("name")}
                      id="name"
                      type="text"
                      className="block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                      placeholder="Masukkan nama gudang"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm/6 font-medium text-font"
                  >
                    No. Telepon Gudang
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("phone")}
                      id="phone"
                      type="text"
                      className="block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                      placeholder="Masukkan no. telepon"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm/6 font-medium text-font"
                >
                  Alamat Gudang
                </label>
                <div className="mt-1">
                  <textarea
                    {...register("address")}
                    id="address"
                    rows={4}
                    className="block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                    placeholder="Masukkan alamat gudang"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500">{errors.address.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-4 mt-4">
                <button type="submit" className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary ease-in-out duration-300 transition">
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

export default EditWarehouse;
