import React, { useCallback, useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import CadidateItem from '@/components/candidate-item';
import { View, Text, Screen } from '@/ui';
import {
  useAllCandidates,
  useSaveCandidate,
  useUnsaveSaveCandidate,
  useMyNetworks,
  useAddContactCandidate,
  useSavedCandidates,
} from '@/services/api/candidate';
import ActivityIndicator from '@/components/activity-indicator';
import { useUser } from '@/store/user';
import { queryClient } from '@/services/api/api-provider';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/theme';
import { ScreenHeader } from '@/components/screen-header';
import { useNavigation } from '@react-navigation/native';

export const MyContacts = () => {
  const { colors } = useTheme<Theme>();

  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const [contactList, setContactList] = useState([]);

  const { navigate } = useNavigation();

  const { isLoading, data } = useMyNetworks();

  const { mutate: saveCandidateApi, isLoading: isSaving } = useSaveCandidate();
  const { mutate: saveUnCandidateApi, isLoading: isUnSaving } = useUnsaveSaveCandidate();
  const { mutate: addHandShakeApi, isLoading: isHandShaking } = useAddContactCandidate();

  //console.log('data?.response?.data', JSON.stringify(data?.response?.data, null, 2));
  useEffect(() => {
    if (data?.response?.data?.length > 0) {
      removeMyUSer();
    }
  }, [data]);

  const removeMyUSer = () => {
    let dummyArr = [];

    data?.response?.data?.map((item) => {
      if (item?.id !== user?.id) {
        dummyArr.push(item);
      }
    });

    setContactList(dummyArr);
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <CadidateItem
          data={item}
          onHandShake={(person) => {
            console.log('HAND SHAKE', person);

            if (person?.is_friend === 0) {
              addHandShakeApi(
                { company_id: 0, person_id: person?.id, emails: person?.email },
                {
                  onSuccess: (data) => {
                    console.log('addHandShakeApi', data);

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
              console.log('NO HADN SHAKE');
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
          onMessage={(person) => {
            console.log('PERSON', person);

            navigate('Chats', {
              person_id: person?.person_id,
              profile_pic: person?.profile_pic,
              name: person?.full_name,
              chat_id: '0',
            });
          }}
        />
      );
    },
    [user]
  );

  const renderLoading = () => {
    return (
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <Screen edges={['top']} backgroundColor={colors.white} barStyle="dark-content">
      <ScreenHeader title="My Contacts" />
      <View flex={1} backgroundColor={'grey500'}>
        {isLoading ? (
          renderLoading()
        ) : (
          <FlashList
            // data={data?.response?.data}
            data={contactList}
            numColumns={2}
            estimatedItemSize={100}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingTop: 20,
              paddingBottom: 100,
            }}
            ListEmptyComponent={
              <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
                <Text>No Contact Found</Text>
              </View>
            }
          />
        )}
      </View>
    </Screen>
  );
};
