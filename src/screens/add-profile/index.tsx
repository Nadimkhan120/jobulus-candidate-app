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
import { useUpdatePicture } from '@/services/api/profile';
import * as mime from 'react-native-mime-types';
import Loader from '@/components/loader';
import { useCreateCandidateProfile } from '@/services/api/candidate';
import { useExperience, setSelectedLocation } from '@/store/experience';
import { SelectOptionButton } from '@/components/select-option-button';

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

export type AddProfileFormType = z.infer<typeof schema>;

export const AddProfile = () => {
  const { colors } = useTheme<Theme>();
  const { goBack, navigate } = useNavigation();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const user = useUser((state) => state.profile);
  const selectedLocation = useExperience((state) => state.selectedLocation);

  useSoftKeyboardEffect();
  const { showActionSheetWithOptions } = useActionSheet();

  const [image, setImage] = useState(null);
  const [apiImage, setApiImage] = useState(null);
  const [picTyp, setPicType] = useState(null);

  const [coverImage, setCoverImage] = useState(null);
  const [apiCover, setApiCover] = useState(null);

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

  const { mutate: createProfile, isLoading: creating } = useCreateCandidateProfile();

  const { handleSubmit, control, setValue, watch, trigger } = useForm<AddProfileFormType>(
    {
      resolver: zodResolver(schema),
    }
  );

  const { mutate: updateProfilePic, isLoading: savingPic } = useUpdatePicture();

  const watchLocation = watch('location');

  const onSubmit = (data: AddProfileFormType) => {
    const body: any = {
      email: data?.email,
      full_name: data?.name,
      job_title_id: data?.jobTitle,
      expected_salary: data?.salary,
      resume_bio: data?.cover,
      // unique_id: profile?.unique_id,
      location_id: data?.location,
      experience_level_id: '0',
      education_level_id: '0',
      pic: apiImage,
      cover: apiCover,
    };

    if (selectedLocation) {
      body.city_id = selectedLocation?.city;
    }
    if (selectedLocation) {
      body.country_id = selectedLocation?.country;
    }

    createProfile(body, {
      onSuccess: (responseData) => {
        console.log('body', JSON.stringify(responseData, null, 2));
        if (responseData?.response?.status === 200) {
          showSuccessMessage(
            responseData?.response?.message ?? 'Profile added successfully'
          );
          queryClient.invalidateQueries(useGetProfile.getKey());
          setSelectedLocation('');
          goBack();
        } else {
          showErrorMessage(responseData?.response?.message ?? '');
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

    //data?.append('id', route?.params?.user?.unique_id);
    data?.append('type', picType);

    updateProfilePic(data, {
      onSuccess: (response) => {
        // console.log('response', response);

        if (response?.response?.status === 200) {
          if (picType === 'pic') {
            setApiImage(response?.response?.filename);
          } else {
            setApiCover(response?.response?.filename);
          }

          // queryClient.invalidateQueries(useGetProfile.getKey());
          // if (user?.unique_id === route?.params?.user?.unique_id) {
          //   setProfilePic(response?.response?.path);
          // }
          // goBack();
          // showSuccessMessage('Profile created successfully');
        } else {
        }
      },
      onError: (error) => {
        // An error happened!
        // @ts-ignore
        console.log(`error`, error);
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
      // setImage(result.assets[0].uri);

      console.log({ picType });

      if (picType === 'pic') {
        setImage(result.assets[0].uri);
      }

      if (picType === 'cover') {
        setCoverImage(result.assets[0].uri);
      }

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
      if (picTyp === 'pic') {
        setImage(result.assets[0].uri);
      }

      if (picTyp === 'cover') {
        setCoverImage(result.assets[0].uri);
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
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title="Create Profile" showBorder={true} icon="close" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <View>
            <Image
              source={
                coverImage ? coverImage : 'https://fakeimg.pl/400x400/cccccc/cccccc'
              }
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
                source={image ? image : 'https://fakeimg.pl/400x400/F0ECEC/F0ECEC'}
                size="large"
                transition={1000}
                placeholder={'https://fakeimg.pl/400x400/F0ECEC/F0ECEC'}
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

          <ControlledInput
            placeholder="Enter salary"
            label="Expected Salary"
            control={control}
            name="salary"
          />

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
        </View>
        <View height={scale(24)} />
        <View flex={1} justifyContent={'flex-end'} paddingHorizontal={'large'}>
          <Button label="Create" onPress={handleSubmit(onSubmit)} loading={creating} />
        </View>
      </ScrollView>

      <Loader isVisible={savingPic} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: scale(160),
  },
});
