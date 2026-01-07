import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchUser, useUpdateUser } from "../../hooks/useUsers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormData, userSchema } from "../../schemas/userSchema";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isPending: isUserLoading } = useFetchUser(Number(id));
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState(
    "/assets/images/icons/gallery-grey.svg"
  );

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("phone", user.phone);
      setValue("email", user.email);
      if (user.photo) {
        setImagePreview(user.photo);
      }
    }
  }, [user, setValue]);

  const onSubmit = (data: UserFormData) => {
    updateUser(
      { id: Number(id), ...data },
      {
        onError: (error: AxiosError<ApiErrorResponse>) => {
          if (error.response?.data.errors) {
            Object.entries(error.response.data.errors).forEach(
              ([key, messages]) => {
                setError(key as keyof UserFormData, {
                  type: "server",
                  message: messages[0],
                });
              }
            );
          }
        },
      }
    );
  };

  if (isUserLoading) return <p>Loading user details...</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-5 mt-5 mb-5"
        >
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <UserProfileCard title="Edit User" backLink="/users" />
          </div>
        </div>
        <main className="flex flex-col gap-5 flex-1">
          <div className="flex gap-5">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
            >
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

              <div className="grid grid-cols-2 gap-5">
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

              <div className="flex items-center justify-end gap-4">
                <button
                  type="submit"
                  className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary transition duration-300"
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

export default EditUser;
