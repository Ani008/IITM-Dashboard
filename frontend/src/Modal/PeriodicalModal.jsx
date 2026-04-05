import React from 'react';
import { Trash2, Plus } from 'lucide-react';

const PeriodicalModal = ({ 
  showForm, 
  setShowForm, 
  formData, 
  setFormData, 
  handleSubmit, 
  handleInputChange, 
  handleNestedChange, 
  handleAuthorsChange, 
  loading, 
  editingId, 
  resetForm,
  frequencyOptions,
  languageOptions,
  departmentOptions,
  modeOptions
}) => {
  if (!showForm) return null;

  const addAuthorField = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, ""]
    }));
  };

  const removeAuthorField = (index) => {
    const updatedAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));
  };

  const handleAuthorUpdate = (index, value) => {
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index] = value;
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingId ? 'Edit' : 'Add New'} Periodical
          </h2>
          <button 
            onClick={() => { setShowForm(false); resetForm(); }} 
            className="text-gray-500 text-3xl hover:text-gray-700 transition"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* UPDATED AUTHORS SECTION */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Authors</label>
                <button 
                  type="button"
                  onClick={addAuthorField}
                  className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
                >
                  <Plus size={14} /> Add Author
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.authors.map((author, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text" 
                      value={author} 
                      onChange={(e) => handleAuthorUpdate(index, e.target.value)}
                      placeholder={`Author ${index + 1} name`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <button 
                      type="button"
                      onClick={() => removeAuthorField(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {formData.authors.length === 0 && (
                  <p className="text-xs text-gray-500 italic">No authors added. Click "Add Author" if needed.</p>
                )}
              </div>
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher *</label>
                <input type="text" name="publisher" value={formData.publisher} onChange={handleInputChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISSN</label>
                <input type="text" name="issn" value={formData.issn} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                <input type="number" name="volume" value={formData.volume} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
                <input type="text" name="issue" value={formData.issue} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <input type="text" name="periodicalMonth" value={formData.periodicalMonth} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input type="text" name="periodicalYear" value={formData.periodicalYear} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
                <input type="text" name="series" value={formData.series} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                <select name="frequency" value={formData.frequency} onChange={handleInputChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select frequency</option>
                  {frequencyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add On Copies</label>
                <input type="number" name="addOnCopies" value={formData.addOnCopies} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select name="language" value={formData.language} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select language</option>
                  {languageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Dates & Department</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Date</label>
                <input type="date" name="subscriptionDate" value={formData.subscriptionDate} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Date</label>
                <input type="date" name="receiptDate" value={formData.receiptDate} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select name="departmentToIssue" value={formData.departmentToIssue} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select department</option>
                  {departmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dept Issue Date</label>
                <input type="date" name="departmentIssueDate" value={formData.departmentIssueDate} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="3" />
            </div>
            </div>

          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Order & Vendor</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PO No</label>
                <input type="text" name="poNo" value={formData.poNo} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                <select name="mode" value={formData.mode} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select mode</option>
                  {modeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-700 mb-3">Vendor Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                  <input type="text" value={formData.vendorDetails.name}
                    onChange={(e) => handleNestedChange('vendorDetails', 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Phone</label>
                  <input type="tel" value={formData.vendorDetails.phone}
                    onChange={(e) => handleNestedChange('vendorDetails', 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Email</label>
                  <input type="email" value={formData.vendorDetails.email}
                    onChange={(e) => handleNestedChange('vendorDetails', 'email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input type="text" value={formData.paymentDetails.currency}
                  onChange={(e) => handleNestedChange('paymentDetails', 'currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" value={formData.paymentDetails.amount}
                  onChange={(e) => handleNestedChange('paymentDetails', 'amount', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks For Payment</label>
              <textarea name="remarksForPayment" value={formData.remarksForPayment} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="2" />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input type="url" name="url" value={formData.url} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="Active">Active</option>
                  <option value="Disposal">Disposal</option>
                  <option value="Inactive">Issued</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-4 justify-end sticky bottom-0 bg-white py-4 border-t">
            <button 
              type="button" 
              onClick={() => { setShowForm(false); resetForm(); }}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
            >
              {loading ? 'Saving...' : (editingId ? 'Update Periodical' : 'Create Periodical')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeriodicalModal;