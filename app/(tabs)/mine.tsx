import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useReports } from '@/hooks/useReports';
import { useAuth } from '@/template';
import { ReportCard } from '@/components/feature/ReportCard';
import { ReportStatus } from '@/types/report';

export default function MyReportsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { reports } = useReports();
  const { user } = useAuth();

  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');

  // Filter reports by current user
  const myReports = reports.filter(r => r.userId === user?.id);

  // Filter by status
  const filteredReports = filterStatus === 'all'
    ? myReports
    : myReports.filter(r => r.status === filterStatus);

  const statusCounts = {
    all: myReports.length,
    pendente: myReports.filter(r => r.status === 'pendente').length,
    em_analise: myReports.filter(r => r.status === 'em_analise').length,
    resolvido: myReports.filter(r => r.status === 'resolvido').length,
  };

  const filterButtons: { value: ReportStatus | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'Todos', icon: 'dashboard' },
    { value: 'pendente', label: 'Pendente', icon: 'schedule' },
    { value: 'em_analise', label: 'Em Análise', icon: 'hourglass-empty' },
    { value: 'resolvido', label: 'Resolvido', icon: 'check-circle' },
  ];

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background }]}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="lock-outline" size={64} color={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
            Faça login para ver seus reportes
          </Text>
          <TouchableOpacity
            style={{ marginTop: 20, backgroundColor: theme.colors.primary, padding: 10, borderRadius: 8 }}
            onPress={() => router.push('/login')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ir para Login</Text>
          </TouchableOpacity>
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
          <Text style={styles.title}>Meus Reportes</Text>
          <Text style={styles.subtitle}>{myReports.length} {myReports.length === 1 ? 'reporte' : 'reportes'} enviados</Text>
        </View>

        <View style={styles.filterContainer}>
          {filterButtons.map((button) => (
            <TouchableOpacity
              key={button.value}
              style={[
                styles.filterButton,
                filterStatus === button.value && styles.filterButtonActive,
              ]}
              onPress={() => setFilterStatus(button.value)}
            >
              <MaterialIcons
                name={button.icon as any}
                size={18}
                color={filterStatus === button.value ? theme.colors.surface : 'rgba(255,255,255,0.7)'}
              />
              <Text style={[
                styles.filterButtonText,
                { color: filterStatus === button.value ? theme.colors.surface : 'rgba(255,255,255,0.7)' }
              ]}>
                {button.label}
              </Text>
              <View style={[
                styles.badge,
                { backgroundColor: filterStatus === button.value ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)' }
              ]}>
                <Text style={[styles.badgeText, { color: theme.colors.surface }]}>
                  {statusCounts[button.value]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {filteredReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name="inbox"
            size={64}
            color={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary}
          />
          <Text style={[styles.emptyText, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
            Nenhum reporte {filterStatus !== 'all' ? `com status "${filterStatus}"` : 'encontrado'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReportCard report={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingBottom: theme.spacing.lg,
  },
  headerContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
  filterContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: theme.spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterButtonText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    ...theme.typography.bodySmall,
    fontWeight: '700',
    fontSize: 12,
  },
  list: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
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
