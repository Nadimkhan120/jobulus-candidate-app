import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import CadidateItem from '@/components/candidate-item';
import { View, Screen } from '@/ui';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/theme';
import { ScreenHeader } from '@/components/screen-header';

export const MyContacts = () => {
  const { colors } = useTheme<Theme>();

  const renderItem = useCallback(({ item }) => {
    return <CadidateItem data={item} />;
  }, []);

  return (
    <Screen
      edges={['top']}
      backgroundColor={colors.white}
      barStyle="dark-content"
    >
      <ScreenHeader title="My Contacts" />
      <View flex={1} backgroundColor={'grey500'}>
        <FlashList
          data={[0, 1, 2, 3, 4, 5]}
          numColumns={2}
          estimatedItemSize={100}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 100,
            paddingHorizontal: 12,
          }}
        />
      </View>
    </Screen>
  );
};
