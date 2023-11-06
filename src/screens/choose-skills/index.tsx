import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { scale } from 'react-native-size-matters';
import { ScreenHeader } from '@/components/screen-header';
import { SearchField } from '@/components/search-field';
import { useGetUser } from '@/services/api/user';
import { useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { PressableScale, Screen, Text, View } from '@/ui';
import SkillsItem from './skill-item';

const employees = [
  { id: 1, name: 'JavaScript', selected: false },
  { id: 2, name: 'Python', selected: false },
  { id: 3, name: 'Java', selected: false },
  { id: 4, name: 'C++', selected: false },
  { id: 5, name: 'C#', selected: false },
  { id: 6, name: 'Ruby', selected: false },
  { id: 7, name: 'PHP', selected: false },
  { id: 8, name: 'Swift', selected: false },
  { id: 9, name: 'Go', selected: false },
  { id: 10, name: 'SQL', selected: false },
];

export const ChooseSkills = () => {
  const { colors } = useTheme<Theme>();

  const { goBack } = useNavigation();

  const company = useUser((state) => state?.company);
  const [skills, setSkills] = useState(employees);

  const { data, isLoading } = useGetUser({
    variables: {
      id: company?.id,
    },
  });

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <SkillsItem
          data={item}
          onPress={(data) => {
            console.log('data', data);

            let prev = [...skills];

            let changeData = prev.map((element) => {
              if (element?.id === data?.id) {
                return {
                  ...element,
                  selected: !element?.selected,
                };
              }
              return element;
            });

            setSkills(changeData);
          }}
        />
      );
    },
    [skills, setSkills]
  );

  return (
    <Screen backgroundColor={colors.white} edges={['top']}>
      <ScreenHeader
        title="Skills"
        icon="close"
        rightElement={
          <PressableScale onPress={goBack}>
            <Text variant={'medium17'} color={'primary'}>
              Done
            </Text>
          </PressableScale>
        }
      />

      <View
        backgroundColor={'grey500'}
        paddingVertical={'large'}
        paddingHorizontal={'large'}
        paddingBottom={'medium'}
      >
        <SearchField placeholder="Search by name" showBorder={true} />

        <View
          flexDirection={'row'}
          gap={'medium'}
          marginTop={'medium'}
          alignItems={'center'}
          flexWrap={'wrap'}
        >
          {skills
            ?.filter((element) => element?.selected)
            .map((element) => {
              return (
                <View
                  paddingHorizontal={'large'}
                  backgroundColor={'primary'}
                  paddingVertical={'small'}
                  key={element?.id}
                  borderRadius={44}
                >
                  <Text color={'white'}>{element?.name}</Text>
                </View>
              );
            })}
        </View>
      </View>

      <View flex={1} backgroundColor={'grey500'}>
        <FlashList
          //@ts-ignore
          data={skills}
          renderItem={renderItem}
          estimatedItemSize={150}
          ListEmptyComponent={
            <View
              height={scale(300)}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Text>No Users Found</Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
};
