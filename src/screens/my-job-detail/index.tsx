import { Button, Screen, View } from '@/ui';
import React from 'react';
import { JobDetailTopContainer } from './top-container';
import { useTheme } from '@shopify/restyle';
import type { Theme } from '@/theme';
import { ScreenHeader } from '@/components/screen-header';
import { ScrollView } from 'react-native';
import JobDetailItem from './job-detail-item';
//import { JobDetailsData } from './data';
import { CustomStepper } from './custom-stepper';
import { scale } from 'react-native-size-matters';
import { useAppliedJobDetails } from '@/services/api/home';
import { useUser } from '@/store/user';
import { useRoute } from '@react-navigation/native';

export const MyJobDetail = () => {
  const { colors } = useTheme<Theme>();
  const route = useRoute<any>();

  const user = useUser((state) => state?.user);

  const { data, isLoading, error } = useAppliedJobDetails({
    variables: {
      person_id: user?.id,
      job_id: route?.params?.data?.id,
    },
  });

  if (isLoading) return;

  return (
    <Screen edges={['top']} backgroundColor={colors.white} barStyle="dark-content">
      <ScreenHeader showBorder={true} />

      <ScrollView>
        <View flex={1} backgroundColor={'grey500'}>
          <JobDetailTopContainer data={data?.response?.data[0]} />

          <View flexDirection={'row'} paddingHorizontal={'large'}>
            <View alignItems={'center'} style={{ marginTop: scale(50) }}>
              {data?.response?.data[0]?.recruitment_process?.map((element, index) => {
                return (
                  <View key={index} flexDirection={'row'} alignItems={'center'}>
                    <CustomStepper
                      index={index}
                      count={data?.response?.data[0]?.recruitment_process?.length}
                      element={element}
                    />
                  </View>
                );
              })}
            </View>
            <View marginLeft={'medium'}>
              {data?.response?.data[0]?.recruitment_process?.map((element, index) => {
                return (
                  <View key={index} marginVertical={'medium'}>
                    <JobDetailItem element={element} />
                  </View>
                );
              })}
            </View>
          </View>

          {/* <Button
            variant={'outline'}
            label="Job Post"
            marginHorizontal={'large'}
            marginVertical={'4xl'}
            onPress={null}
            backgroundColor={'white'}
          /> */}
        </View>
      </ScrollView>
    </Screen>
  );
};
