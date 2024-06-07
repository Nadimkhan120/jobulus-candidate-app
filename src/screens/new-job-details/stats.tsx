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

type StatsProps = {
  data: any;
};

const InfoRow = ({ label, value, isGrey = true }) => {
  return (
    <View
      flexDirection={'row'}
      paddingVertical={'medium'}
      alignItems={'center'}
      justifyContent={'space-between'}
      paddingHorizontal={'large'}
      borderBottomColor={'grey500'}
      borderBottomWidth={1}
    >
      <Text variant={'regular14'} color={'grey200'}>
        {label}
      </Text>
      <Text variant={'medium14'} color={isGrey ? 'grey100' : 'info'}>
        {value}
      </Text>
    </View>
  );
};

const Stats = ({ data }: StatsProps) => {
  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { mutate: saveCandidateApi, isLoading: isSaving } = useSaveCandidate();
  const { mutate: saveUnCandidateApi, isLoading: isUnSaving } = useUnsaveSaveCandidate();
  const { mutate: addHandShakeApi, isLoading: isHandShaking } = useAddContactCandidate();

  const renderItem = useCallback(
    ({ item }) => {
      let data = {
        ...item,
        //profile_pic:"",
      };

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

  console.log('data?.applicants', JSON.stringify(data?.applicants, null, 2));

  return (
    <View>
      <InfoRow label={'Views'} value={data?.salary_max} isGrey={true} />
      <InfoRow label={'Applicants'} value={data?.applicants?.length} isGrey={true} />
      <View paddingHorizontal={'large'} paddingVertical={'large'}>
        <Text variant={'medium20'} color={'black'}>
          Applicants
        </Text>

        <FlashList
          data={data?.applicants}
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
    </View>
  );
};

export default Stats;
