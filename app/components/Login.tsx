"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Package,
  ArrowRight,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginMutation } from "@/store/api/apiSlice";

// Define Yup validation schema
const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function LuxuryLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      // Handle success (e.g., redirect or show success message)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[140px]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:block space-y-10">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-2xl shadow-lg shadow-blue-500/30">
                  <Package className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  InventoryPro
                </h1>
                <p className="text-slate-600 text-sm font-medium tracking-wider mt-0.5">
                  ENTERPRISE EDITION
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="space-y-6">
              <h2 className="text-6xl font-black text-slate-900 leading-tight">
                Next-generation
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                  inventory control
                </span>
              </h2>

              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Enterprise-grade platform trusted by Fortune 500 companies to
                manage billions in inventory assets.
              </p>
            </div>

            {/* Feature stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="text-3xl font-black text-slate-900">99.9%</div>
                <div className="text-sm text-slate-600 font-medium">
                  Uptime SLA
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-black text-slate-900">500K+</div>
                <div className="text-sm text-slate-600 font-medium">
                  Daily Transactions
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-black text-slate-900">24/7</div>
                <div className="text-sm text-slate-600 font-medium">
                  Support
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-slate-600 font-medium">
                  SOC 2 Certified
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-slate-600 font-medium">
                  Real-time Sync
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-slate-600 font-medium">
                  Global CDN
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Glass card */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />

              {/* Card */}
              <div className="relative bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10">
                {/* Header */}
                <div className="px-10 pt-10 pb-8 border-b border-slate-200/60">
                  <h3 className="text-3xl font-black text-slate-900 mb-2">
                    Welcome back
                  </h3>
                  <p className="text-slate-600">
                    Sign in to access your dashboard
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-10 space-y-6"
                >
                  {/* Email */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="you@company.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-blue-600 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Enter your password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group/check">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 group-hover/check:text-slate-900 transition-colors font-medium">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer relative w-full group/btn overflow-hidden hover:scale-105 transition duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl transition-transform group-hover/btn:scale-100 shadow-lg shadow-blue-500/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-center gap-3 px-6 py-4 text-white font-bold">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Divider */}
                  {/* <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-slate-500 font-medium">
                        New to InventoryPro?
                      </span>
                    </div>
                  </div> */}

                  {/* Create account */}
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold transition-all group/link"
                  >
                    <span>Create an account</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </form>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-slate-500 text-sm mt-8">
              © 2026 InventoryPro · Secured by enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
