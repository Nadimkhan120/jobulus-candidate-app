import { icons } from '@/assets/icons';
import { Avatar } from '@/components/avatar';
import { PressableScale, Text, View } from '@/ui';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import type { Theme } from '@/theme';
import { useTheme } from '@shopify/restyle';

const ChatListItem = () => {
  const { colors } = useTheme<Theme>();

  return (
    <PressableScale onPress={null}>
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
            source={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
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
                Wade Warren
              </Text>
              <Text
                variant={'regular13'}
                textTransform={'capitalize'}
                marginVertical={'tiny'}
                color={'grey100'}
              >
                Do you agree with the salary?{' '}
              </Text>
            </View>

            <View alignItems={'flex-end'} gap={'tiny'}>
              <Text variant={'regular12'} color={'black'}>
                Just Now
              </Text>
              <PressableScale onPress={() => null}>
                <View style={style.count} backgroundColor={'danger'}>
                  <Text color={'white'} variant={'medium12'}>
                    1
                  </Text>
                </View>
              </PressableScale>
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
