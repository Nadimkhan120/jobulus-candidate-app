import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';
import { setUserData, setUserProfiles, useUser } from '@/store/user';
import { Text, View } from '@/ui';
import { HomeSliderItem } from './slider-item';
import { useRefreshOnFocus } from '@/hooks';
import { ImageButton } from '@/components';
import { useNavigation } from '@react-navigation/native';
import { useGetProfile } from '@/services/api/home';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const baseOptions = {
  vertical: false,
  width: width,
  height: 200,
} as const;

export const HomeSliderContainer = ({}) => {
  const { navigate } = useNavigation();

  const user = useUser((state) => state?.user);
  const profile = useUser((state) => state?.profile);
  const company = useUser((state) => state.company);
  const roles = useUser((state) => state.roles);

  const { data, isLoading, refetch } = useGetProfile();

  const [currentIndex, setCurrentIndex] = useState(0);

  useRefreshOnFocus(refetch);

  useEffect(() => {
    if (data?.response?.data?.length) {
      if (currentIndex === [...data?.response?.data, { full_name: 'Add' }].length - 1) {
        return;
      } else {
        const itemToSet = data?.response?.data[currentIndex];
        //console.log('itemToSet', itemToSet);

        let newUser = {
          ...user,
        };

        setUserData({
          profile: itemToSet,
          user: newUser,
          company,
          roles,
        });
      }
    }
  }, [currentIndex, data]);

  useEffect(() => {
    if (data) {
      setUserProfiles(data?.response?.data);
    }
  }, [data]);

  if (isLoading) return;

  return (
    <View backgroundColor={'grey500'} marginBottom={'medium'} paddingTop={'large'}>
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {[...data?.response?.data, { full_name: 'Add' }]?.map((element, index) => {
          return <HomeSliderItem data={element} key={index} />;
        })}
      </ScrollView> */}

      <View alignItems={'center'}>
        <Carousel
          {...baseOptions}
          style={{
            width: width,
          }}
          loop={false}
          pagingEnabled={true}
          snapEnabled={true}
          autoPlay={false}
          mode="parallax"
          onSnapToItem={(index) => setCurrentIndex(index)}
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          data={[...data?.response?.data, { full_name: 'Add' }]}
          renderItem={({ index, item }) => <HomeSliderItem data={item} key={index} />}
        />
      </View>

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
