import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { palette, type Theme } from '@/theme';
import {
  Button,
  ControlledInput,
  PressableScale,
  Screen,
  Text,
  View,
} from '@/ui';
import { DescriptionField } from '@/ui/description-field';
import { showErrorMessage, showSuccessMessage } from '@/utils';
import { Avatar } from '@/components/avatar';
import SwitchToggle from 'react-native-switch-toggle';
import SelectionBox from '@/components/drop-down';
import { SelectOptionButton } from '@/components/select-option-button';
import { CheckBox } from '@/components/checkbox';
import { BottomModal } from '@/components/bottom-modal';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { SelectModalItem } from '@/components/select-modal-item';
import { format } from 'date-fns';
import DatePicker from 'react-native-date-picker';

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
  startDate: z.string({
    required_error: 'Start date is required',
  }),
  endDate: z.string({
    required_error: 'End date is required',
  }),
});

export type AddEducationFormType = z.infer<typeof schema>;

const employees = [
  { name: 'Full Time', id: 1 },
  { name: 'Part Time', id: 2 },
  { name: 'Freelance', id: 3 },
  { name: 'Contract', id: 4 },
  { name: 'Self Employed', id: 5 },
  { name: 'Seasonal', id: 6 },
];

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

  const company = useUser((state) => state?.company);

  const { mutate: editCompanyApi, isLoading } = useEditCompany();

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

  const data = route?.params?.data;

  const { handleSubmit, control, setValue, watch } =
    useForm<AddEducationFormType>({
      resolver: zodResolver(schema),
    });

  const onSubmit = (data: AddEducationFormType) => {
    return;
  };

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

  const renderItem = useCallback(({ item }: any) => {
    return (
      <SelectModalItem
        title={item?.title}
        item={item}
        onPress={(data) => {
          handleDismissModalPress();
        }}
      />
    );
  }, []);

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
              Turn on to notify your network of key profile changes (such as new
              job) and work anniversaries. Updates can take up to 2 hours.
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
            isSelected={false}
            selectedText="Please Select"
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseSchool');
            }}
          />

          <SelectOptionButton
            label="Degree"
            isSelected={false}
            selectedText="Please Select"
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseDegree');
            }}
          />

          <SelectOptionButton
            label="Field of study"
            isSelected={false}
            selectedText="Please Select"
            icon={'chevron-down'}
            onPress={() => {
              navigate('ChooseDegreeField');
            }}
          />

          <SelectOptionButton
            label="Start Date"
            isSelected={watchStartDate ? true : false}
            selectedText={watchStartDate ? watchStartDate : 'Please Select'}
            icon={'chevron-down'}
            onPress={() => {
              setOpenStartDate(true);
            }}
          />
          <SelectOptionButton
            label="End Date"
            isSelected={watchEndDate ? true : false}
            selectedText={watchEndDate ? watchEndDate : 'Please Select'}
            icon={'chevron-down'}
            onPress={() => {
              setOpenEndDate(true);
            }}
          />

          <ControlledInput
            placeholder="eg A+"
            label="Grade"
            control={control}
            name="email"
          />

          <DescriptionField
            placeholder="Enter description"
            label="Description"
            control={control}
            name="cover"
          />
        </View>
        <View height={scale(24)} />
        <View flex={1} justifyContent={'flex-end'} paddingHorizontal={'large'}>
          <Button
            label="Save Profile"
            // onPress={handleSubmit(onSubmit)}
            onPress={() => {}}
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
