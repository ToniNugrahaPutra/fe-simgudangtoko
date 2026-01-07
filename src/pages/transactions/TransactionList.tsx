import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import { useFetchMerchantTransactions } from "../../hooks/useTransactions";
import { useAuth } from "../../hooks/useAuth";
import UserProfileCard from "../../components/UserProfileCard";
import { useMyMerchantProfile } from "../../hooks/useMerchants";
import React, { useState } from "react";
import { useFetchProduct } from "../../hooks/useProducts";
import { PlusIcon } from "@heroicons/react/24/solid";

const TransactionList = () => {
  const { user } = useAuth();
  const hasMerchant = !!user?.merchant?.id;
  const { data: merchant } = useMyMerchantProfile();

  const { data: transactions = [] } = useFetchMerchantTransactions({
    enabled: hasMerchant,
  });

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { data: selectedProduct } = useFetchProduct(selectedProductId || 0);

  const [openTransactionIds, setOpenTransactionIds] = useState<number[]>([]);

  const toggleAccordion = (id: number) => {
    setOpenTransactionIds((prev) => (prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]));
  };

  return (
    <>
      <div id="main-container" className="flex flex-1 min-h-screen">
        <Sidebar />
        <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <div id="Top-Bar" className="flex items-center w-full gap-5 my-5">
              <UserProfileCard title="Manajemen Transaksi" />
            </div>
          </div>
          <main className="flex flex-col flex-1 bg-white rounded-3xl">
            <section id="Warehouse-Info" className="flex items-center justify-between p-5 gap-3">
              <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                <img src={`http://localhost:8000${merchant?.photo}`} className="size-full object-contain" alt="icon" />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <p className="font-semibold text-xl">{merchant?.name}</p>
                <p className="flex items-center gap-1 font-medium text-lg text-font">
                  <img src="/assets/images/icons/call-grey.svg" className="size-5 shrink-0" alt="icon" />
                  <span>{merchant?.phone}</span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-1 font-medium text-font">
                  <img src="/assets/images/icons/user-grey.svg" className="size-4 shrink-0" alt="icon" />
                  <span>Nama Operator:</span>
                </p>
                <p className="font-semibold text-lg">{merchant?.keeper?.name ? `${merchant.keeper.name} (You)` : "Unknown Keeper"}</p>
              </div>
            </section>

            <section className="flex flex-col gap-5 flex-1 p-5 px-0">
              <div id="Header" className="flex items-center justify-between px-[18px]">
                <div className="flex flex-col">
                  <p className="flex items-center">
                    <span className="font-semibold text-2xl text-primary">
                      {transactions.length}
                      <span className="text-font pl-2 font-medium">Total Transactions</span>
                    </span>
                  </p>
                </div>
                <Link to={"/transactions/add"} className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full">
                  Transaksi Baru
                  <PlusIcon className="ml-2 size-6" />
                </Link>
              </div>
              <div id="Product-List" className="flex flex-col px-4 gap-5 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xl">All Transactions</p>
                </div>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div className="card-merchant flex flex-col rounded-2xl border border-border">
                      <div className="flex flex-col gap-5 p-4 pb-5">
                        <p className="font-semibold text-lg">Customer Details</p>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex size-[86px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                            <img src="assets/images/icons/user-thin-grey.svg" className="flex size-[42px] shrink-0" alt="icon" />
                          </div>
                          <div className="flex flex-col gap-2 flex-1">
                            <p className="font-semibold text-xl">{tx.name}</p>
                            <p className="flex items-center gap-1 font-medium text-lg text-font">
                              <img src="assets/images/icons/call-grey.svg" className="size-5 flex shrink-0" alt="icon" />
                              <span>{tx.phone}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr className="border-border" />
                      <div className="flex flex-col px-4 gap-5 py-5">
                        <p className="font-semibold text-lg">Product Assigned ({tx.transaction_products.length})</p>

                        <div className="flow-root">
                          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-5 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-8">
                              <div className="overflow-hidden shadow-sm outline-1 outline-black/5">
                                <table className="relative min-w-full divide-y divide-border">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Produk</th>
                                      <th className="px-3 py-3 text-sm font-semibold text-gray-900">Kategori</th>
                                      <th className="px-3 py-3 text-sm font-semibold text-gray-900">Harga</th>
                                      <th className="px-3 py-3"></th>
                                    </tr>
                                  </thead>

                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {tx.transaction_products.map((tp) => (
                                      <tr key={tp.id} className="h-[90px]">
                                        {/* PRODUK */}
                                        <td className="py-2 px-4">
                                          <div className="flex items-center gap-3">
                                            <div className="size-[60px] rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                                              <img src={tp.product.thumbnail} className="w-full h-full object-cover" alt="" />
                                            </div>

                                            <div className="flex flex-col">
                                              <p className="text-sm font-semibold text-gray-900">{tp.product.name}</p>
                                            </div>
                                          </div>
                                        </td>

                                        {/* KATEGORI */}
                                        <td className="px-3 py-2 text-sm text-gray-500 text-center">{tp.product.category.name}</td>

                                        {/* HARGA */}
                                        <td className="px-3 py-2 text-sm text-gray-600 text-center">
                                          <span className="font-semibold text-monday-blue">Rp {tp.price.toLocaleString("id")}</span>
                                          <span className="ml-1">(2x)</span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="px-3 py-2 text-right">
                                          <button onClick={() => setSelectedProductId(tp.product.id)} className="text-white bg-primary px-4 py-1.5 rounded-full font-semibold">
                                            Details
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr className="border-border" />

                      <div className="flex items-center justify-start px-4 py-5">
                        <img src="assets/images/icons/money-grey.svg" className="size-5 shrink-0" alt="icon" />
                        <p className="font-medium text-base text-font pl-2">Grandtotal:</p>
                        <p className="font-semibold text-lg text-monday-blue pl-2">Rp {tx.grand_total.toLocaleString("id")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div id="Empty-State" className="hidden flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-border gap-5">
                    <img src="assets/images/icons/document-text-grey.svg" className="size-[52px]" alt="icon" />
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
          <div className="relative flex flex-col w-[406px] shrink-0 rounded-3xl p-[18px] gap-5 bg-white">
            <div className="modal-header flex items-center justify-between">
              <p className="font-semibold text-xl">Product Details</p>
              <button onClick={() => setSelectedProductId(null)} className="flex size-14 rounded-full items-center justify-center bg-font-background">
                <img src="assets/images/icons/close-circle-black.svg" className="size-5" alt="icon" />
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

export default TransactionList;
