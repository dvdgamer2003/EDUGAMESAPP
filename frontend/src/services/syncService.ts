import api from './api';
import { QueueItem } from '../offline/syncQueue';

/**
 * Sync a queue item to the backend
 */
export const syncItem = async (item: QueueItem): Promise<void> => {
    switch (item.type) {
        case 'SUBMIT_QUIZ_RESULT':
            await syncQuizResult(item.data);
            break;
        case 'SUBMIT_GAME_RESULT':
            await syncGameResult(item.data);
            break;
        case 'GENERIC_SYNC':
            await syncGeneric(item.data);
            break;
        default:
            throw new Error(`Unknown sync type: ${item.type}`);
    }
};

/**
 * Sync quiz result to backend
 */
const syncQuizResult = async (data: any): Promise<void> => {
    // TODO: Replace with actual endpoint when backend is ready
    // await api.post('/quiz_results', data);

    // Mock implementation
    console.log('[SyncService] Syncing quiz result:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * Sync game result to backend
 */
const syncGameResult = async (data: any): Promise<void> => {
    // TODO: Replace with actual endpoint when backend is ready
    // await api.post('/game_results', data);

    // Mock implementation
    console.log('[SyncService] Syncing game result:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * Generic sync for other data types
 */
const syncGeneric = async (data: any): Promise<void> => {
    // TODO: Replace with actual endpoint when backend is ready
    // await api.post('/sync', data);

    // Mock implementation
    console.log('[SyncService] Syncing generic data:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
};
