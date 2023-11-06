import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { PressableScale, Text, View } from '@/ui';

type DegreeItem = {
  data: any;
  onPress: () => void;
};

const DegreeItem = ({ onPress, data }: DegreeItem) => {
  return (
    <PressableScale onPress={onPress}>
      <View
        flexDirection={'row'}
        paddingHorizontal={'large'}
        borderBottomColor={'grey400'}
        borderBottomWidth={StyleSheet.hairlineWidth}
        backgroundColor={'white'}
        paddingVertical={'medium'}
      >
        <View flex={1} paddingLeft={'medium'}>
          <View
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Text variant={'medium14'} color={'black'}>
              {data?.name}
            </Text>
          </View>
        </View>
      </View>
    </PressableScale>
  );
};

export default DegreeItem;
