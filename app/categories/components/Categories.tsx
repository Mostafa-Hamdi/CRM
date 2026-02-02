"use client";

import {
  useDeleteCategoryMutation,
  useGetSpecificCategoriesMutation,
} from "@/store/api/apiSlice";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  FolderTree,
  Edit2,
  Trash2,
  Sparkles,
  Hash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  List,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";

interface Category {
  id: number;
  name: string;
}

interface PaginatedResponse {
  data: Category[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const Categories = () => {
  const permissions = useSelector((state: any) => state.auth.user?.permissions);
  const isLogin = useSelector((state: any) => state.auth.isAuthenticated);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoriesResponse, setCategoriesResponse] =
    useState<PaginatedResponse | null>(null);

  const [getSpecificCategories, { isLoading }] =
    useGetSpecificCategoriesMutation();

  const t = useTranslations("categories");
  const [deleteCategory] = useDeleteCategoryMutation();

  // Fetch categories on mount and when page/size changes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getSpecificCategories({
          pageNumber,
          pageSize,
        }).unwrap();
        setCategoriesResponse(result);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [pageNumber, pageSize, getSpecificCategories]);

  // localized text helpers
  const pageInfo = () =>
    t("pageInfo", {
      current: pageNumber,
      total: categoriesResponse?.totalPages || 1,
      count: categoriesResponse?.totalCount || 0,
      pageSize,
    });

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!categoriesResponse?.data) return [];

    const query = searchQuery.toLowerCase();
    return categoriesResponse.data.filter((category: Category) =>
      category.name.toLowerCase().includes(query),
    );
  }, [categoriesResponse, searchQuery]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: t("deleteConfirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("confirmYes") || "Yes",
      cancelButtonText: t("confirmNo") || "No",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#e5e7eb",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory({ id }).unwrap();

      await Swal.fire({
        icon: "success",
        title: t("addSuccessTitle") || "Deleted!",
        text: t("deleteSuccess"),
        timer: 2000,
      });

      // Refresh current page
      const result = await getSpecificCategories({
        pageNumber,
        pageSize,
      }).unwrap();
      setCategoriesResponse(result);
    } catch (err: any) {
      console.error(err);

      const errorMessage =
        err?.data?.message ||
        err?.error ||
        "Something went wrong while deleting the category.";

      Swal.fire({
        icon: "error",
        title: t("oops") || "Oops!",
        text: errorMessage,
      });
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNumber(1); // Reset to first page when changing page size
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= (categoriesResponse?.totalPages || 1)) {
      setPageNumber(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(categoriesResponse?.totalPages || 1);
  const goToPreviousPage = () => goToPage(pageNumber - 1);
  const goToNextPage = () => goToPage(pageNumber + 1);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = categoriesResponse?.totalPages || 1;
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (pageNumber <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (pageNumber >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(pageNumber - 1);
        pages.push(pageNumber);
        pages.push(pageNumber + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 rotate-3 transition-transform hover:rotate-6">
                  <FolderTree className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                  {t("title")}
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  {t("subtitle")}
                </p>
              </div>
            </div>

            <Link
              href={"/categories/add"}
              className="group relative cursor-pointer flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{t("addButton")}</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {t("totalCategories")}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-1">
                  {categoriesResponse?.totalCount || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                <FolderTree className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {t("categoriesFound")}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                  {filteredCategories.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <Hash className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {t("currentPage")}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-1">
                  {filteredCategories.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar with Page Size Selector */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-blue-500/10">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 border-gray-200 rounded-xl">
              <List className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {t("show")}
              </span>
              <div className="flex items-center gap-2">
                {[5, 10, 20, 50].map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                      pageSize === size
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 border border-blue-400 rounded-xl shadow-lg shadow-blue-500/30">
              <FolderTree className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white">
                {filteredCategories.length} {t("title")}
              </span>{" "}
            </div>
          </div>

          {/* Pagination Info */}
          {categoriesResponse && categoriesResponse.totalPages > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">{pageInfo()}</p>
            </div>
          )}
        </div>

        {/* Table Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-xl shadow-blue-500/10">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-600 font-medium">{t("loading")}</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full mb-4">
                <FolderTree className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                {searchQuery ? t("noCategoriesFound") : t("noCategoriesYet")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 border-b border-blue-400/30">
                  <tr>
                    <th className="px-6 py-5 text-left">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        #
                      </span>
                    </th>
                    <th className="px-6 py-5 text-left">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Category Name
                      </span>
                    </th>
                    {isLogin &&
                    (permissions?.includes("CATEGORIES_EDIT") ||
                      permissions?.includes("CATEGORIES_DELETE")) ? (
                      <th className="px-6 py-5 text-center">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Operations
                        </span>
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.map(
                    (category: Category, index: number) => (
                      <tr
                        key={category.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/30 transition-all duration-200"
                      >
                        {/* Category ID */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-blue-100 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm">
                              <Hash className="w-3.5 h-3.5" />
                              {category.id}
                            </span>
                          </div>
                        </td>

                        {/* Category Name */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                              <FolderTree className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-base">
                                {category.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        {isLogin &&
                        (permissions?.includes("CATEGORIES_EDIT") ||
                          permissions?.includes("CATEGORIES_DELETE")) ? (
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-2">
                              {isLogin &&
                              permissions?.includes("CATEGORIES_EDIT") ? (
                                <Link
                                  href={`/categories/edit/${category.id}`}
                                  className="cursor-pointer p-2.5 text-blue-600 hover:text-white bg-blue-50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 group"
                                  title="Edit category"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </Link>
                              ) : null}
                              {isLogin &&
                              permissions?.includes("CATEGORIES_DELETE") ? (
                                <button
                                  onClick={() => handleDelete(category.id)}
                                  className="cursor-pointer p-2.5 text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 group"
                                  title="Delete category"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              ) : null}
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {categoriesResponse && categoriesResponse.totalPages > 1 && (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-blue-500/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Previous buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToFirstPage}
                  disabled={pageNumber === 1}
                  className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="First page"
                >
                  <ChevronsLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={pageNumber === 1}
                  className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="Previous page"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Page numbers */}
              <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && goToPage(page)}
                    disabled={page === "..." || page === pageNumber}
                    className={`min-w-[40px] h-10 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                      page === pageNumber
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : page === "..."
                          ? "cursor-default"
                          : "border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToNextPage}
                  disabled={pageNumber === categoriesResponse.totalPages}
                  className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={pageNumber === categoriesResponse.totalPages}
                  className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all cursor-pointer"
                  title="Last page"
                >
                  <ChevronsRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
