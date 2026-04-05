import React from 'react';
import { X, Printer, Download } from 'lucide-react';

const StandardDetails = ({ standard, onClose }) => {
  if (!standard) return null;

  // Helper to format dates simply
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Standard Details Report</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => window.print()} className="text-slate-500 hover:text-indigo-600 transition-colors">
              <Printer size={20} />
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="overflow-y-auto p-10 space-y-8 text-slate-700 leading-relaxed">
          
          {/* Section 1: Procurement */}
          <section>
            <h3 className="text-lg font-bold border-b-2 border-slate-100 pb-1 mb-4 flex items-center gap-2">
              📋 Procurement Information
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-8">
              <p><span className="font-semibold w-40 inline-block">ICN Number:</span> {standard.icnNumber}</p>
              <p><span className="font-semibold w-40 inline-block">Requisition No:</span> {standard.requisition_no || '-'}</p>
              <p><span className="font-semibold w-40 inline-block">Requisition Date:</span> {formatDate(standard.requisition_date)}</p>
              <p><span className="font-semibold w-40 inline-block">PR No:</span> {standard.pr_no || '-'}</p>
              <p><span className="font-semibold w-40 inline-block">PO No:</span> {standard.po_no || '-'}</p>
              <p><span className="font-semibold w-40 inline-block">Amount:</span> {standard.amount ? `₹${standard.amount}` : '-'}</p>
              <p><span className="font-semibold w-40 inline-block">Date Received:</span> {formatDate(standard.date_received)}</p>
            </div>
          </section>

          {/* Section 2: Bibliographic */}
          <section>
            <h3 className="text-lg font-bold border-b-2 border-slate-100 pb-1 mb-4 flex items-center gap-2">
              📚 Bibliographic Information
            </h3>
            <div className="space-y-2">
              <p><span className="font-semibold w-40 inline-block">Standard Number:</span> {standard.standardNumber}</p>
              <p><span className="font-semibold w-40 inline-block">Title:</span> {standard.title}</p>
              <p><span className="font-semibold w-40 inline-block">Author(s):</span> {standard.author || '-'}</p>
              <p><span className="font-semibold w-40 inline-block">Department:</span> {standard.department}</p>
              <p><span className="font-semibold w-40 inline-block">Category:</span> {standard.category}</p>
              <p><span className="font-semibold w-40 inline-block">Edition/Version:</span> {standard.edition || '-'}</p>
              <p><span className="font-semibold w-40 inline-block">Status:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold uppercase ${standard.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {standard.status}
                </span>
              </p>
              <p><span className="font-semibold w-40 inline-block">Publisher:</span> {standard.publisher || '-'}</p>
              <p><span className="font-semibold w-40 inline-block">Publication Date:</span> {formatDate(standard.publication_date)}</p>
              <p><span className="font-semibold w-40 inline-block">Pages:</span> {standard.pages || '-'}</p>
              <p><span className="font-semibold w-40 inline-block">ISBN/ISSN:</span> {standard.isbn_issn || '-'}</p>
              <p><span className="font-semibold w-40 inline-block">DOI/URL:</span> <a href={standard.doi_url} className="text-indigo-600 hover:underline">{standard.doi_url || '-'}</a></p>
            </div>
          </section>

          {/* Section 3: Amendment (Conditional) */}
          {standard.amendment_date && (
            <section>
              <h3 className="text-lg font-bold border-b-2 border-slate-100 pb-1 mb-4 flex items-center gap-2 text-orange-600">
                📝 Amendment Information
              </h3>
              <div className="space-y-2">
                <p><span className="font-semibold w-40 inline-block">Amendment Date:</span> {formatDate(standard.amendment_date)}</p>
                <p><span className="font-semibold w-40 inline-block">Remarks:</span> {standard.amendment_remarks || '-'}</p>
              </div>
            </section>
          )}

          {/* Section 4: Additional Information */}
          {(standard.summary || standard.remarks || standard.keywords) && (
            <section>
              <h3 className="text-lg font-bold border-b-2 border-slate-100 pb-1 mb-4 flex items-center gap-2">
                📝 Additional Information
              </h3>
              <div className="space-y-4 whitespace-pre-wrap">
                {standard.summary && (
                  <div>
                    <p className="font-semibold mb-1">Summary:</p>
                    <p className="text-sm bg-slate-50 p-4 rounded-lg italic border-l-4 border-slate-200">{standard.summary}</p>
                  </div>
                )}
                {standard.remarks && (
                  <p><span className="font-semibold">Remarks:</span> {standard.remarks}</p>
                )}
                {standard.keywords && (
                  <p><span className="font-semibold">Keywords:</span> {standard.keywords}</p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t bg-slate-50 flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold tracking-widest">
          <span>Generated via Library Management System</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default StandardDetails;