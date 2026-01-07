import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchWarehouse } from "../../hooks/useWarehouses";
import { useFetchProduct } from "../../hooks/useProducts";
import { useUpdateWarehouseProduct } from "../../hooks/useWarehouseProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editAssignWarehouseProduct,
  EditAssignWarehouseProductFormData,
} from "../../schemas/editAssignWarehouseProduct";
import Sidebar from "../../components/Sidebar";
import UserProfileCard from "../../components/UserProfileCard";

const EditWarehouseProduct = () => {
  const { warehouseId, productId } = useParams<{
    warehouseId: string;
    productId: string;
  }>();

  const { data: warehouse, isLoading: loadingWarehouse } = useFetchWarehouse(Number(warehouseId));
  const { data: product, isLoading: loadingProduct } = useFetchProduct(Number(productId));
  const { mutate: updateStock } = useUpdateWarehouseProduct();

  const warehouseProduct = warehouse?.products?.find(
    (p) => p.id === Number(productId)
  );

  const initialStock = warehouseProduct?.pivot?.stock || product?.warehouse_stock || 0;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditAssignWarehouseProductFormData>({
    resolver: zodResolver(editAssignWarehouseProduct),
    defaultValues: { stock: initialStock },
  });

  useEffect(() => {
    if (warehouseProduct) {
      setValue("stock", warehouseProduct.pivot?.stock || 0);
    }
  }, [warehouseProduct, setValue]);

  const onSubmit = (data: EditAssignWarehouseProductFormData) => {
    if (!warehouseId || !productId) return;
    updateStock({
      warehouse_id: Number(warehouseId),
      product_id: Number(productId),
      stock: data.stock,
    });
  };

  if (!warehouse) return <p>Warehouse details not found...</p>;
  if (!product) return <p>Product details not found...</p>;
  if (loadingWarehouse || loadingProduct) return <p>Loading details...</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        {/* Header */}
        <div className="flex items-center w-full gap-5 mt-5 mb-5">
          <UserProfileCard
            title="Update Stok Produk"
            backLink={`/warehouse-products/${warehouse.id}`}
          />
        </div>

        <main className="flex flex-col gap-5 flex-1">
          <div className="flex gap-5">
            <div className="flex flex-col gap-5 w-full">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full rounded-2xl bg-white p-5 gap-5"
              >
                {/* Warehouse Details */}
                <div>
                  <h2 className="font-semibold text-lg text-font mb-3">Detail Gudang</h2>
                  <div className="flex flex-col gap-4 p-4 bg-white">
                    <div className="flex items-center gap-4">
                      <div className="flex size-16 rounded-lg bg-gray-100 items-center justify-center overflow-hidden">
                        <img
                          src={`http://localhost:8000${warehouse.photo}`}
                          className="size-full object-cover"
                          alt={warehouse.name}
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-semibold text-base text-font">{warehouse.name}</p>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <img
                            src="/assets/images/icons/call-grey.svg"
                            className="size-4"
                            alt="icon"
                          />
                          <span>{warehouse.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="font-semibold text-lg text-font mb-3">Detail Produk</h2>
                  <div className="flex flex-col gap-4 rounded-3xl border border-border p-4 bg-white">
                    <div className="flex items-center gap-4">
                      <div className="flex size-16 rounded-lg bg-gray-100 items-center justify-center overflow-hidden">
                        <img
                          src={product.thumbnail}
                          className="size-full object-contain"
                          alt={product.name}
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="font-semibold text-base text-font">{product.name}</p>
                        <p className="font-semibold text-primary text-base">
                          Rp {product?.price.toLocaleString("id")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-font">
                        <img
                          src="/assets/images/icons/box-black.svg"
                          className="size-5"
                          alt="stok"
                        />
                        <span className="font-medium text-sm">{initialStock} stok</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Stock */}
                <div>
                  <h2 className="font-semibold text-lg text-font mb-3">Perbarui Stok</h2>
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-font">
                      Jumlah Stok
                    </label>
                    <div className="mt-1">
                      <input
                        id="stock"
                        type="number"
                        {...register("stock", { valueAsNumber: true })}
                        className="block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                        placeholder="Masukkan jumlah stok"
                      />
                    </div>
                    {errors.stock && (
                      <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary ease-in-out duration-300 transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditWarehouseProduct;
