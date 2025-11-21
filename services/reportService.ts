import { getSupabaseClient } from '@/template';
import { Report, CreateReportInput } from '@/types/report';

const supabase = getSupabaseClient();

export const reportService = {
  async getReports(): Promise<{ data: Report[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Report[], error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao carregar reportes' };
    }
  },

  async getReportById(id: string): Promise<{ data: Report | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Report, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Erro ao carregar reporte' };
    }
  },

  async createReport(input: CreateReportInput): Promise<{ data: Report | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([input])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Report, error: null };
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
