import React from 'react';
import {} from 'react-native';
import { scale } from 'react-native-size-matters';
import { openDrawer } from '@/store/app';
import { PressableScale, Text, View } from '@/ui';
import { Avatar } from '../avatar';
import { icons } from '@/assets/icons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

export const TopHeader = () => {
  const { navigate } = useNavigation();

  return (
    <View
      height={scale(72)}
      flexDirection={'row'}
      backgroundColor={'white'}
      alignItems={'center'}
      justifyContent={'center'}
      paddingHorizontal={'large'}
    >
      <View flexDirection={'row'} alignItems={'center'}>
        <Avatar source={icons['avatar-3']} onPress={openDrawer} />

        <View flex={1} marginHorizontal={'medium'}>
          <Text>Rifat Sarkar 👋</Text>
        </View>

        <View flexDirection={'row'} alignItems={'center'} gap={'small'}>
          <PressableScale onPress={() => navigate('Search')}>
            <View>
              <Image
                source={icons['search']}
                style={{ height: scale(24), width: scale(24) }}
                contentFit="contain"
              />
            </View>
          </PressableScale>
          <PressableScale onPress={() => navigate('ChatList')}>
            <View>
              <Image
                source={icons['message']}
                style={{ height: scale(24), width: scale(24) }}
                contentFit="contain"
              />
            </View>
          </PressableScale>
          <PressableScale onPress={() => navigate('Notifications')}>
            <View>
              <Image
                source={icons['bell']}
                style={{ height: scale(24), width: scale(24) }}
                contentFit="contain"
              />
            </View>
          </PressableScale>
        </View>
      </View>
    </View>
  );
};
