import { Image } from 'expo-image';
import React from 'react';
import { scale } from 'react-native-size-matters';

import type { IconTypes } from '@/assets/icons';
import { icons } from '@/assets/icons';

type TabBarIconProps = {
  color?: string;
  name: IconTypes;
  focused: boolean;
  size?: number;
};

const HOME = 'home';
const Vacancies = 'jobs';
const AddPost = 'post a job';
const Candidates = 'candidates';
const Settings = 'companies';

// get icon when tab is not focused
const getIcon = (name) => {
  switch (name) {
    case HOME:
      return 'home';
    case Vacancies:
      return 'vacancies';
    case AddPost:
      return 'plus';
    case Candidates:
      return 'person-outline';
    case Settings:
      return 'book';
    default:
      break;
  }
};

// get icon when tab is focused
const getIconFocused = (name) => {
  switch (name) {
    case HOME:
      return 'home-focused';
    case Vacancies:
      return 'vacancies-focused';
    case AddPost:
      return 'new-plus-circle';
    case Candidates:
      return 'person-fill';
    case Settings:
      return 'book';
    default:
      break;
  }
};

const TabBarIcon = ({ name, focused, size = scale(18) }: TabBarIconProps) => {
  return (
    <Image
      style={{
        width: size,
        height: size,
        //tintColor: color,
      }}
      // @ts-ignore
      source={focused ? icons[getIconFocused(name)] : icons[getIcon(name)]}
      contentFit="contain"
    />
  );
};

export default TabBarIcon;
