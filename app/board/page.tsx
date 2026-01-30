"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  Users,
  DollarSign,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  MessageCircle,
  PhoneCall,
  FileText,
  AlertTriangle,
  Clock,
  Tag,
  Flame,
  Zap,
  Circle,
  CheckCircle2,
  X,
  Save,
  UserPlus,
  StickyNote,
} from "lucide-react";
import Link from "next/link";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  assignedTo: string;
  assignedToAvatar?: string;
  dealValue: number;
  stage: string;
  createdAt: string;
  lastActivity: string;
  priority: "low" | "medium" | "high" | "urgent";
  source: string;
  tags: string[];
  budget: number;
  hasCall: boolean;
  hasMessage: boolean;
  hasNote: boolean;
}

// Sales stages with WIP limits
const STAGES = [
  {
    id: "new",
    name: "New",
    color: "from-gray-600 to-slate-600",
    wipLimit: 10,
  },
  {
    id: "contacted",
    name: "Contacted",
    color: "from-blue-600 to-cyan-600",
    wipLimit: 8,
  },
  {
    id: "qualified",
    name: "Qualified",
    color: "from-purple-600 to-pink-600",
    wipLimit: 6,
  },
  {
    id: "proposal",
    name: "Proposal",
    color: "from-indigo-600 to-blue-600",
    wipLimit: 5,
  },
  {
    id: "negotiation",
    name: "Negotiation",
    color: "from-orange-600 to-amber-600",
    wipLimit: 4,
  },
  {
    id: "won",
    name: "Won",
    color: "from-green-600 to-emerald-600",
    wipLimit: null,
  },
  {
    id: "lost",
    name: "Lost",
    color: "from-red-600 to-rose-600",
    wipLimit: null,
  },
];

const PRIORITY_CONFIG = {
  urgent: {
    color: "bg-red-500",
    label: "Urgent",
    icon: Flame,
    textColor: "text-red-700",
  },
  high: {
    color: "bg-orange-500",
    label: "High",
    icon: Zap,
    textColor: "text-orange-700",
  },
  medium: {
    color: "bg-yellow-500",
    label: "Medium",
    icon: Circle,
    textColor: "text-yellow-700",
  },
  low: {
    color: "bg-green-500",
    label: "Low",
    icon: Circle,
    textColor: "text-green-700",
  },
};

// Mock data - Enhanced with new fields
const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "+1234567890",
    company: "Tech Corp",
    assignedTo: "Sarah Johnson",
    assignedToAvatar: "SJ",
    dealValue: 50000,
    stage: "new",
    createdAt: "2024-01-15",
    lastActivity: "2024-01-29T14:30:00",
    priority: "high",
    source: "Website",
    tags: ["Enterprise", "Tech"],
    budget: 60000,
    hasCall: true,
    hasMessage: false,
    hasNote: true,
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1234567891",
    company: "Innovation Inc",
    assignedTo: "Mike Wilson",
    assignedToAvatar: "MW",
    dealValue: 75000,
    stage: "contacted",
    createdAt: "2024-01-16",
    lastActivity: "2024-01-30T09:15:00",
    priority: "urgent",
    source: "Referral",
    tags: ["Hot Lead", "SaaS"],
    budget: 80000,
    hasCall: true,
    hasMessage: true,
    hasNote: false,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+1234567892",
    company: "Global Solutions",
    assignedTo: "Sarah Johnson",
    assignedToAvatar: "SJ",
    dealValue: 120000,
    stage: "qualified",
    createdAt: "2024-01-17",
    lastActivity: "2024-01-29T16:45:00",
    priority: "medium",
    source: "LinkedIn",
    tags: ["Consulting"],
    budget: 150000,
    hasCall: false,
    hasMessage: true,
    hasNote: true,
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    phone: "+1234567893",
    company: "Future Tech",
    assignedTo: "John Davis",
    assignedToAvatar: "JD",
    dealValue: 95000,
    stage: "proposal",
    createdAt: "2024-01-18",
    lastActivity: "2024-01-28T11:20:00",
    priority: "high",
    source: "Cold Call",
    tags: ["AI", "ML"],
    budget: 100000,
    hasCall: true,
    hasMessage: true,
    hasNote: true,
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "+1234567894",
    company: "Smart Systems",
    assignedTo: "Mike Wilson",
    assignedToAvatar: "MW",
    dealValue: 180000,
    stage: "negotiation",
    createdAt: "2024-01-19",
    lastActivity: "2024-01-30T10:00:00",
    priority: "urgent",
    source: "Partner",
    tags: ["Enterprise", "Strategic"],
    budget: 200000,
    hasCall: true,
    hasMessage: false,
    hasNote: true,
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana@example.com",
    phone: "+1234567895",
    company: "Enterprise Co",
    assignedTo: "Sarah Johnson",
    assignedToAvatar: "SJ",
    dealValue: 250000,
    stage: "won",
    createdAt: "2024-01-20",
    lastActivity: "2024-01-29T15:30:00",
    priority: "low",
    source: "Referral",
    tags: ["Closed"],
    budget: 250000,
    hasCall: true,
    hasMessage: true,
    hasNote: true,
  },
  {
    id: 7,
    name: "Eve Adams",
    email: "eve@example.com",
    phone: "+1234567896",
    company: "StartUp Ltd",
    assignedTo: "John Davis",
    assignedToAvatar: "JD",
    dealValue: 35000,
    stage: "lost",
    createdAt: "2024-01-21",
    lastActivity: "2024-01-25T13:00:00",
    priority: "low",
    source: "Website",
    tags: ["Budget Issue"],
    budget: 20000,
    hasCall: false,
    hasMessage: true,
    hasNote: true,
  },
  {
    id: 8,
    name: "Frank Miller",
    email: "frank@example.com",
    phone: "+1234567897",
    company: "Big Corp",
    assignedTo: "Mike Wilson",
    assignedToAvatar: "MW",
    dealValue: 145000,
    stage: "new",
    createdAt: "2024-01-22",
    lastActivity: "2024-01-29T08:45:00",
    priority: "medium",
    source: "Conference",
    tags: ["Finance"],
    budget: 160000,
    hasCall: false,
    hasMessage: false,
    hasNote: false,
  },
];

// Saved filters
const SAVED_FILTERS = [
  { id: "hot", name: "🔥 My Hot Leads", icon: Flame },
  { id: "recent", name: "⚡ Recent Activity", icon: Clock },
  { id: "high-value", name: "💰 High Value", icon: DollarSign },
];

interface ConfirmationDialog {
  show: boolean;
  type: "backward" | "lost" | null;
  lead: Lead | null;
  targetStage: string;
  reason?: string;
}

const Page = () => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [showLeadMenu, setShowLeadMenu] = useState<number | null>(null);
  const [showQuickAction, setShowQuickAction] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationDialog>({
    show: false,
    type: null,
    lead: null,
    targetStage: "",
  });

  // Filter states
  const [filters, setFilters] = useState({
    owner: "",
    source: "",
    priority: "",
    minBudget: "",
    lastActivityDays: "",
  });

  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    let result = leads;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.assignedTo.toLowerCase().includes(query),
      );
    }

    // Owner filter
    if (filters.owner) {
      result = result.filter((lead) => lead.assignedTo === filters.owner);
    }

    // Source filter
    if (filters.source) {
      result = result.filter((lead) => lead.source === filters.source);
    }

    // Priority filter
    if (filters.priority) {
      result = result.filter((lead) => lead.priority === filters.priority);
    }

    // Budget filter
    if (filters.minBudget) {
      result = result.filter(
        (lead) => lead.budget >= parseInt(filters.minBudget),
      );
    }

    // Last activity filter
    if (filters.lastActivityDays) {
      const days = parseInt(filters.lastActivityDays);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter(
        (lead) => new Date(lead.lastActivity) >= cutoffDate,
      );
    }

    return result;
  }, [leads, searchQuery, filters]);

  // Group leads by stage
  const leadsByStage = useMemo(() => {
    const grouped: { [key: string]: Lead[] } = {};
    STAGES.forEach((stage) => {
      grouped[stage.id] = filteredLeads.filter(
        (lead) => lead.stage === stage.id,
      );
    });
    return grouped;
  }, [filteredLeads]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const totalValue = leads.reduce((sum, lead) => sum + lead.dealValue, 0);
    const wonDeals = leads.filter((lead) => lead.stage === "won").length;
    const wonValue = leads
      .filter((lead) => lead.stage === "won")
      .reduce((sum, lead) => sum + lead.dealValue, 0);

    return { totalLeads, totalValue, wonDeals, wonValue };
  }, [leads]);

  // Get stage index for comparison
  const getStageIndex = (stageId: string) => {
    return STAGES.findIndex((s) => s.id === stageId);
  };

  // Check if move is backward
  const isBackwardMove = (fromStage: string, toStage: string) => {
    return getStageIndex(toStage) < getStageIndex(fromStage);
  };

  // Drag and drop handlers
  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (!draggedLead) return;

    // Check if moving to lost stage
    if (stageId === "lost") {
      setConfirmation({
        show: true,
        type: "lost",
        lead: draggedLead,
        targetStage: stageId,
      });
      return;
    }

    // Check if backward move
    if (isBackwardMove(draggedLead.stage, stageId)) {
      setConfirmation({
        show: true,
        type: "backward",
        lead: draggedLead,
        targetStage: stageId,
      });
      return;
    }

    // Normal move
    confirmStageChange(draggedLead, stageId);
  };

  const confirmStageChange = (
    lead: Lead,
    newStage: string,
    reason?: string,
  ) => {
    setLeads((prevLeads) =>
      prevLeads.map((l) =>
        l.id === lead.id
          ? {
              ...l,
              stage: newStage,
              lastActivity: new Date().toISOString(),
            }
          : l,
      ),
    );

    // Auto-log activity
    console.log(`Activity logged: ${lead.name} moved to ${newStage}`, {
      reason,
      timestamp: new Date().toISOString(),
    });

    setDraggedLead(null);
    setConfirmation({ show: false, type: null, lead: null, targetStage: "" });
  };

  // Quick actions
  const handleCall = (lead: Lead) => {
    console.log("Calling:", lead.phone);
    // Implement call functionality
  };

  const handleWhatsApp = (lead: Lead) => {
    window.open(`https://wa.me/${lead.phone.replace(/\+/g, "")}`, "_blank");
  };

  const handleAddNote = (lead: Lead) => {
    console.log("Adding note for:", lead.name);
    // Implement note functionality
  };

  const handleAssignOwner = (lead: Lead) => {
    console.log("Assigning owner for:", lead.name);
    // Implement assign owner functionality
  };

  // Apply saved filter
  const applySavedFilter = (filterId: string) => {
    switch (filterId) {
      case "hot":
        setFilters({
          ...filters,
          priority: "urgent",
        });
        break;
      case "recent":
        setFilters({
          ...filters,
          lastActivityDays: "7",
        });
        break;
      case "high-value":
        setFilters({
          ...filters,
          minBudget: "100000",
        });
        break;
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      owner: "",
      source: "",
      priority: "",
      minBudget: "",
      lastActivityDays: "",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Get unique values for filters
  const uniqueOwners = Array.from(new Set(leads.map((l) => l.assignedTo)));
  const uniqueSources = Array.from(new Set(leads.map((l) => l.source)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-[2000px] mx-auto space-y-6">
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
                  Sales Pipeline
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Manage your leads through the sales funnel
                </p>
              </div>
            </div>

            <Link
              href="/leads/add"
              className="group relative cursor-pointer flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Add Lead</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-1">
                  {stats.totalLeads}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-green-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Won Deals</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                  {stats.wonDeals}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Pipeline Value
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-1">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-orange-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Won Value</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mt-1">
                  {formatCurrency(stats.wonValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl p-6 shadow-lg shadow-blue-500/10">
          <div className="space-y-4">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name, company, email, or salesperson..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gradient-to-r from-gray-50 to-blue-50/50 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3.5 ${showFilters ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"} border-2 font-semibold rounded-xl hover:border-gray-300 transition-all cursor-pointer flex items-center gap-2`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Saved Filters */}
            <div className="flex flex-wrap gap-2">
              {SAVED_FILTERS.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => applySavedFilter(filter.id)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-700 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-all cursor-pointer flex items-center gap-2 text-sm font-medium"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{filter.name}</span>
                  </button>
                );
              })}
              {(filters.owner ||
                filters.source ||
                filters.priority ||
                filters.minBudget ||
                filters.lastActivityDays) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-all cursor-pointer flex items-center gap-2 text-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner
                  </label>
                  <select
                    value={filters.owner}
                    onChange={(e) =>
                      setFilters({ ...filters, owner: e.target.value })
                    }
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">All Owners</option>
                    {uniqueOwners.map((owner) => (
                      <option key={owner} value={owner}>
                        {owner}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source
                  </label>
                  <select
                    value={filters.source}
                    onChange={(e) =>
                      setFilters({ ...filters, source: e.target.value })
                    }
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">All Sources</option>
                    {uniqueSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) =>
                      setFilters({ ...filters, priority: e.target.value })
                    }
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Budget
                  </label>
                  <input
                    type="number"
                    value={filters.minBudget}
                    onChange={(e) =>
                      setFilters({ ...filters, minBudget: e.target.value })
                    }
                    placeholder="e.g., 50000"
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Activity
                  </label>
                  <select
                    value={filters.lastActivityDays}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        lastActivityDays: e.target.value,
                      })
                    }
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">All Time</option>
                    <option value="1">Last 24 hours</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-4 min-w-full">
            {STAGES.map((stage) => {
              const stageLeads = leadsByStage[stage.id] || [];
              const stageValue = stageLeads.reduce(
                (sum, lead) => sum + lead.dealValue,
                0,
              );
              const isOverLimit =
                stage.wipLimit && stageLeads.length > stage.wipLimit;

              return (
                <div
                  key={stage.id}
                  className="flex-shrink-0 w-80"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(stage.id)}
                >
                  {/* Stage Header */}
                  <div
                    className={`bg-white/70 backdrop-blur-2xl border ${isOverLimit ? "border-red-300" : "border-white/60"} rounded-2xl p-4 mb-4 shadow-lg shadow-blue-500/10`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full bg-gradient-to-r ${stage.color}`}
                        />
                        <h3 className="font-bold text-gray-900">
                          {stage.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">
                          {stageLeads.length}
                          {stage.wipLimit && `/${stage.wipLimit}`}
                        </span>
                        {isOverLimit && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">
                      {formatCurrency(stageValue)}
                    </p>
                    {isOverLimit && (
                      <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Stage over capacity - focus needed
                      </p>
                    )}
                  </div>

                  {/* Stage Cards */}
                  <div className="space-y-3 min-h-[400px]">
                    {stageLeads.map((lead) => {
                      const priorityConfig = PRIORITY_CONFIG[lead.priority];
                      const PriorityIcon = priorityConfig.icon;

                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => handleDragStart(lead)}
                          className="bg-white/70 backdrop-blur-2xl border-l-4 border-white/60 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-grab active:cursor-grabbing group relative"
                          style={{
                            borderLeftColor:
                              priorityConfig.color.split("-")[1] === "red"
                                ? "#ef4444"
                                : priorityConfig.color.split("-")[1] ===
                                    "orange"
                                  ? "#f97316"
                                  : priorityConfig.color.split("-")[1] ===
                                      "yellow"
                                    ? "#eab308"
                                    : "#22c55e",
                          }}
                        >
                          {/* Lead Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900 text-base">
                                  {lead.name}
                                </h4>
                                <PriorityIcon
                                  className={`w-4 h-4 ${priorityConfig.textColor}`}
                                />
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Building2 className="w-3.5 h-3.5" />
                                <span>{lead.company}</span>
                              </div>
                            </div>

                            <div className="relative">
                              <button
                                onClick={() =>
                                  setShowLeadMenu(
                                    showLeadMenu === lead.id ? null : lead.id,
                                  )
                                }
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>

                              {showLeadMenu === lead.id && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-xl z-10 py-2 w-40">
                                  <Link
                                    href={`/leads/${lead.id}`}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700 text-sm cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>View</span>
                                  </Link>
                                  <Link
                                    href={`/leads/${lead.id}/edit`}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700 text-sm cursor-pointer"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    <span>Edit</span>
                                  </Link>
                                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 text-sm w-full cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Last Activity */}
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{getTimeAgo(lead.lastActivity)}</span>
                          </div>

                          {/* Deal Value */}
                          <div className="mb-3 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-bold text-green-700">
                                {formatCurrency(lead.dealValue)}
                              </span>
                            </div>
                          </div>

                          {/* Tags */}
                          {lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {lead.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md flex items-center gap-1"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Activity Icons */}
                          <div className="flex items-center gap-2 mb-3">
                            {lead.hasCall && (
                              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                                <PhoneCall className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                            {lead.hasMessage && (
                              <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-purple-600" />
                              </div>
                            )}
                            {lead.hasNote && (
                              <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-orange-600" />
                              </div>
                            )}
                          </div>

                          {/* Assigned To */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {lead.assignedToAvatar}
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {lead.assignedTo}
                              </span>
                            </div>
                          </div>

                          {/* Quick Actions - Show on Hover */}
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                setShowQuickAction(
                                  showQuickAction === lead.id ? null : lead.id,
                                )
                              }
                              className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              <Zap className="w-4 h-4" />
                            </button>

                            {showQuickAction === lead.id && (
                              <div className="absolute right-0 bottom-10 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-2 w-48">
                                {/* <button
                                  onClick={() => handleCall(lead)}
                                  className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 text-gray-700 text-sm w-full cursor-pointer"
                                >
                                  <PhoneCall className="w-4 h-4 text-blue-600" />
                                  <span>Call</span>
                                </button> */}
                                <button
                                  onClick={() => handleWhatsApp(lead)}
                                  className="flex items-center gap-3 px-4 py-2 hover:bg-green-50 text-gray-700 text-sm w-full cursor-pointer"
                                >
                                  <MessageCircle className="w-4 h-4 text-green-600" />
                                  <span>WhatsApp</span>
                                </button>
                                <button
                                  onClick={() => handleAddNote(lead)}
                                  className="flex items-center gap-3 px-4 py-2 hover:bg-orange-50 text-gray-700 text-sm w-full cursor-pointer"
                                >
                                  <StickyNote className="w-4 h-4 text-orange-600" />
                                  <span>Add Note</span>
                                </button>
                                <button
                                  onClick={() => handleAssignOwner(lead)}
                                  className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 text-gray-700 text-sm w-full cursor-pointer"
                                >
                                  <UserPlus className="w-4 h-4 text-purple-600" />
                                  <span>Assign Owner</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {stageLeads.length === 0 && (
                      <div className="bg-white/50 backdrop-blur-xl border border-dashed border-gray-300 rounded-2xl p-8 text-center">
                        <p className="text-gray-400 text-sm">Drop leads here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmation.show && confirmation.lead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {confirmation.type === "lost"
                    ? "Mark as Lost?"
                    : "Move Backward?"}
                </h3>
                <p className="text-sm text-gray-600">
                  {confirmation.type === "lost"
                    ? "This lead will be marked as lost"
                    : "You're moving this lead to an earlier stage"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>{confirmation.lead.name}</strong> from{" "}
                {confirmation.lead.company}
              </p>
              <p className="text-sm text-gray-600">
                Moving to:{" "}
                <strong>
                  {STAGES.find((s) => s.id === confirmation.targetStage)?.name}
                </strong>
              </p>
            </div>

            {confirmation.type === "lost" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for loss (optional)
                </label>
                <textarea
                  value={confirmation.reason || ""}
                  onChange={(e) =>
                    setConfirmation({
                      ...confirmation,
                      reason: e.target.value,
                    })
                  }
                  placeholder="e.g., Budget constraints, went with competitor..."
                  className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all resize-none"
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setConfirmation({
                    show: false,
                    type: null,
                    lead: null,
                    targetStage: "",
                  })
                }
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  confirmStageChange(
                    confirmation.lead!,
                    confirmation.targetStage,
                    confirmation.reason,
                  )
                }
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
