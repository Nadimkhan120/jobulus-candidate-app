import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { scale } from 'react-native-size-matters';
import { ScreenHeader } from '@/components/screen-header';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from '@/config';
import { AppFonts } from '@/constants/fonts';
import { setSelectedLocation, useExperience } from '@/store/experience';

export const ChooseLocation = () => {
  const { colors } = useTheme<Theme>();
  const { goBack } = useNavigation();
  const selectedLocation = useExperience((state) => state?.selectedLocation);

  const goBackToScreen = () => {
    if (selectedLocation !== '') {
      goBack();
    }
  };

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader
        title="Location"
        icon="close"
        rightElement={
          <PressableScale onPress={goBackToScreen}>
            <Text variant={'medium17'} color={'primary'}>
              Done
            </Text>
          </PressableScale>
        }
      />

      <View flex={1} paddingHorizontal={'large'} backgroundColor={'grey500'}>
        <View height={10} />
        <GooglePlacesAutocomplete
          placeholder="Search here"
          fetchDetails={true}
          textInputProps={{
            placeholderTextColor: 'black',
          }}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true

            const addressComponents = details?.address_components;

            const city =
              addressComponents.find((comp) => comp.types.includes('locality'))
                ?.long_name || '';
            const country =
              addressComponents.find((comp) => comp.types.includes('country'))
                ?.long_name || '';

            const location = {
              address: data?.structured_formatting?.main_text,
              city,
              country,
            };

            setSelectedLocation(location);
          }}
          query={{
            key: Config.GOOGLE_PLACES,
            language: 'en',
          }}
          styles={{
            container: {
              flex: 1,
            },
            textInputContainer: {
              flexDirection: 'row',
              paddingVertical: 16,
            },
            textInput: {
              backgroundColor: '#FFFFFF',
              height: scale(44),
              borderRadius: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
              fontSize: 12,
              flex: 1,
              fontFamily: AppFonts.APP_FONT_REGULAR,
              color: 'black',
            },
            poweredContainer: {
              justifyContent: 'flex-end',
              alignItems: 'center',
              borderBottomRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderColor: '#c8c7cc',
              borderTopWidth: 0.5,
            },
            powered: {},
            listView: {},
            row: {
              backgroundColor: '#FFFFFF',
              padding: 13,
              height: 44,
              flexDirection: 'row',
            },
            separator: {
              height: 0.5,
              backgroundColor: '#c8c7cc',
            },
            description: {
              color: 'black',
            },
            loader: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
              height: 20,
            },
          }}
        />
      </View>
    </Screen>
  );
};
