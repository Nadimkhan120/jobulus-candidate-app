import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import * as z from 'zod';
import { icons } from '@/assets/icons';
import { IconButton } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import { useSoftKeyboardEffect } from '@/hooks';
import { useRegisterCompany } from '@/services/api/auth/register-company';
import type { Theme } from '@/theme';
import { Button, ControlledInput, PressableScale, Screen, Text, View } from '@/ui';
import { extractError, showErrorMessage, showSuccessMessage } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useSocialLogin } from '@/services/api/auth/login';
import { login } from '@/store/auth';
import { setUserData } from '@/store/user';
import { setShowLoading } from '@/store/loader';

const schema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required',
    })
    .min(6, 'Full name must be at least 6 characters'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(10, 'Password should be at least 10 characters')
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&]).{10,16}$/,
      'Password must be at least 10 characters and one specail character, one lower case and one upper case'
    ),
});

export type RegisterFormType = z.infer<typeof schema>;

export const Register = () => {
  const { colors } = useTheme<Theme>();
  const { navigate } = useNavigation();

  useSoftKeyboardEffect();

  const { mutate: registerApi, isLoading } = useRegisterCompany();

  const { handleSubmit, control } = useForm<RegisterFormType>({
    resolver: zodResolver(schema),
  });

  const { mutate: socialApi, isLoading: isLoadingSocial } = useSocialLogin();

  const onSubmit = (data: RegisterFormType) => {
    registerApi(
      {
        email: data?.email,
        password: data?.password,
        password_confirmation: data?.password,
        full_name: data?.fullName,
      },
      {
        onSuccess: (responseData) => {
          console.log('data', JSON.stringify(responseData, null, 2));

          if (responseData?.response?.status === 200) {
            navigate('VerifyCode', {
              email: data?.email,
              password: data?.password,
            });
          } else {
            let errorMessage = extractError(responseData?.response?.message);

            showErrorMessage(errorMessage ?? 'Something went wrong');
          }
        },
        onError: (error) => {
          //@ts-ignore
          showErrorMessage(error?.response?.data?.message);
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
            console.log('data', JSON.stringify(data?.response?.data, null, 2));

            if (data?.response?.status === 200) {
              setShowLoading(false);
              login(data?.response?.data?.token);
              setUserData(data?.response?.data);
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

  return (
    <Screen backgroundColor={colors.white}>
      <ScreenHeader />

      <View flex={1} paddingHorizontal={'large'}>
        <View height={scale(24)} />
        <Image source={icons.logo} contentFit="contain" style={styles.logo} />
        <View paddingTop={'large'}>
          <Text variant={'semiBold24'} color={'black'}>
            Registration 👍
          </Text>
          <Text variant={'regular14'} paddingTop={'small'} color={'grey100'}>
            Let's Register. Apply to jobs!
          </Text>
        </View>

        <View paddingTop={'large'}>
          <ControlledInput
            placeholder="Enter full name"
            label="Full Name"
            control={control}
            name="fullName"
          />
          <View height={scale(8)} />
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
        <Button label="Register" onPress={handleSubmit(onSubmit)} loading={isLoading} />

        <Image
          source={icons.continue}
          style={{ height: scale(24), width: '100%', marginTop: scale(24) }}
          contentFit="contain"
        />

        <View
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={'medium'}
          marginVertical={'large'}
        >
          {/* <IconButton icon="apple" onPress={() => null} color={'grey500'} /> */}
          <IconButton icon="google" onPress={googleLogin} color={'grey500'} />
          {/* <IconButton icon="facebook" onPress={() => null} color={'grey500'} /> */}
        </View>

        {/* <View paddingVertical={'2xl'} alignSelf={'center'}>
          <PressableScale
            onPress={() => navigate('ChooseAuthLocation', { from: 'Register' })}
          >
            <Text variant={'regular14'} color={'grey200'}>
              Haven't an account?{' '}
              <Text variant={'semiBold14'} color={'primary'}>
                Register
              </Text>
            </Text>
          </PressableScale>
        </View> */}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: scale(17),
    width: scale(98),
  },
});
