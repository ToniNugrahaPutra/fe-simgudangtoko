import { useTransaction } from "../../../context/TransactionContext";
import { useMyMerchantProfile } from "../../../hooks/useMerchants";
import { useCreateTransaction } from "../../../hooks/useTransactions";
import { 
  ShoppingBagIcon, 
  PhoneIcon, 
  UserIcon, 
  ShoppingCartIcon, 
  CubeIcon, 
  ReceiptPercentIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon 
} from "@heroicons/react/24/outline";

const StepThree = ({ handlePrevStep }: { handlePrevStep: () => void }) => {
  const { transaction, cart } = useTransaction();
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const { data: merchant } = useMyMerchantProfile();
    
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  const onSubmit = () => {
    if (!merchant) return;

    const payload = {
      name: transaction.name,
      phone: transaction.phone,
      merchant_id: merchant.id,
      products: cart.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
      })),
    };

    createTransaction(payload);  
  };

  if (!merchant) return <p>Not found merchant details...</p>;

  return (
    <div className="flex flex-col gap-6">
      {/* Merchant Info */}
      <div className="flex w-full rounded-3xl p-6 gap-4 bg-white shadow-sm">
        <div className="flex size-14 rounded-xl bg-gray-100 items-center justify-center overflow-hidden">
          <img
            src={`http://localhost:8000${merchant.photo}`}
            className="size-full object-cover"
            alt="Merchant logo"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{merchant.name}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <PhoneIcon className="size-4 flex shrink-0" />
            <span className="text-sm">{merchant.phone}</span>
          </div>
        </div>
      </div>

      {/* Review Transaction */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col w-full rounded-3xl p-6 gap-5 bg-white shadow-sm">
          <h3 className="font-semibold text-xl text-gray-900">Review Transaction</h3>
          
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((product, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-[64px] rounded-xl bg-monday-background items-center justify-center overflow-hidden">
                      <img
                        src={product.thumbnail}
                        className="size-full object-contain"
                        alt={product.name}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-base">{product.name}</p>
                      <p className="text-gray-600">
                        Rp {product.price.toLocaleString('id')} <span className="text-gray-500">({product.quantity}x)</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CubeIcon className="size-5 flex shrink-0" />
                    <span className="text-sm font-medium">{product.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="size-5 flex shrink-0" />
                    <span className="font-semibold text-sm text-monday-blue">
                      Rp {(product.quantity * product.price).toLocaleString('id')}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="size-5 flex shrink-0" />
                  <span className="font-medium">Subtotal</span>
                </div>
                <span className="font-semibold text-lg text-monday-blue">
                  Rp {subtotal.toLocaleString('id')}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <DocumentTextIcon className="size-12 mb-3" />
              <p className="text-center">No items added to transaction</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer & Payment Information */}
      <div className="flex flex-col gap-6">
        {/* Customer Information */}
        <div className="flex flex-col w-full rounded-3xl p-6 gap-5 bg-white shadow-sm">
          <h3 className="font-semibold text-xl text-gray-900">Customer Information</h3>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-base">{transaction.name}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <PhoneIcon className="size-4 flex shrink-0" />
                <span className="text-sm">{transaction.phone}</span>
              </div>
            </div>
            <div className="flex size-12 rounded-xl bg-gray-100 items-center justify-center">
              <UserIcon className="size-5 flex shrink-0" />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="flex flex-col w-full rounded-3xl p-6 gap-5 bg-white shadow-sm">
          <h3 className="font-semibold text-xl text-gray-900">Payment Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="size-5 flex shrink-0" />
                <span className="text-sm">Total Items</span>
              </div>
              <span className="font-medium">{cart.length} Item</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2">
                <CubeIcon className="size-5 flex shrink-0" />
                <span className="text-sm">Total Quantity</span>
              </div>
              <span className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}x</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2">
                <ReceiptPercentIcon className="size-5 flex shrink-0" />
                <span className="text-sm">Subtotal</span>
              </div>
              <span className="font-medium">Rp {subtotal.toLocaleString('id')}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="size-5 flex shrink-0" />
                <span className="text-sm">PPN 10%</span>
              </div>
              <span className="font-medium">Rp {tax.toLocaleString('id')}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border-t border-gray-200 pt-3">
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="size-5 flex shrink-0" />
                <span className="font-medium">Grand Total</span>
              </div>
              <span className="font-semibold text-xl text-monday-blue">
                Rp {grandTotal.toLocaleString('id')}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button 
            onClick={handlePrevStep}
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isPending}
            className={`cursor-pointer px-6 py-3 rounded-full font-medium ${
              isPending 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-blue-700'
            } transition-colors`}
          >
            {isPending ? "Saving..." : "Save Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepThree;