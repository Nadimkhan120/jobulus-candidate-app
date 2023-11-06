import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Screen, Text, View } from '@/ui';
import Svg, { Line } from 'react-native-svg';
import { scale } from 'react-native-size-matters';
import { icons } from '@/assets/icons';
import { Image } from 'expo-image';

type StepperProps = {
  element?: any;
  index?: any;
  count?: any;
};

export const CustomStepper = ({ element, index, count }: StepperProps) => {
  return (
    <View alignItems={'center'}>
      <View
        style={styles.stepIcon}
        backgroundColor={element?.completed ? 'primary' : 'tertiary'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Text color={element?.completed ? 'white' : 'primary'}>
          {index + 1}
        </Text>
      </View>
      {index < count - 1 && (
        <Image
          source={element?.completed ? icons['plain-line'] : icons['stepper']}
          style={{ height: scale(80), width: scale(2) }}
          contentFit={element?.completed ? null : 'contain'}
        />
      )}
      {/* <View>
        {index < count - 1 && (
          <Svg height="80" width="2">
            <Line
              x1="1"
              y1="0"
              x2="1"
              y2="80"
              stroke={colors?.primary}
              strokeDasharray="8,10"
              strokeWidth="6"
            />
          </Svg>
        )}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  stepIcon: {
    width: scale(32),
    height: scale(32),
    borderRadius: 20,
  },
});
