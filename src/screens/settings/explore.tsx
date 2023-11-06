import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';

import { View } from '@/ui';
import CompanyItem from '@/components/company-item';

const Explore = () => {
  const renderItem = useCallback(({ item }) => {
    return <CompanyItem data={item} />;
  }, []);

  return (
    <View flex={1} backgroundColor={'grey500'}>
      <FlashList
        data={[0, 1, 2, 3, 4, 5]}
        numColumns={2}
        estimatedItemSize={100}
        renderItem={renderItem}
        contentContainerStyle={{
          // paddingTop: 20,
          paddingBottom: 100,
        }}
      />
    </View>
  );
};

export default Explore;
