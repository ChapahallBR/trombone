import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { ReportSeverity } from '@/types/report';

interface SeverityBadgeProps {
  severity: ReportSeverity;
  size?: 'small' | 'medium';
}

const severityConfig = {
  baixa: {
    label: 'Baixa',
    icon: 'keyboard-arrow-down' as const,
    color: theme.colors.baixa,
  },
  media: {
    label: 'Média',
    icon: 'remove' as const,
    color: theme.colors.media,
  },
  alta: {
    label: 'Alta',
    icon: 'keyboard-arrow-up' as const,
    color: theme.colors.alta,
  },
};

export function SeverityBadge({ severity, size = 'medium' }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, { backgroundColor: `${config.color}20` }]}>
      <MaterialIcons 
        name={config.icon} 
        size={isSmall ? 14 : 16} 
        color={config.color} 
      />
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  text: {
    fontWeight: '600',
  },
});
