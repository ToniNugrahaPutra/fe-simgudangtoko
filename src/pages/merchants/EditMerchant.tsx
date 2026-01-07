import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchMerchant, useUpdateMerchant } from "../../hooks/useMerchants";
import { useFetchUsers } from "../../hooks/useUsers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MerchantFormData, merchantSchema } from "../../schemas/merchantSchema";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";

const EditMerchant = () => {
  const { id } = useParams<{ id: string }>();

  const { data: merchant, isPending: merchantPending } = useFetchMerchant(
    Number(id)
  ); // ✅ Use `isPending`

  const { mutate: updateMerchant, isPending } = useUpdateMerchant(); // ✅ Use `isPending`

  const { data: users, isPending: usersPending } = useFetchUsers(); // ✅ Use `isPending`

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState(
    "/assets/images/icons/gallery-grey.svg"
  );

  // ✅ React Hook Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<MerchantFormData>({
    resolver: zodResolver(merchantSchema),
  });

  // ✅ Populate form fields when merchant data is available
  useEffect(() => {
    if (merchant) {
      setValue("name", merchant.name);
      setValue("phone", merchant.phone);
      setValue("address", merchant.address);
      setValue("keeper_id", merchant.keeper_id);
      if (merchant.photo) {
        setImagePreview(merchant.photo);
      }
    }
  }, [merchant, setValue]);

  const onSubmit = (data: MerchantFormData) => {
    updateMerchant(
      { id: Number(id), ...data },
      {
        onError: (error: AxiosError<ApiErrorResponse>) => {
          const { message, errors: fieldErrors } = error.response?.data || {};
          if (message) {
            setError("root", { type: "server", message });
          }
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([key, value]) => {
              setError(key as keyof MerchantFormData, {
                type: "server",
                message: value[0],
              });
            });
          }
        },
      }
    );
  };

  if (merchantPending) return <p>Loading merchant details...</p>;

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-5 mt-5 mb-5"
        >
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <UserProfileCard title="Edit Merchant" backLink="/merchants" />
          </div>
        </div>
        <main className="flex flex-col gap-5 flex-1">
          <div className="flex gap-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full rounded-3xl p-5 gap-5 bg-white"
            >
              {/* === FOTO (SAMA DENGAN CREATE) === */}
              <div className="col-span-full flex justify-center">
                <div className="w-full max-w-md">
                  <div
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-5 py-10 relative bg-white cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative aspect-video w-full">
                        <img
                          src={imagePreview}
                          className="w-full h-full rounded-lg object-cover"
                          alt="Preview"
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
                      <div className="text-center flex flex-col justify-center items-center aspect-video w-full">
                        <img
                          src="/assets/images/icons/gallery-grey.svg"
                          className="mx-auto h-12 w-12 text-border mb-4"
                        />
                        <p className="text-sm text-gray-500">
                          Upload or drag a file
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

              {/* === MERCHANT NAME === */}
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

              {/* === PHONE + SELECT KEEPER === */}
              <div className="grid grid-cols-2 gap-5 w-full">
                <div>
                  <label className="block text-sm font-medium text-font">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:outline-primary"
                    placeholder="Nomor telepon"
                  />
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-font">
                    Select Keeper
                  </label>

                  <div className="relative mt-1">
                    <select
                      {...register("keeper_id")}
                      className="block w-full appearance-none rounded-lg bg-white p-3 text-font outline-1 outline-border focus:outline-2 focus:outline-primary"
                    >
                      <option value="">-- Pilih Keeper --</option>
                      {users?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>

                    <img
                      src="/assets/images/icons/arrow-down-grey.svg"
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-5"
                      alt="icon"
                    />
                  </div>

                  {errors.keeper_id && (
                    <p className="text-red-500">{errors.keeper_id.message}</p>
                  )}
                </div>
              </div>

              {/* === ADDRESS === */}
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

export default EditMerchant;
