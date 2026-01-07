import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  CheckCircleIcon,
  UserIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  ReceiptPercentIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

const TransactionSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/transactions");
    return null;
  }

  const {
    customerName,
    totalItems,
    totalQuantity,
    subTotal,
    taxTotal,
    grandTotal,
    transactionId,
  } = state;

  return (
    <div id="main-container" className="flex flex-1 min-h-screen bg-gray-50">
      <div className="flex flex-1 items-center justify-center py-8 px-4">
        <div className="flex flex-col w-full max-w-md rounded-2xl shadow-sm pt-9 p-6 gap-6 bg-white">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircleIcon className="size-20 text-green-600" />
            </div>
            <p className="font-bold text-2xl text-center text-gray-900">
              Transaksi Berhasil Dibuat!
            </p>
          </div>
          
          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2">
                <UserIcon className="size-5 text-gray-500" />
                <span className="text-sm text-gray-600">Customer Name</span>
              </div>
              <p className="font-medium text-gray-900">{customerName}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="size-5 text-gray-500" />
                <span className="text-sm text-gray-600">Total Items</span>
              </div>
              <p className="font-medium text-gray-900">{totalItems} Item</p>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2">
                <CubeIcon className="size-5 text-gray-500" />
                <span className="text-sm text-gray-600">Total Quantity</span>
              </div>
              <p className="font-medium text-gray-900">{totalQuantity}x</p>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2">
                <ReceiptPercentIcon className="size-5 text-gray-500" />
                <span className="text-sm text-gray-600">Subtotal</span>
              </div>
              <p className="font-medium text-gray-900">Rp {subTotal.toLocaleString('id')}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="size-5 text-gray-500" />
                <span className="text-sm text-gray-600">PPN 10%</span>
              </div>
              <p className="font-medium text-gray-900">Rp {taxTotal.toLocaleString('id')}</p>
            </div>
            
            <div className="flex items-center justify-between p-3 border-t border-gray-300 pt-3">
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="size-5 text-gray-500" />
                <span className="font-medium text-gray-900">Grand Total</span>
              </div>
              <p className="font-semibold text-xl text-monday-blue">Rp {grandTotal.toLocaleString('id')}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Link 
              to="/transactions"
              className=" bg-primary text-white font-semibold w-full py-3 rounded-full transition-colors text-center"
            >
              Kembali ke Transaksi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccess;