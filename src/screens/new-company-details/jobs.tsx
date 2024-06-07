import React, { useCallback } from 'react';
import { View, Text } from '@/ui';
import { queryClient } from '@/services/api/api-provider';
import { useUser } from '@/store/user';
import { FlashList } from '@shopify/flash-list';
import { scale } from 'react-native-size-matters';
import { useTopVacancies } from '@/services/api/vacancies';
import {
  useGetJobByCompany,
  useSaveJob,
  useSuggestedJobs,
  useUnSaveJob,
} from '@/services/api/home';
import { PersonItem } from '@/components/person-item';

type JobsProps = {
  data: any;
};

const Jobs = ({ data }: JobsProps) => {
  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { data: jobs, isLoading } = useGetJobByCompany({
    variables: {
      person_id: user?.id,
      company_id: data?.id,
    },
  });

  console.log('Jobs', JSON.stringify(jobs, null, 2));

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

  if (isLoading) return;

  return (
    <View>
      <FlashList
        data={jobs?.response?.data}
        numColumns={2}
        estimatedItemSize={100}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
        }}
        ListEmptyComponent={
          <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
            <Text>No Jobs Found</Text>
          </View>
        }
      />
    </View>
  );
};

export default Jobs;
