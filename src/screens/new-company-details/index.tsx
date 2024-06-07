import React, { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { scale } from 'react-native-size-matters';
import { TabBar } from 'react-native-tab-view';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import type { Route } from '@showtime-xyz/tab-view';
import { TabScrollView, TabView } from '@showtime-xyz/tab-view';
import ActivityIndicator from '@/components/activity-indicator';
import { ScreenHeader } from '@/components/screen-header';

import type { Theme } from '@/theme';
import OverView from './overview';
import Applicants from './applicants';
import Jobs from './jobs';
import { Text, View, Screen } from '@/ui';
import Header from './header';
import { useJobDetail } from '@/services/api/vacancies';
import { useGetCompanyDetails } from '@/services/api/company';

const OverViewTab = ({ route, data }: any) => {
  return (
    <>
      <TabScrollView index={route?.index}>
        <OverView data={data} />
      </TabScrollView>
    </>
  );
};

const ApplicantTab = ({ route, data }: any) => {
  return (
    <TabScrollView index={route?.index}>
      <Applicants data={data} />
    </TabScrollView>
  );
};

const JobsTab = ({ route, data }: any) => {
  return (
    <TabScrollView index={route?.index}>
      <Jobs data={data} />
    </TabScrollView>
  );
};

const renderLabel = ({
  focused,
  route,
}: {
  focused: boolean;
  route: { title: string };
}) => {
  return (
    <Text color={focused ? 'primary' : 'black'} variant="medium14" numberOfLines={1}>
      {route.title}
    </Text>
  );
};

const renderTabBar = (props: any) => {
  return (
    <View>
      <TabBar
        {...props}
        style={styles.tabBar}
        inactiveColor={'black'}
        indicatorStyle={[styles.indicatorStyle]}
        scrollEnabled={true}
        renderLabel={renderLabel}
        tabStyle={{ width: 120 }}
      />
      <View height={scale(4)} backgroundColor={'grey500'} />
    </View>
  );
};

export function NewCompanyDetails() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { colors } = useTheme<Theme>();
  const { width } = useWindowDimensions();

  const route = useRoute();

  const [routes] = useState<Route[]>([
    { key: 'Overview', title: 'Overview', index: 0 },
    { key: 'Jobs', title: 'Jobs', index: 1 },
    { key: 'People', title: 'People', index: 2 },
  ]);

  const [index, setIndex] = useState(0);
  const animationHeaderPosition = useSharedValue(0);
  const animationHeaderHeight = useSharedValue(0);

  const { data: companyDetails, isLoading } = useGetCompanyDetails({
    variables: {
      // @ts-ignore
      id: route?.params?.id,
    },
  });

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case 'Overview':
          return <OverViewTab route={route} index={0} data={companyDetails} />;
        case 'People':
          return <ApplicantTab route={route} index={1} data={null} />;
        case 'Jobs':
          return <JobsTab route={route} index={2} data={null} />;

        default:
          return null;
      }
    },
    [companyDetails]
  );

  const onStartRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
  };

  const renderHeader = () => {
    return (
      <View>
        <Header data={companyDetails} />
        <View height={scale(10)} backgroundColor={'grey500'} />
      </View>
    );
  };

  return (
    <Screen backgroundColor={colors.white}>
      <ScreenHeader showBorder={true} icon="close" />
      {isLoading ? (
        <View
          flex={1}
          height={scale(300)}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <TabView
          onStartRefresh={onStartRefresh}
          isRefreshing={isRefreshing}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          lazy
          renderScrollHeader={renderHeader}
          minHeaderHeight={0}
          animationHeaderPosition={animationHeaderPosition}
          animationHeaderHeight={animationHeaderHeight}
          enableGestureRunOnJS={false}
          scrollEnabled={true}
          style={{ width: width }}
          renderTabBar={renderTabBar}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    height: scale(40),
  },
  indicatorStyle: {
    height: scale(3),
    backgroundColor: '#01C96C',
  },
});
