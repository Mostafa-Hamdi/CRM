"use client";

import { useGetLeadFollowupQuery } from "@/store/api/apiSlice";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: followUps, isLoading, error } = useGetLeadFollowupQuery({ id });

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if follow-up is overdue
  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 rotate-3 transition-transform hover:rotate-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                  Lead Follow-ups
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  View all follow-up activities for this lead
                </p>
              </div>
            </div>

            <Link
              href="/leads"
              className="group relative cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-12 shadow-xl shadow-blue-500/10">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Loading follow-ups...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 shadow-xl shadow-blue-500/10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Error Loading Follow-ups
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't load the follow-up information. Please try again.
              </p>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!followUps || followUps.length === 0) && (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-12 shadow-xl shadow-blue-500/10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Follow-ups Yet
              </h3>
              <p className="text-gray-600 mb-6">
                This lead doesn't have any scheduled follow-ups at the moment.
              </p>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Go Back to Leads
              </button>
            </div>
          </div>
        )}

        {/* Follow-ups List */}
        {!isLoading && !error && followUps && followUps.length > 0 && (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                Follow-up History
                <span className="text-lg font-normal text-gray-500">
                  ({followUps.length}{" "}
                  {followUps.length === 1 ? "entry" : "entries"})
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {followUps.map((followUp: any, index: number) => {
                const overdueStatus = isOverdue(followUp.followUpDate);

                return (
                  <div
                    key={followUp.id || index}
                    className={`relative bg-gradient-to-r ${
                      overdueStatus
                        ? "from-red-50 to-orange-50/50 border-red-200"
                        : "from-gray-50 to-blue-50/50 border-gray-200"
                    } border-2 rounded-2xl p-6 hover:shadow-lg transition-all`}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      {overdueStatus ? (
                        <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Scheduled
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pr-24">
                      {/* Lead Information */}
                      <div className="space-y-2">
                        {followUp.leadName && (
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-gray-900 text-lg">
                              {followUp.leadName}
                            </span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          {followUp.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{followUp.phone}</span>
                            </div>
                          )}
                          {followUp.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{followUp.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Follow-up Date & Time */}
                      <div className="flex flex-wrap items-center gap-4 p-4 bg-white/80 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Follow-up Date
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(followUp.followUpDate)}
                            </p>
                          </div>
                        </div>

                        <div className="h-8 w-px bg-gray-300" />

                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Time
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatTime(followUp.followUpDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {followUp.note && (
                        <div className="p-4 bg-white/80 rounded-xl border border-gray-200">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 font-medium mb-1">
                                Notes
                              </p>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {followUp.note}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Details */}
                      {followUp.createdAt && (
                        <div className="text-xs text-gray-500">
                          Created: {formatDate(followUp.createdAt)} at{" "}
                          {formatTime(followUp.createdAt)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Card */}
        {!isLoading && !error && followUps && followUps.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Follow-up Tips
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • Overdue follow-ups are marked in red and need immediate
                    attention
                  </li>
                  <li>
                    • Regular follow-ups help maintain strong relationships with
                    leads
                  </li>
                  <li>• Review notes before each follow-up for context</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
