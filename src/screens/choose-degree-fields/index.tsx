import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { scale } from 'react-native-size-matters';
import { ScreenHeader } from '@/components/screen-header';
import { SearchField } from '@/components/search-field';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import DegreeFieldItem from './degree-field-item';
import { useFields } from '@/services/api/settings';
import { setSelectedField, useExperience } from '@/store/experience';

export const ChooseDegreeField = () => {
  const { colors } = useTheme<Theme>();
  const { goBack } = useNavigation();
  const { data } = useFields();

  const selectedField = useExperience((state) => state?.selectedField);

  const goBackToScreen = () => {
    if (selectedField !== '') {
      goBack();
    }
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <DegreeFieldItem
          data={item}
          onPress={(payload) => {
            setSelectedField(payload);
          }}
        />
      );
    },
    [data]
  );

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader
        title="Field"
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
