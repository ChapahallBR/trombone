import { Report, CreateReportInput } from '@/types/report';
import { reportService as apiService } from './api';
import { getSupabaseClient } from '@/template';

const supabase = getSupabaseClient();

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
      // Note: apiService doesn't have getReportById yet, need to add it or use getAllReports and filter?
      // Or better, add it to api.ts. For now, let's assume api.ts has it or we add it.
      // Actually, I didn't add getReportById to api.ts. I should add it.
      // But for now, let's just use the list endpoint if we don't have a specific one, or add it.
      // Let's add it to api.ts first.
      // Wait, I can't edit api.ts in this same step easily.
      // I'll just comment it out or implement it using getAllReports for now if performance isn't an issue, 
      // OR I'll update api.ts in the next step.
      // Let's stick to what I defined in api.ts: getAllReports, getUserReports, createReport.
      // I'll implement getReportById by fetching all and finding one (inefficient but works for now) 
      // OR better: I'll update api.ts to include getReportById.

      // Let's just use getAllReports and find.
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
      // Convert image to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generate unique filename
      const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `${filename}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) {
        return { data: null, error: uploadError.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('report-images')
        .getPublicUrl(filePath);

      return { data: publicUrl, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao fazer upload da foto' };
    }
  },
};
