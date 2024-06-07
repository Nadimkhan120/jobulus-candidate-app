import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { scale } from 'react-native-size-matters';
import * as z from 'zod';
import StepIndicator from '@/components/indicator-2';
import { ScreenHeader } from '@/components/screen-header';
import type { Theme } from '@/theme';
import { Button, ControlledInput, PressableScale, Screen, Text, View } from '@/ui';
import { loginFromVerifyCode } from '@/store/auth';
import { useUser } from '@/store/user';
import { useSendInviteLink } from '@/services/api/auth';
import { showErrorMessage, showSuccessMessage } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { icons } from '@/assets/icons';

const labels = ['Registration', 'Information', 'Invite'];

const schema = z.object({
  email: z.string().email('Invalid email format'),
  role: z.string(),
});

export type CompanyInformationFormType2 = z.infer<typeof schema>;

export const SendInvite = () => {
  const { colors } = useTheme<Theme>();

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CompanyInformationFormType2>({
    resolver: zodResolver(schema),
  });

  const user = useUser((state) => state?.user);
  const { mutate: sendInviteApi, isLoading: isLoadingInvite } = useSendInviteLink();

  const [selectedInvites, setSelectedInvites] = useState([]);

  const watchEmail = watch('email');

  const selectRole = () => {
    let existingUsers = [...selectedInvites];
    existingUsers.push({ email: watchEmail });
    setSelectedInvites(existingUsers);
    setValue('email', '');
  };

  const sendIvitesToPeople = () => {
    let body = {
      company_id: user?.id,
      invited_by_id: user?.id,
      emails: selectedInvites?.map((element) => {
        return {
          role: 6, //'guest',
          email: element?.email,
        };
      }),
    };

    if (body?.emails?.length === 0) {
      showErrorMessage('Please enter email and select role first');
      return;
    }

    sendInviteApi(body, {
      onSuccess: (data) => {
        if (data?.response?.status === 200) {
          loginFromVerifyCode();
          showSuccessMessage('Invites sent successfully.');
        } else {
          showErrorMessage(data?.response?.message ?? 'Something went wrong');
        }
      },
      onError: (error) => {
        // An error happened!
        console.log(`error`, error?.response?.data);
      },
    });
  };

  return (
    <Screen backgroundColor={colors.white} edges={['top', 'bottom']}>
      <ScreenHeader />

      <View
        paddingHorizontal={'large'}
        backgroundColor={'grey500'}
        paddingBottom={'medium'}
      >
        <StepIndicator stepCount={3} currentPosition={2} labels={labels} />
      </View>

      <View flex={1} paddingHorizontal={'large'}>
        <View height={scale(12)} />

        <View paddingTop={'large'}>
          <Text variant={'semiBold24'} color={'black'}>
            Invite Colleague
          </Text>
          <Text variant={'regular14'} paddingTop={'small'} color={'grey100'}>
            Complete your profile by adding further information
          </Text>
        </View>

        <View paddingTop={'large'} flexDirection={'row'}>
          <View flex={1} marginRight={'medium'}>
            <ControlledInput
              placeholder="Enter email"
              label="Email"
              control={control}
              name="email"
              icon={
                <PressableScale onPress={selectRole}>
                  <Image
                    source={icons['link']}
                    style={{ width: scale(24), height: scale(24) }}
                  />
                </PressableScale>
              }
            />
          </View>
        </View>

        {selectedInvites?.map((element, key) => {
          return (
            <View
              key={key}
              backgroundColor={'grey500'}
              marginTop={'medium'}
              borderRadius={scale(8)}
              padding={'medium'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <View>
                <Text variant={'medium13'} color={'black'}>
                  {element?.email}
                </Text>
              </View>
              <PressableScale
                onPress={() => {
                  let removeItems = selectedInvites?.filter(
                    (data) => data?.email !== element?.email
                  );

                  setSelectedInvites(removeItems);
                }}
              >
                <Image
                  source={icons['close']}
                  style={{ height: scale(20), width: scale(20) }}
                />
              </PressableScale>
            </View>
          );
        })}

        <View flex={1} justifyContent={'flex-end'} paddingBottom={'large'}>
          <View
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <View width={scale(100)}>
              <Button
                backgroundColor={'black'}
                label="Skip"
                onPress={() => {
                  loginFromVerifyCode();
                }}
              />
            </View>
            <View width={scale(100)}>
              <Button
                label="Finish"
                onPress={sendIvitesToPeople}
                loading={isLoadingInvite}
              />
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
};
