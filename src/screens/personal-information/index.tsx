import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { scale } from 'react-native-size-matters';
import * as z from 'zod';
import { ScreenHeader } from '@/components/screen-header';
import { useSoftKeyboardEffect } from '@/hooks';
import type { Theme } from '@/theme';
import { Button, ControlledInput, Screen, Text, View } from '@/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@shopify/restyle';
import { useUser, setUserData } from '@/store/user';
import { useUpdateCandidateProfile } from '@/services/api/candidate';
import { useGetProfile } from '@/services/api/home';
import { showErrorMessage, showSuccessMessage } from '@/utils';
import { queryClient } from '@/services/api/api-provider';

const schema = z.object({
  fullName: z.string({
    required_error: 'Full name is required',
  }),
  jobTilte: z.string({
    required_error: 'Job title is required',
  }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  phone: z.string({
    required_error: 'phone is required',
  }),
});

export type PersonalInformationFormType = z.infer<typeof schema>;

export const PersonalInformation = () => {
  const { colors } = useTheme<Theme>();

  useSoftKeyboardEffect();

  const user = useUser((state) => state.user);
  const profile = useUser((state) => state.profile);
  const company = useUser((state) => state.company);
  const roles = useUser((state) => state.roles);

  const { mutate: updateProfile, isLoading: updating } = useUpdateCandidateProfile();

  const { handleSubmit, control, setValue } = useForm<PersonalInformationFormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: PersonalInformationFormType) => {
    let newProfile = {
      ...profile,
      full_name: data?.fullName,
      job_title: data?.jobTilte,
    };

    let newUser = {
      ...user,
      email: data?.email,
      phone: data?.phone,
    };

    const body: any = {
      email: data?.email,
      full_name: data.fullName,
      job_title_id: data.jobTilte,
      unique_id: profile?.unique_id,
    };

    updateProfile(body, {
      onSuccess: (responseData) => {
        // console.log('responseData', JSON.stringify(responseData, null, 2));

        if (responseData?.status === 200) {
          showSuccessMessage(responseData?.message ?? '');
          queryClient.invalidateQueries(useGetProfile.getKey());

          setUserData({
            profile: newProfile,
            user: newUser,
            company,
            roles,
          });
        } else {
          showErrorMessage(responseData?.message ?? '');
        }
      },
      onError: (error) => {
        //@ts-ignore
        showErrorMessage(error?.response?.data?.message ?? '');
      },
    });
  };

  useEffect(() => {
    if (profile?.full_name) {
      setValue('fullName', profile?.full_name);
    }

    if (user?.phone) {
      setValue('phone', user?.phone);
    }

    if (profile?.job_title) {
      setValue('jobTilte', profile?.job_title);
    }

    setValue('email', user?.email);
  }, []);

  return (
    <Screen backgroundColor={colors.white}>
      <ScreenHeader showBorder={true} title="Personal Information" />

      <View flex={1} paddingHorizontal={'large'}>
        <View paddingTop={'large'}>
          <ControlledInput
            placeholder="Enter full name"
            label="Full Name"
            control={control}
            name="fullName"
          />
          <View height={scale(8)} />
          <ControlledInput
            placeholder="Enter job"
            label="Job title"
            control={control}
            name="jobTilte"
          />
          <View height={scale(8)} />
          <ControlledInput
            placeholder="Enter email address"
            label="Email"
            control={control}
            name="email"
            icon={
              <View
                backgroundColor={'secondary'}
                paddingVertical={'small'}
                paddingHorizontal={'medium'}
                borderRadius={scale(16)}
              >
                <Text color={'primary'}>Verified</Text>
              </View>
            }
          />
          <View height={scale(8)} />
          <ControlledInput
            placeholder="Enter Phone"
            label="Phone Number"
            control={control}
            name="phone"
            keyboardType="phone-pad"
            icon={
              user?.phone ? (
                <View
                  backgroundColor={'secondary'}
                  paddingVertical={'small'}
                  paddingHorizontal={'medium'}
                  borderRadius={scale(16)}
                >
                  <Text color={'primary'}>Verified</Text>
                </View>
              ) : null
            }
          />
        </View>
        <View height={scale(24)} />
        <View flex={1} justifyContent={'flex-end'}>
          <Button label="Update" onPress={handleSubmit(onSubmit)} loading={updating} />
        </View>
      </View>
    </Screen>
  );
};
