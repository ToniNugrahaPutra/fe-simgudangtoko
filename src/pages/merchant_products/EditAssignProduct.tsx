import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchMerchant } from "../../hooks/useMerchants";
import { useFetchProduct } from "../../hooks/useProducts";
import { useUpdateMerchantProduct } from "../../hooks/useMerchantProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editAssignMerchantProduct,
  EditAssignMerchantProductFormData,
} from "../../schemas/editAssignMerchantProduct";
import Sidebar from "../../components/Sidebar";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";
import { useFetchWarehouse } from "../../hooks/useWarehouses";

const EditAssignProduct = () => {
  const { merchantId, productId } = useParams<{
    merchantId: string;
    productId: string;
  }>(); 

  const { data: merchant, isLoading: loadingMerchant } = useFetchMerchant(
    Number(merchantId)
  );
  
  const { data: product, isLoading: loadingProduct } = useFetchProduct(
    Number(productId)
  );
  const { mutate: updateStock, isPending, error } = useUpdateMerchantProduct();

  const merchantProduct = merchant?.products?.find(
    (product) => product.id === Number(productId)
  );

  const warehouseId = merchantProduct?.pivot?.warehouse_id;

  const { data: warehouse, isLoading: loadingWarehouse } = useFetchWarehouse(
    Number(warehouseId)
  );

  const initialStock =
    merchantProduct?.pivot?.stock || product?.merchant_stock || 0;

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<EditAssignMerchantProductFormData>({
    resolver: zodResolver(editAssignMerchantProduct),
    defaultValues: { stock: initialStock },
  });

  useEffect(() => {
    if (merchantProduct) {
      setValue("stock", merchantProduct.pivot?.stock || 0);
    }
  }, [merchantProduct, setValue]);

  const onSubmit = (data: EditAssignMerchantProductFormData) => {
    if (!merchantId || !productId) return;

    setError("root", { type: "server", message: "" });

    updateStock(
      {
        merchant_id: Number(merchantId),
        warehouse_id: Number(warehouseId), // ✅ Pass warehouse_id here
        product_id: Number(productId),
        stock: data.stock,
      },
      { 
        onError: (error: AxiosError<ApiErrorResponse>) => {
          if (error.response) {
            const { message, errors } = error.response.data;

            // ✅ Show general API error message at the top
            if (message) {
              setError("root", { type: "server", message });
            }

            // ✅ Display field-specific errors if present
            if (errors) {
              Object.entries(errors).forEach(([key, messages]) => {
                setError(key as keyof EditAssignMerchantProductFormData, {
                  type: "server",
                  message: messages[0],
                });
              });
            }
          }
        },
      }
    );
  };

  if (loadingMerchant || loadingProduct) return <p>Loading details...</p>;
  if (!merchant) return <p> merchant not found...</p>;
  if (!product) return <p> product not found...</p>;
  if (!warehouse) return <p> warehouse not found...</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
  <Sidebar/>
  <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
    <div id="Top-Bar" className="flex items-center w-full gap-5 mt-5 mb-5">
      <div id="Top-Bar" className="flex items-center w-full gap-5">
        <UserProfileCard
          title="Update Stok Produk"
          backLink={`/merchant-products/${merchant.id}`}
        />
      </div>
    </div>
    <main className="flex flex-col gap-5 flex-1">
      <div className="flex gap-5">
        <div className="flex flex-col w-full rounded-3xl bg-white">
          <div 
            className="flex flex-col w-full p-[18px] gap-5"
          >
            <h2 className="font-semibold text-xl">Gudang</h2>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                  <img
                    src={`http://localhost:8000${warehouse.photo}`}
                    className="size-full object-cover"
                    alt="icon"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <p className="font-semibold text-lg">{warehouse.name}</p>
                  <p className="flex items-center gap-1 font-medium text-lg text-font">
                    <img
                      src="/assets/images/icons/call-grey.svg"
                      className="size-5 flex shrink-0"
                      alt="icon"
                    />
                    <span>{warehouse.phone}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
          >
            <h2 className="font-semibold text-xl">Merchant Details</h2>
            <div className="flex flex-col gap-5 p-[18px] rounded-3xl border-[1.5px] border-border">
              <div className="flex items-center gap-3">
                <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                  <img
                    src={`http://localhost:8000${merchant.photo}`}
                    className="size-full object-cover"
                    alt="icon"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <p className="font-semibold text-lg">{merchant.name}</p>
                  <p className="flex items-center gap-1 font-medium text-lg text-font">
                    <img
                      src="/assets/images/icons/user-thin-grey.svg"
                      className="size-5 flex shrink-0"
                      alt="icon"
                    />
                    <span>{merchant.keeper.name}</span>
                  </p>
                </div>
              </div>
              <hr className="border-border" />
              <div className="flex items-center gap-3">
                <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                  <img
                    src={product.thumbnail}
                    className="size-full object-contain"
                    alt="icon"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <p className="font-semibold text-xl">{product.name}</p>
                  <p className="font-semibold text-xl text-monday-blue">
                    Rp {product.price.toLocaleString('id')}
                  </p>
                </div>
                <div className="flex items-center gap-[6px] shrink-0">
                  <img
                    src="/assets/images/icons/box-black.svg"
                    className="size-5 flex shrink-0"
                    alt="icon"
                  />
                  <p className="font-semibold text-lg text-nowrap">{initialStock} Stock</p>
                </div>
              </div>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-font">
                Stok
              </label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:outline-primary"
                placeholder="Jumlah stok"
              />
              {errors.stock && (
                <p className="text-red-500">{errors.stock.message}</p>
              )}
            </div>


            
            <div className="flex items-center justify-end gap-4">
              <button type="submit" className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary ease-in-out duration-300 transition">
                {isPending ? "Saving..." : "Simpan"}
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

export default EditAssignProduct;
