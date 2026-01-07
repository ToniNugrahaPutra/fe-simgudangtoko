import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchMerchants } from "../../hooks/useMerchants";
import UserProfileCard from "../../components/UserProfileCard";
import { PlusIcon } from "@heroicons/react/24/solid";

const MerchantList = () => {
  const { data: merchants, isPending, isError, error } = useFetchMerchants(); 

  if (isPending) return <p>Loading merchants...</p>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-5 mt-5 mb-5"
        >
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <UserProfileCard title="Manajemen Toko" />
          </div>
        </div>
        <main className="flex flex-col gap-5 flex-1">
          <section
            id="Merchants"
            className="flex flex-col gap-5 flex-1 rounded-3xl p-5 px-0 bg-white"
          >
            {/* HEADER */}
            <div id="Header" className="flex items-center justify-between px-5">
              <div className="flex flex-col">
                <p className="flex items-center font-semibold text-2xl text-primary">
                  {merchants.length || 0}
                  <span className="text-font pl-2 font-medium">
                    Total Toko
                  </span>
                </p>
              </div>

              <Link
                to="/merchants/add"
                className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full"
              >
                Tambah Toko
                <PlusIcon className=" ml-2 size-5" />
              </Link>
            </div>

            {/* TABLE */}
            <div id="Merchant-List" className="flow-root flex-1">
              {merchants.length > 0 ? (
                <div className="-mx-4 -my-2 overflow-x-auto">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-8">
                    <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-5"
                            >
                              Toko
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Operator
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Jumlah Produk
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pr-4 pl-3 text-right text-sm font-semibold text-gray-900 sm:pr-5"
                            >
                              Aksi
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                          {merchants.map((merchant) => (
                            <tr key={merchant.id}>
                              {/* MERCHANT + PHOTO */}
                              <td className="flex items-center gap-3 py-2 text-sm text-gray-900 px-5">
                                <div className="flex size-[64px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                                  <img
                                    src={`http://localhost:8000${merchant.photo}`}
                                    className="size-full object-contain"
                                    alt="merchant"
                                  />
                                </div>
                                <p className="font-semibold text-base truncate w-[200px]">
                                  {merchant.name}
                                </p>
                              </td>

                              {/* KEEPER */}
                              <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">
                                {merchant.keeper?.name || "-"}
                              </td>

                              {/* JUMLAH PRODUK */}
                              <td className="px-3 py-2 text-sm font-semibold text-monday-blue whitespace-nowrap">
                                {merchant.products.length} Produk
                              </td>

                              {/* ACTION */}
                              <td className="py-2 pr-5 text-right text-sm font-medium whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                  <Link
                                    to={`/merchant-products/${merchant.id}`}
                                    className="font-semibold text-font pr-5"
                                  >
                                    Details
                                  </Link>
                                  <Link
                                    to={`/merchants/edit/${merchant.id}`}
                                    className="font-semibold text-blue-500"
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
                  className="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-border gap-5 py-10"
                >
                  <img
                    src="/assets/images/icons/document-text-grey.svg"
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
    </div>
  );
};

export default MerchantList;
