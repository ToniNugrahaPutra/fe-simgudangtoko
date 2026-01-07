import { useTransaction } from "../../../context/TransactionContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../../../schemas/transactionSchema";
import { CustomerFormData } from "../../../types/types";
import { Link } from "react-router-dom";
import { useMyMerchantProfile } from "../../../hooks/useMerchants";

const StepOne = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const { transaction, setTransaction } = useTransaction();
  const { data: merchant } = useMyMerchantProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: transaction.name,
      phone: transaction.phone,
    },
  });

  const onSubmit = (data: CustomerFormData) => {
    setTransaction({ ...transaction, ...data });
    handleNextStep();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full shrink-0 h-fit rounded-3xl p-6 gap-4 bg-white shadow-sm">
        <div className="flex size-14 rounded-xl bg-gray-100 items-center justify-center overflow-hidden">
          <img
            src={`http://localhost:8000${merchant?.photo}`}
            className="size-full object-cover"
            alt="Merchant logo"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{merchant?.name}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <img
              src="/assets/images/icons/call-grey.svg"
              className="size-4 flex shrink-0"
              alt="phone icon"
            />
            <span className="text-sm">{merchant?.phone}</span>
          </div>
        </div>
      </div>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full rounded-3xl p-6 gap-6 bg-white shadow-sm"
      >
        <h2 className="font-semibold text-2xl text-gray-800">Customer Information</h2>
        
        <div className="space-y-6">
          <div className="relative">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Customer Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img
                  src="/assets/images/icons/user-thin-grey.svg"
                  className="size-5 text-gray-400"
                  alt="user icon"
                />
              </div>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`pl-10 w-full h-14 font-medium text-base rounded-xl border ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } px-4 py-3 transition-colors`}
                placeholder="Enter customer name"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="relative">
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img
                  src="/assets/images/icons/call-grey.svg"
                  className="size-5 text-gray-400"
                  alt="phone icon"
                />
              </div>
              <input
                id="phone"
                type="text"
                {...register("phone")}
                className={`pl-10 w-full h-14 font-medium text-base rounded-xl border ${
                  errors.phone 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } px-4 py-3 transition-colors`}
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link 
            to="/transactions" 
            className="px-5 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            className="cursor-pointer font-semibold bg-primary text-white border h-12 px-5 rounded-full hover:bg-white hover:text-primary hover:border-primary ease-in-out duration-300 transition"
          >
            Lanjut
          </button>
        </div>
      </form>
    
    </div>
  );
};

export default StepOne;