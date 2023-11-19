import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import CompanyItem from '@/components/company-item';
import { View, Text } from '@/ui';
import {
  useCompaniesList,
  useSaveCompany,
  useUnsaveSaveCompany,
  useAddContactCompany,
  useFollowedCompanies,
  useSavedCompanies,
} from '@/services/api/company';
import ActivityIndicator from '@/components/activity-indicator';
import { useUser } from '@/store/user';
import { queryClient } from '@/services/api/api-provider';
import { scale } from 'react-native-size-matters';

const Explore = () => {
  const user = useUser((state) => state?.user);

  const { isLoading, data } = useCompaniesList({
    variables: {
      person_id: user?.id,
    },
  });

  //console.log('useCompaniesList', JSON.stringify(data, null, 2));

  const { mutate: saveCompanyApi, isLoading: isSaving } = useSaveCompany();
  const { mutate: unSaveCompanyApi, isLoading: isUnSaving } = useUnsaveSaveCompany();
  const { mutate: followCompmayApi, isLoading: isFollowing } = useAddContactCompany();

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <CompanyItem
          data={item}
          onFollow={(company) => {
            console.log('company', company);

            if (company?.is_followed === 0) {
              followCompmayApi(
                { company_id: company?.id, person_id: 0, emails: company?.email },
                {
                  onSuccess: (data) => {
                    console.log('data', data);

                    if (data?.response?.status === 200) {
                      queryClient.invalidateQueries(useCompaniesList.getKey());
                      queryClient.invalidateQueries(useFollowedCompanies.getKey());
                      queryClient.invalidateQueries(useSavedCompanies.getKey());
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
          onSavePress={(company) => {
            console.log('company', JSON.stringify(company?.is_saved, null, 2));

            if (company?.is_saved === 0) {
              saveCompanyApi(
                { company_id: company?.id },
                {
                  onSuccess: (data) => {
                    console.log('saveCompanyApi', data);

                    if (data?.response?.status === 200) {
                      queryClient.invalidateQueries(useCompaniesList.getKey());
                      queryClient.invalidateQueries(useFollowedCompanies.getKey());
                      queryClient.invalidateQueries(useSavedCompanies.getKey());
                    } else {
                    }
                  },
                  onError: (error) => {
                    // An error happened!
                    console.log(`saveCompanyApi error`, error);
                  },
                }
              );
            } else {
              unSaveCompanyApi(
                { company_id: company?.id },
                {
                  onSuccess: (data) => {
                    console.log('data', data);

                    if (data?.response?.status === 200) {
                      queryClient.invalidateQueries(useCompaniesList.getKey());
                      queryClient.invalidateQueries(useFollowedCompanies.getKey());
                      queryClient.invalidateQueries(useSavedCompanies.getKey());
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
              <Text>No Companies Found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Explore;
