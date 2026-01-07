import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchWarehouses } from "../../hooks/useWarehouses";
import UserProfileCard from "../../components/UserProfileCard";
import { PlusIcon } from "@heroicons/react/24/solid";

const WarehouseList = () => {
  const { data: warehouses, isPending, isError, error } = useFetchWarehouses();

  if (isPending) return <p>Loading warehouses...</p>;
  if (isError)
    return (
      <p className="text-red-500">Error fetching categories: {error.message}</p>
    );

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-5 mt-5 mb-5"
        >
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <UserProfileCard title="Manajemen Gudang" />
          </div>
        </div>
        <main className="flex flex-col gap-5 flex-1">
          <section
            id="Warehouses"
            className="flex flex-col gap-5 flex-1 rounded-3xl p-5 px-0 bg-white"
          >
            {/* HEADER */}
            <div id="Header" className="flex items-center justify-between px-5">
              <div className="flex flex-col">
                <p className="flex items-center font-semibold text-2xl text-primary">
                  {warehouses.length || 0}
                  <span className="text-font pl-2 font-medium">
                    Total Gudang
                  </span>
                </p>
              </div>

              <Link
                to="/warehouses/add"
                className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full"
              >
                Tambah Gudang
                <PlusIcon className=" ml-2 size-5" />
              </Link>
            </div>

            {/* TABLE */}
            <div id="Warehouse-List" className="flow-root flex-1">
              {warehouses.length > 0 ? (
                <div className="-mx-4 -my-2 overflow-x-auto">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-8">
                    <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-5"
                            >
                              Gudang
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                            >
                              Nomor Telepon
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                            >
                              Jumlah Produk
                            </th>
                            <th
                              scope="col"
                              className="py-3 pr-4 pl-3 text-right text-sm font-semibold text-gray-900 sm:pr-6"
                            >
                              Aksi
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                          {warehouses.map((warehouse) => (
                            <tr key={warehouse.id}>
                              {/* Nama + Gambar */}
                              <td className="flex items-center gap-3 py-2 text-sm text-gray-900 px-5">
                                <div className="flex size-[64px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                                  <img
                                    src={`http://localhost:8000${warehouse.photo}`}
                                    className="size-full object-contain"
                                    alt="warehouse"
                                  />
                                </div>
                                <p className="font-semibold text-base truncate w-[200px]">
                                  {warehouse.name}
                                </p>
                              </td>

                              {/* Nomor Telepon */}
                              <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                                {warehouse.phone || "-"}
                              </td>

                              {/* Jumlah Produk */}
                              <td className="px-3 py-2 text-sm font-semibold text-monday-blue whitespace-nowrap">
                                {warehouse.products?.length || 0} Produk
                              </td>

                              {/* Aksi */}
                              <td className="px-3 py-2 text-sm font-medium whitespace-nowrap text-right align-middle">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    to={`/warehouse-products/${warehouse.id}`}
                                    className="btn btn-primary-opacity min-w-[90px] font-semibold flex items-center justify-center"
                                  >
                                    Detail
                                  </Link>
                                  <Link
                                    to={`/warehouses/edit/${warehouse.id}`}
                                    className="min-w-[90px] text-blue-600 font-semibold flex items-center justify-center"
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
                  className="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-border gap-6 py-10"
                >
                  <img
                    src="assets/images/icons/document-text-grey.svg"
                    className="size-[52px]"
                    alt="empty"
                  />
                  <p className="font-semibold text-font">
                    Oops, sepertinya belum ada data gudang.
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

export default WarehouseList;
