"use client";

import {
  useGetCourseQuery,
  useUpdateCourseMutation,
  useGetCategoriesQuery,
} from "@/store/api/apiSlice";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import {
  BookOpen,
  Code,
  FileText,
  DollarSign,
  Clock,
  Calendar,
  Folder,
  Sparkles,
  ArrowLeft,
  Save,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

// Validation Schema
const courseSchema = yup.object().shape({
  name: yup
    .string()
    .required("Course name is required")
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name must not exceed 200 characters"),
  code: yup
    .string()
    .required("Course code is required")
    .min(2, "Code must be at least 2 characters")
    .max(50, "Code must not exceed 50 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be at least 0")
    .typeError("Price must be a valid number"),
  durationInHours: yup
    .number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 hour")
    .typeError("Duration must be a valid number"),
  startDate: yup
    .string()
    .required("Start date is required")
    .test("is-valid-date", "Please enter a valid date", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }),
  endDate: yup
    .string()
    .required("End date is required")
    .test("is-valid-date", "Please enter a valid date", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    })
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return new Date(value) > new Date(startDate);
      },
    ),
  categoryId: yup
    .number()
    .required("Category is required")
    .min(1, "Please select a category")
    .typeError("Category must be selected"),
});

type CourseFormData = yup.InferType<typeof courseSchema>;

interface Category {
  id: number;
  name: string;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: courseData, isLoading: isLoadingCourse } = useGetCourseQuery({
    id,
  });
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: yupResolver(courseSchema),
  });

  // Populate form when course data is loaded
  useEffect(() => {
    if (courseData) {
      // Format date to YYYY-MM-DD for input[type="date"]
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      reset({
        name: courseData.name || "",
        code: courseData.code || "",
        description: courseData.description || "",
        price: courseData.price || 0,
        durationInHours: courseData.durationInHours || 0,
        startDate: formatDateForInput(courseData.startDate) || "",
        endDate: formatDateForInput(courseData.endDate) || "",
        categoryId: courseData.categoryId || 0,
      });
    }
  }, [courseData, reset]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      // Convert dates to ISO format for API
      const startDate = new Date(data.startDate).toISOString();
      const endDate = new Date(data.endDate).toISOString();

      await updateCourse({
        id,
        name: data.name,
        code: data.code,
        description: data.description,
        price: data.price,
        durationInHours: data.durationInHours,
        startDate: startDate,
        endDate: endDate,
        categoryId: data.categoryId,
      }).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Course has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/courses");
    } catch (err) {
      let message = "Failed to update course.";

      if (typeof err === "object" && err !== null) {
        const maybeData = (err as any).data;
        if (typeof maybeData === "string") {
          message = maybeData;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: message,
      });
    }
  };

  // Loading state
  if (isLoadingCourse || isLoadingCategories) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
        <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-20 shadow-xl shadow-blue-500/10">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-600 font-medium">
                Loading course data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - Course not found
  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
        <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-20 shadow-xl shadow-blue-500/10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full mb-4">
                <BookOpen className="w-10 h-10 text-red-600" />
              </div>
              <p className="text-gray-600 font-medium text-lg mb-4">
                Course not found
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 rotate-3 transition-transform hover:rotate-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                  Edit Course
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Update course information
                </p>
              </div>
            </div>

            <Link
              href="/courses"
              className="group relative cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="Enter course name"
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.name ? "border-red-300" : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Course Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Code className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("code")}
                      placeholder="e.g., CS101"
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.code ? "border-red-300" : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.code && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.code.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register("categoryId")}
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.categoryId ? "border-red-300" : "border-gray-200"
                      } rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer`}
                    >
                      <option value={0}>Select category</option>
                      {categories?.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.categoryId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <textarea
                      {...register("description")}
                      rows={4}
                      placeholder="Enter course description"
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.description
                          ? "border-red-300"
                          : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all resize-none`}
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Duration Section */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Pricing & Duration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("price")}
                      placeholder="0.00"
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.price ? "border-red-300" : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (Hours) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      {...register("durationInHours")}
                      placeholder="e.g., 40"
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.durationInHours
                          ? "border-red-300"
                          : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.durationInHours && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.durationInHours.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      {...register("startDate")}
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.startDate ? "border-red-300" : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      {...register("endDate")}
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.endDate ? "border-red-300" : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/courses")}
                className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 group relative cursor-pointer flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {isUpdating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                    <span className="relative z-10">Updating Course...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Update Course</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Editing Course #{id}
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All fields are required for course information</li>
                <li>• End date must be after the start date</li>
                <li>• Changes will be saved immediately upon submission</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
