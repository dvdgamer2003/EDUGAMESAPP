import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LearnDashboardScreen from '../screens/Learn/LearnDashboardScreen';
import ClassSelectionScreen from '../screens/Learn/ClassSelectionScreen';
import SubjectSelectionScreen from '../screens/Learn/SubjectSelectionScreen';
import ChapterListScreen from '../screens/Learn/ChapterListScreen';
import SubchapterListScreen from '../screens/Learn/SubchapterListScreen';
import SubchapterScreen from '../screens/Learn/SubchapterScreen';
import SubchapterQuizScreen from '../screens/Learn/SubchapterQuizScreen';
import SimulationListScreen from '../screens/Learn/SimulationListScreen';
import QuizScreen from '../screens/QuizScreen';
import LessonReaderScreen from '../screens/Learn/LessonReaderScreen';
import ModelListScreen from '../screens/ModelListScreen';
import ThreeDModelScreen from '../screens/ThreeDModelScreen';

const Stack = createNativeStackNavigator();

const LearnNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
            initialRouteName="LearnDashboard"
        >
            <Stack.Screen name="LearnDashboard" component={LearnDashboardScreen} />
            <Stack.Screen name="ClassSelection" component={ClassSelectionScreen} />
            <Stack.Screen name="SubjectSelection" component={SubjectSelectionScreen} />
            <Stack.Screen name="ChapterList" component={ChapterListScreen} />
            <Stack.Screen name="SubchapterList" component={SubchapterListScreen} />
            <Stack.Screen name="Subchapter" component={SubchapterScreen} />
            <Stack.Screen name="SubchapterQuiz" component={SubchapterQuizScreen} />
            <Stack.Screen name="SimulationList" component={SimulationListScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen name="LessonReader" component={LessonReaderScreen} />
            <Stack.Screen name="ModelList" component={ModelListScreen} />
            <Stack.Screen name="ThreeDModel" component={ThreeDModelScreen} />
        </Stack.Navigator>
    );
};

export default LearnNavigator;
