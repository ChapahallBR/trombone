import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Report } from '@/types/report';
import { reportService } from '@/services/reportService';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { data, error: err } = await reportService.getReportById(id);
    if (err) {
      setError(err);
    } else if (data) {
      setReport(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !report) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background }]}>
        <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
          {error || 'Reporte não encontrado'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {report.photo_url && (
        <Image
          source={{ uri: report.photo_url }}
          style={styles.image}
          contentFit="cover"
        />
      )}

      <View style={[styles.card, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
        <View style={styles.badges}>
          <CategoryBadge category={report.category} />
          <SeverityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
        </View>

        <Text style={[styles.title, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
          {report.title}
        </Text>

        <View style={styles.info}>
          <MaterialIcons 
            name="access-time" 
            size={16} 
            color={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary} 
          />
          <Text style={[styles.infoText, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
            {formatDate(report.created_at)}
          </Text>
        </View>

        {report.latitude && report.longitude && (
          <View style={styles.info}>
            <MaterialIcons 
              name="location-on" 
              size={16} 
              color={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary} 
            />
            <Text style={[styles.infoText, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
              {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        {report.is_anonymous && (
          <View style={styles.info}>
            <MaterialIcons 
              name="visibility-off" 
              size={16} 
              color={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary} 
            />
            <Text style={[styles.infoText, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
              Reporte anônimo
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.card, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
          Descrição
        </Text>
        <Text style={[styles.description, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
          {report.description}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.body,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
  card: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  badges: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.sm,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.bodySmall,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body,
    lineHeight: 24,
  },
});
