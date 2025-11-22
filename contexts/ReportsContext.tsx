import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Report, CreateReportInput } from '@/types/report';
import { reportService } from '@/services/reportService';

interface ReportsContextType {
  reports: Report[];
  loading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
  createReport: (input: CreateReportInput) => Promise<{ success: boolean; error: string | null }>;
  uploadPhoto: (uri: string) => Promise<{ data: string | null; error: string | null }>;
}

export const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

import { useAuth } from '@/template';

export function ReportsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await reportService.getReports();

    if (err) {
      setError(err);
    } else if (data) {
      setReports(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const refreshReports = async () => {
    await loadReports();
  };

  const createReport = async (input: CreateReportInput): Promise<{ success: boolean; error: string | null }> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const payload = {
      ...input,
      userEmail: user.email,
      userName: user.user_metadata?.full_name || user.email?.split('@')[0]
    };

    const { data, error: err } = await reportService.createReport(payload, user.id);

    if (err) {
      return { success: false, error: err };
    }

    if (data) {
      setReports(prev => [data, ...prev]);
    }

    return { success: true, error: null };
  };

  const uploadPhoto = async (uri: string) => {
    return await reportService.uploadPhoto(uri);
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        loading,
        error,
        refreshReports,
        createReport,
        uploadPhoto,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}
