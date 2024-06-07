type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export interface RemoteNotification<T>
  extends CustomOmit<FirebaseMessagingTypes.RemoteMessage, 'data'> {
  //  Nested data from fcm is string. carefully when use
  //  example data:{ nested:{ a: 1 }}
  //  => nested will be string
  data?: T;
}

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

export const getDeviceToken = async () => {
  // await messaging().registerDeviceForRemoteMessages();
  if (__DEV__ && Platform.OS === 'ios') {
    await messaging().setAPNSToken('test');
  }
  return messaging().getToken();
};

/**
 * Notification coming when app in foreground
 */
export const useInAppNotification = <T = any>(
  callback: (remoteNotification: RemoteNotification<T>) => any
) => {
  // effect
  useEffect(() => {
    messaging().onMessage(
      callback as (message: FirebaseMessagingTypes.RemoteMessage) => any
    );
  }, []);
};

/**
 * Notification coming when app in background or quit state
 */
export const useBackgroundNotification = <T = any>(
  callback: (remoteNotification: RemoteNotification<T>) => any
) => {
  useEffect(() => {
    messaging().setBackgroundMessageHandler(
      callback as (message: FirebaseMessagingTypes.RemoteMessage) => any
    );
  }, []);
};

/**
 * User click notification when app in background
 */
export const useBackgroundOpenedNotification = <T = any>(
  callback: (remoteNotification: RemoteNotification<T>) => any
) => {
  // effect
  useEffect(() => {
    messaging().onNotificationOpenedApp(
      callback as (message: FirebaseMessagingTypes.RemoteMessage) => any
    );
  }, []);
};

/**
 * User click notification when app in killed or quit state
 */
export const useKilledOpenedNotification = <T = any>(
  callback: (remoteNotification: RemoteNotification<T> | null) => any
) => {
  // effect
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(callback as (message: FirebaseMessagingTypes.RemoteMessage | null) => any);
  }, []);
};
