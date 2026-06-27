import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const REMINDER_ID = 'daily-rec-reminder';

// Shown in the notification tray immediately when it fires
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function requestPermission(): Promise<boolean> {
  if (!Device.isDevice) return false; // simulators can't receive push notifications
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function scheduleReminder(hour: number, minute: number) {
  // Cancel any previous reminder with the same id before re-scheduling
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const existing = scheduled.find((n) => n.identifier === REMINDER_ID);
  if (existing) return; // already scheduled — don't double-book

  const messages = [
    { title: "Don't break the streak! 🔥", body: "Your today's breathwork is waiting. Just a few minutes can change your day." },
    { title: 'Your wellness check-in 🌿',  body: "You haven't completed today's recommendation yet. Take a breath — literally." },
    { title: 'Still time today ✨',         body: "Morning, afternoon, evening — pick one and complete your practice." },
  ];
  const pick = messages[new Date().getDay() % messages.length];

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: {
      title: pick.title,
      body:  pick.body,
      sound: true,
      data:  { screen: 'Recommend' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

async function cancelReminder() {
  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
}

/**
 * Call this hook in PranayamaScreen (Today's Rec).
 * - allDone = true  → cancel the reminder for today
 * - allDone = false → schedule a daily reminder at reminderHour:reminderMinute
 *                    (defaults to 20:00 = 8 pm)
 */
export function useNotifications(allDone: boolean, reminderHour = 20, reminderMinute = 0) {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const granted = await requestPermission();
      if (!granted || cancelled) return;

      if (allDone) {
        await cancelReminder();
      } else {
        await scheduleReminder(reminderHour, reminderMinute);
      }
    })();

    return () => { cancelled = true; };
  }, [allDone, reminderHour, reminderMinute]);
}

export { cancelReminder, scheduleReminder };
