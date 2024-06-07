import { formatDistanceToNow, parseISO } from 'date-fns';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Avatar } from '@/components/avatar';
import { PressableScale, Text, View } from '@/ui';

type JobItemProps = {
  data: any;
  showStatus?: boolean;
  onPress: () => void;
  onOptionPress: () => void;
};

// eslint-disable-next-line max-lines-per-function
const JobItem = ({ data, onPress }: JobItemProps) => {
  // console.log('JobItem', JSON.stringify(data, null, 2));

  // Parse the given date string into a Date object
  const parsedDate = parseISO(data?.updated_at);

  // Calculate the difference between the current time and the parsed date in hours
  // @ts-ignore

  // Format the difference in hours as "X hours ago"
  const formattedDifference = formatDistanceToNow(parsedDate, { addSuffix: true });

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
            source={{
              uri: data?.company?.images?.pic
                ? data?.company?.images?.pic
                : 'https://fakeimg.pl/400x400/cccccc/cccccc',
            }}
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
              {data?.job_titles}
            </Text>
            {/* <PressableScale onPress={() => onOptionPress?.()}>
              <Image
                source={icons['more-horizontal']}
                style={style.dot}
                contentFit="contain"
              />
            </PressableScale> */}
          </View>

          <Text
            variant={'regular13'}
            textTransform={'capitalize'}
            marginVertical={'tiny'}
            color={'grey100'}
          >
            {data?.company_name}
          </Text>
          <Text
            variant={'regular12'}
            textTransform={'capitalize'}
            marginVertical={'tiny'}
            color={'black'}
          >
            {data?.city_name ? `${data?.city_name}, ${data?.country_name}` : null}
          </Text>

          <View flexDirection={'row'} marginVertical={'tiny'}>
            <View>
              {/* eslint-disable-next-line react-native/no-inline-styles */}
              <Text variant={'semiBold12'} style={{ color: 'red' }}>
                {data?.applied_job_status}{' '}
              </Text>
            </View>
            <View>
              <Text variant={'regular12'} color={'grey200'}>
                Updated {formattedDifference}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </PressableScale>
  );
};

export default JobItem;
