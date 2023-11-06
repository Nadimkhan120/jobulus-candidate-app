import { icons } from '@/assets/icons';
import { Avatar } from '@/components/avatar';
import { PressableScale, Text, View } from '@/ui';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const NotificationListItem = () => {
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
        <View
          height={scale(48)}
          width={scale(48)}
          backgroundColor={'grey500'}
          borderRadius={30}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Image
            transition={1000}
            source={icons.zapier}
            contentFit="contain"
            style={style.image}
          />
        </View>

        <View flex={1} paddingLeft={'medium'}>
          <View
            flexDirection={'row'}
            justifyContent={'space-between'}
            paddingTop={'tiny'}
          >
            <View gap={'small'}>
              <Text variant={'medium14'} color={'black'}>
                Gojek Indonesia
              </Text>
              <Text
                variant={'regular13'}
                textTransform={'capitalize'}
                marginVertical={'tiny'}
                color={'grey200'}
              >
                Posted new design jobs
              </Text>
            </View>

            <View alignItems={'flex-end'} gap={'tiny'}>
              <Text variant={'regular12'} color={'grey300'}>
                Just Now
              </Text>
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
  image: {
    width: scale(24),
    height: scale(24),
  },
});

export default NotificationListItem;
