import React from 'react';
import { scale } from 'react-native-size-matters';
import { Text, View } from '@/ui';

type CompanyProps = {
  data: any;
};

const InfoRow = ({ label, value, isGrey = true }) => {
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
      <Text variant={'medium14'} color={isGrey ? 'grey100' : 'info'}>
        {value}
      </Text>
    </View>
  );
};

const Company = ({ data }: CompanyProps) => {
  return (
    <>
      <View paddingHorizontal={'large'} paddingTop={'medium'}>
        <Text variant={'medium20'} color={'black'}>
          About Company
        </Text>

        <Text paddingTop={'small'} variant={'regular14'} color={'grey200'} lineHeight={21}>
          {data?.short_description}
        </Text>
      </View>

      <View height={scale(16)} />

      <View paddingTop={'large'}>
        <Text paddingHorizontal={'large'} variant={'medium20'} color={'black'}>
          Company Detail
        </Text>

        <InfoRow label={'Email'} value={data?.email} isGrey={false} />
        <InfoRow label={'Phone Number'} value={data?.location?.phone} isGrey={false} />
        <InfoRow label={'Website'} value={data?.location?.website} isGrey={false} />
        <InfoRow label={'Employees'} value={data?.no_of_employees} isGrey={true} />
        <InfoRow label={'Category'} value={data?.categories?.map((element) => `${element?.name},`)} isGrey={true} />
        <InfoRow label={'Industry'} value={data?.industries?.map((element) => `${element?.name},`)} isGrey={true} />
        <InfoRow label={'Work Time'} value={`${data?.start_time}-${data?.end_time}`} isGrey={true} />
        <InfoRow label={'Average Wage'} value={data?.average_wage} isGrey={true} />
      </View>

      <View paddingTop={'large'}>
        <Text paddingHorizontal={'large'} variant={'medium20'} color={'black'}>
          Social Links
        </Text>

        <InfoRow label={'Facebook'} value={data?.facebook_link} isGrey={true} />
        <InfoRow label={'Instagram'} value={data?.instagram_link} isGrey={true} />
        <InfoRow label={'Twitter'} value={data?.twitter_link} isGrey={true} />
      </View>
    </>
  );
};

export default Company;
