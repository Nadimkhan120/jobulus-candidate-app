import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { PressableScale, Text, View } from '@/ui';

type JobItemProps = {
  data?: any;
  onStartPress?: (data: any) => void;
  showStars?: boolean;
  onItemPress?: (data: any) => void;
};

function getColorByIndex(index) {
  const colors = ['rgba(247, 40, 40, 0.1)', '#DEFCFE', 'rgba(0, 160, 76, 0.1)'];

  // Check if the index is within the valid range
  if (index >= 0 && index < colors.length) {
    return colors[index];
  } else {
    //console.error('Invalid index provided');
    return colors[0];
  }
}

export const JobItem = ({
  data,
  onStartPress,
  showStars = true,
  onItemPress,
}: JobItemProps) => {
  const navigation = useNavigation();

  return (
    <PressableScale
      onPress={() => {
        navigation?.navigate('NewJobDetails', { id: data?.id });
        onItemPress?.(data);
      }}
    >
      <View
        flexDirection={'row'}
        // marginBottom={'large'}
        backgroundColor={'white'}
        paddingHorizontal={'large'}
        paddingVertical={'medium'}
        borderBottomColor={'grey400'}
        borderBottomWidth={0.5}
      >
        <View>
          <Image
            source={{
              uri:
                data?.company?.images?.pic ?? 'https://fakeimg.pl/400x400/cccccc/cccccc',
            }}
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
            {data?.job_titles}
          </Text>
          <View flexDirection={'row'} alignItems={'center'}>
            <Text variant={'medium12'} color={'grey100'}>
              {data?.company_name},
            </Text>
            <Text variant={'regular12'} color={'grey300'}>
              in {data?.country_name}
            </Text>
          </View>

          <View
            flexDirection={'row'}
            gap={'medium'}
            alignItems={'center'}
            paddingTop={'small'}
            flexWrap={'wrap'}
          >
            {data?.skills && data?.skills?.length === 0
              ? null
              : data?.skills?.map((item, index) => {
                  return (
                    <View
                      key={index}
                      //backgroundColor={'grey500'}
                      borderRadius={scale(4)}
                      height={scale(31)}
                      paddingHorizontal={'medium'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      flexDirection={'row'}
                      style={{
                        backgroundColor: getColorByIndex(index),
                      }}
                    >
                      <Text variant={'regular13'} color={'grey100'}>
                        {item?.skill}
                      </Text>
                    </View>
                  );
                })}
          </View>
        </View>

        {showStars ? (
          <PressableScale onPress={() => onStartPress?.(data)}>
            <Image
              source={data?.isSaved === 0 ? icons['star'] : icons['star-fill']}
              contentFit="contain"
              style={styles.image}
            />
          </PressableScale>
        ) : null}
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
