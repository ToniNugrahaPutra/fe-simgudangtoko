import { useTransaction } from "../../../context/TransactionContext";
import { PlusIcon } from "@heroicons/react/24/solid";

const StepTwo = ({
  handleNextStep,
  handlePrevStep,
  handleOpenModal,
}: {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleOpenModal: () => void;
}) => {
  const { cart, setCart } = useTransaction();

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <section
      id="Products"
      className="flex flex-col gap-6 flex-1 rounded-3xl p-5 px-0 bg-white"
    >
      <div id="Header" className="flex items-center justify-between px-5">
        <div className="flex flex-col">
          <p className="flex items-center font-semibold text-2xl text-primary">
            {cart.length}
            <span className="text-font pl-2 font-medium">Total Item</span>
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-primary font-semibold flex items-center text-white h-12 px-5 rounded-full"
        >
          Assign Produk
          <PlusIcon className=" ml-2 size-6" />
        </button>
      </div>

      <div id="Product-List" className="flow-root flex-1">
        {cart.length > 0 ? (
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
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Subtotal
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-4 pl-3 text-right text-sm font-semibold text-gray-900 sm:pr-6"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {cart.map((product, index) => (
                      <tr key={index}>
                        {/* Produk (thumbnail + nama) */}
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
                            <span className="font-medium">
                              {product.category}
                            </span>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-700">
                          <span className="font-medium">
                            {product.quantity}x
                          </span>
                        </td>

                        {/* Subtotal */}
                        <td className="px-3 py-2 text-sm font-semibold text-monday-blue whitespace-nowrap">
                          Rp{" "}
                          {(product.quantity * product.price).toLocaleString(
                            "id"
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-2 pr-5 text-right text-sm font-medium whitespace-nowrap">
                          <div className="flex justify-end">
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-red-600 min-w-[100px] font-semibold cursor-pointer"
                            >
                              Remove
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
              src="/assets/images/icons/document-text-grey.svg"
              className="size-[52px]"
              alt="empty"
            />
            <p className="font-semibold text-font">
              Oops, it looks like there's no data yet.
            </p>
            <button
              onClick={handleOpenModal}
              className="btn btn-primary font-semibold mt-4"
            >
              Assign Produk
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-end pt-4 mx-5 gap-4">
        <button
          onClick={handlePrevStep}
          className="px-5 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleNextStep}
          className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary ease-in-out duration-300 transition"
        >
          Lanjut
        </button>
      </div>
    </section>
  );
};

export default StepTwo;
