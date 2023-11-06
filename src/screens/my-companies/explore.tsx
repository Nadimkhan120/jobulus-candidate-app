import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { PersonItem } from '@/components/person-item';
import CadidateItem from '@/components/candidate-item';
import { View } from '@/ui';

const Explore = () => {
  const renderItem = useCallback(({ item }) => {
    return <CadidateItem data={item} />;
  }, []);

  return (
    <View flex={1} backgroundColor={'grey500'}>
      <FlashList
        data={[0, 1, 2, 3, 4, 5]}
        numColumns={2}
        estimatedItemSize={100}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
        }}
      />
    </View>
  );
};

export default Explore;
