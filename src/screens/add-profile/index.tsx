import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { scale } from 'react-native-size-matters';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { ScreenHeader } from '@/components/screen-header';
import { useSoftKeyboardEffect } from '@/hooks';
import { queryClient } from '@/services/api/api-provider';
import {
  useCompanies,
  useEditCompany,
  useGetCompanyDetails,
} from '@/services/api/company';
import { useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { Button, ControlledInput, Screen, View } from '@/ui';
import { DescriptionField } from '@/ui/description-field';
import { showErrorMessage, showSuccessMessage } from '@/utils';
import { Avatar } from '@/components/avatar';

const schema = z.object({
  name: z.string({
    required_error: 'Profile name is required',
  }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  cover: z.string({
    required_error: 'Cover Letter is required',
  }),
  location: z.string().optional(),
  salary: z.string().optional(),
  languages: z.string().optional(),
});

export type AddProfileFormType = z.infer<typeof schema>;

export const AddProfile = () => {
  const { colors } = useTheme<Theme>();
  const { goBack } = useNavigation();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();

  useSoftKeyboardEffect();

  const company = useUser((state) => state?.company);

  const { mutate: editCompanyApi, isLoading } = useEditCompany();

  const data = route?.params?.data;

  const { handleSubmit, control, setValue } = useForm<AddProfileFormType>({
    resolver: zodResolver(schema),
    // defaultValues: {
    //   companyName: data?.name,
    //   email: data?.email,
    //   phone: data?.location?.phone,
    //   website: data?.location?.website,
    //   bio: data?.short_description,
    //   employees: data?.no_of_employees,
    //   wage: data?.average_wage,
    //   address: data?.location?.address_1,
    //   city: data?.location?.city_name,
    //   country: data?.location?.country_name,
    //   facebook: data?.facebook_link,
    //   instgram: data?.instagram_link,
    //   whatsapp: data?.twitter_link,
    // },
  });

  const onSubmit = (data: AddProfileFormType) => {
    return;
    editCompanyApi(
      {
        name: data?.companyName,
        email: data?.email,
        contact_number: data?.phone,
        no_of_employees: parseInt(data?.employees),
        start_time: '9 am',
        end_time: '6 pm',
        average_wage: parseInt(data?.wage),
        languages: [1, 2],
        categories: [1, 2],
        company_id: company?.id,
        short_description: data?.bio,
        facebook_link: data?.facebook,
        instagram_link: data?.instgram,
        twitter_link: data?.whatsapp,
        locations: {
          address_1: data?.address,
          address_2: '',
          city_id: '1',
          country_id: '1',
          phone: data?.phone,
          email: data?.email,
          website: data?.website,
          web_location: '',
          longitude: '0.00000',
          latitude: '0.0000',
          google_location: data?.location,
        },
      },
      {
        onSuccess: (responseData) => {
          if (responseData?.status === 200) {
            showSuccessMessage(responseData?.message ?? '');
            queryClient.invalidateQueries(useCompanies.getKey());
            queryClient.invalidateQueries(useGetCompanyDetails.getKey());
            goBack();
          } else {
            showErrorMessage(responseData?.message ?? '');
          }
        },
        onError: (error) => {
          //@ts-ignore
          showErrorMessage(error?.response?.data?.message ?? '');
        },
      }
    );
  };

  useEffect(() => {
    //setValue('bio', data?.short_description);
  }, []);

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title="Edit Profile" showBorder={true} icon="close" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View height={scale(119)}>
          <Image
            source={icons['back-cover']}
            style={{ height: scale(119), width: width }}
          />
          <View
            alignSelf={'flex-start'}
            position={'absolute'}
            // bottom={0}
            marginLeft={'large'}
            style={{
              bottom: -scale(28),
            }}
          >
            <Avatar source={icons['avatar-2']} size="large" />
          </View>
        </View>

        <View height={scale(44)} />

        <View paddingTop={'large'} paddingHorizontal={'large'} rowGap={'small'}>
          <ControlledInput
            placeholder="Enter  name"
            label="Profile Name"
            control={control}
            name="name"
          />

          <ControlledInput
            placeholder="Enter job tilte"
            label="Job Title"
            control={control}
            name="email"
          />

          <ControlledInput
            placeholder="Enter salary"
            label="Expected Salary"
            control={control}
            name="salary"
          />
          <ControlledInput
            placeholder="e.g Urdu, English"
            label="Languages"
            control={control}
            name="languages"
          />

          <ControlledInput
            placeholder="Enter email"
            label="Email"
            control={control}
            name="email"
          />

          <ControlledInput
            placeholder="Enter location."
            label="Location"
            control={control}
            name="location"
          />

          <DescriptionField
            placeholder="Write here"
            label="Cover Letter"
            control={control}
            name="cover"
          />
        </View>
        <View height={scale(24)} />
        <View flex={1} justifyContent={'flex-end'} paddingHorizontal={'large'}>
          <Button
            label="Save Profile"
            onPress={() => {
              navigate('Profile');
            }}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: scale(160),
  },
});
