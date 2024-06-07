import React, { useCallback, useEffect } from 'react';
import { useTheme } from '@shopify/restyle';
import { TopHeader } from '@/components/top-header';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import { HomeSliderContainer } from './home-slider';
import { PersonItem } from '@/components/person-item';
import { FlashList } from '@shopify/flash-list';
import { useSuggestedJobs, useSaveJob, useUnSaveJob } from '@/services/api/home';
import { useUser } from '@/store/user';
import ActivityIndicator from '@/components/activity-indicator';
import { queryClient } from '@/services/api/api-provider';
import { useRefreshOnFocus } from '@/hooks';
import { useNavigation } from '@react-navigation/native';

const renderHeader = () => {
  const { navigate } = useNavigation();

  return (
    <View>
      <HomeSliderContainer />
      <View
        paddingHorizontal={'large'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        paddingBottom={'medium'}
      >
        <Text variant={'semiBold16'} color={'black'}>
          Suggested JObs
        </Text>
        <PressableScale
          onPress={() => {
            // @ts-ignore
            navigate('Vacancies');
          }}
        >
          <Text
            variant={'medium14'}
            style={{
              color: '#5386E4',
            }}
          >
            View All
          </Text>
        </PressableScale>
      </View>
    </View>
  );
};

export function Home() {
  const { colors } = useTheme<Theme>();

  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { data, isLoading, refetch } = useSuggestedJobs({
    variables: {
      person_id: user?.id,
      unique_id: profile?.unique_id,
    },
    enabled: user?.id ? true : false,
  });

  useRefreshOnFocus(refetch);

  const { mutate: saveJobApi, isLoading: isSaving } = useSaveJob();
  const { mutate: saveUnJobApi, isLoading: isUnSaving } = useUnSaveJob();

  const renderItem = ({ item }) => {
    return (
      <PersonItem
        data={item}
        onStartPress={(job) => {
          if (job?.isSaved === 0) {
            saveJobApi(
              { job_id: job?.id, unique_id: profile?.unique_id },
              {
                onSuccess: (data) => {
                  console.log('data', data);
                  if (data?.response?.status === 200) {
                    queryClient.invalidateQueries(useSuggestedJobs.getKey());
                  } else {
                  }
                },
                onError: (error) => {
                  // An error happened!
                  console.log(`error`, error);
                },
              }
            );
          } else {
            saveUnJobApi(
              { job_id: job?.id, unique_id: profile?.unique_id },
              {
                onSuccess: (data) => {
                  console.log('data', data);

                  if (data?.response?.status === 200) {
                    queryClient.invalidateQueries(useSuggestedJobs.getKey());
                  } else {
                  }
                },
                onError: (error) => {
                  // An error happened!
                  console.log(`error`, error);
                },
              }
            );
          }
        }}
      />
    );
  };

  const renderLoading = () => {
    return (
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <Screen
      edges={['top']}
      backgroundColor={colors.white}
      statusBarColor={colors.white}
      barStyle="dark-content"
    >
      <TopHeader />
      {isLoading ? (
        renderLoading()
      ) : (
        <FlashList
          data={data?.response?.data}
          ListHeaderComponent={renderHeader}
          estimatedItemSize={100}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        />
      )}
    </Screen>
  );
}
