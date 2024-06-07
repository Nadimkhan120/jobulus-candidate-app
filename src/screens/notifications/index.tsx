import React, { useCallback, useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { scale } from 'react-native-size-matters';
import { ScreenHeader } from '@/components/screen-header';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import CapsuleView from '@/components/capsule-view';
import NotificationListItem from './notification-list-item';
import { useNotifications, useNotificationMarkAsRead } from '@/services/api/notification';
import ActivityIndicator from '@/components/activity-indicator';
import { showErrorMessage, showSuccessMessage } from '@/utils';
import { queryClient } from '@/services/api/api-provider';
import { useUser } from '@/store/user';

export const Notifications = () => {
  const { colors } = useTheme<Theme>();

  const profiles = useUser((state) => state?.userProfiles);

  const selectedProfile = useUser((state) => state?.profile);

  const [menu, setMenu] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const { isLoading, data } = useNotifications({
    variables: {
      unique_id:
        selectedIndex === null ? selectedProfile?.unique_id : selectedIndex?.unique_id,
    },
  });

  const { mutate: markNotificationAsRead, isLoading: markingAsRead } =
    useNotificationMarkAsRead();

  useEffect(() => {
    let makeMenu = profiles?.map((item, index) => {
      return {
        ...item,
        heading: `Profile ${index + 1}`,
        active: selectedProfile?.unique_id === item?.unique_id ? true : false,
      };
    });

    setMenu(makeMenu);
  }, []);

  const renderItem = useCallback(({ item, index }) => {
    return <NotificationListItem key={index} item={item} />;
  }, []);

  const RenderLoader = () => {
    return (
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader
        title="Notification"
        icon={'close'}
        rightElement={
          <PressableScale
            onPress={() => {
              markNotificationAsRead(
                { notifications: ['21'] },
                {
                  onSuccess: (data) => {
                    console.log('data', data);
                    if (data?.response?.status === 200) {
                      showSuccessMessage('Notifications marked as read sucessfully');
                      queryClient.invalidateQueries(useNotifications.getKey());
                    } else {
                      showErrorMessage(data?.response?.message);
                    }
                  },
                  onError: (error) => {
                    console.log('error', error);
                    // An error happened!
                  },
                }
              );
            }}
          >
            <Text variant={'medium14'} color={'blue'}>
              Mark all as read
            </Text>
          </PressableScale>
        }
      />
      <View flex={1} backgroundColor={'grey500'}>
        <View
          height={scale(50)}
          flexDirection={'row'}
          alignItems={'center'}
          paddingHorizontal={'large'}
          backgroundColor={'white'}
        >
          {menu.map((element) => {
            return (
              <CapsuleView
                key={element?.heading}
                element={element}
                onPress={(element) => {
                  setSelectedIndex(element);

                  let existingMenu = [...menu];

                  let yes = existingMenu.map((item) => {
                    return {
                      ...item,
                      active: item?.unique_id === element?.unique_id ? true : false,
                    };
                  });

                  setMenu(yes);
                  queryClient.invalidateQueries(useNotifications.getKey());
                }}
              />
            );
          })}
        </View>

        {isLoading ? (
          <RenderLoader />
        ) : (
          <FlashList
            //@ts-ignore
            data={data?.response.data?.data}
            renderItem={renderItem}
            estimatedItemSize={150}
            ListHeaderComponent={
              <View paddingHorizontal={'large'} paddingVertical={'small'}>
                <Text variant={'regular14'} color={'grey300'} backgroundColor={'error'}>
                  New
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
                <Text>No Notification Found</Text>
              </View>
            }
          />
        )}
      </View>
    </Screen>
  );
};
