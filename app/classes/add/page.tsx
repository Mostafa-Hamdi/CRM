"use client";

import { useAddClassMutation, useGetCoursesQuery } from "@/store/api/apiSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Code,
  DollarSign,
  User,
  Calendar,
  Clock,
  Users,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

// Validation Schema
const classSchema = yup.object().shape({
  courseId: yup
    .number()
    .required("Course is required")
    .min(1, "Please select a course")
    .typeError("Course must be selected"),
  name: yup
    .string()
    .required("Class name is required")
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name must not exceed 200 characters"),
  code: yup
    .string()
    .required("Class code is required")
    .min(2, "Code must be at least 2 characters")
    .max(50, "Code must not exceed 50 characters"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be at least 0")
    .typeError("Price must be a valid number"),
  instructorName: yup
    .string()
    .required("Instructor name is required")
    .min(2, "Instructor name must be at least 2 characters")
    .max(100, "Instructor name must not exceed 100 characters"),
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
  daysOfWeek: yup
    .array()
    .of(yup.string())
    .min(1, "Please select at least one day")
    .required("Days of week is required"),
  timeFrom: yup
    .string()
    .required("Start time is required")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please enter a valid time (HH:MM)",
    ),
  timeTo: yup
    .string()
    .required("End time is required")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please enter a valid time (HH:MM)",
    )
    .test(
      "is-after-start-time",
      "End time must be after start time",
      function (value) {
        const { timeFrom } = this.parent;
        if (!value || !timeFrom) return true;

        const [startHour, startMin] = timeFrom.split(":").map(Number);
        const [endHour, endMin] = value.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return endMinutes > startMinutes;
      },
    ),
  maxStudents: yup
    .number()
    .required("Maximum students is required")
    .min(1, "Maximum students must be at least 1")
    .typeError("Maximum students must be a valid number"),
});

type ClassFormData = yup.InferType<typeof classSchema>;

interface Course {
  id: number;
  name: string;
}

const DAYS_OF_WEEK = [
  { value: "Sunday", label: "Sun", fullLabel: "Sunday" },
  { value: "Monday", label: "Mon", fullLabel: "Monday" },
  { value: "Tuesday", label: "Tue", fullLabel: "Tuesday" },
  { value: "Wednesday", label: "Wed", fullLabel: "Wednesday" },
  { value: "Thursday", label: "Thu", fullLabel: "Thursday" },
  { value: "Friday", label: "Fri", fullLabel: "Friday" },
  { value: "Saturday", label: "Sat", fullLabel: "Saturday" },
];

const Page = () => {
  const router = useRouter();
  const { data: courses, isLoading: isLoadingCourses } = useGetCoursesQuery();
  const [addClass, { isLoading }] = useAddClassMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ClassFormData>({
    resolver: yupResolver(classSchema),
    defaultValues: {
      courseId: 0,
      name: "",
      code: "",
      price: 0,
      instructorName: "",
      startDate: "",
      endDate: "",
      daysOfWeek: [],
      timeFrom: "",
      timeTo: "",
      maxStudents: 0,
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    try {
      // Convert dates to ISO format for API
      const startDate = new Date(data.startDate).toISOString();
      const endDate = new Date(data.endDate).toISOString();

      // Convert days array to comma-separated string
      const daysOfWeekString = data.daysOfWeek.join(", ");

      await addClass({
        courseId: data.courseId,
        name: data.name,
        code: data.code,
        price: data.price,
        instructorName: data.instructorName,
        startDate: startDate,
        endDate: endDate,
        daysOfWeek: daysOfWeekString,
        timeFrom: data.timeFrom,
        timeTo: data.timeTo,
        maxStudents: data.maxStudents,
      }).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Class has been added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
      router.push("/classes");
    } catch (err) {
      let message = "Failed to add class.";

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
  const handleDateClicker = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.showPicker();
  };

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
                  Add New Class
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Create a new class for a course
                </p>
              </div>
            </div>

            <Link
              href="/classes"
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
                {/* Course Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register("courseId")}
                      disabled={isLoadingCourses}
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.courseId ? "border-red-300" : "border-gray-200"
                      } rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer`}
                    >
                      <option value={0}>
                        {isLoadingCourses
                          ? "Loading courses..."
                          : "Select a course"}
                      </option>
                      {courses?.map((course: Course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.courseId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.courseId.message}
                    </p>
                  )}
                </div>

                {/* Class Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="Enter class name"
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

                {/* Class Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Code className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("code")}
                      placeholder="e.g., CS101-A"
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

                {/* Instructor Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructor Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("instructorName")}
                      placeholder="Enter instructor name"
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.instructorName
                          ? "border-red-300"
                          : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.instructorName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.instructorName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="pb-6 border-b border-gray-200">
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
                      onClick={handleDateClicker}
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
                      onClick={handleDateClicker}
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

                {/* Days of Week */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Days of Week <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="daysOfWeek"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-7 gap-2">
                        {DAYS_OF_WEEK.map((day) => {
                          const isSelected = field.value?.includes(day.value);
                          return (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => {
                                const currentValue = field.value || [];
                                if (isSelected) {
                                  field.onChange(
                                    currentValue.filter((d) => d !== day.value),
                                  );
                                } else {
                                  field.onChange([...currentValue, day.value]);
                                }
                              }}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                                isSelected
                                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-600 text-white shadow-lg"
                                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              <span className="text-xs font-bold">
                                {day.label}
                              </span>
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 mt-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.daysOfWeek && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.daysOfWeek.message}
                    </p>
                  )}
                </div>

                {/* Time From */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      onClick={handleDateClicker}
                      type="time"
                      {...register("timeFrom")}
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.timeFrom ? "border-red-300" : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.timeFrom && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.timeFrom.message}
                    </p>
                  )}
                </div>

                {/* Time To */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      onClick={handleDateClicker}
                      type="time"
                      {...register("timeTo")}
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.timeTo ? "border-red-300" : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.timeTo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.timeTo.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Capacity Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Capacity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Max Students */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Maximum Students <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      {...register("maxStudents")}
                      placeholder="e.g., 30"
                      className={`w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 ${
                        errors.maxStudents
                          ? "border-red-300"
                          : "border-gray-200"
                      } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.maxStudents && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.maxStudents.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/classes")}
                className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 group relative cursor-pointer flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                    <span className="relative z-10">Adding Class...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Add Class</span>
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
              <h3 className="font-semibold text-blue-900 mb-1">Quick Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Select the course this class belongs to</li>
                <li>• Click on the days to select when the class meets</li>
                <li>• End date and time must be after start date and time</li>
                <li>• At least one day must be selected</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
