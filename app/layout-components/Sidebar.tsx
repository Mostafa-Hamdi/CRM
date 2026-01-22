import {
  Home,
  ShoppingCart,
  Package,
  TrendingUp,
  Archive,
  Activity,
  FileText,
  Brain,
  Truck,
  Users,
  FolderTree,
  MapPin,
  UserCircle,
  Shield,
  Settings,
  UserCircle2,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/store/slices/auth";
import Swal from "sweetalert2";
import { useLogoutMutation } from "@/store/api/apiSlice";

const Sidebar = ({ sidebarOpen }: any) => {
  const path = usePathname();
  const dispatch = useDispatch();
  const [removeRefreshToken] = useLogoutMutation();

  const navSections = [
    {
      title: "Main",
      items: [
        { icon: Home, label: "Dashboard", link: "/dashboard" },
        { icon: ShoppingCart, label: "Orders", link: "/dashboard/orders" },
        { icon: Package, label: "Products", link: "/dashboard/products" },
        {
          icon: TrendingUp,
          label: "Stock Movement",
          link: "/dashboard/stock-movement",
        },
        {
          icon: Archive,
          label: "Reserved Quantity",
          link: "/dashboard/reserved-quantity",
        },
        { icon: Activity, label: "Activities", link: "/dashboard/activities" },
      ],
    },
    {
      title: "Reports & Analytics",
      items: [
        { icon: FileText, label: "Reports", link: "/dashboard/reports" },
        { icon: Brain, label: "AI Reports", link: "/dashboard/ai-reports" },
      ],
    },
    {
      title: "Management",
      items: [
        { icon: Truck, label: "Suppliers", link: "/dashboard/suppliers" },
        { icon: Users, label: "Clients", link: "/dashboard/clients" },
        {
          icon: FolderTree,
          label: "Categories",
          link: "/dashboard/categories",
        },
        { icon: MapPin, label: "Locations", link: "/dashboard/locations" },
      ],
    },
    {
      title: "System",
      items: [
        { icon: UserCircle, label: "Users", link: "/users" },
        { icon: Shield, label: "Roles", link: "/dashboard/roles" },
        { icon: Settings, label: "Settings", link: "/dashboard/settings" },
        { icon: UserCircle2, label: "Profile", link: "/dashboard/profile" },
      ],
    },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "😢 Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#e5e7eb",
    });

    if (!result.isConfirmed) return;

    try {
      await removeRefreshToken().unwrap();
      dispatch(logout());
      await Swal.fire({ title: "Logged out successfully!", icon: "success" });
    } catch {
      Swal.fire("Logout failed", "", "error");
    }
  };

  return (
    <aside
      className={`
        fixed left-0 top-20 z-30 h-[calc(100vh-73px)] w-64
        bg-white/95 backdrop-blur-xl border-r border-blue-100 shadow-lg
        transition-transform duration-300  
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <nav className="p-4 space-y-6  h-full pb-20 overflow-y-auto">
        {navSections.map((section, i) => (
          <div key={i}>
            <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
              {section.title}
            </p>

            <div className="space-y-2">
              {section.items.map((item, idx) => {
                const isActive =
                  path === item.link ||
                  (path.startsWith(item.link + "/") &&
                    item.link !== "/dashboard");

                return (
                  <Link
                    href={item.link}
                    key={idx}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg
          text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all mt-8"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
