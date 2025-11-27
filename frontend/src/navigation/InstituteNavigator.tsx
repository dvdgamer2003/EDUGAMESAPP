import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InstituteHomeScreen from '../screens/institute/InstituteHomeScreen';
import TeacherListScreen from '../screens/institute/TeacherListScreen';
import CreateTeacherScreen from '../screens/institute/CreateTeacherScreen';
import EditTeacherScreen from '../screens/institute/EditTeacherScreen';
import InstituteAnalyticsScreen from '../screens/institute/InstituteAnalyticsScreen';
import SyllabusAssignScreen from '../screens/institute/SyllabusAssignScreen';
import ContentUploadScreen from '../screens/institute/ContentUploadScreen';
import QuizManagerScreen from '../screens/institute/QuizManagerScreen';
import InstituteDashboardScreen from '../screens/InstituteDashboardScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();

const InstituteNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InstituteHome" component={InstituteHomeScreen} />
            <Stack.Screen name="TeacherList" component={TeacherListScreen} />
            <Stack.Screen name="CreateTeacher" component={CreateTeacherScreen} />
            <Stack.Screen name="EditTeacher" component={EditTeacherScreen} />
            <Stack.Screen name="InstituteAnalytics" component={InstituteAnalyticsScreen} />
            <Stack.Screen name="SyllabusAssign" component={SyllabusAssignScreen} />
            <Stack.Screen name="ContentUpload" component={ContentUploadScreen} />
            <Stack.Screen name="QuizManager" component={QuizManagerScreen} />
            <Stack.Screen name="InstituteApprovals" component={InstituteDashboardScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
        </Stack.Navigator>
    );
};

export default InstituteNavigator;
