import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { ReportStatus } from '@/types/report';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'small' | 'medium';
}

const statusConfig = {
  pendente: {
    label: 'Pendente',
    color: theme.colors.pendente,
  },
  em_analise: {
    label: 'Em Análise',
    color: theme.colors.em_analise,
  },
  resolvido: {
    label: 'Resolvido',
    color: theme.colors.resolvido,
  },
};

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, { backgroundColor: `${config.color}20` }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color, fontSize: isSmall ? 11 : 13 }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '600',
  },
});
