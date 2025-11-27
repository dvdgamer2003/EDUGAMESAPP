import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import InstituteListScreen from '../screens/admin/InstituteListScreen';
import CreateInstituteScreen from '../screens/admin/CreateInstituteScreen';
import EditInstituteScreen from '../screens/admin/EditInstituteScreen';
import GlobalAnalyticsScreen from '../screens/admin/GlobalAnalyticsScreen';
import GlobalSyllabusManagerScreen from '../screens/admin/GlobalSyllabusManagerScreen';
import QuizBankManagerScreen from '../screens/admin/QuizBankManagerScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
            <Stack.Screen name="InstituteList" component={InstituteListScreen} />
            <Stack.Screen name="CreateInstitute" component={CreateInstituteScreen} />
            <Stack.Screen name="EditInstitute" component={EditInstituteScreen} />
            <Stack.Screen name="GlobalAnalytics" component={GlobalAnalyticsScreen} />
            <Stack.Screen name="GlobalSyllabusManager" component={GlobalSyllabusManagerScreen} />
            <Stack.Screen name="QuizBankManager" component={QuizBankManagerScreen} />
            <Stack.Screen name="AdminApprovals" component={AdminDashboardScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
        </Stack.Navigator>
    );
};

export default AdminNavigator;
