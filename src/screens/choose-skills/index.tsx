import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import { scale } from 'react-native-size-matters';
import { ScreenHeader } from '@/components/screen-header';
import { SearchField } from '@/components/search-field';
import { useUser } from '@/store/user';
import type { Theme } from '@/theme';
import { Button, PressableScale, Screen, Text, View } from '@/ui';
import SkillsItem from './skill-item';
import { useSkills } from '@/services/api/settings';
import ActivityIndicator from '@/components/activity-indicator';
import { useUpdateSkills } from '@/services/api/profile';
import { queryClient } from '@/services/api/api-provider';
import { useGetUserProfileDetails } from '@/services/api/home';

export const ChooseSkills = () => {
  const { colors } = useTheme<Theme>();

  const { goBack } = useNavigation();
  const route = useRoute<any>();

  const company = useUser((state) => state?.company);
  const [skills, setSkills] = useState([]);

  const { data, isLoading } = useSkills();

  const { mutate: updateSkillApi, isLoading: updating } = useUpdateSkills();

  useEffect(() => {
    if (data) {
      // @ts-ignore
      const makeSikills = data?.map((element) => {
        return {
          ...element,
          selected: false,
        };
      });

      setSkills(makeSikills);
    }
  }, [data]);

  const updateSkills = () => {
    let skillBody = skills
      ?.filter((element) => element?.selected)
      .map((element2) => element2?.id);

    updateSkillApi(
      { unique_id: route?.params?.id, skills: skillBody },
      {
        onSuccess: (data) => {
          console.log('data', data);
          if (data?.status === 200) {
            queryClient.invalidateQueries(useGetUserProfileDetails.getKey());
            goBack();
          } else {
          }
        },
        onError: (error) => {
          // An error happened!
          console.log(`error`, error);
        },
      }
    );
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <SkillsItem
          data={item}
          onPress={(data) => {
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

  const renderLoading = () => {
    return (
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <Screen backgroundColor={colors.white}>
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

      {isLoading ? (
        renderLoading()
      ) : (
        <View flex={1} backgroundColor={'grey500'}>
          <FlashList
            //@ts-ignore
            data={skills}
            renderItem={renderItem}
            estimatedItemSize={150}
            ListEmptyComponent={
              <View height={scale(300)} justifyContent={'center'} alignItems={'center'}>
                <Text>No Users Found</Text>
              </View>
            }
          />
        </View>
      )}
      <View
        marginVertical={'medium'}
        backgroundColor={'grey500'}
        marginHorizontal={'medium'}
      >
        <Button label="Save Profile" onPress={updateSkills} loading={updating} />
      </View>
    </Screen>
  );
};
