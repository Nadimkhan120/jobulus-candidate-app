import React from 'react';
import { View, Text, PressableScale } from '@/ui';
import { scale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { CompanyButton } from '../company-button';

type CompanyItemProps = {
  data: any;
};

const CompanyItem = ({ data }: CompanyItemProps) => {
  return (
    <View
      backgroundColor={'white'}
      borderRadius={scale(12)}
      flex={1}
      margin={'small'}
      padding={'medium'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <View position={'absolute'} top={scale(8)} right={scale(8)}>
        <PressableScale>
          <Image
            source={icons['star-grey']}
            style={{ height: scale(16), width: scale(16) }}
            contentFit="contain"
          />
        </PressableScale>
      </View>
      <PressableScale>
        <Image
          source={icons['company']}
          style={{
            height: scale(48),
            width: scale(48),
            borderRadius: scale(8),
            marginTop: scale(16),
          }}
          contentFit="contain"
        />
      </PressableScale>
      <Text variant={'semiBold14'} color={'black'} marginTop={'small'}>
        Design Week
      </Text>
      <Text
        variant={'regular12'}
        color={'grey300'}
        marginTop={'tiny'}
        textAlign={'center'}
      >
        Dubai, UAE
      </Text>

      <View marginTop={'small'}>
        <PressableScale>
          <View
            borderRadius={scale(44)}
            height={scale(32)}
            width={scale(73)}
            justifyContent={'center'}
            alignItems={'center'}
            borderWidth={1}
            borderColor={'primary'}
          >
            <Text variant={'medium13'} color={'primary'}>
              Follow
            </Text>
          </View>
        </PressableScale>
      </View>
    </View>
  );
};

export default CompanyItem;
