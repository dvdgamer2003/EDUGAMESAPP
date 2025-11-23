import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import api from '../../services/api';

const InstituteAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTeachers: 0,
        totalStudents: 0,
        avgQuizScore: 0,
        chapterCompletionRate: 0,
        mostActiveGrades: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/institute/analytics');
            setStats(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }: any) => (
        <CustomCard style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
        </CustomCard>
    );

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Institute Analytics</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
                ) : (
                    <View>
                        <View style={styles.grid}>
                            <StatCard
                                title="Total Teachers"
                                value={stats.totalTeachers}
                                icon="people"
                                color="#4F46E5"
                            />
                            <StatCard
                                title="Total Students"
                                value={stats.totalStudents}
                                icon="school"
                                color="#10B981"
                            />
                            <StatCard
                                title="Avg Quiz Score"
                                value={`${stats.avgQuizScore}%`}
                                icon="ribbon"
                                color="#F59E0B"
                            />
                            <StatCard
                                title="Completion Rate"
                                value={`${stats.chapterCompletionRate}%`}
                                icon="checkmark-circle"
                                color="#EC4899"
                            />
                        </View>

                        <CustomCard style={styles.gradesCard}>
                            <Text style={styles.sectionTitle}>Most Active Grades</Text>
                            {stats.mostActiveGrades.length > 0 ? (
                                stats.mostActiveGrades.map((grade, index) => (
                                    <View key={index} style={styles.gradeRow}>
                                        <View style={styles.gradeRank}>
                                            <Text style={styles.rankText}>{index + 1}</Text>
                                        </View>
                                        <Text style={styles.gradeName}>{grade}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No data available</Text>
                            )}
                        </CustomCard>
                    </View>
                )}
            </ScrollView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        marginBottom: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statTitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    gradesCard: {
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 15,
    },
    gradeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    gradeRank: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        color: '#4F46E5',
        fontWeight: 'bold',
        fontSize: 12,
    },
    gradeName: {
        fontSize: 16,
        color: '#374151',
    },
    emptyText: {
        color: '#6B7280',
        fontStyle: 'italic',
    },
});

export default InstituteAnalyticsScreen;
