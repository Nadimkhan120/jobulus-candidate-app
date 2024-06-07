import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Avatar } from '@/components/avatar';
import { PressableScale, Text, View } from '@/ui';
import { useNavigation } from '@react-navigation/native';
import { ChatListItems } from '@/services/api/chats';
import { timeAgo } from '@/utils';
import { useUser } from '@/store/user';
import { editUserChatCount } from '@/store/app';

type ChatListItemProps = {
  item: ChatListItems;
};

const ChatListItem = ({ item }: ChatListItemProps) => {
  const { navigate } = useNavigation();

  const myUser = useUser((state) => state?.user);
  const time = item?.lastMessage ? timeAgo(new Date(item?.lastMessage?.created_at)) : '';

  const checkUser = `${myUser?.id}` === item?.person_id;

  return (
    <PressableScale
      onPress={() => {
        editUserChatCount(item?.unreadMessages);
        navigate('Chats', {
          person_id: checkUser ? item?.Reciever_Detail?.id : item?.Person_Detail?.id,
          chat_id: item?.lastMessage?.chat_id,
          profile_pic: checkUser
            ? item?.Reciever_Detail?.profile_pic
            : item?.Person_Detail?.profile_pic,
          name: checkUser
            ? item?.Reciever_Detail?.full_name
            : item?.Person_Detail?.full_name,
        });
      }}
    >
      <View
        flexDirection={'row'}
        paddingHorizontal={'large'}
        borderBottomColor={'grey400'}
        borderBottomWidth={StyleSheet.hairlineWidth}
        backgroundColor={'white'}
        paddingVertical={'medium'}
      >
        <View>
          <Avatar
            transition={1000}
            source={
              checkUser
                ? item?.Reciever_Detail?.profile_pic
                : item?.Person_Detail?.profile_pic
            }
            placeholder={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
          />
        </View>

        <View flex={1} paddingLeft={'medium'}>
          <View
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            paddingTop={'tiny'}
          >
            <View gap={'small'}>
              <Text variant={'medium14'} color={'black'}>
                {checkUser
                  ? item?.Reciever_Detail?.full_name
                  : item?.Person_Detail?.full_name}
              </Text>
              <Text
                variant={'regular13'}
                textTransform={'capitalize'}
                marginVertical={'tiny'}
                color={'grey100'}
              >
                {item?.lastMessage?.message}{' '}
              </Text>
            </View>

            <View alignItems={'flex-end'} gap={'tiny'}>
              <Text variant={'regular12'} color={'black'}>
                {time}
              </Text>

              {item?.unreadMessages !== 0 ? (
                <View style={style.count} backgroundColor={'danger'}>
                  <Text color={'white'} variant={'medium12'}>
                    {item?.unreadMessages}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </PressableScale>
  );
};

const style = StyleSheet.create({
  dot: {
    width: scale(24),
    height: scale(24),
  },
  count: {
    width: scale(20),
    height: scale(20),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatListItem;
