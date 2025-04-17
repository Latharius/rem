import { Audio } from "expo-av";

let currentSound: Audio.Sound | null = null;

export async function playTone(toneFile: any) {
    try {
        if (currentSound) {
            await currentSound.stopAsync();
            await currentSound.unloadAsync();
            currentSound = null;
        }

        const { sound } = await Audio.Sound.createAsync(toneFile, { shouldPlay: true });
        currentSound = sound;
    } catch (error) {
        console.error("Error playing tone:", error);
    }
}

export async function stopTone() {
    try {
        if (currentSound) {
            currentSound.stopAsync();
            currentSound.unloadAsync();
            currentSound = null;
        }
    } catch (error) {
        console.error("Error stopping tone:", error);
    }
}