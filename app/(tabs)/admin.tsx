import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useReports } from '@/hooks/useReports';
import { useAuth } from '@/template';
import { ReportCategory, ReportSeverity } from '@/types/report';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.md * 3) / 2;

export default function AdminDashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { reports } = useReports();
  const { user } = useAuth();

  // Calculate statistics
  const stats = {
    total: reports.length,
    pendente: reports.filter(r => r.status === 'pendente').length,
    em_analise: reports.filter(r => r.status === 'em_analise').length,
    resolvido: reports.filter(r => r.status === 'resolvido').length,
    byCategory: {
      buraco: reports.filter(r => r.category === 'buraco').length,
      perigo: reports.filter(r => r.category === 'perigo').length,
      denuncia: reports.filter(r => r.category === 'denuncia').length,
    },
    bySeverity: {
      baixa: reports.filter(r => r.severity === 'baixa').length,
      media: reports.filter(r => r.severity === 'media').length,
      alta: reports.filter(r => r.severity === 'alta').length,
    },
  };

  const resolutionRate = stats.total > 0 
    ? Math.round((stats.resolvido / stats.total) * 100) 
    : 0;

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background }]}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="admin-panel-settings" size={64} color={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
            Acesso restrito a administradores
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark 
          ? [theme.colors.primaryDark, theme.colors.backgroundDark] 
          : [theme.colors.primary, theme.colors.secondary]
        }
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Dashboard Admin</Text>
          <Text style={styles.subtitle}>Visão geral do sistema</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={[styles.content, { backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
            <View style={[styles.kpiIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
              <MaterialIcons name="dashboard" size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.kpiValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
              {stats.total}
            </Text>
            <Text style={[styles.kpiLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
              Total de Reportes
            </Text>
          </View>

          <View style={[styles.kpiCard, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
            <View style={[styles.kpiIcon, { backgroundColor: `${theme.colors.warning}20` }]}>
              <MaterialIcons name="schedule" size={24} color={theme.colors.warning} />
            </View>
            <Text style={[styles.kpiValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
              {stats.pendente}
            </Text>
            <Text style={[styles.kpiLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
              Pendentes
            </Text>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
            <View style={[styles.kpiIcon, { backgroundColor: `${theme.colors.info}20` }]}>
              <MaterialIcons name="hourglass-empty" size={24} color={theme.colors.info} />
            </View>
            <Text style={[styles.kpiValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
              {stats.em_analise}
            </Text>
            <Text style={[styles.kpiLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
              Em Análise
            </Text>
          </View>

          <View style={[styles.kpiCard, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
            <View style={[styles.kpiIcon, { backgroundColor: `${theme.colors.success}20` }]}>
              <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />
            </View>
            <Text style={[styles.kpiValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
              {resolutionRate}%
            </Text>
            <Text style={[styles.kpiLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
              Taxa de Resolução
            </Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={[styles.section, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
            Por Categoria
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialIcons name="warning" size={20} color={theme.colors.buraco} />
              <Text style={[styles.statValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
                {stats.byCategory.buraco}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                Buracos
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="report-problem" size={20} color={theme.colors.perigo} />
              <Text style={[styles.statValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
                {stats.byCategory.perigo}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                Perigos
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="report" size={20} color={theme.colors.denuncia} />
              <Text style={[styles.statValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
                {stats.byCategory.denuncia}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                Denúncias
              </Text>
            </View>
          </View>
        </View>

        {/* Severity Breakdown */}
        <View style={[styles.section, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
            Por Severidade
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.colors.baixa} />
              <Text style={[styles.statValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
                {stats.bySeverity.baixa}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                Baixa
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="remove" size={20} color={theme.colors.media} />
              <Text style={[styles.statValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
                {stats.bySeverity.media}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                Média
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="keyboard-arrow-up" size={20} color={theme.colors.alta} />
              <Text style={[styles.statValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
                {stats.bySeverity.alta}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                Alta
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
            Ações Rápidas
          </Text>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="download" size={20} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
              Exportar Relatório CSV
            </Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="analytics" size={20} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
              Ver Analytics Detalhado
            </Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="people" size={20} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
              Gerenciar Técnicos
            </Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: theme.spacing.lg,
  },
  headerContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.surface,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.surface,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  kpiCard: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  kpiIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  kpiValue: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xs,
  },
  kpiLabel: {
    ...theme.typography.bodySmall,
    textAlign: 'center',
  },
  section: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statValue: {
    ...theme.typography.h2,
  },
  statLabel: {
    ...theme.typography.bodySmall,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  actionButtonText: {
    ...theme.typography.body,
    flex: 1,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  emptyText: {
    ...theme.typography.body,
    textAlign: 'center',
  },
});
