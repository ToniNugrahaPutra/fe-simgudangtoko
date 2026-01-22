import Sidebar from "../../components/Sidebar";
import {
  useFetchRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "../../hooks/useRoles";
import UserProfileCard from "../../components/UserProfileCard";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleFormData, roleSchema } from "../../schemas/roleSchema";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import { useQueryClient } from "@tanstack/react-query";

const RoleList = () => {
  const queryClient = useQueryClient();

  const { data: roles = [], isPending } = useFetchRoles();
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  // Modal Add/Edit
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Modal Delete Confirm
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Notif
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Auto hide notif success/error
  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  const isSaving = isCreating || isUpdating;

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedId(null);
    reset();
    setIsOpen(true);
  };

  const handleOpenEdit = (roleId: number, roleName: string) => {
    setIsEditing(true);
    setSelectedId(roleId);
    setValue("name", roleName);
    setIsOpen(true);
  };

  const openDeleteModal = (roleId: number, roleName: string) => {
    setDeleteTarget({ id: roleId, name: roleName });
    setIsDeleteOpen(true);
  };

  const onSubmit = (data: RoleFormData) => {
    setError("root", { type: "server", message: "" });

    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });

      setSuccessMessage(
        isEditing ? "Role berhasil diupdate ✅" : "Role berhasil ditambahkan ✅"
      );

      reset();
      setIsOpen(false);
    };

    const onError = (error: AxiosError<ApiErrorResponse>) => {
      if (!error.response) return;

      const { message, errors } = error.response.data;

      if (message) {
        setError("root", { type: "server", message });
      }

      if (errors) {
        Object.entries(errors).forEach(([key, messages]) => {
          setError(key as keyof RoleFormData, {
            type: "server",
            message: (messages as string[])[0],
          });
        });
      }
    };

    if (isEditing && selectedId) {
      updateRole({ id: selectedId, ...data }, { onSuccess, onError });
    } else {
      createRole(data, { onSuccess, onError });
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteRole(deleteTarget.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        setSuccessMessage("Role berhasil dihapus ✅");
        setIsDeleteOpen(false);
        setDeleteTarget(null);
      },
      onError: () => {
        setErrorMessage("Gagal menghapus role ❌");
      },
    });
  };

  if (isPending) return <p>Loading roles...</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />

      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div className="flex items-center w-full gap-5 mt-5 mb-5">
          <UserProfileCard title="Manajemen Role" />
        </div>

        <main className="flex flex-col gap-6 flex-1">
          <section className="flex flex-col gap-6 flex-1 rounded-3xl p-5 px-0 bg-white">
            {successMessage && (
              <div className="mx-5 p-3 rounded-xl bg-green-100 text-green-700 font-semibold">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mx-5 p-3 rounded-xl bg-red-100 text-red-700 font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-between px-5">
              <div className="flex flex-col">
                <p className="flex items-center font-semibold text-2xl text-primary">
                  {roles.length || 0}
                  <span className="text-font pl-2 font-medium">Total Roles</span>
                </p>
              </div>

              <button
                onClick={handleOpenAdd}
                className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full cursor-pointer"
              >
                Tambah Role
                <PlusIcon className="ml-2 size-6" />
              </button>
            </div>

            <div className="flow-root flex-1">
              {roles.length > 0 ? (
                <div className="-mx-4 -my-2 overflow-x-auto">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Role
                            </th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Total User
                            </th>
                            <th className="py-3.5 pr-4 pl-3 text-right text-sm font-semibold text-gray-900 sm:pr-6">
                              Aksi
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                          {roles.map((role) => (
                            <tr key={role.id}>
                              <td className="flex items-center gap-3 py-2 text-sm text-gray-900 px-5">
                                <div className="flex size-[64px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                                  <img
                                    src="assets/images/icons/user-octagon-grey.svg"
                                    className="size-5 object-contain"
                                    alt="role"
                                  />
                                </div>
                                <p className="font-semibold text-base truncate w-[200px]">
                                  {role.name}
                                </p>
                              </td>

                              <td className="px-3 py-2 text-sm font-semibold text-monday-blue whitespace-nowrap">
                                {role.users_web_count} User
                              </td>

                              <td className="py-2 pr-5 text-right text-sm font-medium whitespace-nowrap">
                                <div className="flex justify-end gap-3">
                                  <button
                                    onClick={() =>
                                      handleOpenEdit(role.id, role.name)
                                    }
                                    className="min-w-[100px] font-semibold text-primary cursor-pointer"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() =>
                                      openDeleteModal(role.id, role.name)
                                    }
                                    className="min-w-[100px] font-semibold text-red-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? "Deleting..." : "Hapus"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-border gap-6 py-10">
                  <img
                    src="assets/images/icons/document-text-grey.svg"
                    className="size-[52px]"
                    alt="empty"
                  />
                  <p className="font-semibold text-font">
                    Oops, it looks like there's no data yet.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* ✅ Modal Add/Edit */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="font-primary relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col w-full gap-5"
                >
                  <h2 className="font-semibold text-xl capitalize">
                    {isEditing ? "Edit Role" : "Tambah Role"}
                  </h2>

                  {errors.root && (
                    <p className="text-red-500">{errors.root.message}</p>
                  )}

                  <div className="w-full">
                    <label className="block text-sm font-medium text-font">
                      Role
                    </label>

                    <input
                      type="text"
                      {...register("name")}
                      className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:outline-primary"
                      placeholder="Nama role"
                    />

                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="btn btn-red font-semibold"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary ease-in-out duration-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSaving
                        ? "Saving..."
                        : isEditing
                        ? "Update"
                        : "Simpan"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* ✅ Modal Confirm Delete */}
      <Transition appear show={isDeleteOpen} as={Fragment}>
        <Dialog
          as="div"
          className="font-primary relative z-50"
          onClose={() => setIsDeleteOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="font-semibold text-xl">Hapus Role</h2>

                <p className="mt-2 text-sm text-gray-600">
                  Yakin ingin menghapus role{" "}
                  <span className="font-bold text-red-600">
                    {deleteTarget?.name}
                  </span>
                  ?
                </p>

                <div className="flex items-center justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsDeleteOpen(false)}
                    className="btn btn-red font-semibold"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="cursor-pointer font-semibold bg-red-600 text-white border h-12 px-5 rounded-full hover:bg-white hover:text-red-600 hover:border-red-600 ease-in-out duration-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Deleting..." : "Hapus"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default RoleList;
