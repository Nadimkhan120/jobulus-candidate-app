import React from 'react';
import { StyleSheet } from 'react-native';
import { PressableScale, Text, View } from '@/ui';
import { CheckBox } from '@/components/checkbox';

type SkillsItem = {
  data: any;
  onPress: (data: any) => void;
};

const SkillsItem = ({ onPress, data }: SkillsItem) => {
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
            <Text variant={'semiBold14'} color={'black'}>
              {data?.name}
            </Text>

            <CheckBox
              value={data?.selected}
              onToggle={() => {
                onPress(data);
              }}
            />
          </View>
        </View>
      </View>
    </PressableScale>
  );
};

export default SkillsItem;
