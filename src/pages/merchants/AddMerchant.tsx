import Sidebar from "../../components/Sidebar";
import { useCreateMerchant } from "../../hooks/useMerchants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MerchantFormData, merchantSchema } from "../../schemas/merchantSchema";
import { useFetchUsers } from "../../hooks/useUsers";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const AddMerchant = () => {
  const { mutate: createMerchant, isPending } = useCreateMerchant();
  const { data: users, isPending: usersPending } = useFetchUsers();

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
  } = useForm<MerchantFormData>({
    resolver: zodResolver(merchantSchema),
  });

  const onSubmit = (data: MerchantFormData) => {
    setError("root", { type: "server", message: "" });
    createMerchant(data, {
      onError: (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
          const { message, errors } = error.response.data;

          if (message) {
            setError("root", { type: "server", message });
          }

          if (errors) {
            Object.entries(errors).forEach(([key, messages]) => {
              setError(key as keyof MerchantFormData, {
                type: "server",
                message: messages[0],
              });
            });
          }
        }
      },
    });
  };

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div id="Top-Bar" className="flex items-center w-full gap-5 mt-5 mb-5">
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <UserProfileCard title="Tambah Toko" backLink="/merchants" />
          </div>
        </div>
        <main className="flex flex-col gap-6 flex-1">
          <div className="flex gap-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full rounded-3xl p-5 gap-5 bg-white"
            >
              {/* === UPLOAD FOTO === */}
              <div className="col-span-full flex justify-center">
                <div className="w-full max-w-md">
                  <div
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10 relative bg-white"
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
                        <div className="flex text-sm text-gray-600 justify-center">
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

              {/* === MERCHANT NAME (FULL WIDTH) === */}
              <div className="w-full">
                <label className="block text-sm font-medium text-font">
                  Merchant Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:outline-primary"
                  placeholder="Masukkan nama merchant"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* === PHONE + SELECT KEEPER DALAM GRID 2 === */}
              <div className="grid grid-cols-2 gap-5 w-full">
                {/* PHONE NUMBER */}
                <div>
                  <label className="block text-sm font-medium text-font">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:outline-primary"
                    placeholder="Masukkan nomor telepon"
                  />
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                {/* SELECT KEEPER */}
                <div>
                  <label className="block text-sm font-medium text-font">
                    Select Keeper
                  </label>
                  <div className="mt-1 relative">
                    <div className="grid grid-cols-1">
                      {usersPending ? (
                        <div className="w-full rounded-lg bg-white p-3 text-font outline-1 outline-border flex items-center justify-center">
                          Loading users...
                        </div>
                      ) : (
                        <select
                          {...register("keeper_id")}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-lg bg-white p-3 text-font outline-1 outline-border focus:outline-2 focus:outline-primary"
                        >
                          <option value="">-- Pilih Keeper --</option>
                          {users?.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <img
                        src="/assets/images/icons/arrow-down-grey.svg"
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-500"
                        alt="icon"
                      />
                    </div>
                  </div>
                  {errors.keeper_id && (
                    <p className="text-red-500">{errors.keeper_id.message}</p>
                  )}
                </div>
              </div>

              {/* === ADDRESS FULL WIDTH === */}
              <div className="w-full">
                <label className="block text-sm font-medium text-font">
                  Merchant Address
                </label>
                <textarea
                  {...register("address")}
                  rows={5}
                  className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:outline-primary"
                  placeholder="Alamat merchant"
                />
                {errors.address && (
                  <p className="text-red-500">{errors.address.message}</p>
                )}
              </div>
                
              <div className="flex items-center justify-end gap-4">
                <button type="submit" className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary ease-in-out duration-300 transition">
                  {isPending ? "Saving..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddMerchant;
