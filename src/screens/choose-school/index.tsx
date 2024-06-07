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
import { PressableScale, Screen, Text, View } from '@/ui';
import DegreeItem from './school-item';
import { useSchools } from '@/services/api/settings';
import { setSelectedSchool, useExperience } from '@/store/experience';

const employees = [
  { id: 1, name: 'Harvard University' },
  { id: 2, name: 'Stanford University' },
  { id: 3, name: 'Massachusetts Institute of Technology (MIT)' },
  { id: 4, name: 'University of Oxford' },
  { id: 5, name: 'University of Cambridge' },
  { id: 6, name: 'California Institute of Technology (Caltech)' },
  { id: 7, name: 'Princeton University' },
  { id: 8, name: 'Yale University' },
  { id: 9, name: 'University of Chicago' },
  { id: 10, name: 'Columbia University' },
];

export const ChooseSchool = () => {
  const { colors } = useTheme<Theme>();

  const { goBack } = useNavigation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [selectUser, setSelectUser] = useState<User | null>(null);

  const selectedSchool = useExperience((state) => state?.selectedSchool);

  const { data, isLoading } = useSchools();

  const goBackToScreen = () => {
    if (selectedSchool !== '') {
      goBack();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <DegreeItem
        data={item}
        selected={selectedSchool}
        onPress={(payload) => {
          setSelectedSchool(payload);
        }}
      />
    );
  };

  console.log('selectedSchool', selectedSchool);

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader
        title="School"
        rightElement={
          <PressableScale onPress={goBackToScreen}>
            <Text variant={'medium17'} color={'primary'}>
              Done
            </Text>
          </PressableScale>
        }
      />

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
          data={data}
          renderItem={renderItem}
          estimatedItemSize={150}
          ListEmptyComponent={
            <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
              <Text>No Users Found</Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
};
