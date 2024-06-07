import React from 'react';

import { Text, View } from '@/ui';

type DetailsProps = {
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

const Details = ({ data }: DetailsProps) => {
  return (
    <View>
      <InfoRow label={'Salary'} value={data?.salary_max} isGrey={true} />
      <InfoRow label={'Job Type'} value={data?.job_type} isGrey={true} />
      <InfoRow label={'Onsite/Remote'} value={'Onsite'} isGrey={true} />
      <InfoRow
        label={'Experience Level'}
        value={data?.experience_levels[0]?.experience_level}
        isGrey={true}
      />
      <InfoRow label={'Time Posted'} value={data?.created_at} isGrey={true} />
    </View>
  );
};

export default Details;
