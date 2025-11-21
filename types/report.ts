export type ReportCategory = 'buraco' | 'perigo' | 'denuncia';
export type ReportStatus = 'pendente' | 'em_analise' | 'resolvido';
export type ReportSeverity = 'baixa' | 'media' | 'alta';
export type UserRole = 'citizen' | 'operator' | 'manager' | 'admin';

export interface Report {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  is_anonymous: boolean;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  status: ReportStatus;
  assigned_to?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReportInput {
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  is_anonymous: boolean;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
}

export interface ReportComment {
  id: string;
  report_id: string;
  user_id?: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface ReportStatusHistory {
  id: string;
  report_id: string;
  old_status?: string;
  new_status: string;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

export interface ReportStats {
  total: number;
  pendente: number;
  em_analise: number;
  resolvido: number;
  byCategory: Record<ReportCategory, number>;
  bySeverity: Record<ReportSeverity, number>;
}
