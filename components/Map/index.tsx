import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useReports } from '@/hooks/useReports';
import { Report, ReportCategory } from '@/types/report';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const CAMPO_GRANDE_COORDS = {
    latitude: -20.4486,
    longitude: -54.6295,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

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
    const { reports, loading } = useReports();

    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');

    useEffect(() => {
        getUserLocation();
    }, []);

    const getUserLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        }
    };

    const filteredReports = selectedCategory === 'all'
        ? reports
        : reports.filter(r => r.category === selectedCategory);

    const getMarkerColor = (report: Report) => {
        if (report.status === 'resolvido') return theme.colors.success;
        return categoryColors[report.category];
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={CAMPO_GRANDE_COORDS}
                showsUserLocation={true}
                showsMyLocationButton={false}
            >
                {filteredReports.filter(r => r.latitude && r.longitude).map((report) => (
                    <Marker
                        key={report.id}
                        coordinate={{
                            latitude: report.latitude!,
                            longitude: report.longitude!,
                        }}
                        pinColor={getMarkerColor(report)}
                        onPress={() => router.push({ pathname: '/report/[id]', params: { id: String(report.id) } } as never)}
                    />
                ))}
            </MapView>

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={[styles.headerCard, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
                    <Text style={[styles.headerTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
                        Mapa de Reportes
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                        {filteredReports.length} reportes ativos
                    </Text>
                </View>
            </View>

            {/* Filter buttons */}
            <View style={styles.filterContainer}>
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

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        theme.shadows.md,
                        selectedCategory === 'denuncia' && styles.filterButtonActive,
                        { backgroundColor: selectedCategory === 'denuncia' ? theme.colors.denuncia : (isDark ? theme.colors.surfaceDark : theme.colors.surface) }
                    ]}
                    onPress={() => setSelectedCategory('denuncia')}
                >
                    <MaterialIcons
                        name="report"
                        size={20}
                        color={selectedCategory === 'denuncia' ? theme.colors.surface : theme.colors.denuncia}
                    />
                </TouchableOpacity>
            </View>

            {/* My location button */}
            <TouchableOpacity
                style={[styles.locationButton, theme.shadows.lg, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}
                onPress={getUserLocation}
            >
                <MaterialIcons name="my-location" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: theme.spacing.md,
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
    filterContainer: {
        position: 'absolute',
        bottom: 100,
        left: theme.spacing.md,
        right: theme.spacing.md,
        flexDirection: 'row',
        gap: theme.spacing.sm,
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
    locationButton: {
        position: 'absolute',
        bottom: 160,
        right: theme.spacing.md,
        width: 56,
        height: 56,
        borderRadius: theme.borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
