export type AbsenceType = 'Sakit' | 'Izin' | 'Tanpa Keterangan';

export interface AbsenceRecord {
  id: string;
  studentName: string;
  className: string;
  type: AbsenceType;
  reason: string;
  date: string; // ISO String
  proofImage?: string; // Base64 string
  timestamp: number;
}

export interface FilterState {
  month: string;
  className: string;
}