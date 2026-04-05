import React, { useState, useEffect } from "react";

import axios from "axios";
import {
  Plus,
  Edit3,
  Trash2,
  Globe,
  Download,
  FileText,
  Upload,
  BookCopy,
  CheckSquare,
  Square,
} from "lucide-react";
import * as XLSX from "xlsx";
import AbstractModal from "../Modal/AbstractModal"; // Pointing to your new modal
import { useNavigate } from "react-router-dom";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/abstracts`;

const Abstracts = () => {
  const [abstracts, setAbstracts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingAbstract, setViewingAbstract] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [publishedOnly, setPublishedOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();

  const fetchAbstracts = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          page: currentPage,
          limit: limit,
          search: search,
          status: statusFilter,
          onlyPublished: publishedOnly,
        },
      });

      if (response.data?.success) {
        setAbstracts(response.data.data || []);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        setAbstracts([]);
      }
    } catch (error) {
      console.error("Error fetching standards:", error);
      setStandards([]);
    }
  };

  useEffect(() => {
    fetchAbstracts(currentPage);
  }, [currentPage, search, statusFilter, publishedOnly]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, publishedOnly]);

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAllOnPage = () => {
    const currentPageIds = abstracts.map((item) => item._id);
    const allSelectedOnPage = currentPageIds.every((id) =>
      selectedIds.includes(id),
    );

    if (allSelectedOnPage) {
      // Remove only current page IDs from selection
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      // Add current page IDs to selection (avoiding duplicates)
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const handleDownloadExcel = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one record to download.");
      return;
    }

    try {
      // Calling the unprotected route
      const response = await axios.post(`${API_BASE_URL}/export-data`, {
        ids: selectedIds,
      });

      if (response.data?.success) {
        const fullData = response.data.data;

        // Map every single field from your Mongoose Schema
        const dataToExport = fullData.map((item) => ({
          "Research Title": item.title || "",
          Authors: item.authors?.length > 0 ? item.authors.join(", ") : "N/A",
          Journal: item.journal || "",
          Source: item.source || "",
          Keywords: item.keyword?.length > 0 ? item.keyword.join(", ") : "",
          Volume: item.volume || "",
          Issue: item.issue || "",
          Year: item.year || "",
          "Pub Month": item.publicationMonth || "",
          Subject:
            item.subject?.length > 0 ? item.subject.join(", ") : "General",
          Summary: item.summary || "",
          Status: item.status || "",
          "Published in AA": item.publishedInAA || "No",
          Remarks: item.remarks || "",
          URL: item.url || "",
          "Date Added": new Date(item.createdAt).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Abstracts");

        // Auto-size columns slightly for better look
        worksheet["!cols"] = [{ wch: 50 }, { wch: 30 }, { wch: 20 }];

        XLSX.writeFile(workbook, `Automotive_Abstracts_Report.xlsx`);

        // Optional: Clear selection after download
        // setSelectedIds([]);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Check if the server is running.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this research abstract?")
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchAbstracts();
      } catch (error) {
        alert("Failed to delete record.");
      }
    }
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

  const filteredAbstracts = abstracts.filter((item) => {
    if (
      search &&
      !(
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.journal?.toLowerCase().includes(search.toLowerCase()) ||
        item.authors?.join(", ").toLowerCase().includes(search.toLowerCase())
      )
    )
      return false;

    if (statusFilter && item.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      {/* ================= HEADER (NO WHITE BG) ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-rose-600" />
            Automotive Abstract Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage automotive research abstracts and publications.
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Selected:{" "}
            <span className="font-bold text-rose-600">
              {selectedIds.length}
            </span>{" "}
            records.
          </p>
        </div>

        <div className="flex gap-3">
          {/* 🔥 DOWNLOAD BUTTON (Visible when items selected) */}
          {selectedIds.length > 0 && (
            <button
              onClick={handleDownloadExcel}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition shadow-sm font-medium animate-in fade-in zoom-in duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Excel
            </button>
          )}
          <button
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition shadow-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Abstract
          </button>

          <button
            onClick={() => navigate("/reports")}
            className="flex items-center px-4 py-2 border border-rose-600 text-rose-600 rounded-md hover:bg-rose-50 transition shadow-sm font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Reports
          </button>

          <button
            onClick={() => navigate("/uploadExcel")}
            className="flex items-center px-4 py-2 border border-rose-600 text-rose-600 rounded-md hover:bg-rose-50 transition shadow-sm font-medium"
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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author or journal..."
              className="pl-4 pr-3 py-2 w-full rounded-md border border-gray-200 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <button
            onClick={() => {
              setPublishedOnly(!publishedOnly);
              setCurrentPage(1); // Reset to first page when filtering
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border ${
              publishedOnly
                ? "bg-rose-500 text-white border-rose-500 shadow-md"
                : "bg-transparent text-rose-500 border-rose-500 hover:bg-rose-50"
            }`}
          >
            {publishedOnly ? "✓ Published in AA" : "Published in AA"}
          </button>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm min-w-[160px]"
          >
            <option value="">Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 h-4 w-4"
                  onChange={handleSelectAllOnPage}
                  checked={
                    abstracts.length > 0 &&
                    abstracts.every((item) => selectedIds.includes(item._id))
                  }
                />
              </th>
              <th className="px-6 py-4">Research Title & Authors</th>
              <th className="px-6 py-4">Journal / Source</th>
              <th className="px-6 py-4 text-center">Pub. Year</th>
              <th className="px-6 py-4 text-center">Subject</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right pr-10">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {abstracts.map((item) => (
              <tr key={item._id} className="hover:bg-rose-50/30 transition">
                {/* 🔥 INDIVIDUAL CHECKBOX */}
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 h-4 w-4"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => handleSelectOne(item._id)}
                  />
                </td>

                {/* Title & Authors */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-rose-600 mt-1 font-medium">
                    {item.authors?.join(", ") || "No authors listed"}
                  </div>
                </td>

                {/* Journal */}
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="font-medium">{item.journal || "N/A"}</div>
                  <div className="text-[10px] italic text-slate-400">
                    {item.source}
                  </div>
                </td>

                {/* Year */}
                <td className="px-6 py-4 text-center font-mono text-sm text-slate-500">
                  {item.publicationYear || item.year || "—"}
                </td>

                {/* Subject */}
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded">
                    {item.subject?.join(", ") || "General"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] rounded-full font-semibold uppercase">
                    {item.status || "Published"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingId(item._id);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-slate-100 rounded hover:bg-rose-500 hover:text-white transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-slate-100 rounded hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-100 rounded hover:bg-indigo-500 hover:text-white transition"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
                  currentPage === page ? "bg-rose-600 text-white" : "bg-white"
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

        {abstracts.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <BookCopy className="w-10 h-10 mx-auto mb-3 opacity-20" />
            No abstracts found.
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <AbstractModal
          onClose={() => setIsModalOpen(false)}
          editingId={editingId}
          refreshData={fetchAbstracts}
        />
      )}
    </div>
  );
};

export default Abstracts;
