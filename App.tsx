import React, { useState, useEffect } from 'react';
import { BookOpen, ClipboardList, History, Bell } from 'lucide-react';
import AbsenceForm from './components/AbsenceForm';
import HistoryView from './components/HistoryView';
import { AbsenceRecord } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [records, setRecords] = useState<AbsenceRecord[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Load records from LocalStorage on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('sdn_bangsal_absensi');
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }

    // Request Notification Permission on load
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Save records to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sdn_bangsal_absensi', JSON.stringify(records));
  }, [records]);

  const handleFormSubmit = (newRecordData: Omit<AbsenceRecord, 'id' | 'timestamp'>) => {
    const newRecord: AbsenceRecord = {
      ...newRecordData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    setRecords(prev => [newRecord, ...prev]);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

    // Trigger Browser Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Izin Baru Diterima", {
        body: `${newRecord.studentName} (${newRecord.className}) - ${newRecord.type}`,
        icon: '/vite.svg',
        tag: 'new-absence'
      });
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24 font-sans selection:bg-fuchsia-200">
      {/* Modern Header with Gradient & Curves */}
      <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 pb-8 pt-6 rounded-b-[2.5rem] shadow-xl shadow-purple-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight drop-shadow-sm">SDN Bangsal</h1>
              <p className="text-xs text-purple-100 font-medium opacity-90 tracking-wide">Aplikasi Absensi Digital</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white cursor-pointer hover:bg-white/30 transition-all border border-white/30">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </header>

      {/* Floating Navigation Tabs */}
      <div className="max-w-3xl mx-auto px-6 -mt-6 z-40 relative">
        <div className="bg-white p-1.5 rounded-2xl shadow-lg shadow-slate-200/50 flex gap-1 border border-slate-100">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === 'form' 
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md transform scale-[1.02]' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-violet-600'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Form Izin
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === 'history' 
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md transform scale-[1.02]' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-violet-600'
            }`}
          >
            <History className="w-4 h-4" />
            Riwayat
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 mt-8">
        {activeTab === 'form' ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
             <div className="mb-8 pb-6 border-b border-dashed border-slate-200">
               <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                 Formulir Izin
               </h2>
               <p className="text-sm text-slate-500 mt-2 font-medium">Lengkapi data siswa untuk mengajukan izin.</p>
             </div>
             <AbsenceForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <HistoryView records={records} onDelete={handleDeleteRecord} />
        )}
      </main>

      {/* Modern Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-bounce border border-white/10">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-900/20">
            <CheckCircle2Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Berhasil!</p>
            <p className="text-xs text-slate-300">Data telah tersimpan di sistem.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component
const CheckCircle2Icon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
);

export default App;