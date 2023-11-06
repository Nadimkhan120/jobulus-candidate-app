import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { PersonItem } from '@/components/person-item';

const Explore = () => {
  const renderItem = useCallback(({ item }) => {
    return <PersonItem data={item} />;
  }, []);

  return (
    <FlashList
      data={[0, 1, 2, 3, 4, 5]}
      estimatedItemSize={100}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: 100,
      }}
    />
  );
};

export default Explore;
