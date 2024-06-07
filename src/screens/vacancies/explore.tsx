import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { PersonItem } from '@/components/person-item';
import {
  useSaveJob,
  useSuggestedJobs,
  useUnSaveJob,
  useSavedJobs,
} from '@/services/api/home';
import { useUser } from '@/store/user';
import ActivityIndicator from '@/components/activity-indicator';
import { useRefreshOnFocus } from '@/hooks';
import { queryClient } from '@/services/api/api-provider';
import { View, Text } from '@/ui';
import { scale } from 'react-native-size-matters';

const Explore = () => {
  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { data, isLoading, refetch, error } = useSuggestedJobs({
    variables: {
      unique_id: profile?.unique_id,
      person_id: user?.id,
    },
  });

  console.log('useSuggestedJobs error', error);

  const { mutate: saveJobApi, isLoading: isSaving } = useSaveJob();
  const { mutate: saveUnJobApi, isLoading: isUnSaving } = useUnSaveJob();

  useRefreshOnFocus(refetch);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <PersonItem
          data={item}
          onStartPress={(job) => {
            if (job?.isSaved === 0) {
              saveJobApi(
                { job_id: job?.id, unique_id: profile?.unique_id },
                {
                  onSuccess: (data) => {
                    if (data?.response?.status === 200) {
                      queryClient.invalidateQueries(useSuggestedJobs.getKey());
                      queryClient.invalidateQueries(useSavedJobs.getKey());
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
    },
    [profile]
  );

  const renderLoading = () => {
    return (
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <View flex={1}>
      {isLoading ? (
        renderLoading()
      ) : (
        <FlashList
          data={data?.response?.data}
          estimatedItemSize={100}
          renderItem={renderItem}
          ListEmptyComponent={
            <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
              <Text>No Job Found</Text>
            </View>
          }
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 100,
          }}
        />
      )}
    </View>
  );
};

export default Explore;
