import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, useTheme, ProgressBar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { spacing, borderRadius } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

import { useResponsive } from '../hooks/useResponsive';

const { width } = Dimensions.get('window');

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    requiredXP: number;
}

const RewardsScreen = () => {
    const theme = useTheme();
    const { xp, streak } = useAuth();
    const { containerStyle } = useResponsive();

    const level = Math.floor(xp / 100) + 1;
    const currentLevelXP = xp % 100;
    const nextLevelXP = 100;
    const progress = currentLevelXP / nextLevelXP;

    const badges: Badge[] = [
        { id: '1', name: 'First Steps', description: 'Complete your first quiz', icon: 'star', unlocked: xp >= 10, requiredXP: 10 },
        { id: '2', name: 'Quick Learner', description: 'Earn 100 XP', icon: 'flash', unlocked: xp >= 100, requiredXP: 100 },
        { id: '3', name: 'Dedicated', description: 'Maintain a 7-day streak', icon: 'fire', unlocked: streak >= 7, requiredXP: 0 },
        { id: '4', name: 'Scholar', description: 'Reach Level 5', icon: 'school', unlocked: level >= 5, requiredXP: 500 },
        { id: '5', name: 'Expert', description: 'Earn 1000 XP', icon: 'trophy', unlocked: xp >= 1000, requiredXP: 1000 },
        { id: '6', name: 'Game Master', description: 'Win 10 games', icon: 'gamepad-variant', unlocked: false, requiredXP: 0 },
    ];

    const unlockedBadges = badges.filter((b) => b.unlocked);
    const lockedBadges = badges.filter((b) => !b.unlocked);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={[styles.content, containerStyle]} showsVerticalScrollIndicator={false}>
                <Text variant="headlineMedium" style={styles.screenTitle}>
                    Rewards & Progress
                </Text>

                {/* Level Card */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <Surface style={styles.levelCard} elevation={2}>
                        <View style={styles.levelHeader}>
                            <View style={styles.levelCircle}>
                                <Text style={styles.levelNumber}>{level}</Text>
                            </View>
                            <View style={styles.levelInfo}>
                                <Text variant="titleLarge" style={styles.levelTitle}>Level {level}</Text>
                                <Text variant="bodyMedium" style={styles.levelSubtitle}>
                                    <Text style={{ color: '#FF4081', fontWeight: 'bold' }}>{currentLevelXP}</Text> / {nextLevelXP} XP
                                </Text>
                            </View>
                        </View>

                        <View style={styles.progressContainer}>
                            <ProgressBar progress={progress} color="#6A5AE0" style={styles.progressBar} />
                        </View>

                        <Text style={styles.xpToNextLevel}>
                            {nextLevelXP - currentLevelXP} XP to Level {level + 1}
                        </Text>
                    </Surface>
                </Animated.View>

                {/* Streak Card */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <Surface style={styles.streakCard} elevation={4}>
                        <View style={styles.streakContent}>
                            <MaterialCommunityIcons name="fire" size={48} color="#FF5722" />
                            <Text style={styles.streakNumber}>{streak}</Text>
                            <Text variant="titleMedium" style={styles.streakLabel}>Day Streak</Text>
                            <Text style={styles.streakMotivation}>
                                Keep learning daily to maintain your streak!
                            </Text>
                        </View>
                    </Surface>
                </Animated.View>

                {/* Unlocked Badges */}
                <View style={styles.sectionContainer}>
                    <Text variant="titleLarge" style={styles.sectionTitle}>
                        Unlocked Badges ({unlockedBadges.length})
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
                        {unlockedBadges.map((badge, index) => (
                            <Animated.View key={badge.id} entering={FadeInRight.delay(300 + index * 100).duration(500)}>
                                <Surface style={styles.badgeCard} elevation={2}>
                                    <View style={[styles.badgeIcon, { backgroundColor: '#6A5AE0' }]}>
                                        <MaterialCommunityIcons name={badge.icon as any} size={28} color="#fff" />
                                    </View>
                                    <View style={styles.badgeInfo}>
                                        <Text variant="titleMedium" style={styles.badgeName}>{badge.name}</Text>
                                        <Text variant="bodySmall" style={styles.badgeDescription} numberOfLines={2}>
                                            {badge.description}
                                        </Text>
                                    </View>
                                </Surface>
                            </Animated.View>
                        ))}
                        {unlockedBadges.length === 0 && (
                            <Text style={styles.emptyText}>Start learning to unlock badges!</Text>
                        )}
                    </ScrollView>
                </View>

                {/* Locked Badges */}
                <View style={styles.sectionContainer}>
                    <Text variant="titleLarge" style={styles.sectionTitle}>
                        Locked Badges
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
                        {lockedBadges.map((badge, index) => (
                            <Surface key={badge.id} style={[styles.badgeCard, styles.lockedBadge]} elevation={1}>
                                <View style={[styles.badgeIcon, { backgroundColor: '#E0E0E0' }]}>
                                    <MaterialCommunityIcons name="lock" size={28} color="#9E9E9E" />
                                </View>
                                <View style={styles.badgeInfo}>
                                    <Text variant="titleMedium" style={[styles.badgeName, { color: '#9E9E9E' }]}>{badge.name}</Text>
                                    <Text variant="bodySmall" style={styles.badgeDescription} numberOfLines={2}>
                                        {badge.description}
                                    </Text>
                                    {badge.requiredXP > 0 && (
                                        <Text style={styles.xpNeeded}>{badge.requiredXP} XP needed</Text>
                                    )}
                                </View>
                            </Surface>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    content: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    screenTitle: {
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: spacing.lg,
        fontSize: 28,
    },
    levelCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    levelCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#6A5AE0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        shadowColor: '#6A5AE0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    levelNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    levelInfo: {
        flex: 1,
    },
    levelTitle: {
        fontWeight: '800',
        color: '#1A1A1A',
        fontSize: 20,
    },
    levelSubtitle: {
        color: '#666',
        fontWeight: '600',
    },
    progressContainer: {
        height: 12,
        backgroundColor: '#F0F0F0',
        borderRadius: 6,
        marginBottom: spacing.sm,
        overflow: 'hidden',
    },
    progressBar: {
        height: 12,
        borderRadius: 6,
        backgroundColor: '#6A5AE0',
    },
    xpToNextLevel: {
        textAlign: 'center',
        color: '#888',
        fontSize: 13,
        fontWeight: '500',
    },
    streakCard: {
        backgroundColor: '#fff',
        borderRadius: 100, // Pill shape
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    streakContent: {
        alignItems: 'center',
    },
    streakNumber: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FF5722',
        marginVertical: 4,
    },
    streakLabel: {
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: spacing.sm,
    },
    streakMotivation: {
        color: '#FF4081',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    sectionContainer: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: spacing.md,
        fontSize: 20,
    },
    badgesScroll: {
        paddingRight: spacing.lg,
        paddingBottom: spacing.md, // For shadow
    },
    badgeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 50, // Pill shape
        padding: spacing.md,
        paddingRight: spacing.xl,
        marginRight: spacing.md,
        minWidth: 220,
        maxWidth: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    lockedBadge: {
        opacity: 0.8,
        backgroundColor: '#FAFAFA',
    },
    badgeIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    badgeInfo: {
        flex: 1,
    },
    badgeName: {
        fontWeight: '700',
        color: '#1A1A1A',
        fontSize: 16,
        marginBottom: 2,
    },
    badgeDescription: {
        color: '#666',
        fontSize: 12,
        lineHeight: 16,
    },
    xpNeeded: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
        fontWeight: '600',
    },
    emptyText: {
        color: '#888',
        fontStyle: 'italic',
        marginLeft: spacing.sm,
    },
});

export default RewardsScreen;
