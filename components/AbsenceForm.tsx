import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, User, Users, FileText, AlertCircle, CheckCircle2, MessageCircle, RotateCcw, Search, ChevronDown, X } from 'lucide-react';
import { STUDENT_NAMES, CLASSES, ABSENCE_TYPES } from '../constants';
import { AbsenceRecord, AbsenceType } from '../types';

interface AbsenceFormProps {
  onSubmit: (record: Omit<AbsenceRecord, 'id' | 'timestamp'>) => void;
}

const AbsenceForm: React.FC<AbsenceFormProps> = ({ onSubmit }) => {
  // Form State
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [type, setType] = useState<AbsenceType>('Sakit');
  const [reason, setReason] = useState('');
  const [proofImage, setProofImage] = useState<string | undefined>(undefined);
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Searchable Dropdown State
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter names based on search term
  const filteredNames = STUDENT_NAMES.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        // If the typed term isn't a valid selection, revert or keep blank? 
        // For now, let's keep what they typed but validation will fail if it's not exact match?
        // Actually, let's just leave it, but validation checks if studentName is set.
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update search term when a name is selected via other means or reset
  useEffect(() => {
    if (studentName) setSearchTerm(studentName);
    else setSearchTerm('');
  }, [studentName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!studentName) newErrors.studentName = "Nama siswa harus dipilih dari daftar";
    if (!className) newErrors.className = "Kelas harus dipilih";
    if (!reason) newErrors.reason = "Alasan ketidakhadiran harus diisi";
    else if (reason.length < 5) newErrors.reason = "Alasan terlalu singkat";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    onSubmit({
      studentName,
      className,
      type,
      reason,
      date: new Date().toISOString(),
      proofImage
    });

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setStudentName('');
    setSearchTerm('');
    setClassName('');
    setType('Sakit');
    setReason('');
    setProofImage(undefined);
    setErrors({});
    setIsSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleWhatsAppShare = () => {
    const text = `*IZIN KETIDAKHADIRAN SDN BANGSAL*%0A%0A` +
      `Assalamualaikum Wr. Wb.%0A` +
      `Yth. Bapak/Ibu Wali Kelas ${className}%0A%0A` +
      `Mohon izin siswa berikut tidak dapat mengikuti pelajaran:%0A` +
      `Nama: *${studentName}*%0A` +
      `Kelas: *${className}*%0A` +
      `Keterangan: *${type}*%0A` +
      `Alasan: ${reason}%0A%0A` +
      `Terima kasih.`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-8 animate-in zoom-in duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-green-200 blur-xl opacity-50 rounded-full animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl ring-4 ring-green-50">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Laporan Terkirim!</h3>
          <p className="text-slate-500 font-medium">Data telah tersimpan dengan aman.</p>
        </div>
        
        <div className="w-full space-y-4 pt-4">
          <button 
            onClick={handleWhatsAppShare}
            className="w-full py-4 rounded-2xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <MessageCircle className="w-6 h-6" />
            Konfirmasi ke Guru (WA)
          </button>
          
          <button 
            onClick={handleReset}
            className="w-full py-3.5 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Buat Izin Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* 1. Nama Siswa - Custom Searchable Input */}
      <div className="space-y-3 relative z-20">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <User className="w-5 h-5 text-fuchsia-600" />
          Nama Siswa <span className="text-red-500">*</span>
        </label>
        
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Ketik untuk mencari nama..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                setStudentName(''); // Reset selection when typing
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className={`w-full pl-11 pr-10 py-4 bg-slate-50 border rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400
                ${errors.studentName 
                  ? 'border-red-300 focus:ring-4 focus:ring-red-100 bg-red-50' 
                  : 'border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100'
                }`}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStudentName('');
                  setIsDropdownOpen(true);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-64 overflow-y-auto overflow-x-hidden z-50 scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-transparent">
              {filteredNames.length > 0 ? (
                <ul className="py-2">
                  {filteredNames.map((name, index) => (
                    <li 
                      key={index}
                      onClick={() => {
                        setStudentName(name);
                        setSearchTerm(name);
                        setIsDropdownOpen(false);
                        if (errors.studentName) setErrors({...errors, studentName: ''});
                      }}
                      className="px-5 py-3 hover:bg-violet-50 hover:text-violet-700 cursor-pointer transition-colors text-sm font-medium border-b border-slate-50 last:border-0"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-slate-500 text-sm">
                  Nama tidak ditemukan.
                </div>
              )}
            </div>
          )}
        </div>
        
        {errors.studentName && (
          <p className="text-red-500 text-sm font-medium flex items-center gap-1 animate-pulse">
            <AlertCircle className="w-4 h-4" /> {errors.studentName}
          </p>
        )}
      </div>

      {/* 2. Kelas */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Users className="w-5 h-5 text-fuchsia-600" />
          Pilih Kelas <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-5 gap-3">
          {CLASSES.map((cls) => (
            <button
              type="button"
              key={cls}
              onClick={() => {
                setClassName(cls);
                if (errors.className) setErrors({...errors, className: ''});
              }}
              className={`py-3 text-sm font-bold rounded-xl border-2 transition-all duration-200 ${
                className === cls
                  ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200 transform -translate-y-1'
                  : 'bg-white text-slate-600 border-slate-100 hover:border-violet-300 hover:bg-violet-50'
              } ${errors.className && !className ? 'border-red-300 bg-red-50 text-red-500' : ''}`}
            >
              {cls}
            </button>
          ))}
        </div>
        {errors.className && (
          <p className="text-red-500 text-sm font-medium flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors.className}
          </p>
        )}
      </div>

      {/* 3. Jenis Ketidakhadiran */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <AlertCircle className="w-5 h-5 text-fuchsia-600" />
          Keterangan <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ABSENCE_TYPES.map((t) => (
            <label
              key={t}
              className={`relative flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 group overflow-hidden ${
                type === t
                  ? 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700 shadow-md'
                  : 'bg-white border-slate-100 text-slate-600 hover:border-fuchsia-200 hover:bg-fuchsia-50/50'
              }`}
            >
              <input
                type="radio"
                name="absenceType"
                value={t}
                checked={type === t}
                onChange={() => setType(t as AbsenceType)}
                className="hidden"
              />
              <span className="font-bold relative z-10">{t}</span>
              {type === t && (
                <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-fuchsia-500"></div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* 4. Alasan */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <FileText className="w-5 h-5 text-fuchsia-600" />
          Alasan Lengkap <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (errors.reason) setErrors({...errors, reason: ''});
          }}
          placeholder="Jelaskan alasan ketidakhadiran secara singkat..."
          className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none shadow-sm min-h-[120px] transition-all font-medium text-slate-700 placeholder:text-slate-400
            ${errors.reason 
            ? 'border-red-300 focus:border-red-400 bg-red-50' 
            : 'border-slate-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white'
          }`}
        />
        {errors.reason && (
          <p className="text-red-500 text-sm font-medium flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors.reason}
          </p>
        )}
      </div>

      {/* 5. Upload Bukti */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Upload className="w-5 h-5 text-fuchsia-600" />
          Bukti Surat/Foto (Opsional)
        </label>
        <div 
          className="group border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-slate-50 hover:bg-violet-50/50"
          onClick={() => fileInputRef.current?.click()}
        >
          {proofImage ? (
            <div className="relative w-full max-w-xs mx-auto transform transition-transform group-hover:scale-105">
               <img src={proofImage} alt="Preview" className="w-full h-48 rounded-2xl object-cover shadow-lg" />
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-sm">
                 <Upload className="w-6 h-6 mr-2" /> Ganti Foto
               </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                <Upload className="w-8 h-8 text-violet-500 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-slate-700 font-bold text-lg">Upload Bukti</p>
              <p className="text-sm text-slate-400 mt-1 font-medium">Klik untuk mengambil foto atau pilih file</p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* 6. Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 duration-300
          ${isSubmitting 
          ? 'bg-slate-300 cursor-not-allowed shadow-none' 
          : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-violet-300 hover:shadow-violet-400 hover:-translate-y-1'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <Send className="w-6 h-6" />
            KIRIM LAPORAN
          </>
        )}
      </button>
    </form>
  );
};

export default AbsenceForm;