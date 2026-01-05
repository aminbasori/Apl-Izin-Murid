import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Download, Search, Filter, Trash2, Calendar } from 'lucide-react';
import { AbsenceRecord, FilterState } from '../types';
import { CLASSES } from '../constants';

interface HistoryViewProps {
  records: AbsenceRecord[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ records, onDelete }) => {
  const [filters, setFilters] = useState<FilterState>({
    month: '',
    className: ''
  });

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const recordDate = new Date(record.date);
      const matchesClass = filters.className ? record.className === filters.className : true;
      
      let matchesMonth = true;
      if (filters.month) {
        // filters.month format is "YYYY-MM"
        const recordMonth = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
        matchesMonth = recordMonth === filters.month;
      }

      return matchesClass && matchesMonth;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [records, filters]);

  const handleDownloadExcel = () => {
    // Format data for Excel
    const dataForExcel = filteredRecords.map((rec, index) => ({
      'No': index + 1,
      'Nama Siswa': rec.studentName,
      'Kelas': rec.className,
      'Jenis': rec.type,
      'Alasan': rec.reason,
      'Tanggal': new Date(rec.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      'Waktu Input': new Date(rec.timestamp).toLocaleTimeString('id-ID')
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    
    // Auto-width columns
    const wscols = [
      { wch: 4 }, // No
      { wch: 30 }, // Nama
      { wch: 10 }, // Kelas
      { wch: 15 }, // Jenis
      { wch: 30 }, // Alasan
      { wch: 25 }, // Tanggal
      { wch: 15 }, // Waktu
    ];
    ws['!cols'] = wscols;

    const sheetName = filters.className ? `Kelas ${filters.className}` : 'Semua Kelas';
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Absensi");
    
    const fileName = `Rekap_Absensi_${filters.className || 'Semua'}_${filters.month || 'All'}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-6">
          <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
            <Filter className="w-5 h-5" />
          </div>
          Filter Data & Download
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Pilih Kelas</label>
            <select
              value={filters.className}
              onChange={(e) => setFilters(prev => ({ ...prev, className: e.target.value }))}
              className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none font-medium text-slate-700"
            >
              <option value="">Semua Kelas</option>
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Pilih Bulan</label>
            <input
              type="month"
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
              className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none font-medium text-slate-700"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleDownloadExcel}
              disabled={filteredRecords.length === 0}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all transform active:scale-95 ${
                filteredRecords.length === 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-200 hover:-translate-y-1'
              }`}
            >
              <Download className="w-5 h-5" />
              Unduh Excel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-violet-50/50 border-b border-violet-100">
              <tr>
                <th className="p-5 font-bold text-violet-900">Tanggal</th>
                <th className="p-5 font-bold text-violet-900">Siswa</th>
                <th className="p-5 font-bold text-violet-900">Keterangan</th>
                <th className="p-5 font-bold text-violet-900">Bukti</th>
                <th className="p-5 font-bold text-violet-900 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-5 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-2 font-medium">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        {new Date(record.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-slate-800 text-base">{record.studentName}</div>
                      <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2 py-1 rounded-md mt-1 inline-block">
                        Kelas {record.className}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        record.type === 'Sakit' ? 'bg-red-100 text-red-700' :
                        record.type === 'Izin' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {record.type}
                      </div>
                      <div className="mt-2 text-slate-500 truncate max-w-[200px] text-xs font-medium" title={record.reason}>
                        "{record.reason}"
                      </div>
                    </td>
                    <td className="p-5">
                      {record.proofImage ? (
                        <div className="relative w-12 h-12">
                          <img 
                            src={record.proofImage} 
                            alt="Bukti" 
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-150 hover:z-50 transition-all origin-center"
                            onClick={() => {
                               const w = window.open("");
                               if(w) {
                                 w.document.write(`<img src="${record.proofImage}" style="max-width: 100%; height: auto;"/>`);
                               }
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Nil</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => onDelete(record.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                         <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium">Tidak ada data ditemukan untuk filter ini.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;