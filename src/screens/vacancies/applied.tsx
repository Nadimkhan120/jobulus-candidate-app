import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { PersonItem } from '@/components/person-item';
import { useAppliedJobs } from '@/services/api/home';
import { useUser } from '@/store/user';
import ActivityIndicator from '@/components/activity-indicator';
import { View, Text } from '@/ui';
import { scale } from 'react-native-size-matters';
import { useRefreshOnFocus } from '@/hooks';

const Applied = () => {
  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { data, isLoading, refetch, error } = useAppliedJobs({
    variables: {
      person_id: user?.id,
      unique_id: profile?.unique_id,
    },
  });

  useRefreshOnFocus(refetch);

  console.log('error===', error);

  const renderItem = useCallback(({ item }) => {
    return <PersonItem data={item} />;
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

export default Applied;
