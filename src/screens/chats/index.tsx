import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { StyleSheet, TextInput } from 'react-native';
import { scale } from 'react-native-size-matters';
import { BottomModal } from '@/components/bottom-modal';
import { Header } from './header';
import { useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { icons } from '@/assets/icons';
import { SelectModalItem } from '@/components/select-modal-item';
import { useRoute } from '@react-navigation/native';
import {
  useSendChatMessage,
  useChatLists,
  useGetChatMessages,
  usePersonOnline,
  useGetChatWhenComeFromExplore,
} from '@/services/api/chats';
import { showErrorMessage } from '@/utils';
import { queryClient } from '@/services/api/api-provider';
import { useRefreshOnFocus } from '@/hooks';
import ActivityIndicator from '@/components/activity-indicator';
import { NetWorkService } from '@/services/apinetworkservice';

// For the testing purposes, you should probably use https://github.com/uuidjs/uuid
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

const employees = [
  { name: 'Clear Chat', id: 1 },
  { name: 'Block User', id: 2 },
  { name: 'Delete Chat', id: 6 },
];

export const Chats = () => {
  const { colors } = useTheme<Theme>();
  const route = useRoute<any>();

  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const [message, setMessage] = useState<string>('');

  const company = useUser((state) => state?.company);

  const myUser = useUser((state) => state?.user);
  const {
    data: chatMessage,
    isLoading,
    refetch,
  } = useGetChatMessages({
    variables: {
      chat_id: route?.params?.chat_id,
    },
    enabled: route?.params?.chat_id ? true : false,
    refetchInterval: 3000,
  });

  const { data: chatMessages, isLoading: isLoadingHistory } =
    useGetChatWhenComeFromExplore({
      variables: {
        person_id: myUser?.id,
        reciever_id: route?.params?.person_id,
      },
      enabled: route?.params?.chat_id ? true : false,
      refetchInterval: 3000,
    });

  const { data: onlineData } = usePersonOnline({
    variables: {
      person_id: myUser?.id,
    },
  });

  const { mutate: sendMessage, isLoading: sendingMessage } = useSendChatMessage();

  const user = { id: `${myUser?.id}` };

  useRefreshOnFocus(refetch);

  const chatHeaderData = {
    name: route?.params?.name,
    profilePic: route?.params?.profile_pic,
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ['40%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // callbacks
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  useEffect(() => {
    if (chatMessages?.messages?.length && route?.params?.isCompingFrom) {
      let makeMessage = chatMessages?.messages?.map((item, index) => {
        return {
          author: {
            id: item?.person_id,
          },
          createdAt: item?.created_at,
          id: `${item?.id}`,
          text: item?.message,
          type: 'text',
        };
      });

      //@ts-ignore
      setMessages(makeMessage);
    }
  }, [chatMessages, route?.params?.isCompingFrom]);

  useEffect(() => {
    if (chatMessage?.messages?.length) {
      let makeMessage = chatMessage?.messages?.map((item, index) => {
        return {
          author: {
            id: item?.person_id,
          },
          createdAt: item?.created_at,
          id: `${item?.id}`,
          text: item?.message,
          type: 'text',
        };
      });

      //@ts-ignore
      setMessages(makeMessage);
    }
  }, [chatMessage]);

  const addMessage = (message: MessageType.Any) => {
    setMessages([message, ...messages]);
  };

  const handleSendPress = (message: string) => {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message,
      type: 'text',
    };

    addMessage(textMessage);

    const body = {
      person_id: myUser?.id,
      receiver_id: route?.params?.person_id,
      message: message,
      chat_id: route?.params?.chat_id ?? 0,
    };

    sendMessage(body, {
      onSuccess: (data) => {
        console.log('Message send -->>  data', data);
        if (data?.message?.chat_id) {
          queryClient.invalidateQueries(useChatLists.getKey());
        } else {
          showErrorMessage(data?.response?.message);
        }
      },
      onError: (error) => {
        console.log('error', error?.response);
        // An error happened!
      },
    });

    setMessage('');
  };

  /**
   * For dismissing keyboard and avoiding textinput hide behind keyboard
   */
  useEffect(() => {
    AvoidSoftInput.setEnabled(true);
    AvoidSoftInput.setAvoidOffset(30);
    AvoidSoftInput.setEasing('easeIn');
    AvoidSoftInput.setHideAnimationDelay(100);
    AvoidSoftInput.setHideAnimationDuration(300);
    AvoidSoftInput.setShowAnimationDelay(100);
    AvoidSoftInput.setShowAnimationDuration(800);

    return () => {
      NetWorkService.Get({ url: `company/offline/${myUser?.id}` }).then((response) => {
        //@ts-ignore
        console.log('going offline', response?.data);
      });
    };
  }, []);

  const renderItem = useCallback(({ item }: any) => {
    return (
      <SelectModalItem
        title={item?.title}
        item={item}
        onPress={(data) => {
          handleDismissModalPress();
        }}
      />
    );
  }, []);

  const renderBubble = ({
    child,
    message,
    nextMessageInGroup,
  }: {
    child: ReactNode;
    message: MessageType.Any;
    nextMessageInGroup: boolean;
  }) => {
    return (
      <View
        style={{
          backgroundColor:
            user.id !== message.author.id ? colors.grey500 : colors.primary,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderTopLeftRadius: 10,
          overflow: 'hidden',
        }}
      >
        {child}
      </View>
    );
  };

  const renderBottomComponent = () => {
    return (
      <View
        flexDirection={'row'}
        height={scale(52)}
        borderRadius={scale(8)}
        marginBottom="small"
        alignItems={'center'}
        paddingHorizontal={'large'}
        backgroundColor={'grey500'}
        marginHorizontal={'large'}
      >
        <PressableScale>
          <Image source={icons['voice']} style={styles.icon} contentFit="contain" />
        </PressableScale>
        <View flex={1}>
          <TextInput
            placeholder="Type here"
            value={message}
            style={styles.input}
            textAlignVertical="center"
            onChangeText={(value) => {
              setMessage(value);
            }}
          />
        </View>
        {/* <PressableScale>
          <Image source={icons['chat-plus']} style={styles.icon} contentFit="contain" />
        </PressableScale> */}
        <PressableScale onPress={() => handleSendPress(message)}>
          <Image
            source={icons['send']}
            style={{
              height: scale(44),
              width: scale(32),
              marginLeft: scale(5),
            }}
          />
        </PressableScale>
      </View>
    );
  };

  const RenderLoader = () => {
    return (
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <Screen backgroundColor={colors.white}>
      <Header onRightPress={handlePresentModalPress} data={chatHeaderData} />

      {isLoading || isLoadingHistory ? (
        <RenderLoader />
      ) : (
        <View flex={1} backgroundColor={'grey500'}>
          <Chat
            messages={messages}
            renderBubble={renderBubble}
            user={{ id: `${myUser?.id}` }}
            customBottomComponent={renderBottomComponent}
            onSendPress={function (message: MessageType.PartialText): void {
              //throw new Error("Function not implemented.");
            }}
            flatListProps={{
              ListEmptyComponent: (
                <View alignItems={'center'}>
                  <Text variant={'medium14'}>No Chats Found</Text>
                </View>
              ),
            }}
          />
        </View>
      )}

      <BottomModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: colors.background }}
      >
        <BottomSheetFlatList
          contentContainerStyle={styles.contentContainer}
          data={employees}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
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
  icon: {
    height: scale(24),
    width: scale(24),
  },
  input: {
    fontSize: scale(13),
    marginLeft: scale(8),
    height: scale(52),
    paddingHorizontal: scale(8),
    color: 'black',
  },
});
