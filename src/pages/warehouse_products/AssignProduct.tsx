import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchWarehouse } from "../../hooks/useWarehouses";
import Sidebar from "../../components/Sidebar";
import { AxiosError } from "axios";
import {
  AssignWarehouseProductFormData,
  assignWarehouseProductSchema,
} from "../../schemas/assignWarehouseProductSchema";
import { useFetchProducts } from "../../hooks/useProducts";
import { useAssignWarehouseProduct } from "../../hooks/useWarehouseProducts";
import {
  ApiErrorResponse,
  AssignWarehouseProductPayload,
} from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const AssignWarehouseProduct = () => {
  const { id } = useParams<{ id: string }>(); // Get warehouse ID from URL

  const { data: warehouse, isPending: loadingWarehouse } = useFetchWarehouse(
    Number(id)
  );
  const { data: products, isPending: loadingProducts } = useFetchProducts();
  const { mutate: assignProduct, isPending } = useAssignWarehouseProduct();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AssignWarehouseProductFormData>({
    resolver: zodResolver(assignWarehouseProductSchema),
  });

  const onSubmit = (data: AssignWarehouseProductFormData) => {
    // Reset previous errors before submitting
    setError("root", { type: "server", message: "" });

    const payload: AssignWarehouseProductPayload = {
      warehouse_id: Number(id),
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
              setError(key as keyof AssignWarehouseProductFormData, {
                type: "server",
                message: messages[0],
              });
            });
          }
        }
      },
    });
  };

  if (!warehouse) return <p>Not found...</p>;
  if (loadingWarehouse || loadingProducts) return <p>Loading...</p>;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-5 pt-0">
        <div id="Top-Bar" className="flex items-center w-full gap-5 mt-5 mb-5">
          <div id="Top-Bar" className="flex items-center w-full gap-5">
            <UserProfileCard
              title="Assign Produk"
              backLink={`/warehouse-products/${id}`}
            />
          </div>
        </div>

        <main className="flex flex-col gap-5 flex-1">
          <div className="flex gap-5">
            <div className="flex flex-col w-full bg-white rounded-3xl">
              <div className="flex flex-col p-5 gap-5">
                <p className="font-semibold text-xl">Detail Gudang</p>
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

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-full p-5 gap-5"
              >
                <h2 className="font-semibold text-xl capitalize">
                  Lengkapi Form
                </h2>
                {errors.root && (
                  <p className="text-red-500 bg-red-100 border border-red-400 p-2 rounded">
                    {errors.root.message}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="product_id"
                      className="block text-sm/6 font-medium text-font"
                    >
                      Produk
                    </label>
                    <div className="mt-1 relative">
                      <div className="grid grid-cols-1">
                        {loadingProducts ? (
                          <div className="col-start-1 row-start-1 w-full rounded-lg bg-white p-3 text-base text-font outline-1 -outline-offset-1 outline-border flex items-center justify-center">
                            Loading products...
                          </div>
                        ) : (
                          <select
                            id="product_id"
                            {...register("product_id")}
                            className="col-start-1 row-start-1 w-full appearance-none rounded-lg bg-white p-3 text-base text-font outline-1 -outline-offset-1 outline-border focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:text-sm/6"
                          >
                            <option value="">--- Pilih Produk ---</option>
                            {products?.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        )}
                        <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 h-5 w-5 self-center justify-self-end text-gray-500 sm:h-4 sm:w-4" />
                      </div>
                    </div>
                    {errors.product_id && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.product_id.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm/6 font-medium text-font"
                    >
                      Stok Produk
                    </label>
                    <div className="mt-1">
                      <input
                        id="stock"
                        type="number"
                        {...register("stock", { valueAsNumber: true })}
                        className="block w-full rounded-lg bg-white p-3 text-font outline-1 -outline-offset-1 outline-border placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                        placeholder="Masukkan jumlah stok"
                      />
                    </div>
                    {errors.stock && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

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

export default AssignWarehouseProduct;
