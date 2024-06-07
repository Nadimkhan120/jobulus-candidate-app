import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { PressableScale, Text, View } from '@/ui';
import { CheckBox } from '@/components/checkbox';
import { useExperience } from '@/store/experience';

type SchoolItem = {
  data: any;
  onPress: (data: any) => void;
  selected?: any;
};

const SchoolItem = ({ onPress, data, selected }: SchoolItem) => {
  const selectedSchool = useExperience((state) => state?.selectedSchool);

  return (
    <PressableScale onPress={() => onPress(data)}>
      <View
        flexDirection={'row'}
        paddingHorizontal={'large'}
        borderBottomColor={'grey400'}
        borderBottomWidth={StyleSheet.hairlineWidth}
        backgroundColor={'white'}
        paddingVertical={'medium'}
      >
        <View>
          <Image
            transition={1000}
            source={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
            placeholder={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
            style={{
              height: scale(40),
              width: scale(40),
              borderRadius: scale(8),
            }}
          />
        </View>

        <View flex={1} paddingLeft={'medium'}>
          <View
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Text
              variant={'semiBold14'}
              color={selectedSchool?.id === data?.id ? 'primary' : 'black'}
            >
              {data?.name}
            </Text>
          </View>

          <Text
            variant={'regular13'}
            textTransform={'capitalize'}
            marginVertical={'tiny'}
            color={selectedSchool?.id === data?.id ? 'primary' : 'grey100'}
          >
            United State
          </Text>
        </View>
      </View>
    </PressableScale>
  );
};

export default SchoolItem;
