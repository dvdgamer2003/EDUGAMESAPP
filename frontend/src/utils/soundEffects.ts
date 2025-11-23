import { Audio } from 'expo-av';

class SoundManager {
    private correctSound: Audio.Sound | null = null;
    private wrongSound: Audio.Sound | null = null;
    private clickSound: Audio.Sound | null = null;
    private successSound: Audio.Sound | null = null;
    private isEnabled: boolean = true;
    private isInitialized: boolean = false;

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Set audio mode
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });

            // Load sounds from local assets
            // Using try-catch individually to prevent one failure from stopping others
            try {
                this.correctSound = await this.loadSound(require('../assets/sounds/correct.mp3'));
            } catch (e) {
                console.log('Failed to load correct.mp3');
            }

            try {
                this.wrongSound = await this.loadSound(require('../assets/sounds/wrong.mp3'));
            } catch (e) {
                console.log('Failed to load wrong.mp3');
            }

            try {
                this.clickSound = await this.loadSound(require('../assets/sounds/click.mp3'));
            } catch (e) {
                console.log('Failed to load click.mp3');
            }

            try {
                this.successSound = await this.loadSound(require('../assets/sounds/success.mp3'));
            } catch (e) {
                console.log('Failed to load success.mp3');
            }

            this.isInitialized = true;
            console.log('Sound Manager initialized with local sounds');
        } catch (error) {
            console.log('Error initializing sound manager:', error);
        }
    }

    private async loadSound(source: any): Promise<Audio.Sound | null> {
        try {
            const { sound } = await Audio.Sound.createAsync(source, {
                shouldPlay: false,
                volume: 0.8,
            });
            return sound;
        } catch (error) {
            console.log('Error loading sound asset:', error);
            return null;
        }
    }

    async playCorrect() {
        if (!this.isEnabled || !this.correctSound) return;
        try {
            await this.correctSound.replayAsync();
        } catch (error) {
            console.log('Error playing correct sound:', error);
        }
    }

    async playWrong() {
        if (!this.isEnabled || !this.wrongSound) return;
        try {
            await this.wrongSound.replayAsync();
        } catch (error) {
            console.log('Error playing wrong sound:', error);
        }
    }

    async playClick() {
        if (!this.isEnabled || !this.clickSound) return;
        try {
            await this.clickSound.replayAsync();
        } catch (error) {
            console.log('Error playing click sound:', error);
        }
    }

    async playSuccess() {
        if (!this.isEnabled || !this.successSound) return;
        try {
            await this.successSound.replayAsync();
        } catch (error) {
            console.log('Error playing success sound:', error);
        }
    }

    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    getEnabled(): boolean {
        return this.isEnabled;
    }

    async cleanup() {
        try {
            if (this.correctSound) {
                await this.correctSound.unloadAsync();
                this.correctSound = null;
            }
            if (this.wrongSound) {
                await this.wrongSound.unloadAsync();
                this.wrongSound = null;
            }
            if (this.clickSound) {
                await this.clickSound.unloadAsync();
                this.clickSound = null;
            }
            if (this.successSound) {
                await this.successSound.unloadAsync();
                this.successSound = null;
            }
            this.isInitialized = false;
        } catch (error) {
            console.log('Error cleaning up sounds:', error);
        }
    }
}

export const soundManager = new SoundManager();
