import React from 'react';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import type { IconTypes } from '@/assets/icons';
import { icons } from '@/assets/icons';
import { PressableScale, Text, View } from '@/ui';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Avatar } from '@/components/avatar';

type HeaderProps = {
  icon?: IconTypes;
  title?: string;
  showBorder?: boolean;
  onRightPress: () => void;
  data: any;
};

export const Header = ({ icon, showBorder, onRightPress, data }: HeaderProps) => {
  const { goBack } = useNavigation();

  return (
    <View
      height={scale(50)}
      flexDirection={'row'}
      alignItems={'center'}
      paddingHorizontal={'large'}
      borderBottomColor={'grey500'}
      borderBottomWidth={showBorder ? 1 : 0}
      justifyContent={'space-between'}
    >
      <View flexDirection={'row'} alignItems={'center'}>
        <PressableScale onPress={goBack}>
          <Image
            source={icons[icon] ?? icons['arrow-left']}
            style={styles.image}
            contentFit="contain"
          />
        </PressableScale>

        <View paddingLeft={'medium'} flexDirection={'row'} alignItems={'center'}>
          <Avatar
            transition={1000}
            source={data?.profilePic}
            placeholder={{ uri: 'https://fakeimg.pl/400x400/cccccc/cccccc' }}
            size="small"
          />
          <Text variant={'medium17'} color={'grey100'} paddingLeft={'large'}>
            {data?.name}
          </Text>
        </View>
      </View>

      <PressableScale onPress={onRightPress}>
        <Image source={icons['more-horizontal']} style={styles.image} />
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  image: { height: scale(24), width: scale(24) },
});
