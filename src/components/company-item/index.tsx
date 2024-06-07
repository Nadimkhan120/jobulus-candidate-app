import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';

import { icons } from '@/assets/icons';
import { PressableScale, Text, View } from '@/ui';

type CompanyItemProps = {
  data: any;
  onFollow: (data: any) => void;
  onSavePress?: (data: any) => void;
  onMessage?: (data: any) => void;
};

// eslint-disable-next-line max-lines-per-function
const CompanyItem = ({ data, onFollow, onSavePress, onMessage }: CompanyItemProps) => {
  const { navigate } = useNavigation();

  return (
    <Pressable
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1 }}
      onPress={() => navigate('NewCompanyDetails', { id: data?.id })}
    >
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
          <PressableScale onPress={() => onSavePress?.(data)}>
            <Image
              source={data?.is_saved === 0 ? icons['star-grey'] : icons['star-fill']}
              style={{ height: scale(16), width: scale(16) }}
              contentFit="contain"
            />
          </PressableScale>
        </View>
        <PressableScale>
          <Image
            source={data?.images?.pic ? data?.images?.pic : icons.company}
            style={{
              height: scale(48),
              width: scale(48),
              borderRadius: scale(8),
              marginTop: scale(16),
            }}
            contentFit="contain"
          />
        </PressableScale>
        <Text
          variant={'semiBold14'}
          textAlign={'center'}
          color={'black'}
          marginTop={'small'}
          height={44}
        >
          {data?.name}
        </Text>
        <Text
          variant={'regular12'}
          textTransform={'capitalize'}
          color={'grey300'}
          marginTop={'tiny'}
          textAlign={'center'}
          height={44}
        >
          {data?.city_name}, {data?.country_name}
        </Text>

        <View marginTop={'small'}>
          <PressableScale
            onPress={() =>
              data?.is_followed === 0 ? onFollow?.(data) : onMessage?.(data)
            }
          >
            <View
              borderRadius={scale(44)}
              height={scale(32)}
              width={scale(73)}
              justifyContent={'center'}
              alignItems={'center'}
              borderWidth={1}
              borderColor={'primary'}
              backgroundColor={data?.is_followed === 0 ? 'white' : 'primary'}
            >
              <Text
                variant={'medium13'}
                color={data?.is_followed === 0 ? 'primary' : 'white'}
              >
                {data?.is_followed === 0 ? 'Follow' : 'Message'}
              </Text>
            </View>
          </PressableScale>
        </View>
      </View>
    </Pressable>
  );
};

export default CompanyItem;
