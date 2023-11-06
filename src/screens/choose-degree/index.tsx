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
import DegreeItem from './degree-item';

const employees = [
  { id: 1, name: 'Bachelor of Science (B.Sc.)' },
  { id: 2, name: 'Bachelor of Arts (B.A.)' },
  { id: 3, name: 'Master of Business Administration (MBA)' },
  { id: 4, name: 'Doctor of Medicine (M.D.)' },
  { id: 5, name: 'Master of Science (M.Sc.)' },
  { id: 6, name: 'Bachelor of Engineering (B.Eng.)' },
  { id: 7, name: 'Bachelor of Fine Arts (B.F.A.)' },
  { id: 8, name: 'Doctor of Philosophy (Ph.D.)' },
  { id: 9, name: 'Master of Education (M.Ed.)' },
  { id: 10, name: 'Juris Doctor (J.D.)' },
];

export const ChooseDegree = () => {
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
        <DegreeItem
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
      <ScreenHeader title="Degree" />

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
