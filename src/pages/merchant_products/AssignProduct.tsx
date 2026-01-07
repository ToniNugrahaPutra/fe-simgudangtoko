import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchMerchant } from "../../hooks/useMerchants";
import { useFetchProducts } from "../../hooks/useProducts";
import { useFetchWarehouses } from "../../hooks/useWarehouses";
import Sidebar from "../../components/Sidebar";
import {
  AssignProductFormData,
  assignProductSchema,
} from "../../schemas/assignProductSchema";
import { AxiosError } from "axios";
import { useAssignProduct } from "../../hooks/useMerchantProducts";
import { ApiErrorResponse, AssignProductPayload } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";

const AssignProduct = () => {
  const { id } = useParams<{ id: string }>(); // Get merchant ID from URL

  const { data: merchant, isPending: loadingMerchant } = useFetchMerchant(
    Number(id)
  );
  const { data: products, isPending: loadingProducts } = useFetchProducts();
  const { data: warehouses, isPending: loadingWarehouses } =
    useFetchWarehouses();

  const { mutate: assignProduct, isPending } = useAssignProduct(); // ✅ Use `isPending`

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AssignProductFormData>({
    resolver: zodResolver(assignProductSchema),
  });

  const onSubmit = (data: AssignProductFormData) => {
    setError("root", { type: "server", message: "" });

    const payload: AssignProductPayload = {
      merchant_id: Number(id),
      warehouse_id: Number(data.warehouse_id),
      product_id: Number(data.product_id),
      stock: Number(data.stock),
    };

    assignProduct(payload, {
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
              setError(key as keyof AssignProductFormData, {
                type: "server",
                message: messages[0],
              });
            });
          }
        }
      },
    });
  };

  if (!merchant) return <p> merchant not found...</p>;

  if (loadingMerchant || loadingProducts || loadingWarehouses)
    return <p>Loading...</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div id="Top-Bar" className="flex items-center w-full gap-5 mt-5 mb-5">
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <UserProfileCard
              title="Assign Produk"
              backLink={`/merchant-products/${merchant.id}`}
            />
          </div>
        </div>
        <main className="flex flex-col ">
          <div className="flex">
            <div className="flex flex-col w-full bg-white rounded-3xl">
              <div className="flex flex-col p-5 gap-5">
                <p className="font-semibold text-xl">Merchant Details</p>
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
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full rounded-3xl p-5 gap-5 bg-white"
              >
                <div className="grid grid-cols-2 gap-5 w-full">
                  <div>
                    <label className="block text-sm font-medium text-font">
                      Warehouse
                    </label>
                    <div className="mt-1 relative">
                      <select
                        {...register("warehouse_id")}
                        className="w-full appearance-none rounded-lg bg-white p-3 text-font outline-1 outline-border focus:outline-2 focus:outline-primary"
                      >
                        <option value="">-- Pilih Warehouse --</option>
                        {warehouses?.map((warehouse) => (
                          <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </option>
                        ))}
                      </select>

                      <img
                        src="/assets/images/icons/arrow-down-grey.svg"
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-5"
                        alt="icon"
                      />
                    </div>
                    {errors.warehouse_id && (
                      <p className="text-red-500">
                        {errors.warehouse_id.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-font">
                      Product
                    </label>
                    <div className="mt-1 relative">
                      <select
                        {...register("product_id")}
                        className="w-full appearance-none rounded-lg bg-white p-3 text-font outline-1 outline-border focus:outline-2 focus:outline-primary"
                      >
                        <option value="">-- Pilih Product --</option>
                        {products?.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>

                      <img
                        src="/assets/images/icons/arrow-down-grey.svg"
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-5"
                        alt="icon"
                      />
                    </div>
                    {errors.product_id && (
                      <p className="text-red-500">
                        {errors.product_id.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-font">
                    Stock
                  </label>
                  <input
                    type="number"
                    {...register("stock")}
                    className="mt-1 block w-full rounded-lg bg-white p-3 text-font outline-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:outline-primary"
                    placeholder="Jumlah stok"
                  />
                  {errors.stock && (
                    <p className="text-red-500">{errors.stock.message}</p>
                  )}
                </div>

                {/* BUTTONS */}
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

export default AssignProduct;
