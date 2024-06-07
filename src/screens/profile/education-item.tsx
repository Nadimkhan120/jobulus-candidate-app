import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { Text, View } from '@/ui';

type EducationItemProps = {
  data?: any;
  onStartPress?: (data: any) => void;
};

export const EducationItem = ({ data }: EducationItemProps) => {
  return (
    <View flexDirection={'row'} marginBottom={'large'} paddingHorizontal={'large'}>
      <View>
        <Image
          source={{
            uri: data?.images?.pic
              ? data?.images?.pic
              : 'https://fakeimg.pl/400x400/cccccc/cccccc',
          }}
          placeholder={'https://fakeimg.pl/400x400/cccccc/cccccc'}
          transition={1000}
          style={{
            height: scale(72),
            width: scale(72),
            borderRadius: 8,
          }}
        />
      </View>
      <View flex={1} paddingHorizontal={'medium'}>
        <Text textTransform={'capitalize'} variant={'medium16'} color={'black'}>
          {data?.institute}
        </Text>
        <View paddingTop={'xSmall'} flexDirection={'row'} alignItems={'center'}>
          <Text textTransform={'capitalize'} variant={'medium12'} color={'grey100'}>
            {data?.education_level} In {data?.education_field}
          </Text>
        </View>
        <View paddingTop={'xSmall'} flexDirection={'row'} alignItems={'center'}>
          <Text textTransform={'capitalize'} variant={'medium12'} color={'grey100'}>
            {data?.from_date}- {data?.to_date}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: scale(24),
    width: scale(24),
  },
});
