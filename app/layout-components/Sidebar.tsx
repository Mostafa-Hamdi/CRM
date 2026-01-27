import {
  Home,
  Boxes,
  GraduationCap,
  UserCheck,
  UserPlus,
  UserSquare,
  Clock,
  UserCircle,
  Shield,
  Settings,
  UserCircle2,
  LogOut,
  ChevronDown,
  Plus,
  Edit,
  List,
  EditIcon,
  School,
  SchoolIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/store/slices/auth";
import Swal from "sweetalert2";
import { useLogoutMutation } from "@/store/api/apiSlice";
import { useState } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
}

interface SubItem {
  icon: any;
  label: string;
  link: string;
}

interface NavItem {
  icon: any;
  label: string;
  link?: string;
  subItems?: SubItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const Sidebar = ({ sidebarOpen }: SidebarProps) => {
  const path = usePathname();
  const dispatch = useDispatch();
  const [removeRefreshToken] = useLogoutMutation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );

  const navSections: NavSection[] = [
    {
      title: "Main",
      items: [
        { icon: Home, label: "Dashboard", link: "/" },

        {
          icon: Boxes,
          label: "Categories",
          subItems: [
            { icon: List, label: "All Categories", link: "/categories" },
            { icon: Plus, label: "Add Category", link: "/categories/add" },
          ],
        },

        {
          icon: GraduationCap,
          label: "Courses",
          subItems: [
            { icon: List, label: "All Courses", link: "/courses" },
            { icon: Plus, label: "Add Course", link: "/courses/add" },
          ],
        },
        {
          icon: SchoolIcon,
          label: "Classes",
          subItems: [
            { icon: List, label: "All Classes", link: "/classes" },
            { icon: Plus, label: "Add Class", link: "/classes/add" },
          ],
        },

        {
          icon: UserCheck,
          label: "Enrollments",
          subItems: [
            { icon: List, label: "All Enrollments", link: "/enrollments" },
            { icon: Plus, label: "Add Enrollment", link: "/enrollments/add" },
          ],
        },

        {
          icon: UserPlus,
          label: "Leads",
          subItems: [
            { icon: List, label: "All Leads", link: "/leads" },
            { icon: Plus, label: "Add Lead", link: "/leads/add" },
          ],
        },

        {
          icon: UserSquare,
          label: "Students",
          subItems: [
            { icon: List, label: "All Students", link: "/students" },
            { icon: Plus, label: "Add Student", link: "/students/add" },
          ],
        },

        {
          icon: Clock,
          label: "Follow Up",
          subItems: [
            { icon: List, label: "All Follow Ups", link: "/follow-up" },
            { icon: Plus, label: "Add Follow Up", link: "/follow-up/add" },
          ],
        },
      ],
    },

    {
      title: "System",
      items: [
        {
          icon: UserCircle,
          label: "Users",
          subItems: [
            { icon: List, label: "All Users", link: "/users" },
            { icon: Plus, label: "Add User", link: "/users/add" },
          ],
        },

        {
          icon: Shield,
          label: "Roles",
          subItems: [
            { icon: List, label: "All Roles", link: "/dashboard/roles" },
            { icon: Plus, label: "Add Role", link: "/dashboard/roles/add" },
            {
              icon: EditIcon,
              label: "Edit Role",
              link: "/dashboard/roles/edit/:id",
            },
          ],
        },

        {
          icon: Settings,
          label: "Settings",
          subItems: [
            {
              icon: Edit,
              label: "General Settings",
              link: "/dashboard/settings",
            },
            {
              icon: Edit,
              label: "System Config",
              link: "/dashboard/settings/config",
            },
            {
              icon: EditIcon,
              label: "Edit Settings",
              link: "/dashboard/settings/edit",
            },
          ],
        },

        {
          icon: UserCircle2,
          label: "Profile",
          subItems: [
            { icon: Edit, label: "Edit Profile", link: "/dashboard/profile" },
            {
              icon: Edit,
              label: "Change Password",
              link: "/dashboard/profile/password",
            },
            {
              icon: EditIcon,
              label: "Advanced Edit",
              link: "/dashboard/profile/edit",
            },
          ],
        },
      ],
    },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.link) {
      return (
        path === item.link ||
        (path.startsWith(item.link + "/") && item.link !== "/")
      );
    }
    if (item.subItems) {
      return item.subItems.some(
        (sub) => path === sub.link || path.startsWith(sub.link + "/"),
      );
    }
    return false;
  };

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
        fixed left-0 top-[98px] z-30 h-[calc(100vh-98px)] w-64
        bg-white/95 backdrop-blur-xl border-r border-blue-100 shadow-lg
        transition-transform duration-300  
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <nav className="p-4 space-y-6 h-full pb-20 overflow-y-auto">
        {navSections.map((section, i) => (
          <div key={i}>
            <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
              {section.title}
            </p>

            <div className="space-y-2">
              {section.items.map((item, idx) => {
                const isActive = isItemActive(item);
                const hasDropdown = item.subItems && item.subItems.length > 0;
                const isOpen = openDropdowns[item.label];

                return (
                  <div key={idx}>
                    {hasDropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.label)}
                          className={`cursor-pointer w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                              : "text-gray-700 hover:bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Dropdown Menu */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen
                              ? "max-h-96 opacity-100 mt-2"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-4 pl-4 border-l-2 border-blue-200 space-y-1">
                            {item.subItems!.map((subItem, subIdx) => {
                              const isSubActive = path === subItem.link;

                              return (
                                <Link
                                  href={subItem.link}
                                  key={subIdx}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                                    isSubActive
                                      ? "bg-blue-50 text-blue-600 font-medium"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  }`}
                                >
                                  <subItem.icon className="w-4 h-4" />
                                  <span>{subItem.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.link!}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )}
                  </div>
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
