import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Search, Download, MapPin, Calendar, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '../components/ToastProvider';

interface CaseForm {
  _id: string;
  caseID: string;
  caseName: string;
  clients: string[];
  dateOfBirth: string;
  contactNumber: string;
  email: string;
  address: string;
  caseNotes: string;
  formType: string;
  createdAt: string;
}

const YourCases: React.FC = () => {
  const [cases, setCases] = useState<CaseForm[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseForm | null>(null);
  const [searchId, setSearchId] = useState('');
  const [userId, setUserId] = useState<string>('');
  const { fetchData } = useApi();
  const { error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchCases = async () => {
      try {
        const data = await fetchData<unknown, CaseForm[]>(`/lawyerForm/${userId}`, 'GET');
        setCases(data);
        if (data.length > 0) setSelectedCase(data[0]);
      } catch (err) {
        console.error('Failed to fetch cases:', err);
      }
    };
    fetchCases();
  }, [userId]);

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      const data = await fetchData<unknown, CaseForm>(`/lawyerForm/form/${searchId}`, 'GET');
      if (data) {
        setSelectedCase(data);
      } else {
        error('Case not found');
      }
    } catch (err) {
      console.error('Search failed:', err);
      error('Search failed');
    }
  };

  const handleDownload = () => {
    if (!selectedCase) return;
    const content = `
      Case ID: ${selectedCase.caseID}
      Case Name: ${selectedCase.caseName}
      Client: ${selectedCase.clients.join(', ')}
      Date: ${selectedCase.dateOfBirth}
      Contact: ${selectedCase.contactNumber}
      Email: ${selectedCase.email}
      Address: ${selectedCase.address}
      
      Notes:
      ${selectedCase.caseNotes}
    `;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `case_${selectedCase.caseID}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="bg-cream-200 min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-leaf-800 font-poppins mb-2 text-center md:text-left">Application Hub</h1>
            <p className="text-gray-500 font-medium text-center md:text-left">Track and manage your agricultural applications and consultancies.</p>
          </div>
          <button
            onClick={() => navigate('/create-case')}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-leaf-600 hover:bg-leaf-700 text-white font-bold rounded-2xl shadow-xl shadow-leaf-100 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-6 h-6" /> New Application
          </button>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-leaf-100/10 border border-leaf-100/50">
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search by Case ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-4 bg-leaf-50/50 border border-leaf-100 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-400 w-5 h-5" />
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {cases.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-10" />
                    <p>No applications yet</p>
                  </div>
                ) : (
                  cases.map(c => (
                    <div
                      key={c._id}
                      onClick={() => setSelectedCase(c)}
                      className={`p-5 rounded-2xl cursor-pointer transition-all border ${selectedCase?._id === c._id
                        ? "bg-leaf-600 border-leaf-600 text-white shadow-lg shadow-leaf-100"
                        : "bg-leaf-50/50 border-leaf-100 text-charcoal-900 hover:bg-leaf-100"
                        }`}
                    >
                      <p className="font-black text-sm tracking-widest uppercase mb-1">{c.caseID}</p>
                      <p className="font-bold truncate">{c.caseName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${selectedCase?._id === c._id ? "bg-white/20 text-white" : "bg-leaf-100 text-leaf-700"
                          }`}>
                          {c.formType}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Detailed View */}
          <section className="lg:col-span-8">
            {selectedCase ? (
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-leaf-100/20 border border-leaf-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-leaf-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

                <div className="relative">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-8 border-b border-leaf-50">
                    <div>
                      <span className="text-xs font-black text-leaf-600 uppercase tracking-[0.2em] mb-3 block">Application Details</span>
                      <h2 className="text-3xl font-black text-charcoal-900 font-poppins">{selectedCase.caseName}</h2>
                      <p className="text-leaf-600 font-bold mt-1">{selectedCase.caseID}</p>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-cream-200 hover:bg-cream-300 text-leaf-800 font-bold rounded-xl transition-all"
                    >
                      <Download className="w-5 h-5" /> Export PDF
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-leaf-50 rounded-xl text-leaf-600"><User className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Client(s)</p>
                          <p className="font-bold text-charcoal-800">{selectedCase.clients.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-leaf-50 rounded-xl text-leaf-600"><Calendar className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date of Application</p>
                          <p className="font-bold text-charcoal-800">{new Date(selectedCase.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-leaf-50 rounded-xl text-leaf-600"><MessageCircle className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Info</p>
                          <p className="font-bold text-charcoal-800">{selectedCase.contactNumber}</p>
                          <p className="text-sm text-gray-500">{selectedCase.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-leaf-50 rounded-xl text-leaf-600"><MapPin className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Service Address</p>
                          <p className="font-bold text-charcoal-800 leading-relaxed">{selectedCase.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-leaf-50/30 p-8 rounded-3xl border border-leaf-50">
                    <h3 className="text-sm font-black text-leaf-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Application Notes
                    </h3>
                    <p className="text-charcoal-700 leading-relaxed font-medium whitespace-pre-wrap">{selectedCase.caseNotes || 'No additional notes provided for this application.'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white/50 rounded-[2.5rem] border border-dashed border-leaf-100 p-12 text-center">
                <FileText className="w-20 h-20 mb-6 opacity-10" />
                <h3 className="text-2xl font-bold text-charcoal-700 mb-2">Select an Application</h3>
                <p className="max-w-xs">Review details, export reports, and track the progress of your agricultural requests.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default YourCases;
