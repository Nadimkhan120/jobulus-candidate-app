import { Button, Screen, View } from '@/ui';
import React from 'react';
import { JobDetailTopContainer } from './top-container';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '@/theme';
import { ScreenHeader } from '@/components/screen-header';
import { ScrollView } from 'react-native';
import JobDetailItem from './job-detail-item';
import { JobDetailsData } from './data';
import { CustomStepper } from './custom-stepper';
import { scale } from 'react-native-size-matters';

export const MyJobDetail = () => {
  const { colors } = useTheme<Theme>();

  return (
    <Screen
      edges={['top']}
      backgroundColor={colors.white}
      barStyle="dark-content"
    >
      <ScreenHeader showBorder={true} />

      <ScrollView>
        <View flex={1} backgroundColor={'grey500'}>
          <JobDetailTopContainer />

          <View flexDirection={'row'} paddingHorizontal={'large'}>
            <View alignItems={'center'} style={{ marginTop: scale(50) }}>
              {JobDetailsData?.map((element, index) => {
                return (
                  <View key={index} flexDirection={'row'} alignItems={'center'}>
                    <CustomStepper
                      index={index}
                      count={JobDetailsData?.length}
                      element={element}
                    />
                  </View>
                );
              })}
            </View>
            <View marginLeft={'medium'}>
              {JobDetailsData?.map((element) => {
                return (
                  <View marginVertical={'medium'}>
                    <JobDetailItem element={element} />
                  </View>
                );
              })}
            </View>
          </View>

          <Button
            variant={'outline'}
            label="Job Post"
            marginHorizontal={'large'}
            marginVertical={'4xl'}
            onPress={null}
            backgroundColor={'white'}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};
