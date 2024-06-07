import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import CadidateItem from '@/components/candidate-item';
import { View, Text } from '@/ui';
import {
  useAllCandidates,
  useSaveCandidate,
  useSavedCandidates,
  useUnsaveSaveCandidate,
  useAddContactCandidate,
  useMyNetworks,
} from '@/services/api/candidate';
import ActivityIndicator from '@/components/activity-indicator';
import { useUser } from '@/store/user';
import { queryClient } from '@/services/api/api-provider';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const Explore = () => {
  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { navigate } = useNavigation();

  const { isLoading, data } = useAllCandidates({
    variables: {
      person_id: user?.id,
      unique_id: profile?.unique_id,
    },
  });

  //console.log('useAllCandidates', JSON.stringify(data, null, 2));

  const { mutate: saveCandidateApi, isLoading: isSaving } = useSaveCandidate();
  const { mutate: saveUnCandidateApi, isLoading: isUnSaving } = useUnsaveSaveCandidate();
  const { mutate: addHandShakeApi, isLoading: isHandShaking } = useAddContactCandidate();

  const renderItem = useCallback(
    ({ item }) => {
      console.log(item);
      if (item?.id === user?.id) {
        return null;
      } else {
        return (
          <CadidateItem
            data={item}
            onMessage={(person) => {
              navigate('Chats', {
                person_id: person?.person_id,
                profile_pic: person?.profile_pic,
                name: person?.full_name,
                chat_id: '0',
              });
            }}
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
    [user, navigate, profile]
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

export default Explore;
