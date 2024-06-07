import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import CadidateItem from '@/components/candidate-item';
import { View, Text } from '@/ui';
import {
  useAllCandidates,
  useSaveCandidate,
  useUnsaveSaveCandidate,
  useSavedCandidates,
  useMyNetworks,
  useAddContactCandidate,
} from '@/services/api/candidate';
import ActivityIndicator from '@/components/activity-indicator';
import { useUser } from '@/store/user';
import { queryClient } from '@/services/api/api-provider';
import { scale } from 'react-native-size-matters';

const Saved = () => {
  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { isLoading, data, error } = useSavedCandidates({
    variables: {
      person_id: user?.id,
      unique_id: profile?.unique_id,
    },
  });

  console.log('data', data);

  console.log('error', error);

  const { mutate: saveCandidateApi, isLoading: isSaving } = useSaveCandidate();
  const { mutate: saveUnCandidateApi, isLoading: isUnSaving } = useUnsaveSaveCandidate();
  const { mutate: addHandShakeApi, isLoading: isHandShaking } = useAddContactCandidate();

  const renderItem = useCallback(
    ({ item }) => {
      if (item?.id === user?.id) {
        return null;
      } else {
        return (
          <CadidateItem
            data={item}
            onHandShake={(person) => {
              if (person?.is_friend === 0) {
                addHandShakeApi(
                  { company_id: 0, person_id: person?.id, emails: person?.email },
                  {
                    onSuccess: (data) => {
                      if (data?.response?.status === 200) {
                        queryClient.invalidateQueries(useAllCandidates.getKey());
                        queryClient.invalidateQueries(useMyNetworks.getKey());
                        queryClient.invalidateQueries(useSavedCandidates.getKey());
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
              }
            }}
            onSavePress={(person) => {
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
                        queryClient.invalidateQueries(useMyNetworks.getKey());
                        queryClient.invalidateQueries(useSavedCandidates.getKey());
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
                      if (data?.response?.status === 200) {
                        queryClient.invalidateQueries(useAllCandidates.getKey());
                        queryClient.invalidateQueries(useMyNetworks.getKey());
                        queryClient.invalidateQueries(useSavedCandidates.getKey());
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
    [user, profile]
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
              <Text>No Candidate Found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Saved;
