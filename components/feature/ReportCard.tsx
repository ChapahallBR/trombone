import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { Report } from '@/types/report';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = () => {
    router.push({ pathname: '/report/[id]', params: { id: String(report.id) } } as never);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        theme.shadows.md,
        { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {report.photo_url && (
        <Image
          source={{ uri: report.photo_url }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <CategoryBadge category={report.category} size="small" />
          <SeverityBadge severity={report.severity} size="small" />
          <StatusBadge status={report.status} size="small" />
        </View>

        <Text
          style={[
            styles.title,
            { color: isDark ? theme.colors.textDark : theme.colors.text }
          ]}
          numberOfLines={2}
        >
          {report.title}
        </Text>

        <Text
          style={[
            styles.description,
            { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }
          ]}
          numberOfLines={2}
        >
          {report.description}
        </Text>

        <View style={styles.footer}>
          {report.latitude && report.longitude && (
            <View style={styles.location}>
              <MaterialIcons
                name="location-on"
                size={14}
                color={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.locationText,
                  { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }
                ]}
              >
                Localização salva
              </Text>
            </View>
          )}
          <Text
            style={[
              styles.date,
              { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }
            ]}
          >
            {formatDate(report.created_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  title: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.bodySmall,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...theme.typography.caption,
  },
  date: {
    ...theme.typography.caption,
  },
});
