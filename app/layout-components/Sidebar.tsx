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
  KanbanSquare,
} from "lucide-react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/store/slices/auth";
import Swal from "sweetalert2";
import { useLogoutMutation } from "@/store/api/apiSlice";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useIsRTL } from "@/app/i18n/LocaleProvider";

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
  const t = useTranslations("sidebar");

  const navSections: NavSection[] = [
    {
      title: t("sections.main"),
      items: [
        { icon: Home, label: t("dashboard"), link: "/" },

        {
          icon: Boxes,
          label: t("categories"),
          subItems: [
            { icon: List, label: t("allCategories"), link: "/categories" },
            { icon: Plus, label: t("addCategory"), link: "/categories/add" },
          ],
        },

        {
          icon: GraduationCap,
          label: t("courses"),
          subItems: [
            { icon: List, label: t("allCourses"), link: "/courses" },
            { icon: Plus, label: t("addCourse"), link: "/courses/add" },
          ],
        },
        {
          icon: SchoolIcon,
          label: t("classes"),
          subItems: [
            { icon: List, label: t("allClasses"), link: "/classes" },
            { icon: Plus, label: t("addClass"), link: "/classes/add" },
          ],
        },

        {
          icon: UserCheck,
          label: t("enrollments"),
          subItems: [
            { icon: List, label: t("allEnrollments"), link: "/enrollments" },
            { icon: Plus, label: t("addEnrollment"), link: "/enrollments/add" },
          ],
        },

        {
          icon: UserPlus,
          label: t("leads"),
          subItems: [
            { icon: KanbanSquare, label: t("board"), link: "/leads/board" },
            { icon: List, label: t("allLeads"), link: "/leads" },
            { icon: Plus, label: t("addLead"), link: "/leads/add" },
          ],
        },

        {
          icon: UserSquare,
          label: t("students"),
          subItems: [
            { icon: List, label: t("allStudents"), link: "/students" },
            { icon: Plus, label: t("addStudent"), link: "/students/add" },
          ],
        },

        {
          icon: Clock,
          label: t("followUp"),
          subItems: [
            { icon: List, label: t("allFollowUps"), link: "/follow-up" },
            { icon: Plus, label: t("addFollowUp"), link: "/follow-up/add" },
          ],
        },
      ],
    },

    {
      title: t("sections.system"),
      items: [
        {
          icon: UserCircle,
          label: t("users"),
          subItems: [
            { icon: List, label: t("allUsers"), link: "/users" },
            { icon: Plus, label: t("addUser"), link: "/users/add" },
          ],
        },

        {
          icon: Shield,
          label: t("roles"),
          subItems: [
            { icon: List, label: t("allRoles"), link: "/roles" },
            { icon: Plus, label: t("addRole"), link: "/roles/add" },
            // {
            //   icon: EditIcon,
            //   label: "Edit Role",
            //   link: "/dashboard/roles/edit/:id",
            // },
          ],
        },

        {
          icon: Settings,
          label: t("settings"),
          subItems: [
            {
              icon: Edit,
              label: t("generalSettings"),
              link: "/dashboard/settings",
            },
            {
              icon: Edit,
              label: t("systemConfig"),
              link: "/dashboard/settings/config",
            },
            {
              icon: EditIcon,
              label: t("editSettings"),
              link: "/dashboard/settings/edit",
            },
          ],
        },

        {
          icon: UserCircle2,
          label: t("profile"),
          subItems: [
            { icon: Edit, label: t("editProfile"), link: "/dashboard/profile" },
            {
              icon: Edit,
              label: t("changePassword"),
              link: "/dashboard/profile/password",
            },
            {
              icon: EditIcon,
              label: t("advancedEdit"),
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
  const isRTL = useIsRTL();
  return (
    <aside
      className={`
        fixed ${isRTL ? "right-0" : "left-0"} top-[98px] z-30 h-[calc(100vh-98px)] w-64
        bg-white/95 backdrop-blur-xl ${isRTL ? "border-l" : "border-r"} border-blue-100 shadow-lg
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : `${isRTL ? "translate-x-full" : "-translate-x-full"} lg:translate-x-0`}
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
                          <div
                            className={`${isRTL ? "mr-4 pr-4 border-r-2" : "ml-4 pl-4 border-l-2"} border-blue-200 space-y-1`}
                          >
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
          <span className="font-medium">{t("signOut")}</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
