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
  const [role, setRole] = React.useState("");

  const openAssignModal = (user: User) => {
    setSelectedUser(user);
    setRole("");
    setIsOpen(true);
  };

const handleAssign = () => {
  if (!selectedUser || !role) return;

  const selectedRole = roles?.find(r => r.name === role);
  if (!selectedRole) return;

  assignRole({
    pengguna_id: selectedUser.id,
    role: selectedRole.name,
  });
  setIsOpen(false);
};

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  if (isPending) return <p>Loading users...</p>;
  if (!users) return <p>not found users...</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />

      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div className="flex items-center w-full gap-5 mt-5 mb-5">
          <UserProfileCard title="Manajemen User" />
        </div>

        <main className="flex flex-col gap-6 flex-1">
          <section className="flex flex-col gap-6 flex-1 rounded-3xl p-5 px-0 bg-white">
            <div className="flex items-center justify-between px-5">
              <p className="font-semibold text-2xl text-primary">
                {users.length}
                <span className="text-font pl-2 font-medium">Total Users</span>
              </p>

              <Link
                to="/users/add"
                className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full"
              >
                Tambah User
                <PlusIcon className="ml-2 size-5" />
              </Link>
            </div>

            <div className="flow-root flex-1">
              {users.length > 0 ? (
                <div className="-mx-4 -my-2 overflow-x-auto">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm outline outline-1 outline-black/5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left">User</th>
                            <th className="px-3 py-3 text-left">Phone</th>
                            <th className="px-3 py-3 text-left">Role</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="flex items-center gap-3 py-3 px-6">
                                <div className="size-[48px] rounded-full overflow-hidden bg-gray-100">
                                  <img
                                    src={user.photo}
                                    alt="user"
                                    className="size-full object-cover"
                                  />
                                </div>
                                <p className="font-semibold">{user.name}</p>
                              </td>

                              <td className="px-3 py-3 text-sm">
                                {user.phone}
                              </td>
                              <td className="px-3 py-3 text-sm font-semibold text-monday-blue whitespace-nowrap">
                                {user.roles && user.roles.length > 0
                                  ? user.roles.join(", ")
                                  : "No Role"}
                              </td>
                              <td className="px-6 py-3 text-right">
                                <div className="flex justify-end gap-3">
                                  <button
                                    onClick={() => openAssignModal(user)}
                                    className="font-semibold text-font"
                                  >
                                    Assign role |
                                  </button>

                                  <Link
                                    to={`/users/edit/${user.id}`}
                                    className="font-semibold text-primary"
                                  >
                                    Edit |
                                  </Link>

                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="font-semibold text-red-600"
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
                <p className="text-center py-10">No users found</p>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* ===== MODAL ASSIGN ROLE ===== */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6">
            <DialogTitle className="text-xl font-semibold mb-4">
              Assign Role
            </DialogTitle>

            <p className="mb-3">
              User:{" "}
              <span className="font-bold text-primary">
                {selectedUser?.name}
              </span>
            </p>

            <select
              className="w-full border rounded-xl p-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select role</option>
              {roles?.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleAssign}
                className="px-4 py-2 rounded-xl bg-primary text-white font-semibold"
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
