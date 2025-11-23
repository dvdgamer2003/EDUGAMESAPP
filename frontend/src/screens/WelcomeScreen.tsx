import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    StatusBar,
    ScrollView,
    Image
} from 'react-native';
import { Text, useTheme, IconButton, Surface, Button } from 'react-native-paper';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolate,
    runOnJS,
    FadeInDown,
    FadeInUp,
    Layout
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../components/ui/CustomInput';
import CustomButton from '../components/ui/CustomButton';
import { spacing, borderRadius, gradients } from '../theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Track Your Streaks',
        description: 'Consistency is key! Build daily habits, track your learning streak, and watch your progress grow. Don\'t break the chain!',
        image: require('../../assets/images/onboarding/streak.png'),
        color: '#FF6B6B',
    },
    {
        id: '2',
        title: 'Master New Skills',
        description: 'Dive into comprehensive lessons, interactive quizzes, and real-world examples designed to help you level up your knowledge effectively.',
        image: require('../../assets/images/onboarding/learn.png'),
        color: '#4ECDC4',
    },
    {
        id: '3',
        title: 'Compete & Win',
        description: 'Challenge your friends, earn XP for every correct answer, and climb the global leaderboard. Learning has never been this fun!',
        image: require('../../assets/images/onboarding/compete.png'),
        color: '#FFD93D',
    }
];

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'od', label: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

// Separate component for slide items to properly use hooks
const SlideItem = ({ item, index, scrollX }: any) => {
    const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width
    ];

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.8, 1, 0.8],
            Extrapolate.CLAMP
        );
        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolate.CLAMP
        );
        const translateY = interpolate(
            scrollX.value,
            inputRange,
            [50, 0, 50],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ scale }, { translateY }],
            opacity
        };
    });

    return (
        <View style={{ width, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
            <Animated.View style={[styles.slideContent, animatedStyle]}>
                <View style={styles.imageContainer}>
                    <Image
                        source={item.image}
                        style={styles.slideImage}
                        resizeMode="contain"
                    />
                </View>
                <Text variant="displaySmall" style={[styles.slideTitle, { color: '#fff' }]}>
                    {item.title}
                </Text>
                <Text variant="bodyLarge" style={[styles.slideDesc, { color: 'rgba(255,255,255,0.9)' }]}>
                    {item.description}
                </Text>
            </Animated.View>
        </View>
    );
};

const WelcomeScreen = ({ navigation }: any) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { t, setLanguage, language } = useTranslation();
    const { login, register, loginAsGuest } = useAuth();

    // Animation values
    const scrollX = useSharedValue(0);
    const loginSheetY = useSharedValue(height);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Sync selected language with global language state
    useEffect(() => {
        setSelectedLanguage(language);
    }, [language]);

    // Auto-scroll slides
    useEffect(() => {
        if (isSheetVisible) return;

        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % SLIDES.length;
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true
            });
            setCurrentIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex, isSheetVisible]);

    const openSheet = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setIsSheetVisible(true);
        setError(null);
        loginSheetY.value = withSpring(0, { damping: 15 });
    };

    const closeSheet = () => {
        Keyboard.dismiss();
        loginSheetY.value = withTiming(height, { duration: 300 }, () => {
            runOnJS(setIsSheetVisible)(false);
            runOnJS(setAuthMode)('login'); // Reset to login by default
        });
    };

    const handleAuth = async () => {
        if (!email || !password || (authMode === 'register' && !name)) {
            setError(t('login.fillAllFields') || 'Please fill in all fields');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            if (authMode === 'login') {
                await login(email, password, role);
            } else {
                await register({ name, email, password, language: selectedLanguage });
            }
        } catch (e: any) {
            setError(e?.response?.data?.message || (authMode === 'login' ? t('login.loginFailed') : 'Registration failed'));
        } finally {
            setLoading(false);
        }
    };

    const toggleAuthMode = () => {
        Layout.springify(); // Animate layout change
        setAuthMode(prev => prev === 'login' ? 'register' : 'login');
        setError(null);
    };

    const handleLanguageSelect = async (lang: 'en' | 'hi' | 'od') => {
        // Optimistically update local state
        setSelectedLanguage(lang);
        // Update global language
        await setLanguage(lang);
    };

    const renderSlide = ({ item, index }: any) => (
        <SlideItem item={item} index={index} scrollX={scrollX} />
    );

    const sheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: loginSheetY.value }]
        };
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Full Screen Gradient Background */}
            <LinearGradient
                colors={gradients.primary}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Decorative Background Elements */}
            <View style={[styles.circle, { top: -100, left: -50, width: 300, height: 300, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
            <View style={[styles.circle, { bottom: 100, right: -100, width: 400, height: 400, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
            <View style={[styles.circle, { top: height * 0.4, left: -80, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.03)' }]} />

            {/* Header / Brand */}
            <Animated.View
                entering={FadeInDown.delay(200).duration(800)}
                style={[styles.brandHeader, { marginTop: insets.top + spacing.lg }]}
            >
                <View style={styles.logoContainer}>
                    <MaterialCommunityIcons name="lightning-bolt" size={32} color="#FFD700" />
                </View>
                <Text variant="headlineMedium" style={styles.brandName}>
                    StreakWise
                </Text>
            </Animated.View>

            {/* Slider */}
            <Animated.FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                    scrollX.value = e.nativeEvent.contentOffset.x;
                }}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(e) => {
                    setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
                }}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                style={styles.slider}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {SLIDES.map((_, index) => {
                    const animatedDotStyle = useAnimatedStyle(() => {
                        const inputRange = [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width
                        ];
                        const widthAnim = interpolate(
                            scrollX.value,
                            inputRange,
                            [8, 24, 8],
                            Extrapolate.CLAMP
                        );
                        const opacity = interpolate(
                            scrollX.value,
                            inputRange,
                            [0.4, 1, 0.4],
                            Extrapolate.CLAMP
                        );
                        return {
                            width: widthAnim,
                            opacity
                        };
                    });
                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: '#fff' },
                                animatedDotStyle
                            ]}
                        />
                    );
                })}
            </View>

            {/* Bottom Actions */}
            <Animated.View
                entering={FadeInUp.delay(400).duration(800)}
                style={[styles.bottomActions, { paddingBottom: insets.bottom + spacing.xl }]}
            >
                <Surface style={styles.actionContainer} elevation={0}>
                    <CustomButton
                        variant="text"
                        size="large"
                        onPress={() => openSheet('login')}
                        fullWidth
                        style={styles.loginButton}
                        labelStyle={{ color: '#2563EB', fontWeight: 'bold', fontSize: 16 }}
                    >
                        Login
                    </CustomButton>

                    <CustomButton
                        variant="outlined"
                        size="large"
                        onPress={() => openSheet('register')}
                        fullWidth
                        style={styles.registerButton}
                        labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                    >
                        Create Account
                    </CustomButton>
                </Surface>
            </Animated.View>

            {/* Sheet Overlay */}
            {isSheetVisible && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={closeSheet}
                />
            )}

            {/* Auth Sheet */}
            <Animated.View style={[
                styles.sheet,
                { backgroundColor: theme.colors.surface, width: '100%', maxWidth: 600, alignSelf: 'center' },
                sheetStyle
            ]}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
                        <View style={styles.sheetHeader}>
                            <View>
                                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                                    {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                                </Text>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {authMode === 'login' ? 'Please sign in to continue' : 'Join us and start learning'}
                                </Text>
                            </View>
                            <IconButton icon="close" onPress={closeSheet} />
                        </View>

                        <Animated.View layout={Layout.springify()} style={styles.formContent}>
                            {/* Role Selection (Login Only) */}
                            {authMode === 'login' && (
                                <View style={styles.roleSelector}>
                                    <TouchableOpacity
                                        style={[styles.roleOption, role === 'student' && { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }]}
                                        onPress={() => setRole('student')}
                                    >
                                        <MaterialCommunityIcons
                                            name="school"
                                            size={24}
                                            color={role === 'student' ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                        />
                                        <Text style={[styles.roleText, role === 'student' && { color: theme.colors.primary, fontWeight: 'bold' }]}>
                                            Student
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.roleOption, role === 'teacher' && { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }]}
                                        onPress={() => setRole('teacher')}
                                    >
                                        <MaterialCommunityIcons
                                            name="account-tie"
                                            size={24}
                                            color={role === 'teacher' ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                        />
                                        <Text style={[styles.roleText, role === 'teacher' && { color: theme.colors.primary, fontWeight: 'bold' }]}>
                                            Teacher
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Register Fields */}
                            {authMode === 'register' && (
                                <CustomInput
                                    label="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    icon={<MaterialCommunityIcons name="account-outline" size={20} color={theme.colors.primary} />}
                                />
                            )}

                            <CustomInput
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                icon={<MaterialCommunityIcons name="email-outline" size={20} color={theme.colors.primary} />}
                            />
                            <CustomInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                icon={<MaterialCommunityIcons name="lock-outline" size={20} color={theme.colors.primary} />}
                                rightIcon={showPassword ? "eye-off" : "eye"}
                                onRightIconPress={() => setShowPassword(!showPassword)}
                            />

                            {/* Language Selection (Register Only) */}
                            {authMode === 'register' && (
                                <View style={{ marginTop: spacing.sm }}>
                                    <Text style={styles.sectionLabel}>Preferred Language</Text>
                                    <View style={styles.languageContainer}>
                                        {LANGUAGES.map((lang) => (
                                            <TouchableOpacity
                                                key={lang.code}
                                                style={[
                                                    styles.languageButton,
                                                    selectedLanguage === lang.code && styles.languageButtonActive
                                                ]}
                                                onPress={() => handleLanguageSelect(lang.code as 'en' | 'hi' | 'od')}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.languageFlag}>{lang.flag}</Text>
                                                <Text style={[
                                                    styles.languageText,
                                                    selectedLanguage === lang.code && styles.languageTextActive
                                                ]}>
                                                    {lang.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {error && (
                                <View style={styles.errorContainer}>
                                    <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.error} />
                                    <Text style={{ color: theme.colors.error, marginLeft: spacing.xs, flex: 1 }}>
                                        {error}
                                    </Text>
                                </View>
                            )}

                            <CustomButton
                                variant="primary"
                                size="large"
                                onPress={handleAuth}
                                loading={loading}
                                fullWidth
                                style={{ marginTop: spacing.md }}
                            >
                                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                            </CustomButton>

                            {/* Guest Login Button */}
                            {authMode === 'login' && (
                                <CustomButton
                                    variant="outlined"
                                    size="large"
                                    onPress={loginAsGuest}
                                    fullWidth
                                    style={{ marginTop: spacing.sm, borderColor: theme.colors.primary }}
                                    labelStyle={{ color: theme.colors.primary }}
                                >
                                    Continue as Guest
                                </CustomButton>
                            )}

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                </Text>
                                <TouchableOpacity onPress={toggleAuthMode}>
                                    <Text style={styles.linkText}>
                                        {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2563EB', // Blue 600
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
    },
    brandHeader: {
        alignItems: 'center',
        marginBottom: spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    brandName: {
        fontWeight: '900',
        letterSpacing: 1,
        color: '#fff',
        fontSize: 28,
    },
    slider: {
        flexGrow: 0,
        height: height * 0.6,
    },
    slideContent: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        width: '100%',
    },
    imageContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    slideImage: {
        width: '100%',
        height: '100%',
    },
    slideTitle: {
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: spacing.sm,
        fontSize: 28,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    slideDesc: {
        textAlign: 'center',
        lineHeight: 24,
        fontSize: 16,
        paddingHorizontal: spacing.lg,
        marginTop: spacing.sm,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginBottom: spacing.lg,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: spacing.xl,
    },
    actionContainer: {
        backgroundColor: 'transparent',
        gap: spacing.md,
    },
    loginButton: {
        backgroundColor: '#fff',
        borderRadius: borderRadius.xl,
        elevation: 4,
    },
    registerButton: {
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: borderRadius.xl,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100,
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        // left: 0, // Removed to allow centering
        // right: 0, // Removed to allow centering
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: spacing.xl,
        zIndex: 101,
        elevation: 20,
        maxHeight: height * 0.85,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    formContent: {
        gap: spacing.md,
    },
    roleSelector: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.sm,
    },
    roleOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        gap: spacing.xs,
        backgroundColor: '#F5F5F5',
    },
    roleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl, // Increased spacing
        alignItems: 'center',
        marginBottom: spacing.md, // Added bottom margin
    },
    footerText: {
        color: '#666',
        fontSize: 15,
    },
    linkText: {
        color: '#4A00E0',
        fontWeight: 'bold',
        fontSize: 15,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    languageContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        flexWrap: 'wrap',
    },
    languageButton: {
        flex: 1,
        minWidth: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        gap: 4,
    },
    languageButtonActive: {
        backgroundColor: '#4A00E0',
        borderColor: '#4A00E0',
    },
    languageFlag: {
        fontSize: 16,
    },
    languageText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    languageTextActive: {
        color: '#fff',
    },
});

export default WelcomeScreen;
