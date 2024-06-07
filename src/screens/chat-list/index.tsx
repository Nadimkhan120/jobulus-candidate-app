import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetFooter, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { ImageButton } from '@/components';
import { BottomModal } from '@/components/bottom-modal';
import { ScreenHeader } from '@/components/screen-header';
import { Status } from '@/components/status-info';
import type { User } from '@/services/api/user';
import { useGetUser } from '@/services/api/user';
import { useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { Button, Screen, Text, View } from '@/ui';
import ChatListItem from './chat-list-item';
import { useChatLists } from '@/services/api/chats';
import ActivityIndicator from '@/components/activity-indicator';
import { useRefreshOnFocus } from '@/hooks';
import CapsuleView from '@/components/capsule-view';

const menu = [
  { heading: 'Profile 1', active: true },
  { heading: 'Profile 2', active: false },
];

export const ChatList = () => {
  const { colors } = useTheme<Theme>();
  const { bottom } = useSafeAreaInsets();
  const { navigate } = useNavigation();

  const company = useUser((state) => state?.company);
  const myUser = useUser((state) => state?.user);
  const [selectUser, setSelectUser] = useState<User | null>(null);

  const { data } = useGetUser({
    variables: {
      id: company?.id,
    },
  });

  const {
    data: chatLists,
    isLoading: loadingChats,
    refetch,
  } = useChatLists({
    variables: {
      person_id: myUser?.id,
    },
  });

  useRefreshOnFocus(refetch);

  const chatListsUnReadCouns = useMemo(() => {
    let unReadCounts = 0;
    if (chatLists?.chats?.length) {
      chatLists?.chats?.forEach((element) => {
        unReadCounts += element?.unreadMessages;
      });
    }
    return unReadCounts;
  }, [chatLists]);

  // console.log('chatLists', JSON.stringify(chatLists, null, 2));

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ['60%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // callbacks
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      return <ChatListItem key={index} item={item} />;
    },
    [data, bottomSheetModalRef, selectUser, setSelectUser]
  );

  // renders
  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={bottom}>
        <View paddingVertical={'large'}>
          <Button
            marginHorizontal={'large'}
            label="Edit User "
            onPress={handleDismissModalPress}
            variant={'outline'}
          />
          <Button
            marginHorizontal={'large'}
            label="Delete "
            onPress={handleDismissModalPress}
            marginTop={'small'}
            variant={'error'}
          />
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  const RenderLoader = () => {
    return (
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title="Chats" showBorder={true} icon={'close'} />

      <View flex={1} backgroundColor={'grey500'}>
        {/* <View
          height={scale(50)}
          flexDirection={'row'}
          alignItems={'center'}
          paddingHorizontal={'large'}
          backgroundColor={'white'}
          marginVertical={'tiny'}
        >
          {menu?.map((element) => {
            return <CapsuleView key={element?.heading} element={element} />;
          })}
        </View> */}
        {chatLists?.chats?.length > 0 ? (
          <View paddingHorizontal={'large'} paddingVertical={'small'}>
            <Text variant={'regular14'} color={'grey300'}>
              {chatListsUnReadCouns} Unreads
            </Text>
          </View>
        ) : null}

        {loadingChats ? (
          <RenderLoader />
        ) : (
          <FlashList
            data={chatLists?.chats}
            renderItem={renderItem}
            estimatedItemSize={150}
            ListEmptyComponent={
              <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
                <Text>No Chats Found</Text>
              </View>
            }
          />
        )}
      </View>

      <BottomModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'rgb(250,250,253)' }}
        footerComponent={renderFooter}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <ImageButton
              icon="close"
              onPress={handleDismissModalPress}
              size={scale(16)}
            />
            <Status status={selectUser?.isactive === '0' ? 'Pending' : 'Active'} />
          </View>
          <View
            alignItems={'center'}
            justifyContent={'center'}
            paddingVertical={'medium'}
          >
            <Image
              transition={1000}
              source={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
              placeholder={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
              style={styles.image}
              contentFit="contain"
            />
          </View>
          <View
            gap={'tiny'}
            alignItems={'center'}
            justifyContent={'center'}
            paddingVertical={'medium'}
          >
            <Text variant={'medium24'} textTransform={'capitalize'} color={'black'}>
              {selectUser?.person_name}
            </Text>
            <Text variant={'regular13'} color={'grey200'}>
              {selectUser?.email}
            </Text>
            <Text variant={'regular13'} color={'black'}>
              {selectUser?.role}
            </Text>
          </View>
        </BottomSheetView>
      </BottomModal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: scale(16),
  },
  image: {
    height: scale(106),
    width: scale(106),
    borderRadius: scale(53),
  },
});
