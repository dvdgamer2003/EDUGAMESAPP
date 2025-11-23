import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import { useAuth } from '../../context/AuthContext';

const InstituteHomeScreen = () => {
    const navigation = useNavigation();
    const { logout, user } = useAuth();

    const menuItems = [
        { title: 'Teachers', icon: 'people', screen: 'TeacherList', color: '#4F46E5' },
        { title: 'Analytics', icon: 'bar-chart', screen: 'InstituteAnalytics', color: '#10B981' },
        { title: 'Assign Syllabus', icon: 'book', screen: 'SyllabusAssign', color: '#F59E0B' },
        { title: 'Upload Content', icon: 'cloud-upload', screen: 'ContentUpload', color: '#EC4899' },
        { title: 'Quiz Manager', icon: 'help-circle', screen: 'QuizManager', color: '#8B5CF6' },
    ];

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Institute Dashboard</Text>
                        <Text style={styles.subtitle}>Welcome, {user?.name}</Text>
                    </View>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                <View style={styles.grid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.cardWrapper}
                            onPress={() => (navigation as any).navigate(item.screen)}
                        >
                            <CustomCard style={styles.card}>
                                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                                    <Ionicons name={item.icon as any} size={32} color={item.color} />
                                </View>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                            </CustomCard>
                        </TouchableOpacity>
                    ))}
                </View>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#E5E7EB',
        marginTop: 4,
    },
    logoutButton: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '48%',
        marginBottom: 20,
    },
    card: {
        alignItems: 'center',
        padding: 20,
        height: 150,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
    },
});

export default InstituteHomeScreen;
