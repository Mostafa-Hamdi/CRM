"use client";

import { useAddCategoryMutation } from "@/store/api/apiSlice";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FolderPlus,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";

type CategoryFormData = {
  name: string;
};

const AddCategory = () => {
  const t = useTranslations("categories");
  const router = useRouter();
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  // Validation schema using translations
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
    mode: "onChange",
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await addCategory({ name: data.name }).unwrap();

      await Swal.fire({
        icon: "success",
        title: t("addSuccessTitle"),
        text: t("addSuccessText"),
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
      router.push("/categories");
    } catch (err: any) {
      let errorMessage = "Failed to add category.";

      if (err?.data) {
        if (typeof err.data === "string") {
          errorMessage = err.data;
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: t("oops") || "Oops!",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10">
          <div className="flex items-start gap-4">
            <Link
              href="/categories"
              className="cursor-pointer p-3 bg-white/50 hover:bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-md"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 rotate-3 transition-transform hover:rotate-6">
                <FolderPlus className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                {t("addTitle")}
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                {t("addSubtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {t("nameLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
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
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/categories")}
                className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t("adding")}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{t("addButton")}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50/50 backdrop-blur-2xl border border-blue-200/60 rounded-2xl p-6 shadow-lg">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                {t("guidelinesTitle")}
              </h3>
              <ul className="mt-2 text-xs text-gray-500 list-disc pl-5 space-y-1">
                {(t.raw("guidelines") as string[]).map(
                  (g: string, idx: number) => (
                    <li key={idx}>{g}</li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
