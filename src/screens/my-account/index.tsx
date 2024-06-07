import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { ScreenHeader } from '@/components/screen-header';
import SettingsItem from '@/components/settings-item';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import { scale } from 'react-native-size-matters';
import { removeUserData, useUser } from '@/store/user';
import { useDeleteAccount } from '@/services/api/profile';
import { closeDrawer } from '@/store/app';
import { logOut } from '@/store/auth';
import { showSuccessMessage } from '@/utils';
import { Alert } from 'react-native';

export const MyAccount = () => {
  const { colors } = useTheme<Theme>();
  const { navigate } = useNavigation();

  const user = useUser((state) => state?.profile);

  // console.log('user', user);

  const { mutate: deleteAccountApi, isLoading } = useDeleteAccount();

  const deleteUserAccount = () => {
    const data = {
      //@ts-ignore
      person_id: user?.person_id,
    };

    deleteAccountApi(data, {
      onSuccess: (response) => {
        console.log('response', response);

        if (response?.response?.status === 200) {
          closeDrawer();
          removeUserData();
          logOut();

          showSuccessMessage('Account deleted successfully');
        } else {
        }
      },
      onError: (error) => {
        // An error happened!
        // @ts-ignore
        console.log(`error`, error?.response.data?.message);
      },
    });
  };

  return (
    <Screen backgroundColor={colors.white}>
      <ScreenHeader title={'My Account'} showBorder={true} />

      <View flex={1}>
        <View paddingHorizontal={'large'} gap={'medium'} paddingTop={'large'}>
          <SettingsItem
            icon="book"
            title="Personal Information"
            onPress={() => navigate('PersonalInformation')}
          />
          <SettingsItem
            icon="people"
            title="Login And Security"
            onPress={() => navigate('LoginAndSecurity')}
          />
        </View>

        <View flex={1} justifyContent={'flex-end'} marginBottom={'large'}>
          <PressableScale
            onPress={() => {
              Alert.alert(
                'Confirmation',
                'Are you sure to delete you account permanently?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  { text: 'Delete', onPress: () => deleteUserAccount() },
                ]
              );
            }}
          >
            <View
              height={scale(56)}
              backgroundColor={'grey500'}
              justifyContent={'center'}
              alignItems={'center'}
              marginHorizontal={'large'}
              borderRadius={scale(8)}
            >
              <Text variant={'medium16'} color={'error'}>
                {isLoading ? 'Deleting' : 'Delete Account'}
              </Text>
            </View>
          </PressableScale>
        </View>
      </View>
    </Screen>
  );
};
