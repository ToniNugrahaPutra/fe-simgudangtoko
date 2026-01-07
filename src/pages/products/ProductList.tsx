import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useFetchProduct, useFetchProducts } from "../../hooks/useProducts";
import React, { useState } from "react";
import UserProfileCard from "../../components/UserProfileCard";
import { PlusIcon } from "@heroicons/react/24/solid";

const ProductList = () => {
  const { data: products, isPending, isError, error, refetch } = useFetchProducts();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { data: selectedProduct } = useFetchProduct(selectedProductId || 0);

  if (isPending) return <p>Loading products...</p>;
  if (isError)
    return (
      <p className="text-red-500">Error fetching products: {error.message}</p>
    );

  const handleDeleteProduct = async (id: number) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus produk");
      }

      // Berhasil delete
      alert("Produk berhasil dihapus!");
      refetch(); // panggil ulang data produk
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Terjadi kesalahan saat menghapus produk.");
    }
  };
  return (
    <>
      <div id="main-container" className="flex flex-1 min-h-screen">
        <Sidebar />
        <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
          <div
            id="Top-Bar"
            className="flex items-center w-full gap-6 mt-5 mb-6"
          >
            <div id="Top-Bar" className="flex items-center w-full gap-6">
              <UserProfileCard title="Manajemen Produk" />
            </div>
          </div>
          <main className="flex flex-col gap-6 flex-1">
            <section
              id="Products"
              className="flex flex-col gap-6 flex-1 rounded-3xl p-5 px-0 bg-white"
            >
              <div
                id="Header"
                className="flex items-center justify-between px-5"
              >
                <div className="flex flex-col">
                  <p className="flex items-center font-semibold text-2xl text-primary">
                    {products.length || 0}
                    <span className="text-font pl-2 font-medium">
                      Total Produk
                    </span>
                  </p>
                </div>
                <Link
                  to="/products/add"
                  className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full"
                >
                  Tambah Produk
                  <PlusIcon className=" ml-2 size-6" />
                </Link>
              </div>
              <div id="Product-List" className="flow-root flex-1">
                {products.length > 0 ? (
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
                                Produk
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Harga
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Kategori
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
                            {products.map((product) => (
                              <tr key={product.id}>
                                {/* Kolom Produk (thumbnail + nama) */}
                                <td className="flex items-center gap-3 py-2 text-sm text-gray-900 px-5">
                                  <div className="flex size-[64px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                                    <img
                                      src={product.thumbnail}
                                      className="size-full object-contain"
                                      alt="thumbnail"
                                    />
                                  </div>
                                  <p className="font-semibold text-base truncate w-[200px]">
                                    {product.name}
                                  </p>
                                </td>

                                {/* Harga */}
                                <td className="px-3 py-2 text-sm font-semibold text-monday-blue whitespace-nowrap">
                                  Rp {product.price.toLocaleString("id")}
                                </td>

                                {/* Kategori */}
                                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-700">
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src={`http://localhost:8000${product.category.photo}`}
                                      className="size-7 flex shrink-0"
                                      alt="category"
                                    />
                                    <span className="font-medium">
                                      {product.category.name}
                                    </span>
                                  </div>
                                </td>

                                {/* Aksi */}
                                <td className="py-2 pr-5 text-right text-sm font-medium whitespace-nowrap ">
                                  <div className="flex justify-end">
                                    <button
                                      onClick={() =>
                                        setSelectedProductId(product.id)
                                      }
                                      className="btn btn-primary-opacity min-w-[100px] font-semibold"
                                    >
                                      Detail
                                    </button>
                                    <Link
                                      to={`/products/edit/${product.id}`}
                                      className="font-semibold flex items-center justify-center text-blue-600"
                                    >
                                      <img
                                        src="assets/images/icons/edit-white.svg"
                                        className="size-5"
                                        alt="edit"
                                      />
                                      Edit
                                    </Link>
                                    <button
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                      className="text-red-600 min-w-[100px] font-semibold cursor-pointer"
                                    >
                                      Hapus
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
                  src="assets/images/icons/close-circle-black.svg"
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

export default ProductList;
