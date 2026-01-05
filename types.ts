export type AbsenceType = 'Sakit' | 'Izin' | 'Tanpa Keterangan';
export type ApprovalStatus = 'Menunggu' | 'Disetujui' | 'Ditolak';

export interface AbsenceRecord {
  id: string;
  studentName: string;
  className: string;
  type: AbsenceType;
  reason: string;
  date: string; // ISO String
  proofImage?: string; // Base64 string
  timestamp: number;
  status?: ApprovalStatus; // Field baru untuk persetujuan
}

export interface FilterState {
  month: string;
  className: string;
}