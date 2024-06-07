import type { ColorProps } from '@shopify/restyle';
import React from 'react';
import {} from 'react-native';
import { scale } from 'react-native-size-matters';

import type { IconTypes } from '@/assets/icons';
import { icons } from '@/assets/icons';
import type { Theme } from '@/theme';
import { PressableScale, View } from '@/ui';
import { Image } from 'expo-image';

type ImageButtonProps = {
  icon: IconTypes;
  onPress: () => void;
  size?: number;
  imageSize?: number;
  backgroundColor?: ColorProps<Theme>['color'];
  companyImage?: string;
};

export const CompanyButton = ({
  icon,
  size = scale(36),
  imageSize = scale(18),
  onPress,
  backgroundColor,
  companyImage,
}: ImageButtonProps) => {
  return (
    <PressableScale onPress={onPress}>
      <View
        backgroundColor={backgroundColor}
        justifyContent={'center'}
        alignItems={'center'}
        height={size}
        width={size}
        borderRadius={scale(8)}
      >
        <Image
          source={companyImage ?? icons[icon]}
          style={{
            height: imageSize,
            width: imageSize,
            borderRadius: scale(8),
          }}
          resizeMode="contain"
        />
      </View>
    </PressableScale>
  );
};
