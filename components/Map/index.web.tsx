import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useReports } from '@/hooks/useReports';
import { Report, ReportCategory } from '@/types/report';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categoryColors: Record<ReportCategory, string> = {
    buraco: theme.colors.buraco,
    perigo: theme.colors.perigo,
    denuncia: theme.colors.denuncia,
};

export default function MapScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { reports } = useReports();

    const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');

    const filteredReports = reports
        .filter(r => r.category !== 'denuncia') // Security: Hide crime reports from public map
        .filter(r => selectedCategory === 'all' ? true : r.category === selectedCategory);

    const getMarkerColor = (report: Report) => {
        if (report.status === 'resolvido') return theme.colors.success;
        return categoryColors[report.category];
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
                <View style={styles.headerCard}>
                    <Text style={[styles.headerTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
                        Mapa de Reportes
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                        {filteredReports.length} reportes visíveis
                    </Text>
                    <Text style={[styles.webNotice, { color: theme.colors.warning }]}>
                        📱 Visualização de mapa disponível apenas no app mobile
                    </Text>
                </View>
            </View>

            {/* Filter buttons */}
            <View style={[styles.filterContainer, { backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background }]}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        theme.shadows.md,
                        selectedCategory === 'all' && styles.filterButtonActive,
                        { backgroundColor: selectedCategory === 'all' ? theme.colors.primary : (isDark ? theme.colors.surfaceDark : theme.colors.surface) }
                    ]}
                    onPress={() => setSelectedCategory('all')}
                >
                    <MaterialIcons
                        name="map"
                        size={20}
                        color={selectedCategory === 'all' ? theme.colors.surface : (isDark ? theme.colors.textDark : theme.colors.text)}
                    />
                    <Text style={[
                        styles.filterText,
                        { color: selectedCategory === 'all' ? theme.colors.surface : (isDark ? theme.colors.textDark : theme.colors.text) }
                    ]}>
                        Todos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        theme.shadows.md,
                        selectedCategory === 'buraco' && styles.filterButtonActive,
                        { backgroundColor: selectedCategory === 'buraco' ? theme.colors.buraco : (isDark ? theme.colors.surfaceDark : theme.colors.surface) }
                    ]}
                    onPress={() => setSelectedCategory('buraco')}
                >
                    <MaterialIcons
                        name="warning"
                        size={20}
                        color={selectedCategory === 'buraco' ? theme.colors.surface : theme.colors.buraco}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        theme.shadows.md,
                        selectedCategory === 'perigo' && styles.filterButtonActive,
                        { backgroundColor: selectedCategory === 'perigo' ? theme.colors.perigo : (isDark ? theme.colors.surfaceDark : theme.colors.surface) }
                    ]}
                    onPress={() => setSelectedCategory('perigo')}
                >
                    <MaterialIcons
                        name="report-problem"
                        size={20}
                        color={selectedCategory === 'perigo' ? theme.colors.surface : theme.colors.perigo}
                    />
                </TouchableOpacity>
            </View>

            {/* Report list with locations */}
            <View style={[styles.listContainer, { backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background }]}>
                {filteredReports.filter(r => r.latitude && r.longitude).map((report) => (
                    <TouchableOpacity
                        key={report.id}
                        style={[styles.reportItem, theme.shadows.sm, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}
                        onPress={() => router.push({ pathname: '/report/[id]', params: { id: String(report.id) } } as never)}
                    >
                        <View style={[styles.markerDot, { backgroundColor: getMarkerColor(report) }]} />
                        <View style={styles.reportInfo}>
                            <Text style={[styles.reportTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]} numberOfLines={1}>
                                {report.title}
                            </Text>
                            <Text style={[styles.reportLocation, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                                📍 {report.latitude!.toFixed(4)}, {report.longitude!.toFixed(4)}
                            </Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    headerCard: {
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
    headerTitle: {
        ...theme.typography.h2,
    },
    headerSubtitle: {
        ...theme.typography.bodySmall,
        marginTop: 2,
    },
    webNotice: {
        ...theme.typography.bodySmall,
        marginTop: theme.spacing.sm,
        fontWeight: '600',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        gap: theme.spacing.xs,
    },
    filterButtonActive: {
        // Active state handled by backgroundColor
    },
    filterText: {
        ...theme.typography.bodySmall,
        fontWeight: '600',
    },
    listContainer: {
        flex: 1,
        padding: theme.spacing.md,
    },
    reportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.md,
    },
    markerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    reportInfo: {
        flex: 1,
    },
    reportTitle: {
        ...theme.typography.body,
        fontWeight: '600',
        marginBottom: 2,
    },
    reportLocation: {
        ...theme.typography.bodySmall,
    },
});
