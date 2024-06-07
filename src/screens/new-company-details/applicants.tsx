import React, { useCallback } from 'react';
import { View, Text } from '@/ui';
import {
  useAllCandidates,
  useSaveCandidate,
  useUnsaveSaveCandidate,
  useSavedCandidates,
  useMyNetworks,
  useAddContactCandidate,
} from '@/services/api/candidate';
import CadidateItem from '@/components/candidate-item';
import { queryClient } from '@/services/api/api-provider';
import { useUser } from '@/store/user';
import { FlashList } from '@shopify/flash-list';
import { scale } from 'react-native-size-matters';
import { useTopVacancies } from '@/services/api/vacancies';

type StatsProps = {
  data: any;
};

const Applicants = ({ data }: StatsProps) => {
  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { data: people, isLoading } = useTopVacancies({
    variables: {
      id: data?.id,
    },
  });

  const { mutate: saveCandidateApi, isLoading: isSaving } = useSaveCandidate();
  const { mutate: saveUnCandidateApi, isLoading: isUnSaving } = useUnsaveSaveCandidate();
  const { mutate: addHandShakeApi, isLoading: isHandShaking } = useAddContactCandidate();

  const renderItem = useCallback(
    ({ item }) => {
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
    },
    [user, profile]
  );

  if (isLoading) return;

  return (
    <View>
      <FlashList
        data={people?.response?.data}
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
    </View>
  );
};

export default Applicants;
