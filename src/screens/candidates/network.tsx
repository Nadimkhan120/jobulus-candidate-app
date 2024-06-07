import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import CadidateItem from '@/components/candidate-item';
import { View, Text } from '@/ui';
import {
  useAllCandidates,
  useSaveCandidate,
  useUnsaveSaveCandidate,
  useMyNetworks,
} from '@/services/api/candidate';
import ActivityIndicator from '@/components/activity-indicator';
import { useUser } from '@/store/user';
import { queryClient } from '@/services/api/api-provider';
import { scale } from 'react-native-size-matters';

const Network = () => {
  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { isLoading, data } = useMyNetworks({
    variables: {
      person_id: user?.id,
    },
  });

  const { mutate: saveCandidateApi, isLoading: isSaving } = useSaveCandidate();
  const { mutate: saveUnCandidateApi, isLoading: isUnSaving } = useUnsaveSaveCandidate();

  const renderItem = useCallback(
    ({ item }) => {
      if (item?.id === user?.id) {
        return null;
      } else {
        return (
          <CadidateItem
            data={item}
            onHandShake={(person) => {
              console.log('person', person);
            }}
            onSavePress={(person) => {
              console.log('person', person);

              if (person?.isSaved === 0) {
                saveCandidateApi(
                  {
                    candidate_id: person?.id,
                    person_id: user?.id,
                    unique_id: profile?.unique_id,
                  },
                  {
                    onSuccess: (data) => {
                      console.log('data', data);

                      if (data?.response?.status === 200) {
                        queryClient.invalidateQueries(useAllCandidates.getKey());
                        // queryClient.invalidateQueries(useSavedJobs.getKey());
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
                saveUnCandidateApi(
                  {
                    candidate_id: person?.id,
                    person_id: user?.id,
                    unique_id: profile?.unique_id,
                  },
                  {
                    onSuccess: (data) => {
                      console.log('data', data);

                      if (data?.response?.status === 200) {
                        queryClient.invalidateQueries(useAllCandidates.getKey());
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
      }
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
    <View flex={1} backgroundColor={'grey500'}>
      {isLoading ? (
        renderLoading()
      ) : (
        <FlashList
          data={data?.response?.data}
          numColumns={2}
          estimatedItemSize={100}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 100,
          }}
          ListEmptyComponent={
            <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
              <Text>No Network Found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Network;
