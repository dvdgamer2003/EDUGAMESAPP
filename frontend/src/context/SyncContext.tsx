import React, { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { processQueue, getQueueItems, subscribeToQueue } from '../offline/syncQueue';

interface SyncContextType {
    isSyncing: boolean;
    isOffline: boolean;
    pendingItems: number;
    syncNow: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [pendingItems, setPendingItems] = useState(0);

    useEffect(() => {
        const unsubscribeNet = NetInfo.addEventListener(state => {
            setIsOffline(!state.isConnected);
            if (state.isConnected) {
                syncNow();
            }
        });

        // Subscribe to queue changes
        const unsubscribeQueue = subscribeToQueue((items) => {
            setPendingItems(items.length);
        });

        return () => {
            unsubscribeNet();
            unsubscribeQueue();
        };
    }, []);

    const syncNow = async () => {
        if (isSyncing) return;

        setIsSyncing(true);
        try {
            await processQueue();
            // Queue update will be handled by subscription
        } catch (error) {
            console.error('Sync failed', error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <SyncContext.Provider value={{ isSyncing, isOffline, pendingItems, syncNow }}>
            {children}
        </SyncContext.Provider>
    );
};

export const useSync = () => {
    const context = useContext(SyncContext);
    if (!context) {
        throw new Error('useSync must be used within a SyncProvider');
    }
    return context;
};
