import React, { useCallback, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { scale } from 'react-native-size-matters';
import { ScreenHeader } from '@/components/screen-header';
import type { Theme } from '@/theme';
import { Screen, Text, View } from '@/ui';
import CapsuleView from '@/components/capsule-view';
import { useAllSearch } from '@/services/api/notification';
import ActivityIndicator from '@/components/activity-indicator';
import { useRoute } from '@react-navigation/native';
import { CandidateItem } from './candidate-item';
import { JobItem } from './job-item';
import { CompanyItem } from './company-item';

import { useSaveJob, useSuggestedJobs, useUnSaveJob } from '@/services/api/home';
import { queryClient } from '@/services/api/api-provider';

//import CadidateItem from '@/components/candidate-item';

import {
  useAddContactCandidate,
  useAllCandidates,
  useMyNetworks,
  useSaveCandidate,
  useSavedCandidates,
  useUnsaveSaveCandidate,
} from '@/services/api/candidate';
import { useUser } from '@/store/user';
import { use } from 'i18next';

export const SearchResults = () => {
  const { colors } = useTheme<Theme>();

  const route = useRoute<any>();
  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const [menu, setMenu] = useState([
    { heading: 'Jobs', id: 1, active: true },
    { heading: 'Companies', id: 2, active: false },
    { heading: 'Candidates', id: 3, active: false },
  ]);

  const [selectedMenu, setSelectedMenu] = useState(1);

  const { isLoading, data } = useAllSearch({
    variables: {
      query: route?.params?.searchKeyword,
    },
  });

  const { mutate: saveJobApi } = useSaveJob();
  const { mutate: saveUnJobApi } = useUnSaveJob();

  const { mutate: saveCandidateApi, isLoading: isSaving } = useSaveCandidate();
  const { mutate: saveUnCandidateApi, isLoading: isUnSaving } = useUnsaveSaveCandidate();
  const { mutate: addHandShakeApi, isLoading: isHandShaking } = useAddContactCandidate();

  const jobs = data?.suggested_jobs?.original?.response?.data;
  const candidates = data?.applicants?.original?.response?.data;
  const companies = data?.companies?.original?.response?.data;

  const renderCandidateItem = useCallback(
    ({ item }) => {
      return (
        <CandidateItem
          data={item}
          onStartPress={(person) => {
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

  const renderJobItem = useCallback(
    ({ item, index }) => {
      return (
        <JobItem
          data={item}
          onStartPress={(job) => {
            if (job?.isSaved === 0) {
              saveJobApi(
                { job_id: job?.id, unique_id: profile?.unique_id },
                {
                  onSuccess: (data) => {
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
    },
    [user, profile]
  );

  const renderCompanyItem = useCallback(({ item, index }) => {
    return (
      <CompanyItem
        data={item}
        onStartPress={(job) => {
          if (job?.isSaved === 0) {
            saveJobApi(
              { job_id: job?.id, unique_id: profile?.unique_id },
              {
                onSuccess: (data) => {
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
  }, []);

  const RenderLoader = () => {
    return (
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader
        title={`Searching ${`"${route?.params?.searchKeyword}"`}`}
        icon={'close'}
        showBorder={true}
      />

      <View flex={1} backgroundColor={'grey500'}>
        <View
          height={scale(50)}
          flexDirection={'row'}
          alignItems={'center'}
          paddingHorizontal={'large'}
          backgroundColor={'white'}
        >
          {menu.map((element) => {
            return (
              <CapsuleView
                key={element?.heading}
                element={element}
                onPress={(element) => {
                  let existing = [...menu];
                  let changeActive = existing?.map((item) => {
                    return {
                      ...item,
                      active: element?.id === item?.id ? true : false,
                    };
                  });
                  setSelectedMenu(element?.id);
                  setMenu(changeActive);
                }}
              />
            );
          })}
        </View>

        {isLoading ? (
          <RenderLoader />
        ) : selectedMenu === 1 ? (
          <FlashList
            data={jobs}
            renderItem={renderJobItem}
            estimatedItemSize={150}
            ListHeaderComponent={
              <View paddingHorizontal={'large'} paddingVertical={'small'}>
                <Text variant={'regular14'} color={'grey300'} backgroundColor={'error'}>
                  Show {jobs?.length} Results
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
                <Text>No Job Found</Text>
              </View>
            }
          />
        ) : selectedMenu === 2 ? (
          <FlashList
            data={companies}
            renderItem={renderCompanyItem}
            estimatedItemSize={150}
            ListHeaderComponent={
              <View paddingHorizontal={'large'} paddingVertical={'small'}>
                <Text variant={'regular14'} color={'grey300'} backgroundColor={'error'}>
                  Show {companies?.length} Results
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
                <Text>No Company Found</Text>
              </View>
            }
          />
        ) : (
          <FlashList
            data={candidates}
            renderItem={renderCandidateItem}
            estimatedItemSize={150}
            ListHeaderComponent={
              <View paddingHorizontal={'large'} paddingVertical={'small'}>
                <Text variant={'regular14'} color={'grey300'} backgroundColor={'error'}>
                  Show {companies?.length} Results
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
                <Text>No Candidate Found</Text>
              </View>
            }
          />
        )}
      </View>
    </Screen>
  );
};
