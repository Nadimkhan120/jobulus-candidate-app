import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useUser } from '@/store/user';
import { Text, View } from '@/ui';
import { HomeSliderItem } from './slider-item';
import { useRefreshOnFocus } from '@/hooks';
import { ImageButton } from '@/components';
import { useNavigation } from '@react-navigation/native';
import { useGetProfile } from '@/services/api/home';

export const HomeSliderContainer = ({}) => {
  const { navigate } = useNavigation();

  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);

  const { data, isLoading, refetch } = useGetProfile();

  useRefreshOnFocus(refetch);

  if (isLoading) return;

  return (
    <View backgroundColor={'grey500'} marginBottom={'medium'} paddingTop={'large'}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {[...data?.response?.data, { full_name: 'Add' }]?.map((element, index) => {
          return <HomeSliderItem data={element} key={index} />;
        })}
      </ScrollView>

      <View
        flexDirection={'row'}
        marginBottom={'medium'}
        columnGap={'medium'}
        alignSelf={'center'}
      >
        <View alignItems={'center'}>
          <ImageButton
            icon="phone-call"
            size={scale(48)}
            backgroundColor={'white'}
            onPress={() => navigate('MyContacts')}
          />
          <Text variant={'regular12'} marginTop={'small'} color={'black'}>
            Contacts
          </Text>
        </View>
        <View alignItems={'center'}>
          <ImageButton
            icon="book"
            size={scale(48)}
            backgroundColor={'white'}
            onPress={() => navigate('MyCompanies')}
          />
          <Text variant={'regular12'} marginTop={'small'} color={'black'}>
            Companies
          </Text>
        </View>
        <View alignItems={'center'}>
          <ImageButton
            icon="briefcase"
            size={scale(48)}
            backgroundColor={'white'}
            onPress={() => navigate('MyJobs')}
          />
          <Text variant={'regular12'} marginTop={'small'} color={'black'}>
            Jobs
          </Text>
        </View>
        <View alignItems={'center'}>
          <ImageButton
            icon="person"
            size={scale(48)}
            backgroundColor={'white'}
            onPress={() => navigate('EditProfile', { user: profile })}
          />
          <Text variant={'regular12'} marginTop={'small'} color={'black'}>
            Profile
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: scale(8),
    paddingBottom: scale(16),
  },
});
