import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { isWeb } from '../../utils/helpers';
import { useResponsive } from '../../hooks/useResponsive';
import { useTranslation } from '../../i18n';
import CustomButton from '../../components/ui/CustomButton';
import CustomCard from '../../components/ui/CustomCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { spacing, borderRadius } from '../../theme';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'od', label: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

const OnboardingScreen = ({ navigation }: any) => {
    const theme = useTheme();
    const { isMobile, responsiveValue } = useResponsive();
    const { language, setLanguage, t } = useTranslation();
    const [selectedLang, setSelectedLang] = useState<string>(language);

    const handleLanguageSelect = async (lang: string) => {
        setSelectedLang(lang);
        await setLanguage(lang as 'en' | 'hi' | 'od');
    };

    const handleContinue = () => {
        if (selectedLang) {
            navigation.replace('Login');
        }
    };

    // Responsive animation sizes
    const animationSize = responsiveValue(200, 280, 350);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

            {/* Solid Header */}
            <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.animationContainer}>
                    {isWeb ? (
                        <DotLottieReact
                            src="https://lottie.host/5634562b-2345-4324-2345-234523452345/welcome.lottie"
                            loop
                            autoplay
                            style={{ width: animationSize, height: animationSize }}
                        />
                    ) : (
                        <LottieView
                            source={require('../../assets/lottie/welcome.json')}
                            autoPlay
                            loop
                            style={{ width: animationSize, height: animationSize }}
                        />
                    )}
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.titleContainer}>
                    <Text variant="displaySmall" style={styles.title}>
                        {t('onboarding.title')}
                    </Text>
                    <Text variant="titleMedium" style={styles.subtitle}>
                        {t('onboarding.subtitle')}
                    </Text>
                </Animated.View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.contentContainer}>
                    <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.languageContainer}>
                        <Text variant="titleLarge" style={[styles.languageTitle, { color: theme.colors.onSurface }]}>
                            {t('onboarding.selectLanguage')}
                        </Text>

                        <View style={styles.languageGrid}>
                            {LANGUAGES.map((lang, index) => (
                                <Animated.View
                                    key={lang.code}
                                    entering={FadeInUp.delay(600 + index * 100).duration(500)}
                                    style={styles.languageCardWrapper}
                                >
                                    <CustomCard
                                        onPress={() => handleLanguageSelect(lang.code)}
                                        elevation={selectedLang === lang.code ? 4 : 1}
                                        style={[
                                            styles.languageCard,
                                            selectedLang === lang.code && {
                                                borderColor: theme.colors.primary,
                                                borderWidth: 2,
                                                backgroundColor: theme.colors.surface
                                            }
                                        ]}
                                    >
                                        <View style={styles.languageCardContent}>
                                            <Text style={styles.flag}>{lang.flag}</Text>
                                            <Text
                                                variant="titleMedium"
                                                style={[
                                                    styles.languageLabel,
                                                    selectedLang === lang.code && { color: theme.colors.primary, fontWeight: '700' },
                                                ]}
                                            >
                                                {lang.label}
                                            </Text>
                                            {selectedLang === lang.code && (
                                                <View style={[styles.checkmark, { backgroundColor: theme.colors.primary }]}>
                                                    <Text style={styles.checkmarkText}>✓</Text>
                                                </View>
                                            )}
                                        </View>
                                    </CustomCard>
                                </Animated.View>
                            ))}
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(900).duration(600)} style={styles.buttonContainer}>
                        <CustomButton
                            variant="primary"
                            size="large"
                            onPress={handleContinue}
                            disabled={!selectedLang}
                            icon="arrow-right"
                            iconPosition="right"
                            fullWidth
                        >
                            {t('onboarding.continue')}
                        </CustomButton>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: spacing.xxxl,
        paddingBottom: spacing.xxl,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
    },
    contentContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    animationContainer: {
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    title: {
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.sm,
        color: '#FFFFFF',
    },
    subtitle: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    languageContainer: {
        width: '100%',
        maxWidth: 500,
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
    languageTitle: {
        textAlign: 'center',
        marginBottom: spacing.lg,
        fontWeight: '700',
    },
    languageGrid: {
        gap: spacing.md,
    },
    languageCardWrapper: {
        width: '100%',
    },
    languageCard: {
        borderRadius: borderRadius.xl,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    languageCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        gap: spacing.lg,
    },
    flag: {
        fontSize: 32,
    },
    languageLabel: {
        flex: 1,
        fontWeight: '500',
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
        marginTop: spacing.sm,
        marginBottom: spacing.xl,
    },
});

export default OnboardingScreen;
