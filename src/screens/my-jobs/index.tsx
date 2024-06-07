import { useTheme } from '@shopify/restyle';
import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { scale } from 'react-native-size-matters';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import { ScreenHeader } from '@/components/screen-header';
import type { Theme } from '@/theme';
import { Screen, Text, View } from '@/ui';

import Applied from './applied';
import Saved from './saved';

const FirstRoute = () => <Applied />;
const SecondRoute = () => <Saved />;

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const renderLabel = ({
  focused,
  route,
}: {
  focused: boolean;
  route: { title: string };
}) => {
  return (
    <Text
      color={focused ? 'primary' : 'grey300'}
      variant={focused ? 'medium14' : 'regular14'}
      //numberOfLines={1}
    >
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
        // eslint-disable-next-line react-native/no-inline-styles
        tabStyle={{ width: 120 }}
      />
      <View height={scale(4)} backgroundColor={'grey500'} />
    </View>
  );
};

export const MyJobs = () => {
  const { colors } = useTheme<Theme>();

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'first', title: 'Applied Jobs' },
    { key: 'second', title: 'Saved Jobs' },
  ]);

  return (
    <Screen edges={['top']} backgroundColor={colors.white} barStyle="dark-content">
      <ScreenHeader title="My Jobs" />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: scale(16),
  },
  tabBar: {
    backgroundColor: 'white',
    height: scale(40),
  },
  indicatorStyle: {
    height: scale(3),
    backgroundColor: '#01C96C',
  },
});
