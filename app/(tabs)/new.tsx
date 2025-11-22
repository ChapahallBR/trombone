import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useColorScheme, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useReports } from '@/hooks/useReports';
import { useAlert } from '@/template';
import { ReportCategory, ReportSeverity } from '@/types/report';

export default function NewReportScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { createReport, uploadPhoto } = useReports();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory>('buraco');
  const [severity, setSeverity] = useState<ReportSeverity>('media');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const categories: { value: ReportCategory; label: string; icon: string }[] = [
    { value: 'buraco', label: 'Buraco', icon: 'warning' },
    { value: 'perigo', label: 'Perigo', icon: 'report-problem' },
    { value: 'denuncia', label: 'Denúncia', icon: 'report' },
  ];

  const severities: { value: ReportSeverity; label: string; icon: string }[] = [
    { value: 'baixa', label: 'Baixa', icon: 'keyboard-arrow-down' },
    { value: 'media', label: 'Média', icon: 'remove' },
    { value: 'alta', label: 'Alta', icon: 'keyboard-arrow-up' },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permissão necessária', 'Precisamos de permissão para acessar a câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permissão necessária', 'Precisamos de permissão para acessar sua localização');
      return;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      showAlert('Localização capturada!', 'Sua localização foi adicionada ao reporte');
    } catch (err) {
      showAlert('Erro', 'Não foi possível obter sua localização');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      showAlert('Atenção', 'Por favor, adicione um título');
      return;
    }

    if (!description.trim()) {
      showAlert('Atenção', 'Por favor, adicione uma descrição');
      return;
    }

    if (!location) {
      showAlert('Atenção', 'Por favor, adicione a localização do problema');
      return;
    }

    setLoading(true);

    try {
      let photoUrl: string | undefined;

      if (photoUri) {
        const { data, error } = await uploadPhoto(photoUri);
        if (error) {
          showAlert('Erro', `Falha ao enviar foto: ${error}`);
          setLoading(false);
          return;
        }
        photoUrl = data ?? undefined;
      }

      const result = await createReport({
        title: title.trim(),
        description: description.trim(),
        category, // Assuming 'selectedCategory' and 'selectedSeverity' are typos and should be 'category' and 'severity' from state
        severity,
        isAnonymous: isAnonymous,
        imageUrl: photoUrl,
        latitude: location?.latitude, // Keep optional chaining as location can be null
        longitude: location?.longitude, // Keep optional chaining as location can be null
      });

      if (result.success) {
        showAlert('Sucesso!', 'Reporte enviado com sucesso');
        setTitle('');
        setDescription('');
        setCategory('buraco');
        setSeverity('media');
        setIsAnonymous(false);
        setPhotoUri(null);
        setLocation(null);
        router.push('/(tabs)');
      } else {
        showAlert('Erro', result.error || 'Falha ao enviar reporte');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado';
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'default';
      showAlert('Erro', `${errorMessage}\nAPI: ${apiUrl}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={isDark
          ? [theme.colors.primaryDark, theme.colors.backgroundDark]
          : [theme.colors.primary, theme.colors.secondary]
        }
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Novo Reporte</Text>
          <Text style={styles.subtitle}>Ajude a melhorar nossa cidade</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>Categoria</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryButton,
                  category === cat.value && styles.categoryButtonActive,
                  {
                    backgroundColor: category === cat.value
                      ? theme.colors.primary
                      : isDark ? theme.colors.backgroundDark : theme.colors.background
                  }
                ]}
                onPress={() => setCategory(cat.value)}
              >
                <MaterialIcons
                  name={cat.icon as any}
                  size={24}
                  color={category === cat.value ? theme.colors.surface : isDark ? theme.colors.textDark : theme.colors.text}
                />
                <Text style={[
                  styles.categoryLabel,
                  { color: category === cat.value ? theme.colors.surface : isDark ? theme.colors.textDark : theme.colors.text }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.card, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>Severidade</Text>
          <View style={styles.categoryContainer}>
            {severities.map((sev) => (
              <TouchableOpacity
                key={sev.value}
                style={[
                  styles.categoryButton,
                  severity === sev.value && styles.categoryButtonActive,
                  {
                    backgroundColor: severity === sev.value
                      ? theme.colors[sev.value]
                      : isDark ? theme.colors.backgroundDark : theme.colors.background
                  }
                ]}
                onPress={() => setSeverity(sev.value)}
              >
                <MaterialIcons
                  name={sev.icon as any}
                  size={24}
                  color={severity === sev.value ? theme.colors.surface : isDark ? theme.colors.textDark : theme.colors.text}
                />
                <Text style={[
                  styles.categoryLabel,
                  { color: severity === sev.value ? theme.colors.surface : isDark ? theme.colors.textDark : theme.colors.text }
                ]}>
                  {sev.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.card, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <TouchableOpacity
            style={styles.anonymousToggle}
            onPress={() => setIsAnonymous(!isAnonymous)}
            activeOpacity={0.7}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text, marginBottom: 4 }]}>Reporte Anônimo</Text>
              <Text style={[styles.anonymousSubtext, { color: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary }]}>
                Seu nome não será divulgado publicamente
              </Text>
            </View>
            <View style={[
              styles.toggleButton,
              isAnonymous && styles.toggleButtonActive,
              { backgroundColor: isAnonymous ? theme.colors.primary : (isDark ? theme.colors.backgroundDark : theme.colors.border) }
            ]}>
              <View style={[
                styles.toggleCircle,
                isAnonymous && styles.toggleCircleActive,
                { backgroundColor: theme.colors.surface }
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>Título</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background,
                color: isDark ? theme.colors.textDark : theme.colors.text,
              }
            ]}
            placeholder="Ex: Buraco grande na Rua Principal"
            placeholderTextColor={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={[styles.card, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>Descrição</Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: isDark ? theme.colors.backgroundDark : theme.colors.background,
                color: isDark ? theme.colors.textDark : theme.colors.text,
              }
            ]}
            placeholder="Descreva o problema em detalhes..."
            placeholderTextColor={isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={[styles.card, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>Foto</Text>
          {photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
              <TouchableOpacity style={styles.removePhoto} onPress={() => setPhotoUri(null)}>
                <MaterialIcons name="close" size={20} color={theme.colors.surface} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <MaterialIcons name="camera-alt" size={24} color={theme.colors.primary} />
                <Text style={[styles.photoButtonText, { color: theme.colors.primary }]}>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <MaterialIcons name="photo-library" size={24} color={theme.colors.primary} />
                <Text style={[styles.photoButtonText, { color: theme.colors.primary }]}>Galeria</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.card, theme.shadows.md, { backgroundColor: isDark ? theme.colors.surfaceDark : theme.colors.surface }]}>
          <Text style={[styles.label, { color: isDark ? theme.colors.textDark : theme.colors.text }]}>Localização</Text>
          <TouchableOpacity
            style={[styles.locationButton, location && styles.locationButtonActive]}
            onPress={getLocation}
          >
            <MaterialIcons
              name={location ? "check-circle" : "location-on"}
              size={24}
              color={location ? theme.colors.success : theme.colors.primary}
            />
            <Text style={[
              styles.locationButtonText,
              { color: location ? theme.colors.success : theme.colors.primary }
            ]}>
              {location ? 'Localização capturada' : 'Adicionar localização'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            theme.shadows.lg,
            loading && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.submitGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <>
                <MaterialIcons name="send" size={24} color={theme.colors.surface} />
                <Text style={styles.submitText}>Enviar Reporte</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  categoryButtonActive: {
    ...theme.shadows.md,
  },
  categoryLabel: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  input: {
    ...theme.typography.body,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  textArea: {
    ...theme.typography.body,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
  },
  removePhoto: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  photoButton: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    borderStyle: 'dashed',
    gap: theme.spacing.xs,
  },
  photoButtonText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  locationButtonActive: {
    borderColor: theme.colors.success,
  },
  locationButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  submitText: {
    ...theme.typography.body,
    color: theme.colors.surface,
    fontWeight: '700',
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  anonymousSubtext: {
    ...theme.typography.bodySmall,
  },
  toggleButton: {
    width: 52,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleButtonActive: {
    // Handled by backgroundColor
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
});
