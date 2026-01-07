import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchCategories } from "../../hooks/useCategories";
import React from "react";
import UserProfileCard from "../../components/UserProfileCard";
import { PlusIcon } from "@heroicons/react/24/solid";

const CategoryList = () => {
  const { data: categories, isPending, isError, error } = useFetchCategories();

  if (isPending) return <p>Loading categories...</p>;
  if (isError)
    return (
      <p className="text-red-500">Error fetching categories: {error.message}</p>
    );

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div id="Top-Bar" className="flex items-center w-full gap-6 mt-5 mb-6">
          <div id="Top-Bar" className="flex items-center w-full gap-6">
            <UserProfileCard title="Manajemen Kategori" />
          </div>
        </div>
        <main className="flex flex-col gap-6 flex-1">
          <section
            id="Categories"
            className="flex flex-col gap-6 flex-1 rounded-3xl p-5 px-0 bg-white"
          >
            {/* HEADER */}
            <div id="Header" className="flex items-center justify-between px-5">
              <div className="flex flex-col">
                <p className="flex items-center font-semibold text-2xl text-primary">
                  {categories.length || 0}
                  <span className="text-font pl-2 font-medium">
                    Total Kategori
                  </span>
                </p>
              </div>
              <Link
                to="/categories/add"
                className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full"
              >
                Tambah Kategori
                <PlusIcon className=" ml-2 size-6" />
              </Link>
            </div>

            {/* TABLE */}
            <div id="Category-List" className="flow-root flex-1">
              {categories.length > 0 ? (
                <div className="-mx-4 -my-2 overflow-x-auto">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Kategori
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Tagline
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Jumlah Produk
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pr-4 pl-3 text-right text-sm font-semibold text-gray-900 sm:pr-6"
                            >
                              Aksi
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                          {categories.map((category) => (
                            <tr key={category.id}>
                              <td className="flex items-center gap-3 py-2 text-sm text-gray-900 px-5">
                                <div className="flex size-[64px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                                  <img
                                    src={`http://localhost:8000${category.photo}`}
                                    className="size-full object-contain"
                                    alt="category"
                                  />
                                </div>
                                <p className="font-semibold text-base truncate w-[200px]">
                                  {category.name}
                                </p>
                              </td>

                              <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                                {category.tagline || "-"}
                              </td>

                              <td className="px-3 py-2 text-sm font-semibold text-monday-blue whitespace-nowrap">
                                {category.products?.length || 0} Produk
                              </td>

                              <td className="py-2 pr-5 text-right text-sm font-medium whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                  <Link
                                    to={`/categories/edit/${category.id}`}
                                    className="min-w-[100px] font-semibold text-blue-600"
                                  >
                                    Edit
                                  </Link>
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
                  className="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6 py-10"
                >
                  <img
                    src="assets/images/icons/document-text-grey.svg"
                    className="size-[52px]"
                    alt="empty"
                  />
                  <p className="font-semibold text-monday-gray">
                    Oops, it looks like there's no data yet.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CategoryList;
