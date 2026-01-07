import { useParams, Link } from "react-router-dom";
import { useFetchMerchant } from "../../hooks/useMerchants";
import Sidebar from "../../components/Sidebar";
import React, { useState } from "react";
import { useFetchProduct } from "../../hooks/useProducts";
import UserProfileCard from "../../components/UserProfileCard";
import { PlusIcon } from "@heroicons/react/24/solid";

const MerchantProductList = () => {
  const { id } = useParams<{ id: string }>(); // Get Merchant ID from URL
  const { data: merchant, isPending } = useFetchMerchant(Number(id)); // ✅ Use `isPending`

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { data: selectedProduct } = useFetchProduct(selectedProductId || 0);

  if (!merchant) return <p> merchant not found...</p>;
  if (isPending) return <p>Loading merchant products...</p>;

  return (
    <>
      <div id="main-container" className="flex flex-1 min-h-screen">
        <Sidebar />
        <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
          <div id="Top-Bar" className="flex items-center w-full gap-5 mt-5 mb-5">
            <div id="Top-Bar" className="flex items-center w-full gap-5">
              <UserProfileCard title="Detail Toko" backLink="/merchants" />
            </div>
          </div>

          <main className="flex flex-col flex-1 rounded-3xl bg-white">
            {/* WAREHOUSE INFO */}
            <section id="Warehouse-Info" className="flex items-center justify-between p-5 gap-3">
              <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                <img src={`http://localhost:8000${merchant.photo}`} className="size-full object-contain" alt="icon" />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <p className="font-semibold text-xl">{merchant.name}</p>
                <p className="flex items-center gap-1 font-medium text-lg text-font">
                  <img src="/assets/images/icons/call-grey.svg" className="size-5 shrink-0" alt="icon" />
                  <span>{merchant.phone}</span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-1 font-medium text-font">
                  <img src="/assets/images/icons/user-grey.svg" className="size-4 shrink-0" alt="icon" />
                  <span>Nama Operator:</span>
                </p>
                <p className="font-semibold text-lg">{merchant.keeper.name}</p>
              </div>
            </section>

            {/* PRODUCT LIST */}
            <section id="Products" className="flex flex-col gap-5 flex-1 p-5 px-0">
              {/* HEADER */}
              <div id="Header" className="flex items-center justify-between px-5">
                <div className="flex flex-col gap-[6px]">
                  <p className="flex items-center gap-[6px]">
                    <span className="font-semibold text-2xl text-primary">
                      {merchant.products.length}
                      <span className="text-font pl-2 font-medium">
                        Total Produk Toko <span className="font-bold text-font">{merchant.name}</span>
                      </span>
                    </span>
                  </p>
                </div>

                <Link to={`/merchant-products/${id}/assign`} className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full">
                  Assign Produk
                  <PlusIcon className="ml-2 size-6" />
                </Link>
              </div>

              {/* TABLE */}
              <div className="flow-root flex-1">
                {merchant.products.length > 0 ? (
                  <div className="-my-2 overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle px-5">
                      <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Product
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Harga
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Stok
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Kategori
                              </th>
                              <th scope="col" className="py-3.5 pr-4 pl-3 text-right text-sm font-semibold text-gray-900 sm:pr-6">
                                Aksi
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200 bg-white">
                            {merchant.products.map((product) => (
                              <tr key={product.id}>
                                {/* PRODUCT + IMAGE */}
                                <td className="flex items-center gap-3 py-3 px-5 text-sm text-gray-900">
                                  <div className="flex size-[64px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                                    <img src={product.thumbnail} className="size-full object-contain" alt="product" />
                                  </div>
                                  <p className="font-semibold text-base truncate w-[180px]">{product.name}</p>
                                </td>

                                {/* HARGA */}
                                <td className="px-3 py-3 text-sm font-semibold text-monday-blue whitespace-nowrap">Rp {product.price.toLocaleString("id")}</td>

                                {/* STOK */}
                                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{product.pivot?.stock} Stock</td>

                                {/* CATEGORY */}
                                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{product.category.name}</td>

                                {/* ACTION */}
                                <td className="py-3 pr-5 text-right text-sm font-medium whitespace-nowrap">
                                  <div className="flex justify-end gap-3">
                                    <button onClick={() => setSelectedProductId(product.id)} className="btn btn-primary-opacity min-w-[110px] font-semibold">
                                      Details
                                    </button>

                                    <Link to={`/merchant-products/${id}/edit-assign/${product.id}`} className="btn btn-black min-w-[110px] font-semibold">
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
                  <div id="Empty-State" className="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-border gap-5 py-10">
                    <img src="/assets/images/icons/document-text-grey.svg" className="size-[52px]" alt="icon" />
                    <p className="font-semibold text-font">Oops, it looks like there's no data yet.</p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
      {selectedProductId && selectedProduct && (
        <div className="modal flex flex-1 items-center justify-center h-full fixed top-0 w-full">
          <div onClick={() => setSelectedProductId(null)} className="absolute w-full h-full bg-[#292D32B2] cursor-pointer" />
          <div className="relative flex flex-col w-[406px] shrink-0 rounded-3xl p-5 gap-5 bg-white">
            <div className="modal-header flex items-center justify-between">
              <p className="font-semibold text-xl">Product Details</p>
              <button onClick={() => setSelectedProductId(null)} className="flex size-14 rounded-full items-center justify-center bg-font-background">
                <img src="/assets/images/icons/close-circle-black.svg" className="size-5" alt="icon" />
              </button>
            </div>
            <div className="modal-content flex flex-col rounded-3xl border border-border p-4 gap-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-[6px] font-semibold text-lg">
                    <img src={selectedProduct.category.photo} className="size-5 flex shrink-0" alt="icon" />
                    {selectedProduct.name}
                  </p>
                  <p className="font-bold text-lg">{selectedProduct.category.name}</p>
                  <p className="font-semibold text-[17px] text-monday-blue">Rp {selectedProduct.price.toLocaleString("id")}</p>
                </div>
                <div className="flex size-[100px] rounded-2xl bg-font-background items-center justify-center overflow-hidden">
                  <img src={selectedProduct.thumbnail} className="size-full object-contain" alt="icon" />
                </div>
              </div>
              <hr className="border-border" />
              <div>
                <p className="font-medium text-sm text-font">Product About</p>
                <p className="font-semibold leading-[160%]">{selectedProduct.about}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MerchantProductList;
