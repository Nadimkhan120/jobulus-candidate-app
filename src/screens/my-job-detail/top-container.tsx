import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { PressableScale, Text, View } from '@/ui';

type DetailContainerProps = {
  data?: any;
};

export const JobDetailTopContainer = ({ data }: DetailContainerProps) => {
  const navigation = useNavigation();

  return (
    <PressableScale
      onPress={() => {
        navigation?.navigate('Job', { id: data?.unique_id });
      }}
    >
      <View
        paddingVertical={'large'}
        paddingHorizontal={'large'}
        backgroundColor={'white'}
      >
        <Text variant={'regular20'} color={'black'}>
          Jr. Front-End Designer
        </Text>
        <View flexDirection={'row'} marginTop={'small'}>
          <Image
            source={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
            placeholder={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
            transition={1000}
            style={{
              height: scale(40),
              width: scale(40),
              borderRadius: 8,
            }}
          />
          <View marginLeft={'small'} gap={'small'}>
            <Text variant={'medium12'} color={'grey100'}>
              Kickstarter
            </Text>
            <Text variant={'regular12'} color={'grey300'}>
              Dubai, United Arab Emirates
            </Text>
          </View>
        </View>
        <View
          flexDirection={'row'}
          gap={'medium'}
          alignItems={'center'}
          paddingTop={'small'}
        >
          {['React', 'MangoDb'].map((item, index) => {
            return (
              <View
                key={index}
                backgroundColor={'tertiary'}
                borderRadius={scale(4)}
                height={scale(24)}
                paddingHorizontal={'medium'}
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection={'row'}
              >
                <Text variant={'regular13'} color={'grey100'}>
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  image: {
    height: scale(24),
    width: scale(24),
  },
});
