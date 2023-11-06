import React, { useCallback, useRef, useState } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { scale } from 'react-native-size-matters';
import { ScreenHeader } from '@/components/screen-header';
import { SearchField } from '@/components/search-field';
import type { User } from '@/services/api/user';
import { useGetUser } from '@/services/api/user';
import { useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { Screen, Text, View } from '@/ui';
import DegreeFieldItem from './degree-field-item';

const employees = [
  { id: 1, name: 'Computer Science' },
  { id: 2, name: 'Engineering' },
  { id: 3, name: 'Psychology' },
  { id: 4, name: 'Business Administration' },
  { id: 5, name: 'Biology' },
  { id: 6, name: 'Economics' },
  { id: 7, name: 'Medicine' },
  { id: 8, name: 'Art History' },
  { id: 9, name: 'Political Science' },
  { id: 10, name: 'Mathematics' },
  { id: 11, name: 'Environmental Science' },
  { id: 12, name: 'Linguistics' },
  { id: 13, name: 'History' },
  { id: 14, name: 'Sociology' },
  { id: 15, name: 'Music Theory' },
];

export const ChooseDegreeField = () => {
  const { colors } = useTheme<Theme>();

  const { goBack } = useNavigation();

  const company = useUser((state) => state?.company);
  const [selectUser, setSelectUser] = useState<User | null>(null);

  const { data, isLoading } = useGetUser({
    variables: {
      id: company?.id,
    },
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <DegreeFieldItem
          data={item}
          onPress={() => {
            console.log('hello');
          }}
        />
      );
    },
    [data, bottomSheetModalRef, selectUser, setSelectUser]
  );

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title="Field" />

      <View
        backgroundColor={'grey500'}
        paddingVertical={'large'}
        paddingHorizontal={'large'}
        paddingBottom={'medium'}
      >
        <SearchField placeholder="Search by name" showBorder={true} />
      </View>

      <View flex={1} backgroundColor={'grey500'}>
        <FlashList
          //@ts-ignore
          data={employees}
          renderItem={renderItem}
          estimatedItemSize={150}
          ListEmptyComponent={
            <View
              height={scale(300)}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Text>No Users Found</Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
};
