import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetFooter, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
//import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { ImageButton } from '@/components';
//import ActivityIndicator from '@/components/activity-indicator';
import { BottomModal } from '@/components/bottom-modal';
import { ScreenHeader } from '@/components/screen-header';
import { SearchField } from '@/components/search-field';
import { Status } from '@/components/status-info';
import type { User } from '@/services/api/user';
import { useGetUser } from '@/services/api/user';
import { useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { Button, PressableScale, Screen, Text, View } from '@/ui';
import { PersonItem } from '@/components/person-item';
import { icons } from '@/assets/icons';
import { useDebounce } from '@/hooks';
import { useSearchVacancies } from '@/services/api/vacancies';
import { setRecentSearches, useSearchStorage } from '@/store/search';

export const Search = () => {
  const { colors } = useTheme<Theme>();
  const { bottom } = useSafeAreaInsets();
  const { navigate } = useNavigation();

  const company = useUser((state) => state?.company);
  const recentSearches = useSearchStorage((state) => state?.recentSearches);

  const [selectUser, setSelectUser] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebounce<string>(searchQuery, 300);

  const { data, isLoading } = useGetUser({
    variables: {
      id: company?.id,
    },
  });

  const { data: seachData } = useSearchVacancies({
    enabled: debouncedSearch?.length ? true : false,
    variables: {
      keyword: debouncedSearch?.toLocaleLowerCase(),
    },
  });

  //console.log('seachData', JSON.stringify(seachData, null, 2));

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

  // callbacks
  const onKeyPress = (data) => {
    console.log('data', data.nativeEvent.key);
  };

  const renderItem = useCallback(
    ({ item }) => {
      return <PersonItem />;
    },
    [data, bottomSheetModalRef, selectUser, setSelectUser]
  );

  // renders
  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={bottom}>
        <View paddingVertical={'large'}>
          <Button
            marginHorizontal={'large'}
            label="Edit User "
            onPress={handleDismissModalPress}
            variant={'outline'}
          />
          <Button
            marginHorizontal={'large'}
            label="Delete "
            onPress={handleDismissModalPress}
            marginTop={'small'}
            variant={'error'}
          />
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title="Search" />

      <View
        backgroundColor={'grey500'}
        paddingVertical={'large'}
        paddingHorizontal={'large'}
        paddingBottom={'medium'}
      >
        <SearchField
          placeholder="Search by name"
          showBorder={true}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          returnKeyLabel="Search"
          autoFocus={true}
          onSubmitEditing={(e) => {
            navigate('SearchResults', { searchKeyword: debouncedSearch });
          }}
        />
      </View>

      <View flex={1} backgroundColor={'white'}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: 16,
          }}
        >
          <View
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            paddingHorizontal={'large'}
            paddingBottom={'medium'}
            paddingTop={'large'}
          >
            <Text variant={'semiBold16'} color={'black'}>
              Recent Search
            </Text>
          </View>

          <View paddingHorizontal={'large'}>
            {recentSearches?.length === 0 ? (
              <View>
                <Text variant={'medium12'} color={'black'}>
                  No Recent Searches
                </Text>
              </View>
            ) : null}

            {recentSearches?.map((item, index) => {
              return (
                <PressableScale
                  onPress={() => {
                    // @ts-ignore
                    navigate('NewJobDetails', { id: item?.id });
                  }}
                >
                  <View
                    key={index}
                    flexDirection={'row'}
                    marginVertical={'small'}
                    alignItems={'center'}
                  >
                    <Image
                      source={icons['clock']}
                      style={{ height: scale(16), width: scale(16) }}
                      contentFit="contain"
                    />
                    <Text marginLeft={'small'} variant={'medium13'}>
                      {item?.job_titles}
                    </Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>

          <View
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            paddingHorizontal={'large'}
            paddingBottom={'medium'}
            paddingTop={'large'}
          >
            <Text variant={'semiBold16'} color={'black'}>
              Searches
            </Text>
            {/* <Text variant={'medium14'} color={'primary'}>
              See All
            </Text> */}
          </View>

          {
            // @ts-ignore
            (seachData?.response?.data && seachData?.response?.data?.length === 0) ||
            !seachData ? (
              <View paddingHorizontal={'large'}>
                <Text variant={'medium12'} color={'black'}>
                  No Searches Found, Please search
                </Text>
              </View>
            ) : null
          }

          {
            // @ts-ignore
            seachData?.response?.data?.map((item, index) => {
              return (
                <PersonItem
                  key={index}
                  data={item}
                  showStars={false}
                  onItemPress={(payload) => {
                    let dataToStore = {
                      job_titles: payload?.job_titles,
                      id: payload?.id,
                    };

                    setRecentSearches(dataToStore);
                  }}
                />
              );
            })
          }
          {/* <View>
            <View paddingHorizontal={'large'}>
              {[0, 1, 2].map((item, index) => {
                return (
                  <View
                    key={index}
                    flexDirection={'row'}
                    marginVertical={'small'}
                    alignItems={'center'}
                  >
                    <Image
                      source={icons['price-tag']}
                      style={{ height: scale(16), width: scale(16) }}
                      contentFit="contain"
                    />
                    <Text marginLeft={'small'} variant={'medium13'}>
                      human resource manager
                    </Text>
                  </View>
                );
              })}
            </View>
          </View> */}
        </ScrollView>
      </View>

      <BottomModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'rgb(250,250,253)' }}
        footerComponent={renderFooter}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <ImageButton
              icon="close"
              onPress={handleDismissModalPress}
              size={scale(16)}
            />
            <Status status={selectUser?.isactive === '0' ? 'Pending' : 'Active'} />
          </View>
          <View
            alignItems={'center'}
            justifyContent={'center'}
            paddingVertical={'medium'}
          >
            <Image
              transition={1000}
              source={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
              placeholder={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
              style={styles.image}
              contentFit="contain"
            />
          </View>
          <View
            gap={'tiny'}
            alignItems={'center'}
            justifyContent={'center'}
            paddingVertical={'medium'}
          >
            <Text variant={'medium24'} textTransform={'capitalize'} color={'black'}>
              {selectUser?.person_name}
            </Text>
            <Text variant={'regular13'} color={'grey200'}>
              {selectUser?.email}
            </Text>
            <Text variant={'regular13'} color={'black'}>
              {selectUser?.role}
            </Text>
          </View>
        </BottomSheetView>
      </BottomModal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: scale(16),
  },
  image: {
    height: scale(106),
    width: scale(106),
    borderRadius: scale(53),
  },
});
