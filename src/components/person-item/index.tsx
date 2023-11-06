import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import type { Candidate } from '@/services/api/candidate';
import { PressableScale, Text, View } from '@/ui';

type PersonItemProps = {
  data?: any;
};

export const PersonItem = ({ data }: PersonItemProps) => {
  const navigation = useNavigation();

  return (
    <PressableScale
      onPress={() => {
        navigation?.navigate('Job', { id: data?.unique_id });
      }}
    >
      <View
        flexDirection={'row'}
        marginBottom={'large'}
        paddingHorizontal={'large'}
      >
        <View>
          <Image
            source={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
            placeholder={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
            transition={1000}
            style={{
              height: scale(72),
              width: scale(72),
              borderRadius: 8,
            }}
          />
        </View>
        <View flex={1} paddingHorizontal={'medium'}>
          <Text variant={'medium16'} color={'black'}>
            Sr. UI/UX Designer
          </Text>
          <View flexDirection={'row'} alignItems={'center'}>
            <Text variant={'medium12'} color={'grey100'}>
              Tripadvisor,
            </Text>
            <Text variant={'regular12'} color={'grey300'}>
              in California
            </Text>
          </View>

          <View
            flexDirection={'row'}
            gap={'medium'}
            alignItems={'center'}
            paddingTop={'small'}
          >
            {['React', 'Laravel', 'MangoDb'].map((item, index) => {
              return (
                <View
                  key={index}
                  backgroundColor={'grey500'}
                  borderRadius={scale(4)}
                  height={scale(31)}
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

        <PressableScale>
          <Image
            source={icons['star']}
            contentFit="contain"
            style={styles.image}
          />
        </PressableScale>
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
