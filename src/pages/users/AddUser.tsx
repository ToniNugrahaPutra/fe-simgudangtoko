import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import Sidebar from "../../components/Sidebar";
import UserProfileCard from "../../components/UserProfileCard";

import { useCreateUser } from "../../hooks/useUsers";
import { UserFormData, userSchema } from "../../schemas/userSchema";
import { ApiErrorResponse } from "../../types/types";

const AddUser = () => {
  const { mutate: createUser, isPending } = useCreateUser();

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
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserFormData) => {
    const formData = new FormData();

    // 🔁 mapping frontend → backend
    formData.append("nama", data.name);
    formData.append("no_hp", data.phone);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append(
      "password_confirmation",
      data.password_confirmation
    );
    formData.append("foto", data.photo);

    createUser(formData, {
      onError: (error: AxiosError<ApiErrorResponse>) => {
        if (!error.response) return;

        const { message, errors } = error.response.data;

        // global error
        if (message) {
          setError("root", {
            type: "server",
            message,
          });
        }

        // field error mapping backend → frontend
        if (errors) {
          Object.entries(errors).forEach(([key, messages]) => {
            const map: Record<string, keyof UserFormData> = {
              nama: "name",
              no_hp: "phone",
              foto: "photo",
            };

            setError(map[key] || (key as keyof UserFormData), {
              message: (messages as string[])[0],
            });
          });
        }
      },
    });
  };

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />

      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div className="flex items-center w-full gap-5 mt-5 mb-5">
          <UserProfileCard title="Tambah User" backLink="/users" />
        </div>

        <main className="flex flex-col gap-5 flex-1">
          <div className="flex gap-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
            >
                {/* UPLOAD FOTO */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md flex justify-center">
                    <div
                      className="mt-2 flex justify-center rounded-lg border border-dashed border-border p-5 relative bg-white w-48 h-48 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview &&
                      imagePreview !== "/assets/images/icons/gallery-grey.svg" ? (
                        <div className="relative w-full h-full">
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
                        <div className="text-center cursor-pointer w-full h-full flex flex-col justify-center items-center">
                          <svg
                            className="mx-auto h-10 w-10 text-border mb-2"
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
                          <span className="font-semibold text-primary">
                            Upload a file
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
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

                {/* GRID INPUTS */}
                <div className="grid grid-cols-2 gap-5">
                  {/* FULL NAME (FULL WIDTH) */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-font">
                      Full Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border focus:outline-2 focus:outline-primary"
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="block text-sm font-medium text-font">
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="text"
                      className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border focus:outline-2 focus:outline-primary"
                      placeholder="Masukkan nomor telepon"
                    />
                    {errors.phone && (
                      <p className="text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-medium text-font">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="off"
                      className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border focus:outline-2 focus:outline-primary"
                      placeholder="Masukkan email"
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-sm font-medium text-font">
                      Password
                    </label>
                    <input
                      {...register("password")}
                      type="password"
                      autoComplete="off"
                      className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border focus:outline-2 focus:outline-primary tracking-[0.3em]"
                      placeholder="*******"
                    />
                    {errors.password && (
                      <p className="text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="block text-sm font-medium text-font">
                      Password Confirmation
                    </label>
                    <input
                      {...register("password_confirmation")}
                      type="password"
                      className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border focus:outline-2 focus:outline-primary tracking-[0.3em]"
                      placeholder="*******"
                    />
                    {errors.password_confirmation && (
                      <p className="text-red-500">
                        {errors.password_confirmation.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex items-center justify-end gap-4">
                  <button
                    type="submit"
                    className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary transition duration-300"
                  >
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

  export default AddUser;
