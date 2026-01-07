import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchUsers, useDeleteUser } from "../../hooks/useUsers";
import { useFetchRoles } from "../../hooks/useRoles";
import { useAssignUserRole } from "../../hooks/useAssignRoles";
import { User } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";
import { PlusIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

const UserList = () => {
  const { data: users, isPending } = useFetchUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const { data: roles } = useFetchRoles();
  const { mutate: assignRole } = useAssignUserRole();

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [roleId, setRoleId] = React.useState("");

  const openAssignModal = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleAssign = () => {
    if (!selectedUser || !roleId) return;
    assignRole({ user_id: selectedUser.id, role_id: Number(roleId) });
    setIsOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  if (!users) return <p>not found users...</p>;
  if (isPending) return <p>Loading users...</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div id="Top-Bar" className="flex items-center w-full gap-5 mt-5 mb-5">
          <div className="flex items-center w-full gap-5">
            <UserProfileCard title="Manajemen User" />
          </div>
        </div>

        <main className="flex flex-col gap-6 flex-1">
          <section
            id="Users"
            className="flex flex-col gap-6 flex-1 rounded-3xl p-5 px-0 bg-white"
          >
            <div id="Header" className="flex items-center justify-between px-5">
              <div className="flex flex-col">
                <p className="flex items-center font-semibold text-2xl text-primary">
                  {users.length || 0}
                  <span className="text-font pl-2 font-medium">
                    Total Users
                  </span>
                </p>
              </div>

              <Link
                to="/users/add"
                className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full cursor-pointer"
              >
                Tambah User
                <PlusIcon className=" ml-2 size-5" />
              </Link>
            </div>

            <div id="User-List" className="flow-root flex-1">
              {users.length > 0 ? (
                <div className="-mx-4 -my-2 overflow-x-auto">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm outline outline-1 outline-black/5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              User
                            </th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Phone
                            </th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Role
                            </th>
                            <th className="py-3.5 pr-4 pl-3 text-right text-sm font-semibold text-gray-900 sm:pr-6">
                              Aksi
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="flex items-center gap-3 py-3 px-5 text-sm text-gray-900">
                                <div className="flex size-[64px] rounded-full bg-monday-background items-center justify-center overflow-hidden">
                                  <img
                                    src={user.photo}
                                    className="size-full object-cover"
                                    alt="user"
                                  />
                                </div>
                                <p className="font-semibold text-base truncate w-[200px]">
                                  {user.name}
                                </p>
                              </td>

                              <td className="px-3 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                                {user.phone}
                              </td>

                              <td className="px-3 py-3 text-sm font-semibold text-monday-blue whitespace-nowrap">
                                {user.roles?.join(", ") || "No Role"}
                              </td>

                              <td className="py-3 pr-5 text-right text-sm font-medium whitespace-nowrap">
                                <div className="flex justify-end space-x-3">

                                  <button
                                    onClick={() => openAssignModal(user)}
                                    className="font-semibold text-font cursor-pointer"
                                  >
                                    Assign role |
                                  </button>

                                  <Link
                                    to={`/users/edit/${user.id}`}
                                    className="font-semibold text-primary cursor-pointer"
                                  >
                                    Edit |
                                  </Link>

                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="font-semibold text-red-600 cursor-pointer"
                                  >
                                    Delete
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
                <div
                  id="Empty-State"
                  className="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-border gap-6 py-10"
                >
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

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 font-primary">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <DialogTitle className="text-xl font-semibold mb-4">
              Assign Role
            </DialogTitle>

            <p className="font-medium mb-3">
              User: <span className="font-bold text-primary">{selectedUser?.name}</span>
            </p>

            <label className="block mb-4">
              <p className="font-medium mb-1">Pilih Role</p>
              <select
                className="w-full border rounded-xl p-3"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option value="">Select role</option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleAssign}
                className="px-4 py-2 rounded-xl bg-primary text-white font-semibold cursor-pointer"
              >
                Save
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

    </div>
  );
};

export default UserList;
