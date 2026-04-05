import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Download,
  Search,
  UserMinus,
  Upload,
} from "lucide-react";
import StandardModal from "../Modal/StandardModal";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const StandardsPage = () => {
  const [standards, setStandards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(25);
  
  // Dynamic Lists for Dropdowns
  const [availableDepts, setAvailableDepts] = useState([]);
  const [availablePublishers, setAvailablePublishers] = useState([]);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [publisherFilter, setPublisherFilter] = useState(""); // Changed from categoryFilter to match your intent
  const [statusFilter, setStatusFilter] = useState("");

  // 1. Fetch Dynamic Filter Lists (Run only once on mount)
  const fetchFilters = async () => {
    try {
      const [deptRes, pubRes] = await Promise.all([
        api.get("/standards/unique-values/department"),
        api.get("/standards/unique-values/publisher"),
      ]);

      if (deptRes.data.success) setAvailableDepts(deptRes.data.data);
      if (pubRes.data.success) setAvailablePublishers(pubRes.data.data);
    } catch (error) {
      console.error("Error loading filters", error);
    }
  };

  // 2. Fetch the Table Data
  const fetchStandards = async () => {
    try {
      const response = await api.get("/standards", {
        params: {
          page: currentPage,
          limit: limit,
          search: search,
          department: departmentFilter,
          publisher: publisherFilter, // Use publisherFilter here
          status: statusFilter,
        },
      });

      if (response.data?.success) {
        setStandards(response.data.data || []);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching standards:", error);
      setStandards([]);
    }
  };

  // INITIAL LOAD: Fetch dropdown options once
  useEffect(() => {
    fetchFilters();
  }, []);

  // DATA LOAD: Re-fetch table whenever filters or page change
  useEffect(() => {
    fetchStandards();
  }, [currentPage, search, departmentFilter, publisherFilter, statusFilter]);

  // RESET PAGE: Go back to page 1 if search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, departmentFilter, publisherFilter, statusFilter]);

  // 🔥 Delete Standard
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this standard?")) {
      try {
        await api.delete(`/standards/${id}`);
        fetchStandards(currentPage);
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete");
      }
    }
  };

  const handleEditClick = (id) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const getVisiblePages = () => {
    const pages = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      {/* ================= HEADER (NO WHITE BG) ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-amber-400" />
            Standards Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage engineering standards, categories and lifecycle status.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-amber-400 text-white rounded-md hover:bg-amber-300 transition shadow-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Standard
          </button>

          <button
            onClick={() => navigate("/reports")}
            className="flex items-center px-4 py-2 border border-amber-400 text-amber-400 rounded-md hover:bg-indigo-50 transition shadow-sm font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Reports
          </button>

          <button
            onClick={() => navigate("/uploadExcel")}
            className="flex items-center px-4 py-2 border border-amber-400 text-amber-400 rounded-md hover:bg-indigo-50 transition shadow-sm font-medium"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </button>
        </div>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ICN, Standard No, Title or Requisition No."
              className="pl-9 pr-3 py-2 w-full rounded-md border border-gray-200 text-sm focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Department */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm min-w-[180px]"
          >
            <option value="">All Departments</option>
            {availableDepts.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Publisher */}
          <select
            value={publisherFilter}
            onChange={(e) => setPublisherFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm min-w-[180px]"
          >
            <option value="">All Publishers</option>
            {availablePublishers.map((pub) => (
              <option key={pub} value={pub}>{pub}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm min-w-[160px]"
          >
            <option value="">Status</option>
            <option>Active</option>
            <option>Superseded</option>
            <option>Withdrawn</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ICN No.</th>
              <th className="px-6 py-4">Standard Number</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4 text-center">Department</th>
              <th className="px-6 py-4 text-center">Category</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right pr-10">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {standards.map((s) => (
              <tr key={s._id} className="hover:bg-indigo-50/30 transition">
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {s.icnNumber}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {s.standardNumber}
                </td>

                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                  {s.title}
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-amber-100 text-black text-[10px] rounded-full font-bold uppercase">
                    {s.department}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-amber-100 text-black text-[10px] rounded-full font-bold uppercase">
                    {s.category}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] rounded-full font-bold uppercase">
                    {s.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(s._id)}
                      className="p-2 bg-slate-100 rounded hover:bg-emerald-500 hover:text-white transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-2 bg-slate-100 rounded hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-6">
          {/* Records Dropdown */}
          <div className="flex items-center gap-2 text-sm">
            <span>Show</span>

            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>

            <span>records</span>
          </div>

          {/* Page Controls */}
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-amber-400 text-white" : "bg-white"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        {standards.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
            No standards found.
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}
      {isModalOpen && (
        <StandardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingId={editingId}
          refreshData={fetchStandards}
        />
      )}
    </div>
  );
};

export default StandardsPage;
