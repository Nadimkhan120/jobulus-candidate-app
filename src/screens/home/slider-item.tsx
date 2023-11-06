import React from 'react';
import { scale } from 'react-native-size-matters';
import { PressableScale, Text, View } from '@/ui';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { Avatar } from '@/components/avatar';
import { useNavigation } from '@react-navigation/native';

type HomeSliderItemProps = {
  data: any;
};

export const HomeSliderItem = ({ data }: HomeSliderItemProps) => {
  const { navigate } = useNavigation();

  if (data?.name === 'Add') {
    return (
      <PressableScale onPress={() => navigate('AddProfile')}>
        <View
          marginRight={'medium'}
          borderRadius={scale(8)}
          padding={'large'}
          backgroundColor={'white'}
          height={scale(160)}
          width={scale(300)}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Image
            source={icons['plus2']}
            style={{ height: scale(24), width: scale(24) }}
          />
          <Text variant={'medium16'} color={'grey200'}>
            Add New Profile
          </Text>
        </View>
      </PressableScale>
    );
  }

  return (
    <View
      marginRight={'medium'}
      borderRadius={scale(8)}
      padding={'large'}
      backgroundColor={'black'}
      height={scale(160)}
      width={scale(300)}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <View position={'absolute'} left={scale(16)} top={scale(16)}>
        <PressableScale>
          <Image
            source={icons['qr']}
            style={{ height: scale(24), width: scale(24) }}
          />
        </PressableScale>
      </View>
      <View position={'absolute'} right={scale(16)} top={scale(16)}>
        <PressableScale>
          <Image
            source={icons['more-vertical']}
            style={{ height: scale(24), width: scale(24) }}
          />
        </PressableScale>
      </View>

      <View alignItems={'center'} justifyContent={'center'}>
        <Avatar source={icons['avatar-2']} />
        <Text variant={'medium24'} paddingTop={'tiny'} color={'white'}>
          {data?.name}
        </Text>
        <Text variant={'regular12'} color={'white'} paddingTop={'tiny'}>
          User Experience Designer at Conrad labs
        </Text>
        <Text variant={'regular12'} color={'white'} paddingTop={'tiny'}>
          Rawalpindi, Pakistan
        </Text>
      </View>
    </View>
  );
};
