import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { ScreenHeader } from '@/components/screen-header';
import { useRefreshOnFocus, useSoftKeyboardEffect } from '@/hooks';
import { queryClient } from '@/services/api/api-provider';
import { setProfilePic, useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { Button, ControlledInput, Screen, View, Text } from '@/ui';
import { DescriptionField } from '@/ui/description-field';
import { showErrorMessage, showSuccessMessage } from '@/utils';
import { Avatar } from '@/components/avatar';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { useGetUserProfileDetails, useGetProfile } from '@/services/api/home';
import { useUpdatePicture, useProfileDetails } from '@/services/api/profile';
import * as mime from 'react-native-mime-types';
import Loader from '@/components/loader';
import { useUpdateCandidateProfile } from '@/services/api/candidate';
import { useExperience, setSelectedLocation } from '@/store/experience';
import { SelectOptionButton } from '@/components/select-option-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MultiTextField } from '@/ui/multine-text-field';
import { PriceControlledInput } from '@/ui/price-controlled-input';

const schema = z.object({
  name: z.string({
    required_error: 'Profile name is required',
  }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  jobTitle: z.string({
    required_error: 'Job title is required',
  }),

  cover: z.string({
    required_error: 'Bio is required',
  }),
  location: z.string().optional(),
  salary: z.string().optional(),
  languages: z.string().optional(),
});

export type EditProfileFormType = z.infer<typeof schema>;

export const EditProfile = () => {
  const { colors } = useTheme<Theme>();
  const { goBack, navigate } = useNavigation();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const user = useUser((state) => state.profile);
  const selectedLocation = useExperience((state) => state.selectedLocation);

  //useSoftKeyboardEffect();

  const { showActionSheetWithOptions } = useActionSheet();

  const [image, setImage] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

  const [picTyp, setPicType] = useState(null);

  const [cameraPermissionStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [galleryPermission, requestGallaryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const { data, isLoading, refetch } = useGetUserProfileDetails({
    variables: {
      id: route?.params?.user?.unique_id,
    },
  });

  useRefreshOnFocus(refetch);

  const { mutate: updateProfile, isLoading: updating } = useUpdateCandidateProfile();

  const profileData = data?.response?.data;

  // console.log('profileData', JSON.stringify(profileData, null, 2));

  const profile = route?.params?.user;

  const { handleSubmit, control, setValue, watch, trigger } =
    useForm<EditProfileFormType>({
      resolver: zodResolver(schema),
      // defaultValues: {
      //   name: profile?.full_name,
      //   email: profile?.contact?.email,
      //   jobTitle: profile?.job_titles,
      //   cover: profile?.resume_bio ? profile?.resume_bio : '',
      //   location: profile?.contact?.google_location,
      //   salary: profile?.expected_salary,
      // },
    });

  const { mutate: updateProfilePic, isLoading: savingPic } = useUpdatePicture();

  const watchLocation = watch('location');

  useEffect(() => {
    if (profileData) {
      setValue('name', profileData?.full_name);
      setValue('jobTitle', profileData?.job_titles);
      setValue('salary', profileData?.expected_salary?.toString());
      setValue('email', profileData?.contact?.email);
      setValue('cover', profileData?.resume_bio);

      const location = {
        address: profileData?.contact?.google_location,
        city: profileData?.contact?.country_name,
        country: profileData?.contact?.city_name,
      };
      setSelectedLocation(location);
    }
  }, [profileData]);

  const onSubmit = (data: EditProfileFormType) => {
    const body: any = {
      email: data?.email,
      full_name: data?.name,
      job_title_id: data?.jobTitle,
      expected_salary: data?.salary,
      resume_bio: data?.cover,
      unique_id: profile?.unique_id,
      location_id: data?.location,
      experience_level_id: '0',
      education_level_id: '0',
    };

    if (selectedLocation) {
      body.city_id = selectedLocation?.city;
    }
    if (selectedLocation) {
      body.country_id = selectedLocation?.country;
    }

    /// console.log('body', JSON.stringify(body, null, 2));

    updateProfile(body, {
      onSuccess: (responseData) => {
        if (responseData?.status === 200) {
          showSuccessMessage(responseData?.message ?? '');
          queryClient.invalidateQueries(useGetProfile.getKey());
          setSelectedLocation('');
          goBack();
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
    if (!cameraPermissionStatus?.granted) {
      requestCameraPermission();
    }
    if (!galleryPermission?.granted) {
      requestGallaryPermission();
    }
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setValue('location', selectedLocation?.address);
      trigger('location');
    }
  }, [selectedLocation]);

  const updateProfilePicApiCall = ({
    asset,
    picType,
  }: {
    asset: any;
    picType: 'pic' | 'cover';
  }) => {
    const data = new FormData();

    let fileName;

    const uriParts = asset.uri.split('/');
    fileName = uriParts[uriParts.length - 1];

    // if (asset.fileName === null) {
    //   const uriParts = asset.uri.split('/');
    //   fileName = uriParts[uriParts.length - 1];
    // } else {
    //   fileName = asset.fileName;
    // }

    data.append('file', {
      name: fileName,
      type: mime.lookup(asset?.uri?.replace('file://', '')),
      uri: Platform.OS === 'ios' ? asset?.uri?.replace('file://', '') : asset?.uri,
    });

    data?.append('id', route?.params?.user?.unique_id);
    data?.append('type', picType);

    updateProfilePic(data, {
      onSuccess: (response) => {
        if (response?.response?.status === 200) {
          queryClient.invalidateQueries(useGetProfile.getKey());
          if (user?.unique_id === route?.params?.user?.unique_id) {
            setProfilePic(response?.response?.path);
          }
          // goBack();
          showSuccessMessage('Experience Updated successfully');
        } else {
        }
      },
      onError: (error) => {
        // An error happened!
        // @ts-ignore
        console.log(`error`, error?.response.data?.message);
      },
    });
  };

  const pickImage = async (picType) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: picType === 'cover' ? [4, 2] : [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      if (picType === 'pic') {
        setImage(result.assets[0].uri);
      } else {
        setCoverPic(result.assets[0].uri);
      }

      setPicType(picType);
      const asset = result?.assets[0];
      updateProfilePicApiCall({ asset, picType });
    }
  };

  const takeImage = async (picType) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPicType(picType);

      if (picType === 'pic') {
        setImage(result.assets[0].uri);
      } else {
        setCoverPic(result.assets[0].uri);
      }

      const asset = result?.assets[0];
      updateProfilePicApiCall({ asset, picType });
    }
  };

  const takeProfilePic = ({ picType }: { picType: 'pic' | 'cover' }) => {
    const options = ['Gallery', 'Camera', 'Cancel'];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            // Save
            pickImage(picType);
            break;
          case 1:
            // Save
            takeImage(picType);
            break;
          case destructiveButtonIndex:
            // Delete
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  return (
    <Screen backgroundColor={colors.white} edges={['top', 'bottom']}>
      <ScreenHeader title="Edit Profile" showBorder={true} icon="close" />

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <View>
            <Image
              cachePolicy="memory-disk"
              source={coverPic ? coverPic : profileData?.cover_pic}
              style={{ height: scale(119), width: width }}
              transition={1000}
              placeholder={`https://fakeimg.pl/${width}x400/cccccc/cccccc`}
            />

            <View position={'absolute'} right={16} top={16}>
              <TouchableOpacity onPress={() => takeProfilePic({ picType: 'cover' })}>
                <View
                  height={scale(24)}
                  justifyContent={'center'}
                  alignItems={'center'}
                  width={scale(24)}
                  backgroundColor={'white'}
                  borderRadius={scale(12)}
                >
                  <Image
                    source={icons['camera']}
                    style={{ height: scale(16), width: scale(16) }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            marginLeft={'large'}
            style={{
              marginTop: -28,
            }}
          >
            <View alignSelf={'baseline'}>
              <Avatar
                cachePolicy="none"
                source={image ? image : profileData?.profile_pic}
                size="large"
                onPress={() => takeProfilePic({ picType: 'pic' })}
                transition={1000}
                placeholder={'https://fakeimg.pl/400x400/cccccc/cccccc'}
              />
              <View position={'absolute'} right={0} top={0}>
                <TouchableOpacity onPress={() => takeProfilePic({ picType: 'pic' })}>
                  <View
                    height={scale(24)}
                    justifyContent={'center'}
                    alignItems={'center'}
                    width={scale(24)}
                    backgroundColor={'white'}
                    borderRadius={scale(12)}
                  >
                    <Image
                      source={icons['camera']}
                      style={{ height: scale(16), width: scale(16) }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

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
            name="jobTitle"
          />

          <PriceControlledInput
            placeholder="Enter salary"
            label="Expected Salary"
            control={control}
            name="salary"
          />
          {/* <ControlledInput
            placeholder="e.g Urdu, English"
            label="Languages"
            control={control}
            name="languages"
          /> */}

          <ControlledInput
            placeholder="Enter email"
            label="Email"
            control={control}
            name="email"
          />

          <SelectOptionButton
            label="Location"
            isSelected={watchLocation ? true : false}
            selectedText={watchLocation ? watchLocation : 'Choose Location'}
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseLocation', { from: 'Profile' });
            }}
          />

          <DescriptionField
            placeholder="Write here"
            label="Bio"
            control={control}
            name="cover"
          />

          {/* <ControlledInput
            placeholder="Write here"
            label="Bio"
            control={control}
            name="cover"
          /> */}
        </View>
      </KeyboardAwareScrollView>
      <View height={scale(24)} />
      <View paddingHorizontal={'large'}>
        <Button label="Update" onPress={handleSubmit(onSubmit)} loading={updating} />
      </View>
      <Loader isVisible={savingPic} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: scale(160),
  },
});
