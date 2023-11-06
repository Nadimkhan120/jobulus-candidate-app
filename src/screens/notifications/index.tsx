import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { scale } from 'react-native-size-matters';
import { ScreenHeader } from '@/components/screen-header';
import type { Theme } from '@/theme';
import { Screen, Text, View } from '@/ui';
import CapsuleView from '@/components/capsule-view';
import NotificationListItem from './notification-list-item';

export const Notifications = () => {
  const { colors } = useTheme<Theme>();

  const renderItem = useCallback(({ item, index }) => {
    return <NotificationListItem key={index} />;
  }, []);

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader
        title="Notification"
        icon={'close'}
        rightElement={
          <Text variant={'medium14'} color={'blue'}>
            Mark all as read
          </Text>
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
          {[
            { heading: 'Profile 1', active: true },
            { heading: 'Profile 2', active: false },
          ].map((element) => {
            return <CapsuleView element={element} />;
          })}
        </View>

        <FlashList
          //@ts-ignore
          data={[0, 1, 2, 3, 4, 5]}
          renderItem={renderItem}
          estimatedItemSize={150}
          ListHeaderComponent={
            <View paddingHorizontal={'large'} paddingVertical={'small'}>
              <Text
                variant={'regular14'}
                color={'grey300'}
                backgroundColor={'error'}
              >
                2 Unreads
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View
              height={scale(300)}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Text>No Users Found</Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
};
