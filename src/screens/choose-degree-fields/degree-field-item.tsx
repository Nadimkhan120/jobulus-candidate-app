import React from 'react';
import { StyleSheet } from 'react-native';
import { PressableScale, Text, View } from '@/ui';
import { useExperience } from '@/store/experience';

type DegreeFieldItem = {
  data: any;
  onPress: (data) => void;
};

const DegreeFieldItem = ({ onPress, data }: DegreeFieldItem) => {
  const selectedField = useExperience((state) => state?.selectedField);

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
        <View flex={1} paddingLeft={'medium'}>
          <View
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Text
              variant={'medium14'}
              color={selectedField?.id === data?.id ? 'primary' : 'black'}
            >
              {data?.name}
            </Text>
          </View>
        </View>
      </View>
    </PressableScale>
  );
};

export default DegreeFieldItem;
