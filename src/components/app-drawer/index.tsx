import * as React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { scale } from 'react-native-size-matters';
import { icons } from '@/assets/icons';
import { useCompanies, useLogout } from '@/services/api/company';
import { closeDrawer, openDrawer, useApp } from '@/store/app';
import { logOut } from '@/store/auth';
import { useUser, removeUserData } from '@/store/user';
import { PressableScale, Screen, Text, View } from '@/ui';
import { Avatar } from '../avatar';
import { useNavigation } from '@react-navigation/native';
import { useRefreshOnFocus } from '@/hooks';
import { Image } from 'expo-image';
import { showErrorMessage } from '@/utils';

const { width } = Dimensions.get('screen');

type AppDrawer = {
  children: React.ReactNode;
};

export function AppDrawer({ children }: AppDrawer) {
  const { navigate } = useNavigation();

  const drawerStatus = useApp((state) => state.drawerStatus);
  const user = useUser((state) => state?.profile);
  const company = useUser((state) => state?.company);

  const { data: companies, refetch } = useCompanies();

  const { mutate: logOutApi, error, isLoading } = useLogout();

  useRefreshOnFocus(refetch);

  React.useEffect(() => {
    // @ts-ignore
    if (companies?.response?.status === 201) {
      logOut();
    }
    // @ts-ignore
  }, [companies?.response?.status]);

  const logoutUSer = () => {
    logOutApi(
      //@ts-ignore
      {},
      {
        onSuccess: (response) => {
          if (response?.message === 'User logged out successfully') {
            closeDrawer();
            removeUserData();
            logOut();
          } else {
            showErrorMessage('Error in logout');
          }
        },
        onError: (error) => {
          // An error happened!
          // @ts-ignore
          console.log(`error`, error?.response.data?.message);
        },
      }
    );
  };

  return (
    <Drawer
      open={drawerStatus}
      onOpen={openDrawer}
      onClose={closeDrawer}
      drawerStyle={{ width: width * 0.8 }}
      renderDrawerContent={() => {
        return (
          <Screen>
            <View flex={1}>
              <View
                paddingHorizontal={'large'}
                flexDirection={'row'}
                paddingTop={'medium'}
                alignItems={'center'}
                borderBottomColor={'grey500'}
                paddingBottom={'medium'}
                borderBottomWidth={1}
              >
                <Avatar
                  source={{ uri: user?.profile_pic }}
                  transition={1000}
                  placeholder={'https://fakeimg.pl/400x400/cccccc/cccccc'}
                  size="medium"
                  onPress={() => navigate('EditProfile', { user })}
                />
                <TouchableOpacity onPress={() => navigate('EditProfile', { user })}>
                  <View>
                    <Text
                      variant={'medium16'}
                      textTransform={'capitalize'}
                      paddingLeft={'medium'}
                      color={'black'}
                      numberOfLines={2}
                      maxWidth={200}
                    >
                      {user?.full_name} 👋
                    </Text>
                    <Text
                      variant={'regular14'}
                      paddingLeft={'medium'}
                      paddingTop={'tiny'}
                      color={'grey200'}
                    >
                      View profile
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View height={30} />

              <View>
                <PressableScale onPress={() => navigate('MyJobs')}>
                  <View
                    height={scale(56)}
                    alignItems={'center'}
                    marginHorizontal={'large'}
                    borderRadius={scale(8)}
                    marginBottom={'large'}
                    backgroundColor={'grey500'}
                    flexDirection={'row'}
                    paddingHorizontal={'large'}
                  >
                    <Image
                      source={icons['vacancies']}
                      style={{ height: scale(24), width: scale(24) }}
                      contentFit="contain"
                    />
                    <Text variant={'medium14'} color={'grey200'} paddingLeft={'large'}>
                      My Jobs
                    </Text>
                  </View>
                </PressableScale>
                <PressableScale onPress={() => navigate('MyContacts')}>
                  <View
                    height={scale(56)}
                    alignItems={'center'}
                    marginHorizontal={'large'}
                    borderRadius={scale(8)}
                    marginBottom={'large'}
                    backgroundColor={'grey500'}
                    flexDirection={'row'}
                    paddingHorizontal={'large'}
                  >
                    <Image
                      source={icons['person']}
                      style={{ height: scale(24), width: scale(24) }}
                      contentFit="contain"
                    />
                    <Text variant={'medium14'} color={'grey200'} paddingLeft={'large'}>
                      My Contacts
                    </Text>
                  </View>
                </PressableScale>
                <PressableScale onPress={() => navigate('MyCompanies')}>
                  <View
                    height={scale(56)}
                    alignItems={'center'}
                    marginHorizontal={'large'}
                    borderRadius={scale(8)}
                    marginBottom={'large'}
                    backgroundColor={'grey500'}
                    flexDirection={'row'}
                    paddingHorizontal={'large'}
                  >
                    <Image
                      source={icons['book']}
                      contentFit="contain"
                      style={{ height: scale(24), width: scale(24) }}
                    />
                    <Text variant={'medium14'} color={'grey200'} paddingLeft={'large'}>
                      My Companies
                    </Text>
                  </View>
                </PressableScale>
                <PressableScale onPress={() => navigate('MyAccount')}>
                  <View
                    height={scale(56)}
                    alignItems={'center'}
                    marginHorizontal={'large'}
                    borderRadius={scale(8)}
                    marginBottom={'large'}
                    backgroundColor={'grey500'}
                    flexDirection={'row'}
                    paddingHorizontal={'large'}
                  >
                    <Image
                      source={icons.settings}
                      style={{ height: scale(24), width: scale(24) }}
                    />
                    <Text variant={'medium14'} color={'grey200'} paddingLeft={'large'}>
                      My Account
                    </Text>
                  </View>
                </PressableScale>
              </View>

              <View flex={1} paddingBottom={'large'} justifyContent={'flex-end'}>
                <PressableScale onPress={logoutUSer}>
                  <View
                    height={scale(56)}
                    backgroundColor={'grey500'}
                    alignItems={'center'}
                    marginHorizontal={'large'}
                    borderRadius={scale(8)}
                    flexDirection={'row'}
                    paddingHorizontal={'large'}
                  >
                    <Image
                      source={icons['log-out']}
                      style={{ height: scale(24), width: scale(24) }}
                    />
                    <Text variant={'medium14'} color={'error'} paddingLeft={'large'}>
                      Sign Out
                    </Text>
                  </View>
                </PressableScale>
              </View>
            </View>
          </Screen>
        );
      }}
    >
      {children}
    </Drawer>
  );
}
