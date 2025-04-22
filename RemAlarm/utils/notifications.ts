import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export const requestNotificationPermissions = async () => {
    const settings = await Notifications.getPermissionsAsync();
    if (!settings.granted) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            console.error('Notification permissions not granted');
            return false;
        }
    }
};

export async function scheduleAlarmNotification(alarmID: string, hour: number, minute: number) {
    const now = new Date();
    const triggerDate = new Date();

    triggerDate.setHours(hour, minute, 0, 0); // Set the time for the trigger date

    if (triggerDate.getTime() <= now.getTime()) {
        triggerDate.setDate(triggerDate.getDate() + 1); // Schedule for the next day
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Alarm",
            body: "Your alarm is ringing!",
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { alarmID },
        },
        trigger: {
            type: SchedulableTriggerInputTypes.CALENDAR,
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
            repeats: false,
        },
    });
}

export const cancelAlarmNotification = async (notificationId: string) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log(`Alarm with ID: ${notificationId} cancelled`);
    } catch (error) {
        console.error(`Failed to cancel alarm with ID: ${notificationId}`, error);
    }
}
