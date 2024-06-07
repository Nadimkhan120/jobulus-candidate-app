import { PressableScale, Text, View } from '@/ui';
import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

type CapsuleViewProps = {
  element: any;
  onPress: (data: any) => void;
};

const CapsuleView = ({ element, onPress }: CapsuleViewProps) => {
  return (
    <PressableScale onPress={() => onPress?.(element)}>
      <View
        paddingHorizontal={'medium'}
        height={scale(37)}
        borderWidth={element?.active ? null : StyleSheet.hairlineWidth * 3}
        borderColor={'grey300'}
        borderRadius={scale(24)}
        justifyContent={'center'}
        alignItems={'center'}
        marginRight={'small'}
        backgroundColor={element?.active ? 'primary' : 'white'}
      >
        <Text variant={'medium14'} color={element?.active ? 'white' : 'grey100'}>
          {element?.heading}
        </Text>
      </View>
    </PressableScale>
  );
};

export default CapsuleView;
