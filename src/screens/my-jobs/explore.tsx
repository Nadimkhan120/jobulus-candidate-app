import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { View } from '@/ui';
import JobItem from './job-item';
import { useNavigation } from '@react-navigation/native';

const Explore = () => {

  const { navigate } = useNavigation();

  const renderItem = useCallback(({ item }) => {
    return (
      <JobItem
        data={item}
        onPress={() => navigate('MyJobDetail')}        
        onOptionPress={function (): void {}}
      />
    );
  }, []);

  return (
    <View flex={1} backgroundColor={'grey500'}>
      <FlashList
        data={[0, 1, 2, 3, 4, 5]}
        estimatedItemSize={100}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
          paddingHorizontal: 12,
        }}
      />
    </View>
  );
};

export default Explore;
