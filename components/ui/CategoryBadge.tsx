import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { ReportCategory } from '@/types/report';

interface CategoryBadgeProps {
  category: ReportCategory;
  size?: 'small' | 'medium';
}

const categoryConfig = {
  buraco: {
    label: 'Buraco',
    icon: 'warning' as const,
    color: theme.colors.buraco,
  },
  perigo: {
    label: 'Perigo',
    icon: 'report-problem' as const,
    color: theme.colors.perigo,
  },
  denuncia: {
    label: 'Denúncia',
    icon: 'report' as const,
    color: theme.colors.denuncia,
  },
};

export function CategoryBadge({ category, size = 'medium' }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, { backgroundColor: `${config.color}20` }]}>
      <MaterialIcons 
        name={config.icon} 
        size={isSmall ? 14 : 16} 
        color={config.color} 
      />
      <Text style={[styles.text, { color: config.color, fontSize: isSmall ? 12 : 14 }]}>
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
  text: {
    fontWeight: '600',
  },
});
