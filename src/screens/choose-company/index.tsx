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
import CompanyItem from './company-item';
import { useCompaniesList } from '@/services/api/company';
import ActivityIndicator from '@/components/activity-indicator';
import { setSelectedCompany } from '@/store/experience';

export const ChooseCompany = () => {
  const { colors } = useTheme<Theme>();

  const { goBack } = useNavigation();

  const [selectUser, setSelectUser] = useState<User | null>(null);

  const user = useUser((state) => state?.user);

  const { isLoading, data } = useCompaniesList({
    variables: {
      person_id: user?.id,
    },
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <CompanyItem
          data={item}
          onPress={(company) => {
            setSelectedCompany(company?.name);
            goBack();
          }}
        />
      );
    },
    [data, goBack]
  );

  console.log('data?.response?.data', JSON.stringify(data?.response?.data, null, 2));

  const renderLoading = () => {
    return (
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title="Company Name" />

      <View
        backgroundColor={'grey500'}
        paddingVertical={'large'}
        paddingHorizontal={'large'}
        paddingBottom={'medium'}
      >
        <SearchField placeholder="Search by name" showBorder={true} />
      </View>

      {isLoading ? (
        renderLoading()
      ) : (
        <View flex={1} backgroundColor={'grey500'}>
          <FlashList
            //@ts-ignore
            data={data?.response?.data}
            renderItem={renderItem}
            estimatedItemSize={150}
            ListEmptyComponent={
              <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
                <Text>No Users Found</Text>
              </View>
            }
          />
        </View>
      )}
    </Screen>
  );
};
