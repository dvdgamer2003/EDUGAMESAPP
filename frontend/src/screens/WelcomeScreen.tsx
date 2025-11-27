import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { spacing, borderRadius } from '../theme';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: 1,
        icon: 'lightning-bolt',
        title: 'Track Your Streaks',
        description: 'Build daily habits and maintain your learning streak. Consistency is the key to success!',
        gradient: ['#667eea', '#764ba2'] as readonly [string, string],
    },
    {
        id: 2,
        icon: 'trophy-variant',
        title: 'Earn Rewards',
        description: 'Unlock badges, collect XP, and level up as you progress through your learning journey.',
        gradient: ['#f093fb', '#f5576c'] as readonly [string, string],
    },
    {
        id: 3,
        icon: 'rocket-launch',
        title: 'Learn Anywhere',
        description: 'Access your lessons offline. Learn at your own pace, anytime, anywhere.',
        gradient: ['#4facfe', '#00f2fe'] as readonly [string, string],
    },
];

const ROLES = [
    { value: 'student', label: 'Student', icon: 'school', color: '#667eea' },
    { value: 'teacher', label: 'Teacher', icon: 'account-tie', color: '#f093fb' },
    { value: 'institute', label: 'Institute', icon: 'office-building', color: '#4facfe' },
    { value: 'admin', label: 'Admin', icon: 'shield-account', color: '#f5576c' },
];

const WelcomeScreen = ({ navigation }: any) => {
    const { login, register, loginAsGuest } = useAuth();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const scrollViewRef = useRef<ScrollView>(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher' | 'admin' | 'institute'>('student');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleScroll = (event: any) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentSlide(slideIndex);
    };

    const goToNextSlide = () => {
        if (currentSlide < SLIDES.length - 1) {
            scrollViewRef.current?.scrollTo({
                x: width * (currentSlide + 1),
                animated: true,
            });
        }
    };

    const handleAuth = async () => {
        if (!email || !password || (authMode === 'register' && !name)) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (authMode === 'login') {
                await login(email, password);
            } else {
                await register({ name, email, password, language: 'en', role });
            }
        } catch (e: any) {
            setError(e?.response?.data?.message || `${authMode === 'login' ? 'Login' : 'Registration'} failed. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const openAuthModal = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setShowAuthModal(true);
        setError('');
    };

    if (showAuthModal) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={SLIDES[currentSlide].gradient}
                    style={styles.background}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.modalScrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowAuthModal(false)}
                        >
                            <MaterialCommunityIcons name="close" size={28} color="#fff" />
                        </TouchableOpacity>

                        {/* Header */}
                        <Animated.View entering={FadeInDown.duration(600)} style={styles.modalHeader}>
                            <MaterialCommunityIcons
                                name={authMode === 'login' ? 'login' : 'account-plus'}
                                size={80}
                                color="#fff"
                            />
                            <Text style={styles.modalTitle}>
                                {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
                            </Text>
                            <Text style={styles.modalSubtitle}>
                                {authMode === 'login' ? 'Sign in to continue learning' : 'Join us and start learning'}
                            </Text>
                        </Animated.View>

                        {/* Form Card */}
                        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.formCard}>
                            {/* Name (Register only) */}
                            {authMode === 'register' && (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        mode="outlined"
                                        label="Full Name"
                                        value={name}
                                        onChangeText={setName}
                                        style={styles.input}
                                        outlineColor="#e0e0e0"
                                        activeOutlineColor="#667eea"
                                        theme={{ roundness: 12 }}
                                        left={<TextInput.Icon icon="account-outline" />}
                                    />
                                </View>
                            )}

                            {/* Email */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    mode="outlined"
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                    outlineColor="#e0e0e0"
                                    activeOutlineColor="#667eea"
                                    theme={{ roundness: 12 }}
                                    left={<TextInput.Icon icon="email-outline" />}
                                />
                            </View>

                            {/* Password */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    mode="outlined"
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    style={styles.input}
                                    outlineColor="#e0e0e0"
                                    activeOutlineColor="#667eea"
                                    theme={{ roundness: 12 }}
                                    left={<TextInput.Icon icon="lock-outline" />}
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? 'eye-off' : 'eye'}
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                />
                            </View>

                            {/* Role Selection (Register only) */}
                            {authMode === 'register' && (
                                <View style={styles.roleSection}>
                                    <Text style={styles.roleTitle}>Who are you?</Text>
                                    <View style={styles.roleGrid}>
                                        {ROLES.map((roleItem, index) => (
                                            <Animated.View
                                                key={roleItem.value}
                                                entering={ZoomIn.delay(400 + index * 100).duration(400)}
                                                style={styles.roleCardWrapper}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => setRole(roleItem.value as any)}
                                                    activeOpacity={0.7}
                                                >
                                                    <LinearGradient
                                                        colors={
                                                            role === roleItem.value
                                                                ? [roleItem.color, roleItem.color + 'dd']
                                                                : ['#f5f5f5', '#e0e0e0']
                                                        }
                                                        style={[
                                                            styles.roleCard,
                                                            role === roleItem.value && styles.roleCardActive
                                                        ]}
                                                    >
                                                        <MaterialCommunityIcons
                                                            name={roleItem.icon as any}
                                                            size={28}
                                                            color={role === roleItem.value ? '#fff' : '#666'}
                                                        />
                                                        <Text style={[
                                                            styles.roleLabel,
                                                            role === roleItem.value && styles.roleLabelActive
                                                        ]}>
                                                            {roleItem.label}
                                                        </Text>
                                                        {role === roleItem.value && (
                                                            <View style={styles.checkmark}>
                                                                <MaterialCommunityIcons name="check-circle" size={18} color="#4CAF50" />
                                                            </View>
                                                        )}
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Error Message */}
                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleAuth}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    style={styles.submitButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.submitButtonText}>
                                                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                                            </Text>
                                            <MaterialCommunityIcons
                                                name={authMode === 'login' ? 'arrow-right' : 'rocket-launch'}
                                                size={24}
                                                color="#fff"
                                            />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Guest Login (Login only) */}
                            {authMode === 'login' && (
                                <TouchableOpacity
                                    style={styles.guestButton}
                                    onPress={loginAsGuest}
                                >
                                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
                                </TouchableOpacity>
                            )}

                            {/* Toggle Auth Mode */}
                            <View style={styles.toggleContainer}>
                                <Text style={styles.toggleText}>
                                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                </Text>
                                <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                                    <Text style={styles.toggleLink}>
                                        {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={SLIDES[currentSlide].gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />

            {/* Decorative circles */}
            <View style={[styles.decorativeCircle, { top: -100, right: -100, width: 300, height: 300 }]} />
            <View style={[styles.decorativeCircle, { bottom: -80, left: -80, width: 250, height: 250 }]} />

            {/* Skip Button */}
            <TouchableOpacity style={styles.skipButton} onPress={loginAsGuest}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* Slides */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
            >
                {SLIDES.map((slide, index) => (
                    <View key={slide.id} style={styles.slide}>
                        <Animated.View
                            entering={currentSlide === index ? ZoomIn.delay(200).duration(600) : undefined}
                            style={styles.iconContainer}
                        >
                            <MaterialCommunityIcons name={slide.icon as any} size={120} color="#fff" />
                        </Animated.View>

                        <Animated.View
                            entering={currentSlide === index ? FadeInUp.delay(400).duration(600) : undefined}
                            style={styles.contentContainer}
                        >
                            <Text style={styles.slideTitle}>{slide.title}</Text>
                            <Text style={styles.slideDescription}>{slide.description}</Text>
                        </Animated.View>
                    </View>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {SLIDES.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            currentSlide === index && styles.paginationDotActive
                        ]}
                    />
                ))}
            </View>

            {/* Bottom Buttons */}
            <View style={styles.bottomContainer}>
                {currentSlide === SLIDES.length - 1 ? (
                    <>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => openAuthModal('login')}
                        >
                            <LinearGradient
                                colors={['#fff', '#f0f0f0']}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.primaryButtonText}>Login</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => openAuthModal('register')}
                        >
                            <Text style={styles.secondaryButtonText}>Create Account</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity onPress={goToNextSlide}>
                        <LinearGradient
                            colors={['#fff', '#f0f0f0']}
                            style={styles.nextButtonGradient}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
                            <MaterialCommunityIcons name="arrow-right" size={24} color="#667eea" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    decorativeCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 1000,
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    skipText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    slide: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    iconContainer: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    contentContainer: {
        alignItems: 'center',
    },
    slideTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    slideDescription: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: spacing.lg,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        width: 32,
        backgroundColor: '#fff',
    },
    bottomContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
        gap: spacing.md,
    },
    primaryButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#667eea',
    },
    secondaryButton: {
        paddingVertical: 18,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
        borderRadius: 16,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#667eea',
    },
    // Modal styles
    keyboardView: {
        flex: 1,
    },
    modalScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.xl,
        paddingTop: 80,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    modalTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    modalSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
        gap: spacing.lg,
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        backgroundColor: '#fff',
    },
    roleSection: {
        marginTop: spacing.sm,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    roleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'center',
    },
    roleCardWrapper: {
        width: '45%',
        minWidth: 130,
    },
    roleCard: {
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 90,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    roleCardActive: {
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    roleLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#666',
        marginTop: spacing.xs,
    },
    roleLabelActive: {
        color: '#fff',
    },
    checkmark: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#fff',
        borderRadius: 9,
    },
    errorText: {
        color: '#f44336',
        fontSize: 14,
        textAlign: 'center',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: spacing.sm,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    guestButton: {
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#667eea',
        alignItems: 'center',
    },
    guestButtonText: {
        color: '#667eea',
        fontSize: 16,
        fontWeight: '600',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleText: {
        color: '#666',
        fontSize: 14,
    },
    toggleLink: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default WelcomeScreen;
