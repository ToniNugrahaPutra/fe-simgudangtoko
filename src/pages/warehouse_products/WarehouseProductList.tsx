import { Link, useParams } from "react-router-dom";
import { useFetchWarehouse } from "../../hooks/useWarehouses";
import Sidebar from "../../components/Sidebar";
import React, { useState } from "react";
import { useFetchProduct } from "../../hooks/useProducts";
import UserProfileCard from "../../components/UserProfileCard";
import { PlusIcon, PhoneIcon } from "@heroicons/react/24/solid";

const WarehouseProductList = () => {
  const { id } = useParams<{ id: string }>(); // Get Warehouse ID from URL
  const { data: warehouse, isPending } = useFetchWarehouse(Number(id));

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { data: selectedProduct } = useFetchProduct(selectedProductId || 0);

  if (!warehouse) return <p>Warehouse not found</p>;
  if (isPending) return <p>Loading warehouse products...</p>;

  return (
    <>
      <div id="main-container" className="flex flex-1 min-h-screen">
        <Sidebar />
        <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
          <div
            id="Top-Bar"
            className="flex items-center w-full gap-5 mt-5 mb-6"
          >
            <div id="Top-Bar" className="flex items-center w-full gap-6">
              <UserProfileCard title="Detail Gudang" backLink="/warehouses" />
            </div>
          </div>
          <main className="flex flex-col gap-6 flex-1">
            <section
              id="Warehouse-Info"
              className="flex items-center justify-between rounded-3xl p-5 gap-3 bg-white"
            >
              <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                <img
                  src={`http://localhost:8000${warehouse.photo}`}
                  alt="icon"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <p className="font-semibold text-lg">{warehouse.name}</p>
                <p className="flex items-center gap-1 font-medium text-sm text-font">
                  <PhoneIcon className="size-4" />
                  <span className="pl-1">{warehouse.phone}</span>
                </p>
              </div>
              <Link
                to={`/warehouses/edit/${warehouse.id}`}
                className="bg-primary text-white px-3 py-2 rounded-full font-semibold text-nowrap ease-in-out duration-300 transition hover:text-primary hover:bg-white hover:border-primary"
              >
                Edit Gudang
              </Link>
            </section>
            <section
              id="Products"
              className="flex flex-col gap-6 flex-1 rounded-3xl p-5 px-0 bg-white"
            >
              {/* HEADER */}
              <div
                id="Header"
                className="flex items-center justify-between px-5"
              >
                <div className="flex flex-col">
                  <p className="flex items-center font-semibold text-2xl text-primary">
                    {warehouse.products.length || 0}
                    <span className="text-font pl-2 font-medium">
                      Total Produk
                    </span>
                  </p>
                </div>

                <Link
                  to={`/warehouse-products/${id}/assign`}
                  className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full"
                >
                  Daftarkan Produk
                  <PlusIcon className=" ml-2 size-6" />
                </Link>
              </div>

              {/* TABLE */}
              <div id="Product-List" className="flow-root flex-1">
                {warehouse.products.length > 0 ? (
                  <div className="-mx-4 -my-2 overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                Produk
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                              >
                                Harga
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                              >
                                Stok
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                              >
                                Kategori
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
                            {warehouse.products.map((product) => (
                              <tr key={product.id}>
                                {/* Nama + Thumbnail */}
                                <td className="flex items-center gap-3 py-2 text-sm text-gray-900 px-5 align-middle">
                                  <div className="flex size-[64px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                                    <img
                                      src={product.thumbnail}
                                      className="size-full object-contain"
                                      alt="product"
                                    />
                                  </div>
                                  <p className="font-semibold text-base truncate w-[200px]">
                                    {product.name}
                                  </p>
                                </td>

                                {/* Harga */}
                                <td className="px-3 py-2 text-sm font-semibold text-monday-blue whitespace-nowrap align-middle">
                                  Rp {product.price.toLocaleString("id")}
                                </td>

                                {/* Stok */}
                                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap align-middle">
                                  {product.pivot?.stock || 0} Stock
                                </td>

                                {/* Kategori */}
                                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap align-middle">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={`http://localhost:8000${product.category.photo}`}
                                      className="size-6 flex shrink-0"
                                      alt="category"
                                    />
                                    <p className="font-semibold text-base truncate w-[150px]">
                                      {product.category.name}
                                    </p>
                                  </div>
                                </td>

                                {/* Aksi */}
                                <td className="px-3 py-2 text-sm font-medium whitespace-nowrap text-right align-middle">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() =>
                                        setSelectedProductId(product.id)
                                      }
                                      className="btn btn-primary-opacity min-w-[100px] font-semibold flex items-center justify-center"
                                    >
                                      Details
                                    </button>
                                    <Link
                                      to={`/warehouse-products/${id}/edit-assign/${product.id}`}
                                      className="btn btn-black min-w-[100px] font-semibold flex items-center justify-center"
                                    >
                                      Add Stock
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
                      src="/assets/images/icons/document-text-grey.svg"
                      className="size-[52px]"
                      alt="empty"
                    />
                    <p className="font-semibold text-font">
                      Oops, sepertinya belum ada data produk.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {selectedProductId && selectedProduct && (
        <div className="modal flex flex-1 items-center justify-center h-full fixed top-0 w-full">
          <div
            onClick={() => setSelectedProductId(null)}
            className="absolute w-full h-full bg-[#292D32B2] cursor-pointer"
          />
          <div className="relative flex flex-col w-[406px] shrink-0 rounded-3xl p-5 gap-5 bg-white">
            <div className="modal-header flex items-center justify-between">
              <p className="font-semibold text-xl">Product Details</p>
              <button
                onClick={() => setSelectedProductId(null)}
                className="flex size-14 rounded-full items-center justify-center bg-font-background"
              >
                <img
                  src="/assets/images/icons/close-circle-black.svg"
                  className="size-6"
                  alt="icon"
                />
              </button>
            </div>
            <div className="modal-content flex flex-col rounded-3xl border border-border p-4 gap-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-[6px] font-semibold text-lg">
                    <img
                      src={selectedProduct.category.photo}
                      className="size-6 flex shrink-0"
                      alt="icon"
                    />
                    {selectedProduct.name}
                  </p>
                  <p className="font-bold text-lg">
                    {selectedProduct.category.name}
                  </p>
                  <p className="font-semibold text-[17px] text-monday-blue">
                    Rp {selectedProduct.price.toLocaleString("id")}
                  </p>
                </div>
                <div className="flex size-[100px] rounded-2xl bg-font-background items-center justify-center overflow-hidden">
                  <img
                    src={selectedProduct.thumbnail}
                    className="size-full object-contain"
                    alt="icon"
                  />
                </div>
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-medium text-sm text-font">
                  Product About
                </p>
                <p className="font-semibold leading-[160%]">
                  {selectedProduct.about}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WarehouseProductList;
