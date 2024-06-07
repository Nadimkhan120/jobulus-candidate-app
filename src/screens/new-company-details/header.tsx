import React from 'react';
import { scale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import { Text, View } from '@/ui';
import { CompanyButton } from '@/components/company-button';
import { icons } from '@/assets/icons';
import { useWindowDimensions } from 'react-native';

type DetailContainerProps = {
  data?: any;
};

const Header = ({ data }: DetailContainerProps) => {
  const { width } = useWindowDimensions();

  return (
    <>
      <View height={scale(119)}>
        <Image
          source={data?.images?.cover ? data?.images?.cover : icons['back-cover']}
          style={{ height: scale(119), width: width }}
        />
        <View
          alignSelf={'flex-start'}
          position={'absolute'}
          marginLeft={'large'}
          style={{
            bottom: -scale(43),
          }}
        >
          <CompanyButton
            icon="company"
            onPress={() => null}
            size={scale(86)}
            imageSize={scale(86)}
            companyImage={data?.images?.pic}
          />
        </View>
      </View>

      <View padding={'large'}></View>

      <View paddingHorizontal={'large'} paddingVertical={'large'}>
        <Text variant={'semiBold20'} textTransform={'capitalize'} color={'black'}>
          {data?.name}
        </Text>
        <Text variant={'regular13'} color={'grey200'}>
          {data?.location?.city_name}, {data?.location?.country_name}
        </Text>
      </View>
    </>
  );
};

export default Header;
