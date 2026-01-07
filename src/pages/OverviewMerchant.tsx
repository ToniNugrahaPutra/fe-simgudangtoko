import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { useFetchMerchantTransactions } from "../hooks/useTransactions";
import UserProfileCard from "../components/UserProfileCard";
import React, { useState } from "react";
import { useFetchProduct } from "../hooks/useProducts";

import {
  UserGroupIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

const OverviewMerchant = () => {
  const { user } = useAuth();
  const merchant = user?.merchant;
  const hasMerchant = !!merchant?.id;

  const { data: transactionsResponse = [] } = useFetchMerchantTransactions({
    enabled: hasMerchant,
  });

  const transactions = transactionsResponse ?? [];

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.grand_total, 0);

  const totalProductsSold =
    transactions.reduce(
      (sum, tx) =>
        sum + tx.transaction_products.reduce((acc, p) => acc + p.quantity, 0),
      0
    ) ?? 0;

  const latestTransactions = transactions.slice(0, 4);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { data: selectedProduct } = useFetchProduct(selectedProductId || 0);

  return (
    <>
      <div id="main-container" className="flex flex-1 min-h-screen">
        <Sidebar />
        <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
          <div id="Top-Bar" className="flex items-center w-full gap-5 my-5">
            <UserProfileCard title="Dashboard" />
          </div>

          <main className="flex flex-col gap-5 flex-1">
            {/* KPI CARDS — DISAMAKAN DENGAN DASHBOARD */}
            <section className="grid grid-cols-3 gap-5">
              {/* Total Revenue */}
              <div className="flex justify-between items-center rounded-3xl p-5 bg-white">
                <div className="flex flex-col">
                  <p className="text-base font-medium text-font mb-4">
                    Total Penghasilan
                  </p>
                  <p className="text-2xl font-bold leading-tight">
                    Rp {totalRevenue.toLocaleString("id")}
                  </p>
                </div>
                <div className="flex size-12 rounded-full bg-[#FFEAA0]/60 items-center justify-center">
                  <BanknotesIcon className="size-5 text-[#FACC15]" />
                </div>
              </div>

              {/* Total Transactions */}
              <div className="flex justify-between items-center rounded-3xl p-5 bg-white">
                <div className="flex flex-col">
                  <p className="text-base font-medium text-font mb-4">
                    Total Transaksi
                  </p>
                  <p className="text-2xl font-bold leading-tight">
                    {transactions.length}
                  </p>
                </div>
                <div className="flex size-12 rounded-full bg-[#C7F8D1]/60 items-center justify-center">
                  <DocumentTextIcon className="size-5 text-[#22C55E]" />
                </div>
              </div>

              {/* Products Sold */}
              <div className="flex justify-between items-center rounded-3xl p-5 bg-white">
                <div className="flex flex-col">
                  <p className="text-base font-medium text-font mb-4">
                    Produk Terjual
                  </p>
                  <p className="text-2xl font-bold leading-tight">
                    {totalProductsSold.toLocaleString("id")}
                  </p>
                </div>
                <div className="flex size-12 rounded-full bg-[#FFC9C9]/60 items-center justify-center">
                  <ShoppingBagIcon className="size-5 text-[#EF4444]" />
                </div>
              </div>
            </section>

            {/* ===================== */}
            {/* LASTEST TRANSACTION */}
            {/* ===================== */}
            <section
              id="Lastest-Transaction"
              className="flex flex-col gap-5 flex-1 rounded-3xl p-5 bg-white"
            >
              <h2 className="font-medium text-xl">Transaksi Terbaru</h2>

              {latestTransactions.length > 0 ? (
                latestTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="card-merchant flex flex-col rounded-2xl border border-border"
                  >
                    {/* HEADER */}
                    <div className="flex items-center justify-between gap-3 p-5">
                      <div className="flex rounded-2xl items-center justify-center overflow-hidden">
                        <div className="bg-[#F3F5F9] p-3">
                          <img
                            src="assets/images/icons/user-thin-grey.svg"
                            className="flex size-10 shrink-0"
                            alt="icon"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 flex-1 ml-2">
                        <p className="font-semibold text-lg text-font">
                          {tx.name}
                        </p>
                        <p className="flex items-center gap-1 font-medium text-base text-gray-700">
                          <img
                            src="assets/images/icons/call-grey.svg"
                            className="size-5"
                            alt="icon"
                          />
                          {tx.phone}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <img
                          src="assets/images/icons/shop-black.svg"
                          className="size-5"
                          alt="icon"
                        />
                        <p className="font-semibold text-lg text-font">
                          {tx.merchant.name}
                        </p>
                      </div>
                    </div>

                    {/* TABLE PRODUCT ASSIGN — SAMA DENGAN DASHBOARD */}
                    <div className="flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-5 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-5 lg:px-8">
                          <div className="overflow-hidden shadow-sm outline-1 outline-black/5">
                            <table className="relative min-w-full divide-y divide-border">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                                    Produk
                                  </th>
                                  <th className="px-3 py-3">Tanggal</th>
                                  <th className="px-3 py-3">Kategori</th>
                                  <th className="px-3 py-3">Harga</th>
                                  <th className="px-3 py-3">Jumlah</th>
                                  <th className="px-3 py-3">Total</th>
                                  <th className="px-3 py-3"></th>
                                </tr>
                              </thead>

                              <tbody className="divide-y divide-gray-200 bg-white">
                                {tx.transaction_products.map((tp) => (
                                  <tr key={tp.id}>
                                    <td className="py-2 px-4 flex items-center gap-3 text-sm font-medium text-gray-900">
                                      <div className="size-[60px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                                        <img
                                          src={tp.product.thumbnail}
                                          className="size-full object-contain"
                                        />
                                      </div>
                                      {tp.product.name}
                                    </td>

                                    <td className="px-3 py-2 text-sm text-gray-500">
                                      {new Date(tx.created_at).toLocaleString(
                                        "id-ID"
                                      )}
                                    </td>

                                    <td className="px-3 py-2 text-sm text-gray-500">
                                      {tp.product.category.name}
                                    </td>

                                    <td className="px-3 py-2 text-sm text-gray-500">
                                      Rp {tp.price.toLocaleString("id")}
                                    </td>

                                    <td className="px-3 py-2 text-sm text-gray-500">
                                      {tp.quantity}
                                    </td>

                                    <td className="px-3 py-2 text-sm text-gray-500">
                                      Rp{" "}
                                      {(tp.quantity * tp.price).toLocaleString(
                                        "id"
                                      )}
                                    </td>

                                    <td className="px-3 py-2 text-right">
                                      <button
                                        onClick={() =>
                                          setSelectedProductId(tp.product.id)
                                        }
                                        className="text-white bg-primary px-3 py-1.5 rounded-full font-semibold flex items-center cursor-pointer"
                                      >
                                        Detail
                                        <ChevronRightIcon className="size-5 ml-1" />
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

                    {/* GRAND TOTAL */}
                    <div className="flex items-center justify-start px-4 py-5">
                      <BanknotesIcon className="size-5 text-font" />
                      <p className="font-medium text-base text-font pl-2">
                        Grandtotal:
                      </p>
                      <p className="font-semibold text-lg text-primary pl-2">
                        Rp {tx.grand_total.toLocaleString("id")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  id="Empty-State"
                  className="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-border gap-5"
                >
                  <img
                    src="assets/images/icons/document-text-grey.svg"
                    className="size-[52px]"
                  />
                  <p className="font-semibold text-font">
                    Oops, it looks like there's no data yet.
                  </p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProductId && selectedProduct && (
        <div className="modal flex flex-1 items-center justify-center h-full fixed top-0 w-full">
          <div
            onClick={() => setSelectedProductId(null)}
            className="absolute w-full h-full bg-[#292D32B2] cursor-pointer"
          />
          <div className="relative flex flex-col w-[406px] rounded-3xl p-[18px] gap-5 bg-white">
            <div className="modal-header flex items-center justify-between">
              <p className="font-semibold text-xl">Product Details</p>
              <button
                onClick={() => setSelectedProductId(null)}
                className="flex size-14 rounded-full items-center justify-center bg-font-background"
              >
                <img
                  src="assets/images/icons/close-circle-black.svg"
                  className="size-5"
                />
              </button>
            </div>

            <div className="modal-content flex flex-col rounded-3xl border border-border p-4 gap-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-[6px] font-semibold text-lg">
                    <img
                      src={selectedProduct.category.photo}
                      className="size-5"
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
                  />
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <p className="font-medium text-sm text-font">Product About</p>
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

export default OverviewMerchant;
