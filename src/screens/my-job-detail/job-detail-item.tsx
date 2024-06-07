import { Button, Screen, Text, View } from '@/ui';
import React from 'react';
import { scale } from 'react-native-size-matters';

type JobDetailsProps = {
  element?: any;
};

const JobDetailItem = ({ element }: JobDetailsProps) => {
  return (
    <View
      backgroundColor={'white'}
      borderRadius={8}
      padding={'medium'}
      width={scale(279)}
      height={scale(90)}
      gap={'xSmall'}
    >
      <Text variant={'medium14'} color={'black'}>
        {element?.step_name}
      </Text>
      <Text variant={'regular12'} color={'grey200'}>
        {element?.description}
      </Text>
      <View flexDirection={'row'} gap={'small'}>
        {element?.docs &&
          element?.docs?.map((item) => {
            return (
              <Text variant={'medium14'} color={'blue'}>
                {item}
              </Text>
            );
          })}
      </View>
    </View>
  );
};

export default JobDetailItem;
