export const theme = {
  colors: {
    // Primary colors - Deep blue + Teal accent
    primary: '#1E40AF', // Deep blue
    secondary: '#0891B2', // Teal
    accent: '#06B6D4', // Bright teal

    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Severity colors
    baixa: '#10B981', // Green
    media: '#F59E0B', // Amber
    alta: '#EF4444', // Red

    // Category colors
    buraco: '#F59E0B',
    perigo: '#EF4444',
    denuncia: '#8B5CF6',

    // Status colors
    pendente: '#F59E0B',
    em_analise: '#3B82F6',
    resolvido: '#10B981',

    // Neutral colors (light mode)
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    border: '#E2E8F0',
    text: '#0F172A',
    textSecondary: '#64748B',

    // Neutral colors (dark mode)
    backgroundDark: '#0F172A',
    surfaceDark: '#1E293B',
    surfaceSecondaryDark: '#334155',
    borderDark: '#334155',
    textDark: '#F1F5F9',
    textSecondaryDark: '#94A3B8',

    // Dark mode primary
    primaryDark: '#1E3A8A',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
