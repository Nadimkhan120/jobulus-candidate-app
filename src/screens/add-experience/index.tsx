import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { ScreenHeader } from '@/components/screen-header';
import { useSoftKeyboardEffect } from '@/hooks';
import { queryClient } from '@/services/api/api-provider';
import { palette, type Theme } from '@/theme';
import { Button, ControlledInput, Screen, Text, View } from '@/ui';
import { DescriptionField } from '@/ui/description-field';
import { showErrorMessage, showSuccessMessage } from '@/utils';
import SwitchToggle from 'react-native-switch-toggle';
import SelectionBox from '@/components/drop-down';
import { SelectOptionButton } from '@/components/select-option-button';
import { CheckBox } from '@/components/checkbox';
import { BottomModal } from '@/components/bottom-modal';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { SelectModalItem } from '@/components/select-modal-item';
import { format } from 'date-fns';
import DatePicker from 'react-native-date-picker';
import {
  setSelectedCompany,
  setSelectedLocation,
  useExperience,
} from '@/store/experience';
import { useUpdateExperience } from '@/services/api/profile';
import { useGetUserProfileDetails } from '@/services/api/home';

const schema = z.object({
  name: z.string({
    required_error: 'Profile name is required',
  }),

  employeType: z.string({
    required_error: 'Employee Type is required',
  }),

  comapnyName: z.string({
    required_error: 'Company name is required',
  }),

  location: z.string({
    required_error: 'Location is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),

  startDate: z.string({
    required_error: 'Start date is required',
  }),
  endDate: z
    .string({
      required_error: 'End date is required',
    })
    .optional(),
  isPresent: z.boolean().optional(),
});

export type AddExperienceFormType = z.infer<typeof schema>;

const employees = [
  { name: 'Full Time', id: 1 },
  { name: 'Part Time', id: 2 },
  { name: 'Freelance', id: 3 },
  { name: 'Contract', id: 4 },
  { name: 'Self Employed', id: 5 },
  { name: 'Seasonal', id: 6 },
];

export const AddExperience = () => {
  const { colors } = useTheme<Theme>();
  const { goBack, navigate } = useNavigation();
  const route = useRoute<any>();

  useSoftKeyboardEffect();

  const [on, setOn] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(new Date());
  const [openStartDate, setOpenStartDate] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [openEndDate, setOpenEndDate] = useState(false);
  const [isPresent, setIsPresent] = useState(false);

  const selectedCompany = useExperience((state) => state?.selectedCompany);
  const selectedLocation = useExperience((state) => state?.selectedLocation);

  const { mutate: updateExperienceApi, isLoading } = useUpdateExperience();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ['60%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // callbacks
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const data = route?.params;

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<AddExperienceFormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (formData: AddExperienceFormType) => {
    updateExperienceApi(
      {
        unique_id: route?.params?.id,
        from_date: formData?.startDate,
        to_date: formData?.isPresent ? formData?.startDate : formData?.endDate,
        is_current: formData?.isPresent ? '1' : '0',
        employee_type: formData?.employeType,
        description: formData?.description,
        company_name: formData?.comapnyName,
        company_description: formData?.description,
        job_title: formData?.name,
        job_category_id: '1',
        location: formData?.location,
        //@ts-ignore
        city_id: selectedLocation?.city,
        country_id: selectedLocation?.country,
      },
      {
        onSuccess: (response) => {
          console.log('response', response);
          if (response?.status === 200) {
            queryClient.invalidateQueries(useGetUserProfileDetails.getKey());
            goBack();
            showSuccessMessage('Experience Updated successfully');
            setSelectedCompany('');
            setSelectedLocation('');
          } else {
          }
        },
        onError: (error) => {
          // An error happened!
          console.log(`error`, error);
        },
      }
    );
  };

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const watchEmployeeType = watch('employeType');
  const watchCompanyName = watch('comapnyName');
  const watchLocation = watch('location');

  useEffect(() => {
    if (selectedCompany) {
      setValue('comapnyName', selectedCompany);
      trigger('comapnyName');
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedLocation) {
      setValue('location', selectedLocation?.address);
      trigger('location');
    }
  }, [selectedLocation]);

  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <SelectModalItem
          title={item?.title}
          item={item}
          onPress={(data) => {
            setValue('employeType', data?.name);
            trigger('employeType');
            handleDismissModalPress();
          }}
        />
      );
    },
    [setValue]
  );

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title="Add Experience" showBorder={true} icon="close" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          backgroundColor={'secondary'}
          flexDirection={'row'}
          paddingHorizontal={'large'}
          paddingVertical={'large'}
        >
          <View flex={1}>
            <Text variant={'medium14'} color={'black'}>
              Notify network
            </Text>
            <Text variant={'regular13'} paddingTop={'small'} color={'grey300'}>
              Turn on to notify your network of key profile changes (such as new job) and
              work anniversaries. Updates can take up to 2 hours.
            </Text>
          </View>
          <SwitchToggle
            switchOn={on}
            onPress={() => setOn(!on)}
            circleColorOff={palette.white}
            circleColorOn={palette.white}
            backgroundColorOn={palette.primary}
            backgroundColorOff="#95969D"
          />
        </View>

        <View paddingTop={'large'} paddingHorizontal={'large'} rowGap={'small'}>
          <ControlledInput
            placeholder="ex. react native developer"
            label="Title"
            control={control}
            name="name"
          />

          <SelectOptionButton
            label="Employee Type"
            isSelected={watchEmployeeType ? true : false}
            selectedText={watchEmployeeType ? watchEmployeeType : 'Please Select'}
            icon={'chevron-down'}
            onPress={handlePresentModalPress}
          />

          {errors?.employeType?.message ? (
            <Text variant={'regular13'} color={'error'}>
              {errors?.employeType?.message}
            </Text>
          ) : null}

          <SelectOptionButton
            label="Company Name"
            isSelected={watchCompanyName ? true : false}
            selectedText={watchCompanyName ? watchCompanyName : 'Please Select'}
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseCompany');
            }}
          />

          {errors?.comapnyName?.message ? (
            <Text variant={'regular13'} color={'error'}>
              {errors?.comapnyName?.message}
            </Text>
          ) : null}

          <SelectOptionButton
            label="Location"
            isSelected={watchLocation ? true : false}
            selectedText={watchLocation ? watchLocation : 'Choose Location'}
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseLocation', { from: 'Experience' });
            }}
          />

          {errors?.location?.message ? (
            <Text variant={'regular13'} color={'error'}>
              {errors?.location?.message}
            </Text>
          ) : null}

          {/* <ControlledInput
            placeholder="ex. dubai, united arab emirates"
            label="Location"
            control={control}
            name="location"
          /> */}

          {/* <SelectOptionButton
            label="Location Type"
            isSelected={false}
            selectedText="Please Select"
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseLocation');
            }}
          /> */}

          <View flexDirection={'row'} paddingTop={'medium'} alignItems={'center'}>
            <CheckBox
              value={isPresent}
              onToggle={(data) => {
                setIsPresent(data);
                setValue('isPresent', data);
                trigger('isPresent');
              }}
            />
            <Text variant={'regular14'} color={'black'} marginLeft={'medium'}>
              Currently working in this role
            </Text>
          </View>

          {errors?.isPresent?.message ? (
            <Text variant={'regular13'} color={'error'}>
              {errors?.isPresent?.message}
            </Text>
          ) : null}

          <SelectOptionButton
            label="Start Date"
            isSelected={watchStartDate ? true : false}
            selectedText={watchStartDate ? watchStartDate : 'Please Select'}
            icon={'chevron-down'}
            onPress={() => {
              setOpenStartDate(true);
            }}
          />

          {errors?.startDate?.message ? (
            <Text variant={'regular13'} color={'error'}>
              {errors?.startDate?.message}
            </Text>
          ) : null}

          {isPresent ? null : (
            <SelectOptionButton
              label="End Date"
              isSelected={watchEndDate ? true : false}
              selectedText={watchEndDate ? watchEndDate : 'Please Select'}
              icon={'chevron-down'}
              onPress={() => {
                setOpenEndDate(true);
              }}
            />
          )}

          <DescriptionField
            //@ts-ignore
            placeholder="Enter company details"
            label="About Company"
            control={control}
            name="description"
          />

          {/* <ControlledInput
            placeholder="ex. react native developer"
            label="Profile Headline"
            control={control}
            name="salary"
          /> */}

          {/* <Text variant={'regular12'}>
            Appears below your name at the top of the profile
          </Text>

          <Text paddingVertical={'small'} variant="medium14" color={'black'}>
            Skills
          </Text>

          <Text variant={'regular13'} color={'grey300'}>
            We recommend adding your top 5 used in this role. They’ll also appear in your
            Skills section.
          </Text> */}

          {/* <PressableScale
            onPress={() => {
              navigate('ChooseSkills');
            }}
          >
            <View
              width={scale(132)}
              height={scale(40)}
              borderRadius={scale(8)}
              flexDirection={'row'}
              borderColor={'primary'}
              borderWidth={1}
              alignItems={'center'}
              justifyContent={'center'}
              marginTop={'small'}
            >
              <Image
                source={icons['plus2']}
                style={{
                  width: scale(20),
                  height: scale(20),
                  tintColor: palette.primary,
                }}
              />
              <Text variant={'medium14'} marginLeft={'small'} color={'primary'}>
                Add Skills
              </Text>
            </View>
          </PressableScale> */}
        </View>
        <View height={scale(24)} />
        <View flex={1} justifyContent={'flex-end'} paddingHorizontal={'large'}>
          <Button
            label="Save Profile"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
          />
        </View>
      </ScrollView>

      <BottomModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: colors.background }}
      >
        <BottomSheetFlatList
          contentContainerStyle={styles.contentContainer}
          data={employees}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </BottomModal>

      <DatePicker
        modal
        locale="en"
        open={openStartDate}
        date={startDate}
        mode="date"
        onConfirm={(date) => {
          const myDate = new Date(date);
          const formattedDate = format(myDate, 'yyyy/MM/dd');
          setValue('startDate', formattedDate);
          setOpenStartDate(false);
          setStartDate(date);
        }}
        onCancel={() => {
          setOpenStartDate(false);
        }}
      />

      <DatePicker
        modal
        locale="en"
        open={openEndDate}
        date={endDate}
        mode="date"
        onConfirm={(date) => {
          const myDate = new Date(date);
          const formattedDate = format(myDate, 'yyyy/MM/dd');
          setValue('endDate', formattedDate);
          setOpenEndDate(false);
          setEndDate(date);
        }}
        onCancel={() => {
          setOpenEndDate(false);
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: scale(160),
  },
  contentContainer: {
    paddingHorizontal: scale(16),
  },
});
