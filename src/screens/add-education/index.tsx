import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
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
import { SelectOptionButton } from '@/components/select-option-button';
import { format } from 'date-fns';
import DatePicker from 'react-native-date-picker';
import {
  setSelectedDegree,
  setSelectedField,
  setSelectedSchool,
  useExperience,
} from '@/store/experience';
import { useUpdateEducation } from '@/services/api/profile';
import { useGetUserProfileDetails } from '@/services/api/home';

const schema = z.object({
  school: z.string({
    required_error: 'School is required',
  }),
  degree: z.string({
    required_error: 'Degree is required',
  }),

  field: z.string({
    required_error: ' Field is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
  grade: z.string({
    required_error: 'Grade is required',
  }),
  startDate: z.string({
    required_error: 'Start date is required',
  }),
  endDate: z.string({
    required_error: 'End date is required',
  }),
});

export type AddEducationFormType = z.infer<typeof schema>;

export const AddEducation = () => {
  const { colors } = useTheme<Theme>();
  const { goBack, navigate } = useNavigation();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();

  useSoftKeyboardEffect();

  const [on, setOn] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(new Date());
  const [openStartDate, setOpenStartDate] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [openEndDate, setOpenEndDate] = useState(false);

  const { mutate: updateEducationApi, isLoading } = useUpdateEducation();

  const selectedSchool = useExperience((state) => state?.selectedSchool);
  const selectedField = useExperience((state) => state?.selectedField);
  const selectedDegree = useExperience((state) => state?.selectedDegree);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<AddEducationFormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (formData: AddEducationFormType) => {
    updateEducationApi(
      {
        unique_id: route?.params?.id,
        from_date: formData?.startDate,
        to_date: formData?.startDate,
        created_by: 1,
        description: formData?.description,
        institute_id: selectedSchool?.id,
        education_level_id: selectedDegree?.id,
        education_field_id: selectedField?.id,
        grade: formData?.grade,
      },
      {
        onSuccess: (response) => {
          console.log('response', response);
          if (response?.status === 200) {
            queryClient.invalidateQueries(useGetUserProfileDetails.getKey());
            goBack();
            showSuccessMessage('Experience Updated successfully');
            setSelectedSchool(null);
            setSelectedDegree(null);
            setSelectedField(null);
          } else {
          }
        },
        onError: (error) => {
          // An error happened!
          console.log(`error`, error);
        },
      }
    );

    return;
  };

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

  useEffect(() => {
    if (selectedSchool) {
      setValue('school', `${selectedSchool?.id}`);
      trigger('school');
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedDegree) {
      setValue('degree', `${selectedDegree?.id}`);
      trigger('degree');
    }
  }, [selectedDegree]);

  useEffect(() => {
    if (selectedField) {
      setValue('field', `${selectedField?.id}`);
      trigger('field');
    }
  }, [selectedField]);

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title="Add Education" showBorder={true} icon="close" />

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
          <SelectOptionButton
            label="School"
            isSelected={selectedSchool?.name ? true : false}
            selectedText={selectedSchool?.name ?? 'Please Select'}
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseSchool');
            }}
          />

          {errors?.school?.message ? (
            <Text variant={'regular13'} color={'error'}>
              {errors?.school?.message}
            </Text>
          ) : null}

          <SelectOptionButton
            label="Degree"
            isSelected={selectedDegree?.name ? true : false}
            selectedText={selectedDegree?.name ?? 'Please Select'}
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseDegree');
            }}
          />

          {errors?.degree?.message ? (
            <Text variant={'regular13'} color={'error'}>
              {errors?.degree?.message}
            </Text>
          ) : null}

          <SelectOptionButton
            label="Field of study"
            isSelected={selectedField?.name ? true : false}
            selectedText={selectedField?.name ?? 'Please Select'}
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseDegreeField');
            }}
          />

          {errors?.field?.message ? (
            <Text variant={'regular13'} color={'error'}>
              {errors?.field?.message}
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

          <SelectOptionButton
            label="End Date"
            isSelected={watchEndDate ? true : false}
            selectedText={watchEndDate ? watchEndDate : 'Please Select'}
            icon={'chevron-down'}
            onPress={() => {
              setOpenEndDate(true);
            }}
          />

          {errors?.endDate?.message ? (
            <Text variant={'regular13'} color={'error'}>
              {errors?.endDate?.message}
            </Text>
          ) : null}

          <ControlledInput
            placeholder="eg A+"
            label="Grade"
            control={control}
            name="grade"
          />

          <DescriptionField
            //@ts-ignore
            placeholder="Enter description"
            label="Description"
            control={control}
            name="description"
          />
        </View>
        <View height={scale(24)} />
        <View flex={1} justifyContent={'flex-end'} paddingHorizontal={'large'}>
          <Button
            label="Add Education"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
          />
        </View>
      </ScrollView>

      <DatePicker
        modal
        locale="en"
        open={openStartDate}
        mode="date"
        date={startDate}
        onConfirm={(date) => {
          const myDate = new Date(date);
          const formattedDate = format(myDate, 'yyyy/MM/dd');
          setValue('startDate', formattedDate);
          trigger('startDate');
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
        mode="date"
        date={endDate}
        onConfirm={(date) => {
          const myDate = new Date(date);
          const formattedDate = format(myDate, 'yyyy/MM/dd');
          setValue('endDate', formattedDate);
          trigger('endDate');
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
