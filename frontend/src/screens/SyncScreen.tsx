import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Chip, useTheme, IconButton, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn, useAnimatedStyle, withRepeat, withTiming, useSharedValue, Easing } from 'react-native-reanimated';
import { useSync } from '../context/SyncContext';
import { getQueueItems, clearQueue, QueueItem } from '../offline/syncQueue';
import { spacing } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

const SyncScreen = ({ navigation }: any) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { isSyncing, isOffline, syncNow } = useSync();
    const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const { containerStyle } = useResponsive();

    // Animation for sync icon
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (isSyncing) {
            rotation.value = withRepeat(
                withTiming(360, { duration: 1000, easing: Easing.linear }),
                -1
            );
        } else {
            rotation.value = 0;
        }
    }, [isSyncing]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const loadQueueItems = async () => {
        const items = await getQueueItems();
        setQueueItems(items);
    };

    useEffect(() => {
        loadQueueItems();
    }, [isSyncing]); // Reload when sync status changes

    const handleManualSync = async () => {
        await syncNow();
        await loadQueueItems();
    };

    const handleClearQueue = async () => {
        await clearQueue();
        await loadQueueItems();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadQueueItems();
        setRefreshing(false);
    };

    const getTypeLabel = (type: QueueItem['type']) => {
        switch (type) {
            case 'SUBMIT_QUIZ_RESULT': return 'Quiz Result';
            case 'SUBMIT_GAME_RESULT': return 'Game Result';
            case 'GENERIC_SYNC': return 'Generic Data';
            default: return type;
        }
    };

    const getTypeIcon = (type: QueueItem['type']) => {
        switch (type) {
            case 'SUBMIT_QUIZ_RESULT': return 'school-outline';
            case 'SUBMIT_GAME_RESULT': return 'gamepad-variant-outline';
            case 'GENERIC_SYNC': return 'sync';
            default: return 'file-document-outline';
        }
    };

    const retryCount = queueItems.filter((item) => item.retryCount > 0).length;

    return (
        <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
            <ScrollView
                contentContainerStyle={[styles.content, containerStyle, { paddingTop: insets.top }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <LinearGradient
                    colors={['#4c669f', '#3b5998', '#192f6a']}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <IconButton
                            icon="arrow-left"
                            iconColor="#fff"
                            size={24}
                            onPress={() => navigation.goBack()}
                        />
                        <Text variant="headlineSmall" style={styles.headerTitle}>
                            Sync Status
                        </Text>
                        <View style={{ width: 48 }} />
                    </View>
                </LinearGradient>

                {/* Status Card */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <Surface style={styles.statusCard} elevation={4}>
                        <LinearGradient
                            colors={isOffline ? ['#FF5252', '#D32F2F'] : ['#4CAF50', '#2E7D32']}
                            style={styles.statusGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.statusRow}>
                                <Animated.View style={isSyncing ? animatedIconStyle : {}}>
                                    <MaterialCommunityIcons
                                        name={isSyncing ? 'loading' : (isOffline ? 'cloud-off-outline' : 'cloud-check-outline')}
                                        size={40}
                                        color="#fff"
                                    />
                                </Animated.View>
                                <View style={styles.statusTextContainer}>
                                    <Text variant="titleLarge" style={styles.statusTitle}>
                                        {isSyncing ? 'Syncing...' : (isOffline ? 'Offline Mode' : 'Online & Synced')}
                                    </Text>
                                    <Text variant="bodyMedium" style={styles.statusSubtitle}>
                                        {isSyncing
                                            ? 'Uploading your progress...'
                                            : (isOffline ? 'Changes will sync when online' : 'Your data is up to date')}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </Surface>
                </Animated.View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.statCol}>
                        <Surface style={styles.statCard} elevation={2}>
                            <Text variant="displayMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                {queueItems.length}
                            </Text>
                            <Text variant="bodyMedium" style={styles.statLabel}>Pending Items</Text>
                        </Surface>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.statCol}>
                        <Surface style={styles.statCard} elevation={2}>
                            <Text variant="displayMedium" style={{ color: retryCount > 0 ? '#FF9800' : theme.colors.secondary, fontWeight: 'bold' }}>
                                {retryCount}
                            </Text>
                            <Text variant="bodyMedium" style={styles.statLabel}>Retrying</Text>
                        </Surface>
                    </Animated.View>
                </View>

                {/* Action Buttons */}
                <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.actionButtons}>
                    <Button
                        mode="contained"
                        onPress={handleManualSync}
                        loading={isSyncing}
                        disabled={isSyncing || isOffline || queueItems.length === 0}
                        icon="sync"
                        style={styles.syncButton}
                        contentStyle={{ height: 48 }}
                    >
                        Sync Now
                    </Button>

                    {queueItems.length > 0 && (
                        <Button
                            mode="outlined"
                            onPress={handleClearQueue}
                            disabled={isSyncing}
                            icon="delete-sweep-outline"
                            style={styles.clearButton}
                            textColor={theme.colors.error}
                        >
                            Clear Queue
                        </Button>
                    )}
                </Animated.View>

                {/* Queue List */}
                <Text variant="titleMedium" style={styles.sectionTitle}>Queue Items</Text>

                {queueItems.length === 0 ? (
                    <Animated.View entering={ZoomIn.delay(500)} style={styles.emptyState}>
                        <MaterialCommunityIcons name="check-circle" size={80} color="#E0E0E0" />
                        <Text variant="titleMedium" style={styles.emptyText}>All caught up!</Text>
                        <Text variant="bodyMedium" style={styles.emptySubtext}>No pending items to sync</Text>
                    </Animated.View>
                ) : (
                    <View style={styles.listContainer}>
                        {queueItems.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInDown.delay(500 + (index * 100)).duration(500)}
                            >
                                <Surface style={styles.itemCard} elevation={1}>
                                    <View style={styles.itemIconContainer}>
                                        <LinearGradient
                                            colors={['#e3f2fd', '#bbdefb']}
                                            style={styles.itemIconBg}
                                        >
                                            <MaterialCommunityIcons name={getTypeIcon(item.type)} size={24} color={theme.colors.primary} />
                                        </LinearGradient>
                                    </View>
                                    <View style={styles.itemContent}>
                                        <Text variant="titleSmall" style={styles.itemTitle}>{getTypeLabel(item.type)}</Text>
                                        <Text variant="bodySmall" style={styles.itemTime}>
                                            {new Date(item.timestamp).toLocaleTimeString()} • {new Date(item.timestamp).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    {item.retryCount > 0 && (
                                        <Chip
                                            icon="alert-circle-outline"
                                            mode="flat"
                                            style={{ backgroundColor: '#FFF3E0' }}
                                            textStyle={{ color: '#F57C00', fontSize: 10 }}
                                        >
                                            Retry {item.retryCount}
                                        </Chip>
                                    )}
                                </Surface>
                            </Animated.View>
                        ))}
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    header: {
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 4,
        marginBottom: 24,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        height: 56,
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold',
    },
    statusCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
    },
    statusGradient: {
        padding: 24,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusTextContainer: {
        marginLeft: 20,
        flex: 1,
    },
    statusTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statusSubtitle: {
        color: 'rgba(255,255,255,0.9)',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    statCol: {
        flex: 1,
    },
    statCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        color: '#757575',
        marginTop: 4,
    },
    actionButtons: {
        gap: 12,
        marginBottom: 32,
    },
    syncButton: {
        borderRadius: 12,
    },
    clearButton: {
        borderRadius: 12,
        borderColor: '#FFEBEE',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#424242',
    },
    listContainer: {
        gap: 12,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    itemIconContainer: {
        marginRight: 16,
    },
    itemIconBg: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontWeight: 'bold',
        color: '#424242',
    },
    itemTime: {
        color: '#9E9E9E',
        marginTop: 2,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#BDBDBD',
        marginTop: 16,
        fontWeight: 'bold',
    },
    emptySubtext: {
        color: '#E0E0E0',
        marginTop: 4,
    },
});

export default SyncScreen;
