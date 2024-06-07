import React from 'react';
import { StyleSheet } from 'react-native';
import { PressableScale, Text, View } from '@/ui';

type LocationItem = {
  data: any;
  onPress: () => void;
};

const LocationItem = ({ onPress, data }: LocationItem) => {
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
            <Text variant={'semiBold14'} color={'black'}>
              {data?.name}
            </Text>
          </View>
        </View>
      </View>
    </PressableScale>
  );
};

export default LocationItem;
