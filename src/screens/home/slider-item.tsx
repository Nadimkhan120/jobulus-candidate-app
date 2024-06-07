import React from 'react';
import { scale } from 'react-native-size-matters';
import { PressableScale, Text, View } from '@/ui';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { Avatar } from '@/components/avatar';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

type HomeSliderItemProps = {
  data: any;
};

export const HomeSliderItem = ({ data }: HomeSliderItemProps) => {
  const { navigate } = useNavigation();

  if (data?.full_name === 'Add') {
    return (
      <PressableScale onPress={() => navigate('AddProfile')}>
        <View
          marginRight={'medium'}
          borderRadius={scale(8)}
          padding={'large'}
          backgroundColor={'white'}
          height={scale(160)}
          width={width}
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
    <PressableScale onPress={() => navigate('Profile', { id: data?.unique_id })}>
      <View
        marginRight={'medium'}
        borderRadius={scale(8)}
        padding={'large'}
        //backgroundColor={'black'}
        height={scale(160)}
        width={width}
        //width={scale(300)}
        justifyContent={'center'}
        alignItems={'center'}
        style={{
          backgroundColor: '#1B1F29',
        }}
      >
        <View position={'absolute'} left={scale(16)} top={scale(16)}>
          {/* <PressableScale>
            <Image source={icons['qr']} style={{ height: scale(24), width: scale(24) }} />
          </PressableScale> */}
        </View>
        <View position={'absolute'} right={scale(16)} top={scale(16)}>
          {/* <PressableScale>
            <Image
              source={icons['more-vertical']}
              style={{ height: scale(24), width: scale(24) }}
            />
          </PressableScale> */}
        </View>

        <View alignItems={'center'} justifyContent={'center'}>
          <Avatar
            source={{ uri: data?.profile_pic }}
            transition={1000}
            placeholder={'https://fakeimg.pl/400x400/cccccc/cccccc'}
          />
          <Text variant={'medium24'} paddingTop={'tiny'} color={'white'}>
            {data?.full_name}
          </Text>
          <Text variant={'regular12'} color={'white'} paddingTop={'tiny'}>
            {data?.job_title}
          </Text>
          <Text variant={'regular12'} color={'white'} paddingTop={'tiny'}>
            {data?.city_name}, {data?.country_name}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
};
