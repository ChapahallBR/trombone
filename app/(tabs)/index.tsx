import React from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { useReports } from '@/hooks/useReports';
import { ReportCard } from '@/components/feature/ReportCard';

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { reports, loading, refreshReports } = useReports();

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
          <Text style={styles.appName}>Trombone CG</Text>
          <Text style={styles.subtitle}>Relatos da Comunidade</Text>
        </View>
      </LinearGradient>

      {loading && reports.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
            Carregando reportes...
          </Text>
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
            Nenhum reporte ainda.{'\n'}Seja o primeiro a reportar!
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReportCard report={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshReports}
              tintColor={theme.colors.primary}
            />
          }
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
  },
  appName: {
    ...theme.typography.h1,
    color: theme.colors.surface,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.surface,
    opacity: 0.9,
  },
  list: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    ...theme.typography.body,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    textAlign: 'center',
  },
});
