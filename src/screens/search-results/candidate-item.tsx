import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { PressableScale, Text, View } from '@/ui';
import { Avatar } from '@/components/avatar';

type CandidateItemProps = {
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

export const CandidateItem = ({
  data,
  onStartPress,
  showStars = true,
  onItemPress,
}: CandidateItemProps) => {
  const navigation = useNavigation();

  //console.log('data', JSON.stringify(data, null, 2));

  return (
    <PressableScale
      onPress={() => {
        navigation.navigate('Job', { id: data?.unique_id });
        onItemPress?.(data);
      }}
    >
      <View
        flexDirection={'row'}
        //  marginBottom={'large'}
        backgroundColor={'white'}
        paddingHorizontal={'large'}
        paddingVertical={'medium'}
        borderBottomColor={'grey400'}
        borderBottomWidth={0.5}
      >
        <View>
          <Avatar
            source={{ uri: data?.profile_pic }}
            placeholder={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
            transition={1000}
          />
        </View>
        <View flex={1} paddingHorizontal={'medium'}>
          <Text variant={'medium16'} color={'black'}>
            {data?.full_name}
          </Text>
          <View flexDirection={'row'} alignItems={'center'}>
            <Text variant={'medium12'} color={'grey100'}>
              {data?.company_name},
            </Text>
            <Text variant={'regular12'} color={'grey300'}>
              in {data?.city_name}, {data?.country_name}
            </Text>
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
