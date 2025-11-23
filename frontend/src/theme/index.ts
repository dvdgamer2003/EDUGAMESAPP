import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { getResponsiveFontSize, getResponsiveSpacing } from '../utils/responsive';

// Enhanced Color Palette - Queezy Style
// Enhanced Color Palette - Premium Modern Blue
const colors = {
  primary: '#2563EB', // Blue 600
  primaryLight: '#60A5FA', // Blue 400
  primaryDark: '#1E40AF', // Blue 800
  secondary: '#10B981', // Emerald 500
  secondaryLight: '#34D399', // Emerald 400
  secondaryDark: '#059669', // Emerald 600
  tertiary: '#F59E0B', // Amber 500
  tertiaryLight: '#FBBF24', // Amber 400
  tertiaryDark: '#D97706', // Amber 600
  error: '#EF4444', // Red 500
  errorLight: '#F87171', // Red 400
  errorDark: '#B91C1C', // Red 700
  success: '#10B981', // Emerald 500
  successLight: '#34D399', // Emerald 400
  successDark: '#059669', // Emerald 600
  warning: '#F59E0B', // Amber 500
  warningLight: '#FBBF24', // Amber 400
  warningDark: '#D97706', // Amber 600
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9', // Slate 100
  outline: '#94A3B8', // Slate 400
  outlineVariant: '#CBD5E1', // Slate 300
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#FFFFFF',
  onError: '#FFFFFF',
  onBackground: '#0F172A', // Slate 900
  onSurface: '#0F172A', // Slate 900
  onSurfaceVariant: '#475569', // Slate 600
  inverseSurface: '#0F172A',
  inverseOnSurface: '#FFFFFF',
  inversePrimary: '#60A5FA',
  shadow: '#2563EB', // Colored shadows
  scrim: '#000000',
};

// Typography Scale (Base sizes for mobile)
const typography = {
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400' as const,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400' as const,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400' as const,
  },
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  titleMedium: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  titleSmall: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600' as const,
  },
};

// Responsive Typography Helper
export const getResponsiveTypography = (variant: keyof typeof typography) => {
  const base = typography[variant];
  return {
    ...base,
    fontSize: getResponsiveFontSize(base.fontSize),
    lineHeight: getResponsiveFontSize(base.lineHeight),
  };
};

// Breakpoints
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
};

// Spacing System (8pt grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Responsive Spacing (adapts to screen size)
export const getResponsiveSpacingValue = (key: keyof typeof spacing): number => {
  return getResponsiveSpacing(spacing[key]);
};

// Border Radius Tokens
export const borderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  full: 9999,
};

// Shadow Presets (Elevation)
export const shadows = {
  elevation1: {
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  elevation2: {
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  elevation3: {
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  elevation4: {
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
  elevation5: {
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },
};

// Gradient Presets
export const gradients = {
  primary: ['#2563EB', '#60A5FA'] as const, // Blue 600 to Blue 400
  secondary: ['#10B981', '#34D399'] as const, // Emerald
  tertiary: ['#F59E0B', '#FBBF24'] as const, // Amber
  success: ['#10B981', '#34D399'] as const,
  warm: ['#F59E0B', '#FBBF24'] as const,
  cool: ['#2563EB', '#06B6D4'] as const, // Blue to Cyan
  sunset: ['#F43F5E', '#F59E0B'] as const, // Rose to Amber
  ocean: ['#06B6D4', '#3B82F6'] as const, // Cyan to Blue
  // New gamified gradients
  tealPurple: ['#10B981', '#6366F1'] as const,
  levelUp: ['#F59E0B', '#F43F5E'] as const,
  xpProgress: ['#10B981', '#3B82F6'] as const,
  softPurple: ['#F8FAFC', '#FFFFFF'] as const, // Light background
  cardGlow: ['rgba(37, 99, 235, 0.1)', 'rgba(16, 185, 129, 0.1)'] as const,
};

// Neumorphism shadow styles
export const neumorphism = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  pressed: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
};

// Animation Durations
export const durations = {
  fast: 150,
  normal: 250,
  slow: 350,
  verySlow: 500,
};

// Dark Theme Colors - True Blue Dark Mode
const darkColors = {
  primary: '#60A5FA', // Blue 400 (lighter for dark mode)
  primaryLight: '#93C5FD', // Blue 300
  primaryDark: '#3B82F6', // Blue 500
  secondary: '#34D399', // Emerald 400
  secondaryLight: '#6EE7B7', // Emerald 300
  secondaryDark: '#10B981', // Emerald 500
  tertiary: '#FBBF24', // Amber 400
  tertiaryLight: '#FCD34D', // Amber 300
  tertiaryDark: '#F59E0B', // Amber 500
  error: '#F87171', // Red 400
  errorLight: '#FCA5A5', // Red 300
  errorDark: '#EF4444', // Red 500
  success: '#34D399', // Emerald 400
  successLight: '#6EE7B7', // Emerald 300
  successDark: '#10B981', // Emerald 500
  warning: '#FBBF24', // Amber 400
  warningLight: '#FCD34D', // Amber 300
  warningDark: '#F59E0B', // Amber 500
  background: '#0F172A', // Slate 900
  surface: '#1E293B', // Slate 800
  surfaceVariant: '#334155', // Slate 700
  outline: '#64748B', // Slate 500
  outlineVariant: '#475569', // Slate 600
  onPrimary: '#1E3A8A', // Blue 900
  onSecondary: '#064E3B', // Emerald 900
  onTertiary: '#78350F', // Amber 900
  onError: '#7F1D1D', // Red 900
  onBackground: '#F1F5F9', // Slate 100
  onSurface: '#F1F5F9', // Slate 100
  onSurfaceVariant: '#CBD5E1', // Slate 300
  inverseSurface: '#F1F5F9', // Slate 100
  inverseOnSurface: '#0F172A', // Slate 900
  inversePrimary: '#2563EB', // Blue 600
  shadow: '#000000',
  scrim: '#000000',
};

// Enhanced Theme
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  roundness: borderRadius.xl,
  animation: {
    scale: 1.0,
  },
};

export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    ...darkColors,
  },
  roundness: borderRadius.xl,
  animation: {
    scale: 1.0,
  },
};

// Export all design tokens
export { colors, darkColors, typography };
