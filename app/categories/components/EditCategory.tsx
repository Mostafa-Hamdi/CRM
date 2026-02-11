"use client";

import {
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "@/store/api/apiSlice";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import {
  FolderOpen,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  Edit,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";

type CategoryFormData = {
  name: string;
};

const EditCategory = ({ id }: { id: number }) => {
  const t = useTranslations("categories");
  const router = useRouter();
  const { data: categoryData, isLoading: loadingCategory } =
    useGetCategoryQuery({ id });
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();

  // Validation Schema using translations
  const categorySchema = yup.object().shape({
    name: yup
      .string()
      .required(t("nameRequired"))
      .min(2, t("nameMin", { min: 2 }))
      .max(100, t("nameMax", { max: 100 }))
      .trim(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
  });

  // Set default values when category data loads
  useEffect(() => {
    if (categoryData?.name) {
      reset({
        name: categoryData.name,
      });
    }
  }, [categoryData, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await updateCategory({
        id,
        name: data.name,
      }).unwrap();

      await Swal.fire({
        icon: "success",
        title: t("updateSuccessTitle"),
        text: t("updateSuccessText"),
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/categories");
    } catch (err: any) {
      let errorMessage = "Failed to update category.";

      if (err?.data) {
        if (typeof err.data === "string") {
          errorMessage = err.data;
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 rotate-3 transition-transform hover:rotate-6">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl leading-[50px]  font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                  {t("editTitle")}
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  {t("editSubtitle")}
                </p>
              </div>
            </div>

            <Link
              href="/categories"
              className="group relative cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
              title={t("goBack")}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{t("goBack")}</span>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loadingCategory && (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-12 shadow-xl shadow-blue-500/10">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-600 text-lg">{t("loading")}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        {!loadingCategory && categoryData && (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10">
            <div className="space-y-6">
              {/* Category Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {t("nameLabel")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={t("enterName")}
                  {...register("name")}
                  className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  } rounded-xl px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:bg-white transition-all`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/categories")}
                  className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={updating}
                  className="flex-1 group relative cursor-pointer flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {updating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                      <span className="relative z-10">{t("updating")}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">{t("updateButton")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        {!loadingCategory && categoryData && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  {t("quickTipsTitle")}
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  {(t.raw("guidelines") as string[]).map((g, idx) => (
                    <li key={idx}>• {g}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCategory;
