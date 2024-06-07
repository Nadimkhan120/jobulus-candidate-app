import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { useForm } from 'react-hook-form';
import { scale } from 'react-native-size-matters';
import * as z from 'zod';

import { ScreenHeader } from '@/components/screen-header';
import { useSoftKeyboardEffect } from '@/hooks';
import type { Theme } from '@/theme';
import { Button, ControlledInput, Screen, View } from '@/ui';
import { showErrorMessage, showSuccessMessage } from '@/utils';
import { useUpdatePassword } from '@/services/api/auth';
import { useUser } from '@/store/user';

const schema = z.object({
  password: z.string({
    required_error: 'Password is required',
  }),
  confirmPassword: z.string({
    required_error: 'Confirm Password is required',
  }),
  newPassword: z.string({
    required_error: 'New Password is required',
  }),
});

export type ChangePasswordFormType = z.infer<typeof schema>;

export const ChangePassword = () => {
  const { colors } = useTheme<Theme>();

  useSoftKeyboardEffect();
  const user = useUser((state) => state?.user);

  const { handleSubmit, control, watch, setError, formState: { errors }, reset } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(schema),
  });

  const { mutate: updatePasswordApi, isLoading } = useUpdatePassword();

  // const onSubmit = (data: ChangePasswordFormType) => {
  //   console.log('data', data);
    
  // };


  const onSubmit = (data) => {
    console.log(data);
    
    // Check old password and new password are not same
    if (data?.password === data?.newPassword) {
      showErrorMessage('Please enter a different password, the new password cannot be the same as the old one');
      return;
    }

    // Check if passwords match
    if (data?.newPassword !== data?.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    updatePasswordApi(
      {
        email: user?.email,
        oldpassword: data?.password,
        newpassword: data?.newPassword,
        newpassword_confirmation: data?.confirmPassword,
        
        // token: user?.auth_id,
      },
      {
        onSuccess: (responseData) => {
          console.log("responseData ",responseData?.response?.message);
          
          if (responseData?.response?.status === 200) {
            showSuccessMessage("Password has been changed");
            reset()
          } else {
            if(responseData?.response?.message?.newpassword?.length > 0){
              showErrorMessage(responseData?.response?.message?.newpassword[0]);
            }
            else{
              showErrorMessage(responseData?.response?.message);

            }
          }
        },
        onError: (error) => {
          //@ts-ignore
          showErrorMessage(error?.response?.data?.message);
        },
      }
    );
  };
  return (
    <Screen backgroundColor={colors.white}>
      <ScreenHeader showBorder={true} title="Change Password" />

      <View flex={1} paddingHorizontal={'large'}>
        <View paddingTop={'large'}>
          <ControlledInput
            placeholder="Enter password"
            label="Current Password"
            control={control}
            name="password"
          />
          <View height={scale(8)} />
          <ControlledInput
            placeholder="Enter password"
            label="New Password"
            control={control}
            name="newPassword"
          />
          <View height={scale(8)} />
          <ControlledInput
            placeholder="Enter Cofirm Password"
            label="Cofirm Password"
            control={control}
            name="confirmPassword"
          />
          <View height={scale(8)} />
        </View>
        <View height={scale(20)} />
        <View flex={1} justifyContent={'flex-end'} style={{bottom: scale(5)}}>
          <Button label="Update" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </Screen>
  );
};
