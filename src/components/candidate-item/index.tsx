import React from 'react';
import { View, Text, PressableScale } from '@/ui';
import { scale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';
import { Avatar } from '../avatar';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

type CadidateItemProps = {
  data: any;
  onSavePress?: (data: any) => void;
  onHandShake?: (data: any) => void;
  onMessage?: (data: any) => void;
};

const CadidateItem = ({
  data,
  onSavePress,
  onHandShake,
  onMessage,
}: CadidateItemProps) => {
  const { navigate } = useNavigation();

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        navigate('Job', { id: data?.unique_id });
      }}
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
              source={data?.isSaved === 0 ? icons['star-grey'] : icons['star-fill']}
              style={{ height: scale(16), width: scale(16) }}
              contentFit="contain"
            />
          </PressableScale>
        </View>
        <View height={scale(16)}></View>
        <Avatar
          source={data?.profile_pic ? data?.profile_pic : icons['avatar-2']}
          size="small"
          placeholder={'https://fakeimg.pl/400x400/cccccc/cccccc'}
        />
        <Text
          variant={'semiBold14'}
          textAlign={'center'}
          color={'black'}
          marginTop={'tiny'}
        >
          {data?.full_name}
        </Text>
        <Text
          variant={'regular12'}
          color={'grey300'}
          marginTop={'tiny'}
          textAlign={'center'}
        >
          {data?.job_title}
        </Text>
        <Text
          variant={'regular12'}
          marginTop={'tiny'}
          color={'grey300'}
          textAlign={'center'}
        >
          {data?.city}, {data?.country}
        </Text>
        <View marginTop={'small'}>
          <PressableScale
            onPress={() =>
              data?.is_friend == 0
                ? onHandShake?.(data)
                : data?.is_request_sent == 1
                ? null
                : onMessage?.(data)
            }
          >
            <View
              borderRadius={scale(44)}
              height={scale(32)}
              width={scale(106)}
              justifyContent={'center'}
              alignItems={'center'}
              borderWidth={1}
              borderColor={
                data?.is_request_sent === 1
                  ? 'grey500'
                  : data?.is_friend === 1
                  ? 'primary'
                  : 'primary'
              }
              backgroundColor={
                data?.is_request_sent === 1
                  ? 'grey500'
                  : data?.is_friend === 1
                  ? 'primary'
                  : 'white'
              }
            >
              <Text
                variant={'medium13'}
                color={
                  data?.is_request_sent === 1
                    ? 'grey300'
                    : data?.is_friend === 1
                    ? 'white'
                    : 'primary'
                }
              >
                {data?.is_request_sent == 1
                  ? 'Request Sent'
                  : data?.is_friend == 1
                  ? 'Message'
                  : 'HandShake'}
              </Text>
            </View>
          </PressableScale>
        </View>
      </View>
    </Pressable>
  );
};

export default CadidateItem;
