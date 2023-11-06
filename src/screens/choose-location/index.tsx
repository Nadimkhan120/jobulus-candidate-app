import React, { useCallback, useState } from 'react';
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
import LocationItem from './location-item';

const employees = [
  { name: 'Austrailia', id: 1 },
  { name: 'United state', id: 2 },
  { name: 'Argentena', id: 3 },
  { name: 'UAE', id: 4 },
  { name: '', id: 5 },
];

export const ChooseLocation = () => {
  const { colors } = useTheme<Theme>();

  const { goBack } = useNavigation();

  const company = useUser((state) => state?.company);
  const [selectUser, setSelectUser] = useState<User | null>(null);

  const { data, isLoading } = useGetUser({
    variables: {
      id: company?.id,
    },
  });

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <LocationItem
          data={item}
          onPress={() => {
            console.log('hello');
          }}
        />
      );
    },
    [data]
  );

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title="Location" icon="close" />

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
