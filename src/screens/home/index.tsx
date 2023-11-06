import React, { useCallback } from 'react';
import { useTheme } from '@shopify/restyle';
import { TopHeader } from '@/components/top-header';
import type { Theme } from '@/theme';
import { Screen } from '@/ui';
import { HomeSliderContainer } from './home-slider';
import { PersonItem } from '@/components/person-item';
import { FlashList } from '@shopify/flash-list';

const renderHeader = () => {
  return <HomeSliderContainer />;
};

export function Home() {
  const { colors } = useTheme<Theme>();

  const renderItem = useCallback(({ item }) => {
    return <PersonItem data={item} />;
  }, []);

  return (
    <Screen
      edges={['top']}
      backgroundColor={colors.white}
      statusBarColor={colors.white}
      barStyle="dark-content"
    >
      <TopHeader />
      <FlashList
        data={[0, 1, 2, 3, 4, 5]}
        ListHeaderComponent={renderHeader}
        estimatedItemSize={100}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </Screen>
  );
}
