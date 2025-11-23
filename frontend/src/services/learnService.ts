import api from './api';
import { getData, storeData } from '../offline/offlineStorage';
import { STORAGE_KEYS } from '../utils/constants';

const CACHE_PREFIX = 'learn_cache_';

export const learnService = {
    getClasses: async () => {
        try {
            const response = await api.get('/learn/classes');
            await storeData(`${CACHE_PREFIX}classes`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}classes`);
            if (cached) return cached;
            throw error;
        }
    },

    getSubjects: async (classId: string) => {
        try {
            const response = await api.get(`/learn/classes/${classId}/subjects`);
            await storeData(`${CACHE_PREFIX}subjects_${classId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}subjects_${classId}`);
            if (cached) return cached;
            throw error;
        }
    },

    getChapters: async (subjectId: string) => {
        try {
            const response = await api.get(`/learn/subjects/${subjectId}/chapters`);
            await storeData(`${CACHE_PREFIX}chapters_${subjectId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}chapters_${subjectId}`);
            if (cached) return cached;
            throw error;
        }
    },

    getSubchapters: async (chapterId: string) => {
        try {
            const response = await api.get(`/learn/chapters/${chapterId}/subchapters`);
            await storeData(`${CACHE_PREFIX}subchapters_${chapterId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}subchapters_${chapterId}`);
            if (cached) return cached;
            throw error;
        }
    },

    getSubchapter: async (id: string) => {
        try {
            const response = await api.get(`/learn/subchapters/${id}`);
            await storeData(`${CACHE_PREFIX}subchapter_${id}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}subchapter_${id}`);
            if (cached) return cached;
            throw error;
        }
    },

    getQuiz: async (subchapterId: string) => {
        try {
            const response = await api.get(`/learn/subchapters/${subchapterId}/quiz`);
            await storeData(`${CACHE_PREFIX}quiz_${subchapterId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}quiz_${subchapterId}`);
            if (cached) return cached;
            throw error;
        }
    },

    getChapterContent: async (chapterId: string) => {
        try {
            const response = await api.get(`/learn/chapters/${chapterId}/content`);
            await storeData(`${CACHE_PREFIX}chapter_content_${chapterId}`, response.data);
            return response.data;
        } catch (error) {
            const cached = await getData(`${CACHE_PREFIX}chapter_content_${chapterId}`);
            if (cached) return cached;
            throw error;
        }
    }
};
