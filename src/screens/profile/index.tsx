import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { scale } from 'react-native-size-matters';
import { icons } from '@/assets/icons';
import { ScreenHeader } from '@/components/screen-header';
import { useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { useGetCompanyDetails } from '@/services/api/company';
import { Avatar } from '@/components/avatar';

const InfoRow = ({ label, onPress }) => {
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
      <PressableScale onPress={onPress}>
        <Image
          source={icons['plus2']}
          style={{ width: scale(24), height: scale(24) }}
          contentFit="contain"
        />
      </PressableScale>
    </View>
  );
};

export const Profile = () => {
  const { colors } = useTheme<Theme>();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();

  const company = useUser((state) => state?.company);

  const { data } = useGetCompanyDetails({
    variables: {
      id: company?.id,
    },
  });

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader title={'Rifaat Sarkar'} showBorder={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View height={scale(119)}>
          <Image
            source={icons['back-cover']}
            style={{ height: scale(119), width: width }}
          />
          <View
            alignSelf={'flex-start'}
            position={'absolute'}
            // bottom={0}
            marginLeft={'large'}
            style={{
              bottom: -scale(28),
            }}
          >
            <Avatar source={icons['avatar-2']} size="large" />
          </View>
        </View>

        <View height={scale(19)} />

        <View paddingHorizontal={'large'} paddingVertical={'large'}>
          <Text
            variant={'semiBold20'}
            textTransform={'capitalize'}
            color={'black'}
          >
            Rifaat Sarkar
          </Text>
          <Text variant={'regular13'} color={'grey200'}>
            MEARN Stack Developer
          </Text>
          <Text variant={'regular13'} color={'grey200'}>
            Lahore, Pakistan
          </Text>
        </View>

        <View borderBottomColor={'grey400'} borderBottomWidth={1}></View>

        <View paddingHorizontal={'large'} paddingTop={'medium'}>
          <Text variant={'medium20'} color={'black'}>
            About
          </Text>

          <Text
            paddingTop={'small'}
            variant={'regular14'}
            color={'grey200'}
            lineHeight={21}
          >
            I’m a strategist who constantly strives to achieve success through
            in-depth research and constant learning. Creating an optimal flow
            from the beginning of the process to the end is critical to any
            campaign’s outcome regardless of what mediums it occupies. My work
            helps both the team and the client to keep the user’s motivations,
            goals, and roles top of mind.
          </Text>
        </View>

        <View height={scale(16)} />

        <View paddingTop={'large'}>
          <InfoRow
            label={'Experience'}
            onPress={() => {
              navigate('AddExperience');
            }}
          />

          <InfoRow
            label={'Education'}
            onPress={() => {
              navigate('AddEducation');
            }}
          />
          <InfoRow
            label={'Skills'}
            onPress={() => {
              navigate('ChooseSkills');
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: scale(160),
  },
});
