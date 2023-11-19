import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import * as z from 'zod';
import StepIndicator from '@/components/indicator-2';
import { ScreenHeader } from '@/components/screen-header';
import { useSoftKeyboardEffect } from '@/hooks';
import { useCompanyInformation } from '@/services/api/auth/company-information';
import type { Theme } from '@/theme';
import { Button, ControlledInput, Screen, Text, View } from '@/ui';
import { showErrorMessage } from '@/utils';
import { useUser } from '@/store/user';
import {
  useEducationLevels,
  useExperienceLevels,
} from '@/services/api/settings';
import SelectionBox from '@/components/drop-down';

const labels = ['Registration', 'Information', 'Invite'];

const schema = z.object({
  title: z.string({
    required_error: 'Company name is required',
  }),
  experience: z.string({
    required_error: 'experience is required',
  }),

  education: z.string({
    required_error: 'Education is required',
  }),
  skills: z.string({
    required_error: 'Skilles are  required',
  }),
  location: z.string({
    required_error: 'Location is required',
  }),
});

export type CompanyInformationFormType = z.infer<typeof schema>;

export const CompanyInformation = () => {
  const { colors } = useTheme<Theme>();
  const { navigate } = useNavigation();

  useSoftKeyboardEffect();

  const user = useUser((state) => state?.user);

  const { mutate: companyInformationApi, isLoading } = useCompanyInformation();
  const { data: experienceLevels } = useExperienceLevels();
  const { data: educationLevels } = useEducationLevels();

  const { handleSubmit, control, formState, setValue } =
    useForm<CompanyInformationFormType>({
      resolver: zodResolver(schema),
    });

  const onSubmit = (data: CompanyInformationFormType) => {
    let body = {
      city_id: 'Islamabad',
      country_id: 'Pakistan',
      job_title_id: data?.title,
      education_level_id: parseInt(data.education),
      experience_level_id: parseInt(data.experience),
      user_id: user?.id,
      //@ts-ignore
      skills: [data?.skills],
      google_location: data?.location,
    };

    console.log('body', body);

    companyInformationApi(
      {
        city_id: 'Islamabad',
        country_id: 'Pakistan',
        job_title_id: data?.title,
        education_level_id: parseInt(data.education),
        experience_level_id: parseInt(data.experience),
        user_id: user?.id,
        //@ts-ignore
        skills: [data?.skills],
        google_location: data?.location,
      },
      {
        onSuccess: (data: any) => {
          console.log('data', JSON.stringify(data, null, 2));

          // if (data?.response?.status === 200) {
          //   navigate('SendInvite');
          // } else {
          //   showErrorMessage(data?.response?.message);
          // }
        },
        onError: (error) => {
          // An error happened!
          console.log('error', error);
        },
      }
    );
  };

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader />

      <View
        paddingHorizontal={'large'}
        backgroundColor={'grey500'}
        paddingBottom={'medium'}
      >
        <StepIndicator stepCount={3} currentPosition={1} labels={labels} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View flex={1} paddingHorizontal={'large'}>
          <View height={scale(12)} />

          <View paddingTop={'large'}>
            <Text variant={'semiBold24'} color={'black'}>
              Personal Information
            </Text>
            <Text variant={'regular14'} paddingTop={'small'} color={'grey100'}>
              Complete your profile by adding further information
            </Text>
          </View>

          <View paddingTop={'large'} gap={'medium'}>
            <ControlledInput
              placeholder="Enter title"
              label="Job Title"
              control={control}
              name="title"
            />

            <View>
              <SelectionBox
                label="Experience level"
                placeholder="Select experience"
                data={experienceLevels}
                onChange={(data) => {
                  setValue('experience', `${data?.id}`);
                }}
              />
              {formState?.errors?.experience?.message && (
                <Text paddingTop={'small'} variant="regular14" color={'error'}>
                  {formState?.errors?.experience?.message}
                </Text>
              )}
            </View>

            <View>
              <SelectionBox
                label="Education"
                data={educationLevels}
                placeholder="Select education"
                onChange={(data) => {
                  setValue('education', `${data?.id}`);
                }}
              />
              {formState?.errors?.education?.message && (
                <Text paddingTop={'small'} variant="regular14" color={'error'}>
                  {formState?.errors?.education?.message}
                </Text>
              )}
            </View>

            <ControlledInput
              placeholder="Enter skills"
              label="Skills"
              control={control}
              name="skills"
            />

            <ControlledInput
              placeholder="Enter location"
              label="Location"
              control={control}
              name="location"
            />
          </View>
          <View height={scale(24)} />
          <Button
            label="Next"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: scale(40),
  },
});
