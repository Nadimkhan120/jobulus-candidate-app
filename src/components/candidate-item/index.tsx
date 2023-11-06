import React from 'react';
import { View, Text, PressableScale } from '@/ui';
import { scale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { Avatar } from '../avatar';

type CadidateItemProps = {
  data: any;
};

const CadidateItem = ({ data }: CadidateItemProps) => {
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
      <View height={scale(16)}></View>
      <Avatar source={icons['avatar-2']} size="small" />
      <Text variant={'semiBold14'} color={'black'} marginTop={'tiny'}>
        Jhon Wick
      </Text>
      <Text
        variant={'regular12'}
        color={'grey300'}
        marginTop={'tiny'}
        textAlign={'center'}
      >
        User Experience Designer at Conrad labs
      </Text>
      <Text
        variant={'regular12'}
        marginTop={'tiny'}
        color={'grey300'}
        textAlign={'center'}
      >
        Rawalpindi, Pakistan
      </Text>
      <View marginTop={'small'}>
        <PressableScale>
          <View
            borderRadius={scale(44)}
            height={scale(32)}
            width={scale(106)}
            justifyContent={'center'}
            alignItems={'center'}
            borderWidth={1}
            borderColor={'primary'}
          >
            <Text variant={'medium13'} color={'primary'}>
              Handshake
            </Text>
          </View>
        </PressableScale>
      </View>
    </View>
  );
};

export default CadidateItem;
