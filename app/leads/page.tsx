"use client";

import {
  useConvertStatusMutation,
  useDeleteLeadMutation,
  useGetCoursesQuery,
  useGetFilteredLeadsMutation,
  useGetLeadsQuery,
} from "@/store/api/apiSlice";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Users,
  Edit2,
  Trash2,
  Sparkles,
  Phone,
  Mail,
  Tag,
  Calendar,
  ChevronDown,
  User,
  TrendingUp,
  Filter,
  CheckCircle,
  XCircle,
  Pause,
  FileText,
  ArrowRight,
  X,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

interface Lead {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  status: number;
  source: string;
  assignedTo: string | null;
  createdAt: string;
}

interface Course {
  id: number;
  name: string;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<number>(0);
  const [displayedLeads, setDisplayedLeads] = useState<Lead[]>([]);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<string>("");

  const { data: leadsResponse, isLoading } = useGetLeadsQuery();
  const leads = leadsResponse?.data;
  const { data: courses, isLoading: coursesIsLoading } = useGetCoursesQuery();
  const [deleteLead] = useDeleteLeadMutation();
  const [convertStatus, { isLoading: isConverting }] =
    useConvertStatusMutation();
  const [getFilteredLeads, { isLoading: isFilterLoading }] =
    useGetFilteredLeadsMutation();

  // Status mapping
  const statusMap: { [key: number]: string } = {
    1: "New",
    2: "Contacted",
    3: "Interested",
    4: "Followup",
    5: "Cold",
    6: "Lost",
    7: "Converted",
  };

  // Initialize displayed leads
  useEffect(() => {
    if (leads) {
      setDisplayedLeads(leads);
    }
  }, [leads]);

  // Filter by status
  const handleStatusFilter = async (statusId: number) => {
    setActiveFilter(statusId);

    if (statusId === 0) {
      setDisplayedLeads(leads || []);
    } else {
      try {
        const filtered = await getFilteredLeads({ statusId }).unwrap();
        setDisplayedLeads(filtered);
      } catch (err) {
        console.error("Failed to filter leads:", err);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to filter leads.",
        });
      }
    }
  };

  // Search filter
  const filteredLeads = useMemo(() => {
    if (!displayedLeads) return [];

    const query = searchQuery.toLowerCase();
    return displayedLeads.filter(
      (lead: Lead) =>
        lead.fullName.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.source.toLowerCase().includes(query) ||
        statusMap[lead.status]?.toLowerCase().includes(query),
    );
  }, [displayedLeads, searchQuery]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "😢 Are you sure you want to delete this lead?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#e5e7eb",
    });

    if (!result.isConfirmed) return;
    try {
      await deleteLead({ id }).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Lead has been deleted successfully.",
        timer: 2000,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to delete lead.",
      });
    }
  };

  // Open convert modal
  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead);
    setSelectedCourseId(0);
    setPaidAmount("");
    setShowConvertModal(true);
  };

  // Close convert modal
  const handleCloseModal = () => {
    setShowConvertModal(false);
    setSelectedLead(null);
    setSelectedCourseId(0);
    setPaidAmount("");
  };

  // Submit conversion
  const handleConvertSubmit = async () => {
    if (!selectedLead) return;

    if (selectedCourseId === 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing Course",
        text: "Please select a course.",
      });
      return;
    }

    if (!paidAmount || parseFloat(paidAmount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Amount",
        text: "Please enter a valid paid amount.",
      });
      return;
    }

    try {
      await convertStatus({
        id: selectedLead.id,
        courseId: selectedCourseId,
        paidAmount: parseFloat(paidAmount),
      }).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Converted!",
        text: "Lead has been converted successfully.",
        timer: 2000,
      });

      handleCloseModal();
    } catch (err) {
      let message = "Failed to convert lead.";

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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: number) => {
    const colors: { [key: number]: string } = {
      1: "from-blue-100 to-cyan-100 border-blue-200 text-blue-700",
      2: "from-purple-100 to-pink-100 border-purple-200 text-purple-700",
      3: "from-green-100 to-emerald-100 border-green-200 text-green-700",
      4: "from-yellow-100 to-orange-100 border-yellow-200 text-yellow-700",
      5: "from-gray-100 to-slate-100 border-gray-200 text-gray-700",
      6: "from-red-100 to-rose-100 border-red-200 text-red-700",
      7: "from-emerald-100 to-teal-100 border-emerald-200 text-emerald-700",
    };
    return (
      colors[status] ||
      "from-gray-100 to-gray-100 border-gray-200 text-gray-700"
    );
  };

  // Generate random colors for lead icons
  const getColorForLead = (index: number) => {
    const colors = [
      "from-blue-600 to-cyan-600",
      "from-purple-600 to-pink-600",
      "from-green-600 to-emerald-600",
      "from-orange-600 to-red-600",
      "from-indigo-600 to-blue-600",
      "from-rose-600 to-pink-600",
      "from-teal-600 to-cyan-600",
      "from-amber-600 to-orange-600",
    ];
    return colors[index % colors.length];
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
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                  Leads
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Manage and track your sales leads pipeline
                </p>
              </div>
            </div>

            <Link
              href={"/leads/add"}
              className="group relative cursor-pointer flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Add Lead</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-1">
                  {leads?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">New</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                  {leads?.filter((l: Lead) => l.status === 1).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Converted</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">
                  {leads?.filter((l: Lead) => l.status === 7).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Found</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-1">
                  {filteredLeads.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-blue-500/10">
          <div className="flex flex-wrap gap-3">
            {[
              {
                id: 0,
                label: "All",
                icon: Filter,
                color: "from-gray-600 to-gray-700",
              },
              {
                id: 1,
                label: "New",
                icon: Tag,
                color: "from-blue-600 to-cyan-600",
              },
              {
                id: 2,
                label: "Contacted",
                icon: Phone,
                color: "from-purple-600 to-pink-600",
              },
              {
                id: 3,
                label: "Interested",
                icon: Users,
                color: "from-green-600 to-emerald-600",
              },
              {
                id: 4,
                label: "Followup",
                icon: Calendar,
                color: "from-yellow-600 to-orange-600",
              },
              {
                id: 5,
                label: "Cold",
                icon: Pause,
                color: "from-gray-600 to-slate-600",
              },
              {
                id: 6,
                label: "Lost",
                icon: XCircle,
                color: "from-red-600 to-rose-600",
              },
              {
                id: 7,
                label: "Converted",
                icon: CheckCircle,
                color: "from-emerald-600 to-teal-600",
              },
            ].map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  onClick={() => handleStatusFilter(filter.id)}
                  disabled={isFilterLoading}
                  className={`group relative cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${filter.color} text-white shadow-lg hover:shadow-xl`
                      : "bg-white/50 text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-white"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{filter.label}</span>
                  {filter.id !== 0 && (
                    <span
                      className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive ? "bg-white/20" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {leads?.filter((l: Lead) => l.status === filter.id)
                        .length || 0}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-blue-500/10">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, phone, email or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 border border-blue-400 rounded-xl shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white">
                {filteredLeads.length} Leads
              </span>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-xl shadow-blue-500/10">
          {isLoading || isFilterLoading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                {searchQuery
                  ? "No leads found matching your search"
                  : "No leads yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 border-b border-blue-400/30">
                  <tr>
                    <th className="px-6 py-5 text-left">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Lead Info
                      </span>
                    </th>
                    <th className="px-6 py-5 text-left">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Contact
                      </span>
                    </th>
                    <th className="px-6 py-5 text-left">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Source
                      </span>
                    </th>
                    <th className="px-6 py-5 text-left">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Status
                      </span>
                    </th>
                    <th className="px-6 py-5 text-left">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Assigned To
                      </span>
                    </th>
                    <th className="px-6 py-5 text-left">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Created Date
                      </span>
                    </th>
                    <th className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Notes
                      </span>
                    </th>
                    <th className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Convert
                      </span>
                    </th>
                    <th className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Operations
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead: Lead, index: number) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/30 transition-all duration-200"
                    >
                      {/* Lead Info */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${getColorForLead(
                              index,
                            )} rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30`}
                          >
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-base">
                              {lead.fullName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-700 text-sm font-medium">
                              {lead.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-600 text-xs">
                              {lead.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold shadow-sm">
                          <Tag className="w-3 h-3" />
                          {lead.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r border rounded-lg text-xs font-bold shadow-sm ${getStatusColor(
                            lead.status,
                          )}`}
                        >
                          {statusMap[lead.status]}
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td className="px-6 py-5">
                        {lead.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-gray-700 text-sm font-medium">
                              {lead.assignedTo}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 text-sm font-medium">
                            {formatDate(lead.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center">
                          <Link
                            href={`/leads/notes/${lead.id}`}
                            className="cursor-pointer p-2.5 text-amber-600 hover:text-white bg-amber-50 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 group"
                            title="View notes"
                          >
                            <FileText className="w-5 h-5" />
                          </Link>
                        </div>
                      </td>

                      {/* Convert */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleConvertClick(lead)}
                            disabled={lead.status === 7}
                            className={`cursor-pointer p-2.5 rounded-xl transition-all duration-300 group ${
                              lead.status === 7
                                ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                                : "text-emerald-600 hover:text-white bg-emerald-50 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
                            }`}
                            title={
                              lead.status === 7
                                ? "Already converted"
                                : "Convert lead"
                            }
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/leads/edit/${lead.id}`}
                            className="cursor-pointer p-2.5 text-blue-600 hover:text-white bg-blue-50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 group"
                            title="Edit lead"
                          >
                            <Edit2 className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="cursor-pointer p-2.5 text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 group"
                            title="Delete lead"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Convert Modal */}
      {showConvertModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600  p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Convert Lead
                    </h2>
                    <p className="text-emerald-100 text-sm mt-1">
                      {selectedLead.fullName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Course Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCourseId}
                    onChange={(e) =>
                      setSelectedCourseId(parseInt(e.target.value))
                    }
                    className="w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value={0}>Choose a course...</option>
                    {courses?.map((course: Course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Paid Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Paid Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 border-gray-200 rounded-xl pl-8 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConvertSubmit}
                disabled={isConverting}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600  text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Convert Lead</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Page;
