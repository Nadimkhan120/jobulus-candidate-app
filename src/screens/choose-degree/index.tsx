import React, { useCallback, useRef, useState } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { scale } from 'react-native-size-matters';
import { ScreenHeader } from '@/components/screen-header';
import { SearchField } from '@/components/search-field';
import type { User } from '@/services/api/user';
import { useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import DegreeItem from './degree-item';
import { setSelectedDegree, useExperience } from '@/store/experience';
import { useDegree } from '@/services/api/settings';

export const ChooseDegree = () => {
  const { colors } = useTheme<Theme>();

  const { goBack } = useNavigation();

  const company = useUser((state) => state?.company);
  const [selectUser, setSelectUser] = useState<User | null>(null);

  const selectedDegree = useExperience((state) => state?.selectedDegree);

  const { data, isLoading } = useDegree();

  const goBackToScreen = () => {
    if (selectedDegree !== '') {
      goBack();
    }
  };

  // console.log('data', JSON.stringify(data, null, 2));

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <DegreeItem
          data={item}
          onPress={(payload) => {
            setSelectedDegree(payload);
          }}
        />
      );
    },
    [data, bottomSheetModalRef, selectUser, setSelectUser]
  );

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader
        title="Degree"
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
              <Text>No Skills Found</Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
};
