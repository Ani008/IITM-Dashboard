import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  FileText,
  Globe,
  Link as LinkIcon,
  Tag,
} from "lucide-react";

// Adjusted to match common naming conventions for your Abstract model
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/abstracts`;

const AbstractModal = ({ onClose, editingId, refreshData }) => {
  const [formData, setFormData] = useState({
    title: "",
    authors: [""],
    journal: "",
    source: "",
    keyword: [""],
    volume: "",
    issue: "",
    year: "",
    publicationMonth: "",
    subject: [""],
    summary: "",
    publishedInAA: "",
    remarks: "",
    url: "",
    status: "Draft",
  });

  useEffect(() => {
    if (editingId) {
      const fetchSingle = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/${editingId}`);
          const item = res.data.data;

          // Ensure authors is an array for the dynamic inputs
          if (!Array.isArray(item.authors) || item.authors.length === 0) {
            item.authors = [""];
          }

          setFormData(item);
        } catch (error) {
          console.error("Error fetching abstract:", error);
        }
      };
      fetchSingle();
    }
  }, [editingId]);

  // Dynamic Author Logic
  const handleAuthorChange = (index, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData({ ...formData, authors: newAuthors });
  };

  // SUBJECT
  const addSubjectField = () => {
    setFormData({
      ...formData,
      subject: [...formData.subject, ""],
    });
  };

  const handleSubjectChange = (index, value) => {
    const updated = [...formData.subject];
    updated[index] = value;
    setFormData({ ...formData, subject: updated });
  };

  const removeSubjectField = (index) => {
    const updated = formData.subject.filter((_, i) => i !== index);
    setFormData({ ...formData, subject: updated });
  };

  // KEYWORDS
  const addKeywordField = () => {
    setFormData({
      ...formData,
      keyword: [...formData.keyword, ""],
    });
  };

  const handleKeywordChange = (index, value) => {
    const updated = [...formData.keyword];
    updated[index] = value;
    setFormData({ ...formData, keyword: updated });
  };

  const removeKeywordField = (index) => {
    const updated = formData.keyword.filter((_, i) => i !== index);
    setFormData({ ...formData, keyword: updated });
  };

  const addAuthorField = () => {
    setFormData({ ...formData, authors: [...formData.authors, ""] });
  };

  const removeAuthorField = (index) => {
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      authors: newAuthors.length ? newAuthors : [""],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy to format data types if necessary (e.g., volume to Number)
      const submissionData = {
        ...formData,
        volume: formData.volume ? Number(formData.volume) : null,
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, submissionData);
      } else {
        await axios.post(API_BASE_URL, submissionData);
      }
      refreshData();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving abstract record.");
    }
  };

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-rose-500 outline-none transition-all bg-white";
  const labelClass =
    "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingId ? "Update" : "New"} Abstract Entry
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">
              Research Management System
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-8 space-y-10"
        >
          {/* Section 1: Bibliographic Details */}
          <section>
            <HeaderSection
              icon={<BookOpen size={18} />}
              title="Bibliographic Details"
              color="text-rose-600"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-3">
                <label className={labelClass}>Research Title *</label>
                <input
                  required
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-3">
                <label className={labelClass}>Authors</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formData.authors.map((author, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder={`Author ${index + 1}`}
                        value={author}
                        onChange={(e) =>
                          handleAuthorChange(index, e.target.value)
                        }
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeAuthorField(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAuthorField}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 mt-2"
                  >
                    <Plus size={14} /> Add Author
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Journal Name</label>
                <input
                  className={inputClass}
                  value={formData.journal}
                  onChange={(e) =>
                    setFormData({ ...formData, journal: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Subject / Category</label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formData.subject.map((subj, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder={`Subject ${index + 1}`}
                        value={subj}
                        onChange={(e) =>
                          handleSubjectChange(index, e.target.value)
                        }
                      />

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeSubjectField(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSubjectField}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 mt-2"
                  >
                    <Plus size={14} /> Add Subject
                  </button>
                </div>
              </div>

              <div className="md:col-span-3">
                <label className={labelClass}>Keywords</label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formData.keyword.map((key, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder={`Keyword ${index + 1}`}
                        value={key}
                        onChange={(e) =>
                          handleKeywordChange(index, e.target.value)
                        }
                      />

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeKeywordField(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addKeywordField}
                    className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 mt-2"
                  >
                    <Plus size={14} /> Add Keyword
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Publication Details */}
          <section>
            <HeaderSection
              icon={<Globe size={18} />}
              title="Publication Info"
              color="text-emerald-600"
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Volume</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.volume}
                  onChange={(e) =>
                    setFormData({ ...formData, volume: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Issue</label>
                <input
                  className={inputClass}
                  value={formData.issue}
                  onChange={(e) =>
                    setFormData({ ...formData, issue: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <input
                  className={inputClass}
                  placeholder="e.g. 2026"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Pub. Month</label>
                <input
                  className={inputClass}
                  value={formData.publicationMonth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicationMonth: e.target.value,
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Source / Database</label>
                <input
                  className={inputClass}
                  placeholder="e.g. IEEE, PubMed"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Published in AA</label>
                <input
                  className={inputClass}
                  value={formData.publishedInAA}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedInAA: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          {/* Section 3: Content & Links */}
          <section>
            <HeaderSection
              icon={<FileText size={18} />}
              title="Summary & Metadata"
              color="text-indigo-600"
            />

            <div className="grid grid-cols-1 gap-5">
              {/* Summary */}
              <div>
                <label className={labelClass}>Summary / Abstract Text</label>
                <textarea
                  className={`${inputClass} h-32`}
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                />
              </div>

              {/* Metadata Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Access URL */}
                <div>
                  <label className={labelClass}>Access URL</label>
                  <div className="relative">
                    <LinkIcon
                      size={14}
                      className="absolute left-3 top-3 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-8`}
                      placeholder="https://doi.org/..."
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className={labelClass}>AA Number</label>
                  <input
                    className={inputClass}
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                  />
                </div>

                {/* ✅ Status Dropdown */}
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            className="px-12 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-100 transition-all"
          >
            {editingId ? "Update Abstract" : "Save Abstract"}
          </button>
        </div>
      </div>
    </div>
  );
};

const HeaderSection = ({ icon, title, color }) => (
  <div
    className={`flex items-center gap-2 mb-6 ${color} border-b border-slate-100 pb-2`}
  >
    {icon}
    <h3 className="font-bold text-xs uppercase tracking-[0.2em]">{title}</h3>
  </div>
);

export default AbstractModal;
