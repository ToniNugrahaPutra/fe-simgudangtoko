import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HomeIcon as HomeOutline,
  ShoppingBagIcon as ShoppingBagOutline,
  CreditCardIcon as CreditCardOutline,
  QueueListIcon as QueueListOutline,
  BuildingOfficeIcon as BuildingOfficeOutline,
  BuildingStorefrontIcon as BuildingStorefrontOutline,
  Cog6ToothIcon as CogOutline,
  UserGroupIcon as UserGroupOutline,
  UserCircleIcon as UserCircleOutline,
  IdentificationIcon as IdentificationOutline,
  UsersIcon as UsersOutline,
  ArrowRightOnRectangleIcon as LogoutOutline,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

import {
  HomeIcon as HomeSolid,
  ShoppingBagIcon as ShoppingBagSolid,
  CreditCardIcon as CreditCardSolid,
  QueueListIcon as QueueListSolid,
  BuildingOfficeIcon as BuildingOfficeSolid,
  BuildingStorefrontIcon as BuildingStorefrontSolid,
  Cog6ToothIcon as CogSolid,
  UserGroupIcon as UserGroupSolid,
  UserCircleIcon as UserCircleSolid,
  IdentificationIcon as IdentificationSolid,
  UsersIcon as UsersSolid,
} from "@heroicons/react/24/solid";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  const toggleAccordion = (label: string) => {
    setOpenAccordions((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const userRoles = user?.roles || [];

  const sidebarMenus = [
    {
      section: "Main Menu",
      items: [
        {
          label: "Beranda",
          path: "/dashboard",
          iconDefault: HomeOutline,
          iconPrimary: HomeSolid,
          roles: ["admin"],
        },
        {
          label: "Beranda",
          path: "/overview-merchant",
          iconDefault: HomeOutline,
          iconPrimary: HomeSolid,
          roles: ["operator"],
        },
        {
          label: "Produk",
          path: "/products",
          iconDefault: ShoppingBagOutline,
          iconPrimary: ShoppingBagSolid,
          roles: ["admin"],
        },
        {
          label: "Transaksi",
          path: "/transactions",
          iconDefault: CreditCardOutline,
          iconPrimary: CreditCardSolid,
          roles: ["operator"],
        },
        {
          label: "Kategori",
          path: "/categories",
          iconDefault: QueueListOutline,
          iconPrimary: QueueListSolid,
          roles: ["admin"],
        },
        {
          label: "Gudang",
          path: "/warehouses",
          iconDefault: BuildingOfficeOutline,
          iconPrimary: BuildingOfficeSolid,
          roles: ["admin"],
        },
        {
          label: "Toko",
          path: "/merchants",
          iconDefault: BuildingStorefrontOutline,
          iconPrimary: BuildingStorefrontSolid,
          roles: ["admin"],
        },
        {
          label: "Toko",
          path: "/my-merchant",
          iconDefault: BuildingStorefrontOutline,
          iconPrimary: BuildingStorefrontSolid,
          roles: ["operator"],
        },
      ],
    },
    {
      section: "Pengaturan Akun",
      items: [
        {
          label: "Manajemen Role",
          path: "/roles",
          iconDefault: IdentificationOutline,
          iconPrimary: IdentificationSolid,
          roles: ["admin"],
        },
        {
          label: "Manajemen User",
          path: "/users",
          iconDefault: UsersOutline,
          iconPrimary: UsersSolid,
          roles: ["admin"],
        }
      ],
    },
  ];

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="relative flex h-auto w-[280px] shrink-0 bg-white">
      <div className="flex flex-col fixed top-0 w-[280px] shrink-0 h-screen pt-[30px] px-4 gap-[30px]">
        <div className="flex items-center">
          <img
            src="/assets/images/logos/logo.svg"
            className="h-8 w-fit"
            alt="logo"
          />
          <p className="pl-2 font-semibold text-lg">SimGudangToko</p>
        </div>

        <div className="flex flex-col gap-5 h-full overflow-y-auto hide-scrollbar">
          {sidebarMenus.map((section) => {
            const visibleItems = section.items.filter((item) =>
              item.roles?.some((r) => userRoles.includes(r))
            );

            if (visibleItems.length === 0) return null;

            return (
              <nav key={section.section} className="flex flex-col gap-3">
                <p className="font-medium text-xs text-[#c4c4c4]">
                  {section.section}
                </p>
                <ul className="flex flex-col gap-2">
                  {visibleItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = isActive ? item.iconPrimary : item.iconDefault;

                    return (
                      <li key={item.label} className="group">
                        <Link
                          to={item.path}
                          className={`flex items-center w-full min-h-14 gap-2 rounded-2xl overflow-hidden py-[10px] pl-4 transition-300 ${
                            isActive ? "bg-primary" : "bg-white"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 transition-colors ${
                              isActive ? "text-white" : "text-font"
                            }`}
                          />
                          <p
                            className={`transition-300 w-full ${
                              isActive
                                ? "text-white font-semibold"
                                : "font-medium"
                            }`}
                          >
                            {item.label}
                          </p>
                          {isActive && (
                            <div className="w-2 h-9 shrink-0 rounded-l-xl" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            );
          })}
        <div className="mb-5">
          <button
            onClick={handleLogout}
            className="flex items-center w-full rounded-2xl pl-4 cursor-pointer"
          >
            <LogoutOutline className="w-6 h-6 text-red-500" />
            <p className="font-bold text-left pl-2 w-full text-red-500">Logout</p>
          </button>
        </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
