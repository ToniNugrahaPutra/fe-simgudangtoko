import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface UseProfileCardProps {
  title: string;
  backLink?: string; // opsional, jika diisi maka tombol back muncul
}

const UseProfileCard = ({ title, backLink }: UseProfileCardProps) => {
  const { user } = useAuth();

  return (
    <div className="flex items-center h-20 w-full">
      {/* Kiri: Judul + Tombol Back (opsional) */}
      <div className="flex items-center h-full bg-white rounded-3xl rounded-r-none px-6 w-full">
        {backLink && (
          <Link
            to={backLink}
            className="flex items-center justify-center mr-3 hover:opacity-80 transition"
          >
            <ChevronLeftIcon className="size-6" />
          </Link>
        )}
        <h1 className="font-bold text-[18px]">{title}</h1>
      </div>

      {/* Kanan: Profil user */}
      <div className="flex items-center h-full bg-white rounded-3xl rounded-l-none px-6 w-[320px]">
        {/* <div className="flex rounded-full overflow-hidden size-16">
          <img src={user?.photo} className="size-full object-cover" alt="photo" />
        </div> */}

        <div className="flex flex-col">
          <p className="font-semibold text-base leading-none">{user?.name}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <img
              src="/assets/images/icons/user-grey.svg"
              className="size-4"
              alt="icon"
            />
            {user?.roles}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UseProfileCard;
