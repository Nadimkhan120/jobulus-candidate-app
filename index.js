/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/app';
import { name as appName } from './app.json';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

// Note that an async function or a function that returns a Promise
async function onMessageReceived(message) {
  console.log('message', message);

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: '122',
    name: '122',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });

  // Display a notification
  await notifee.displayNotification({
    title: message?.data?.title, //"Notification in background",
    body: message?.data.body, // "Main body content of the notification",

    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      //pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: '2003',
        launchActivity: 'default',
      },
    },
  });
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  console.log('detail', detail);
  console.log('type', type);

  // Remove the notification
  // await notifee.cancelNotification(notification.id);
});

messaging().setBackgroundMessageHandler(onMessageReceived);

AppRegistry.registerComponent(appName, () => App);
