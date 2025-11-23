import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherHomeScreen from '../screens/teacher/TeacherHomeScreen';
import StudentListScreen from '../screens/teacher/StudentListScreen';
import CreateStudentScreen from '../screens/teacher/CreateStudentScreen';
import EditStudentScreen from '../screens/teacher/EditStudentScreen';
import StudentAnalyticsScreen from '../screens/teacher/StudentAnalyticsScreen';
import ChapterAssignScreen from '../screens/teacher/ChapterAssignScreen';
import TeacherContentManagerScreen from '../screens/teacher/TeacherContentManagerScreen';
import TeacherQuizCreatorScreen from '../screens/teacher/TeacherQuizCreatorScreen';

const Stack = createNativeStackNavigator();

const TeacherNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} />
            <Stack.Screen name="StudentList" component={StudentListScreen} />
            <Stack.Screen name="CreateStudent" component={CreateStudentScreen} />
            <Stack.Screen name="EditStudent" component={EditStudentScreen} />
            <Stack.Screen name="StudentAnalytics" component={StudentAnalyticsScreen} />
            <Stack.Screen name="ChapterAssign" component={ChapterAssignScreen} />
            <Stack.Screen name="TeacherContentManager" component={TeacherContentManagerScreen} />
            <Stack.Screen name="TeacherQuizCreator" component={TeacherQuizCreatorScreen} />
        </Stack.Navigator>
    );
};

export default TeacherNavigator;
