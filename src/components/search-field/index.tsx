import React from "react";
import type { TextInputProps } from "react-native";
import { StyleSheet, TextInput, Platform } from "react-native";
import { scale } from "react-native-size-matters";
import { useTheme } from "@shopify/restyle";
import { Image } from "expo-image";
import type { IconTypes } from "@/assets/icons";
import { icons } from "@/assets/icons";
import { AppFonts } from "@/constants/fonts";
import type { Theme } from "@/theme";
import { View } from "@/ui";

type SearchFieldProps = {
  icon?: IconTypes;
  showBorder?: boolean;
} & TextInputProps;

export const SearchField = ({ icon, showBorder, ...rest }: SearchFieldProps) => {
  const { colors } = useTheme<Theme>();

  return (
    <View
      flexDirection={"row"}
      alignItems={"center"}
      paddingHorizontal={"small"}
      borderRadius={scale(8)}
      backgroundColor={"white"}
      borderWidth={showBorder ? 1 : 0}
      borderColor={"grey300"}
      height={scale(40)}
    >
      <Image source={icon ?? icons.search} style={styles.icon} contentFit="contain" />
      <TextInput
        textAlignVertical="center"
        placeholderTextColor={colors.grey300}
        style={[
          styles.input,
          {
            color: colors.black,
            ...Platform.select({
              android: {
                padding: 0,
                paddingTop: 3,
              },
            }),
          },
        ]}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: scale(40),
    flex: 1,
    fontSize: 12,
    marginHorizontal: scale(4),
    fontFamily: AppFonts.APP_FONT_REGULAR,
  },
  icon: {
    height: scale(16),
    width: scale(16),
  },
});
