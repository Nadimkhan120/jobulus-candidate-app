import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import * as z from 'zod';
import { icons } from '@/assets/icons';
import { IconButton } from '@/components';
import { useLogin, useSocialLogin } from '@/services/api/auth/login';
import { login, loginFromVerifyCode, setUserToken } from '@/store/auth';
import { setUserData, setUserWithProfile } from '@/store/user';
import type { Theme } from '@/theme';
import { Button, ControlledInput, PressableScale, Screen, Text, View } from '@/ui';
import { showErrorMessage } from '@/utils';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { setShowLoading } from '@/store/loader';
import { appleAuth } from '@invertase/react-native-apple-authentication';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export const Login = () => {
  const { colors } = useTheme<Theme>();
  const { navigate } = useNavigation();

  const { mutate: loginApi, isLoading } = useLogin();
  const { mutate: socialApi, isLoading: isLoadingSocial } = useSocialLogin();

  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormType) => {
    loginApi(
      { email: data?.email, password: data?.password },
      {
        onSuccess: (data) => {
          console.log('data', JSON.stringify(data, null, 2));

          if (data?.response?.status === 200) {
            if (data?.response?.message === 'This Account deleted Successfully') {
              showErrorMessage(data?.response?.message);
            } else {
              login(data?.response?.data?.token);
              setUserData(data?.response?.data);
            }
          } else {
            showErrorMessage(data?.response?.message);
          }
        },
        onError: (error) => {
          console.log('error', error?.response);

          // An error happened!
          console.log(`error`, error?.response?.data);
        },
      }
    );
  };

  const googleLogin = async () => {
    setShowLoading(true);

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      console.log('userInfo', JSON.stringify(userInfo, null, 2));

      socialApi(
        {
          email: userInfo?.user?.email,
          provider: 'google',
          token: userInfo?.user?.id,
          user_type: '1',
          full_name: userInfo?.user?.name,
        },
        {
          onSuccess: (data) => {
            console.log('data', JSON.stringify(data, null, 2));

            if (data?.response?.status === 200) {
              setShowLoading(false);
              //@ts-ignore
              if (data?.response?.data?.profile?.is_registration_done === 0) {
                setUserToken(data?.response?.data?.token);
                setUserWithProfile(data?.response?.data);
                navigate('CompanyInformation');
              } else {
                login(data?.response?.data?.token);
                setUserData(data?.response?.data);
              }
            } else {
              showErrorMessage(data?.response?.message);
            }
          },
          onError: (error) => {
            console.log('error', error?.response);

            // An error happened!
            console.log(`error`, error?.response?.data);
            setShowLoading(false);
          },
        }
      );
    } catch (error) {
      console.log('error', error);
      setShowLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  async function onAppleButtonPress() {
    setShowLoading(true);

    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated

      console.log(
        'appleAuthRequestResponse',
        JSON.stringify(appleAuthRequestResponse, null, 2)
      );

      let body = {
        email: appleAuthRequestResponse?.email,
        provider: 'apple',
        token: appleAuthRequestResponse?.user,
        user_type: '1',
        full_name:
          appleAuthRequestResponse?.fullName?.givenName === null
            ? 'My Name'
            : appleAuthRequestResponse?.fullName?.givenName,
      };

      //@ts-ignore
      socialApi(body, {
        onSuccess: (data) => {
          console.log('data', JSON.stringify(data, null, 2));

          if (data?.response?.status === 200) {
            setShowLoading(false);
            //@ts-ignore
            if (data?.response?.data?.profile?.is_registration_done === 0) {
              setUserToken(data?.response?.data?.token);
              setUserWithProfile(data?.response?.data);
              navigate('CompanyInformation');
            } else {
              login(data?.response?.data?.token);
              setUserData(data?.response?.data);
            }
          } else {
            showErrorMessage(data?.response?.message);
          }
        },
        onError: (error) => {
          console.log('error', error?.response);

          // An error happened!
          console.log(`error`, error?.response?.data);
          setShowLoading(false);
        },
      });
    } else {
      setShowLoading(true);
    }
  }

  return (
    <Screen backgroundColor={colors.white}>
      <ScrollView style={{ marginHorizontal: scale(15) }}>
        <View height={scale(72)} />
        <Image source={icons.logo} contentFit="contain" style={styles.logo} />
        <View paddingTop={'large'}>
          <Text variant={'semiBold24'} color={'black'}>
            Welcome Back 👋
          </Text>
          <Text variant={'regular14'} paddingTop={'small'} color={'grey100'}>
            Let’s log in. Apply to jobs!
          </Text>
        </View>

        <View paddingTop={'large'}>
          <ControlledInput
            placeholder="Enter email address"
            label="Email"
            control={control}
            name="email"
          />
          <View height={scale(8)} />
          <ControlledInput
            placeholder="Enter password"
            label="Password"
            isSecure={true}
            control={control}
            name="password"
          />
        </View>
        <View height={scale(24)} />
        <Button label="Log in" onPress={handleSubmit(onSubmit)} loading={isLoading} />

        <View paddingVertical={'2xl'} alignSelf={'center'}>
          <PressableScale onPress={() => navigate('ForgotPassword')}>
            <Text color={'black'}>Forgot password?</Text>
          </PressableScale>
        </View>

        <Image
          source={icons.continue}
          style={{ height: scale(24), width: '100%' }}
          contentFit="contain"
        />

        <View
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={'medium'}
          marginVertical={'large'}
        >
          <IconButton icon="apple" onPress={onAppleButtonPress} color={'grey500'} />
          <IconButton icon="google" onPress={googleLogin} color={'grey500'} />
          {/* <IconButton icon="facebook" onPress={() => null} color={'grey500'} /> */}
        </View>

        <View paddingVertical={'2xl'} alignSelf={'center'}>
          <PressableScale onPress={() => navigate('Register')}>
            <Text variant={'regular14'} color={'grey200'}>
              Haven’t an account?{' '}
              <Text variant={'semiBold14'} color={'primary'}>
                Register
              </Text>
            </Text>
          </PressableScale>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: scale(17),
    width: scale(98),
  },
});
