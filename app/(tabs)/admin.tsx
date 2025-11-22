import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Dimensions, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useReports } from '@/hooks/useReports';
import { useAuth } from '@/contexts/AuthContext';
import { Report, ReportCategory, ReportSeverity } from '@/types/report';
import { reportService } from '@/services/reportService';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { reports, refreshReports } = useReports();
  const { user } = useAuth();

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setEditStatus(report.status);
    setEditDepartment(report.department || '');
    setEditNotes(report.adminNotes || '');
    setModalVisible(true);
  };

  const handleSaveReport = async () => {
    if (!selectedReport) return;

    setSaving(true);
    try {
      const { error } = await reportService.updateReport(selectedReport.id, {
        status: editStatus,
        department: editDepartment,
        adminNotes: editNotes
      });

      if (error) {
        Alert.alert('Erro', error);
      } else {
        Alert.alert('Sucesso', 'Reporte atualizado com sucesso');
        setModalVisible(false);
        refreshReports();
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar reporte');
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'admin') {
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
              Total
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

          <View style={[styles.kpiCard, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
            <View style={[styles.kpiIcon, { backgroundColor: `${theme.colors.success}20` }]}>
              <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />
            </View>
            <Text style={[styles.kpiValue, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
              {resolutionRate}%
            </Text>
            <Text style={[styles.kpiLabel, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
              Resolução
            </Text>
          </View>
        </View>

        {/* Report Management List */}
        <View style={[styles.section, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
            Gerenciar Reportes Recentes
          </Text>
          {reports.slice(0, 10).map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportItem}
              onPress={() => handleEditReport(report)}
            >
              <View style={styles.reportInfo}>
                <Text style={[styles.reportTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]} numberOfLines={1}>
                  {report.title}
                </Text>
                <Text style={[styles.reportSubtitle, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                  {report.category} • {report.status}
                </Text>
              </View>
              <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>
              Editar Reporte
            </Text>

            <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>Status</Text>
            <View style={styles.optionsRow}>
              {['pendente', 'em_analise', 'resolvido'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.optionButton,
                    editStatus === status && styles.optionButtonActive,
                    { borderColor: editStatus === status ? theme.colors.primary : theme.colors.border }
                  ]}
                  onPress={() => setEditStatus(status)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: editStatus === status ? theme.colors.primary : (isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary) }
                  ]}>
                    {status.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>Departamento</Text>
            <View style={styles.optionsRow}>
              {['obras', 'defesa_civil', 'gcm'].map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={[
                    styles.optionButton,
                    editDepartment === dept && styles.optionButtonActive,
                    { borderColor: editDepartment === dept ? theme.colors.primary : theme.colors.border }
                  ]}
                  onPress={() => setEditDepartment(dept)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: editDepartment === dept ? theme.colors.primary : (isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary) }
                  ]}>
                    {dept.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>Notas do Admin</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background,
                color: isDark ? theme.colors.textDark : theme.colors.text
              }]}
              value={editNotes}
              onChangeText={setEditNotes}
              placeholder="Adicione notas internas..."
              placeholderTextColor={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveReport}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  reportSubtitle: {
    ...theme.typography.bodySmall,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  label: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  optionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
  },
  optionButtonActive: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  optionText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
