import { useTheme } from '@shopify/restyle';
import React from 'react';
import { scale } from 'react-native-size-matters';

import { CompanyButton } from '@/components/company-button';
import { ScreenHeader } from '@/components/screen-header';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import { useDeleteAccount } from '@/services/api/profile';
import { removeUserData, useUser } from '@/store/user';
import { showSuccessMessage } from '@/utils';
import { queryClient } from '@/services/api/api-provider';
import { closeDrawer } from '@/store/app';
import { logOut } from '@/store/auth';

export const UserSettings = () => {
  const { colors } = useTheme<Theme>();

  const user = useUser((state) => state?.user);

  console.log('user', user);

  const { mutate: deleteAccountApi, isLoading } = useDeleteAccount();

  const deleteUserAccount = () => {
    const data = {
      unique_id: '',
    };

    deleteAccountApi(data, {
      onSuccess: (response) => {
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
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader showBorder={true} title="Setttings" />
      <View flex={1} backgroundColor={'grey500'}>
        <PressableScale>
          <View
            flexDirection={'row'}
            alignItems={'center'}
            paddingHorizontal={'large'}
            paddingVertical={'small'}
            backgroundColor={'white'}
          >
            <View flex={1} flexDirection={'row'} alignItems={'center'}>
              <CompanyButton
                backgroundColor={'black'}
                icon="company"
                onPress={() => null}
                size={scale(48)}
                imageSize={scale(48)}
              />
              <View paddingLeft={'small'}>
                <Text variant={'semiBold14'} color={'black'}>
                  vFairs
                </Text>
                <Text variant={'regular12'} paddingTop={'tiny'} color={'black'}>
                  Posted 6 hours ago
                </Text>
              </View>
            </View>
          </View>
        </PressableScale>

        <View height={scale(20)} />

        <PressableScale>
          <View
            height={scale(56)}
            backgroundColor={'white'}
            justifyContent={'center'}
            alignItems={'center'}
            marginHorizontal={'large'}
            borderRadius={scale(8)}
          >
            <Text variant={'medium16'} color={'error'}>
              {isLoading ? '...Deleting Account' : 'Delete Account'}
            </Text>
          </View>
        </PressableScale>
      </View>
    </Screen>
  );
};
