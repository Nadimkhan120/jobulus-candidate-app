import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { Avatar } from '@/components/avatar';
import { PressableScale, Text, View } from '@/ui';

type JobItemProps = {
  //   data: {
  //     full_name: string;
  //     is_block: string;
  //     bio: string;
  //     email: string;
  //     phone: string;
  //     person_resume_id: string;
  //     description: string;
  //     cover_pic: string | null;
  //     profile_pic: string | null;
  //     unique_id: string;
  //     expected_salary: string;
  //     job_title: string;
  //     country: string;
  //     city: string;
  //   };
  data: any;
  showStatus?: boolean;
  onPress: () => void;
  onOptionPress: () => void;
};

const JobItem = ({
  data,
  showStatus,
  onPress,
  onOptionPress,
}: JobItemProps) => {
  return (
    <PressableScale onPress={onPress}>
      <View
        flexDirection={'row'}
        paddingHorizontal={'large'}
        borderBottomColor={'grey400'}
        borderBottomWidth={StyleSheet.hairlineWidth}
        backgroundColor={'white'}
        paddingVertical={'medium'}
      >
        <View>
          <Avatar
            transition={1000}
            source={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
            placeholder={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
          />
        </View>

        <View flex={1} paddingLeft={'medium'}>
          <View
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Text variant={'semiBold14'} color={'black'}>
              React Native Developer
            </Text>
            <PressableScale onPress={() => onOptionPress?.()}>
              <Image
                source={icons['more-horizontal']}
                style={style.dot}
                contentFit="contain"
              />
            </PressableScale>
          </View>

          <Text
            variant={'regular13'}
            textTransform={'capitalize'}
            marginVertical={'tiny'}
            color={'grey100'}
          >
            Brandzmate
          </Text>
          <Text
            variant={'regular12'}
            textTransform={'capitalize'}
            marginVertical={'tiny'}
            color={'black'}
          >
            Lahore, Pakistan
          </Text>

          <View flexDirection={'row'} marginVertical={'tiny'}>
            <View>
              <Text variant={'semiBold12'} style={{ color: 'red' }}>
                Rejected{' '}
              </Text>
            </View>
            <View>
              <Text variant={'regular12'} color={'grey200'}>
                Updated 6 hours ago
              </Text>
            </View>
          </View>
        </View>
      </View>
    </PressableScale>
  );
};

const style = StyleSheet.create({
  dot: {
    width: scale(24),
    height: scale(24),
  },
});

export default JobItem;
