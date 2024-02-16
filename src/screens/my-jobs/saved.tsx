import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { PersonItem } from '@/components/person-item';
import { useSavedJobs, useSuggestedJobs, useUnSaveJob } from '@/services/api/home';
import ActivityIndicator from '@/components/activity-indicator';
import { View, Text } from '@/ui';
import { scale } from 'react-native-size-matters';
import { queryClient } from '@/services/api/api-provider';
import { useUser } from '@/store/user';

const Saved = () => {
  const user = useUser((state) => state?.user);

  const { data, isLoading } = useSavedJobs({
    variables: {
      person_id: user?.id,
    },
  });

  // console.log('Saved', JSON.stringify(data, null, 2));

  const { mutate: saveUnJobApi, isLoading: isUnSaving } = useUnSaveJob();

  const renderItem = useCallback(({ item }) => {
    let itemToSend = {
      ...item,
      company: {
        images: {
          pic: item?.company_images?.pic,
        },
      },
    };

    return (
      <PersonItem
        data={itemToSend}
        onStartPress={(job) => {
          saveUnJobApi(
            { job_id: job?.id },
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
        }}
      />
    );
  }, []);

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

export default Saved;
