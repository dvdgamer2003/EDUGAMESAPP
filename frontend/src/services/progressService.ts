import { getData, storeData } from '../offline/offlineStorage';

const PROGRESS_KEY = 'user_progress';

interface ProgressData {
    chapters: { [chapterId: string]: boolean };
    subjects: { [subjectId: string]: number }; // percentage
}

export const progressService = {
    // Get all progress data
    getProgress: async (): Promise<ProgressData> => {
        try {
            const progress = await getData(PROGRESS_KEY);
            return progress || { chapters: {}, subjects: {} };
        } catch (error) {
            return { chapters: {}, subjects: {} };
        }
    },

    // Mark a chapter as complete
    markChapterComplete: async (chapterId: string): Promise<void> => {
        try {
            const progress = await progressService.getProgress();
            progress.chapters[chapterId] = true;
            await storeData(PROGRESS_KEY, progress);
        } catch (error) {
            console.error('Failed to mark chapter complete:', error);
        }
    },

    // Check if a chapter is complete
    isChapterComplete: async (chapterId: string): Promise<boolean> => {
        try {
            const progress = await progressService.getProgress();
            return progress.chapters[chapterId] || false;
        } catch (error) {
            return false;
        }
    },

    // Calculate subject progress based on completed chapters
    calculateSubjectProgress: async (subjectId: string, chapterIds: string[]): Promise<number> => {
        try {
            if (chapterIds.length === 0) return 0;

            const progress = await progressService.getProgress();
            const completedCount = chapterIds.filter(id => progress.chapters[id]).length;
            return completedCount / chapterIds.length;
        } catch (error) {
            return 0;
        }
    },

    // Get chapter progress (0 or 1 for now, can be expanded later)
    getChapterProgress: async (chapterId: string): Promise<number> => {
        try {
            const isComplete = await progressService.isChapterComplete(chapterId);
            return isComplete ? 1 : 0;
        } catch (error) {
            return 0;
        }
    }
};
