import { Report, CreateReportInput } from '@/types/report';
import { reportService as apiService } from './api';

export const reportService = {
  async getReports(): Promise<{ data: Report[] | null; error: string | null }> {
    try {
      const data = await apiService.getAllReports();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao carregar reportes' };
    }
  },

  async getReportById(id: string): Promise<{ data: Report | null; error: string | null }> {
    try {
      const reports = await apiService.getAllReports();
      const report = reports.find((r: Report) => r.id === id);
      return { data: report || null, error: report ? null : 'Report not found' };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao carregar reporte' };
    }
  },

  async createReport(input: CreateReportInput, userId: string): Promise<{ data: Report | null; error: string | null }> {
    try {
      const payload = { ...input, userId };
      const data = await apiService.createReport(payload);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao criar reporte' };
    }
  },

  async uploadPhoto(uri: string): Promise<{ data: string | null; error: string | null }> {
    try {
      // For now, just return the URI directly
      // In production, you would upload to a cloud storage service
      // or implement a backend endpoint to handle file uploads
      return { data: uri, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao fazer upload da foto' };
    }
  },

  async updateReport(id: string, data: Partial<Report>): Promise<{ data: Report | null; error: string | null }> {
    try {
      const result = await apiService.updateReport(id, data);
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao atualizar reporte' };
    }
  },
};
