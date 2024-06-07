import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { scale } from 'react-native-size-matters';

import ActivityIndicator from '@/components/activity-indicator';
import CompanyItem from '@/components/company-item';
import { queryClient } from '@/services/api/api-provider';
import {
  useAddContactCompany,
  useCompaniesList,
  useFollowedCompanies,
  useSaveCompany,
  useSavedCompanies,
  useUnsaveSaveCompany,
} from '@/services/api/company';
import { useUser } from '@/store/user';
import { Text, View } from '@/ui';

// eslint-disable-next-line max-lines-per-function
const Saved = () => {
  const profile = useUser((state) => state?.profile);

  const { isLoading, data } = useSavedCompanies({
    variables: {
      unique_id: profile?.unique_id,
    },
  });

  const { mutate: saveCompanyApi } = useSaveCompany();
  const { mutate: unSaveCompanyApi } = useUnsaveSaveCompany();
  const { mutate: followCompmayApi } = useAddContactCompany();

  const renderItem = useCallback(
    // eslint-disable-next-line max-lines-per-function
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
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  onSuccess: (data) => {
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
            if (company?.is_saved === 0) {
              saveCompanyApi(
                { company_id: company?.id, unique_id: profile?.unique_id },
                {
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  onSuccess: (data) => {
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
                { company_id: company?.id, unique_id: profile?.unique_id },
                {
                  // eslint-disable-next-line @typescript-eslint/no-shadow
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
    [followCompmayApi, saveCompanyApi, profile?.unique_id, unSaveCompanyApi]
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
          // eslint-disable-next-line react-native/no-inline-styles
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

export default Saved;
