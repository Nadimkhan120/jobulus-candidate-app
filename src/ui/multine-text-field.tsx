// import { useTheme } from "@shopify/restyle";
// import * as React from "react";
// import type { TextInput, TextInputProps } from "react-native";
// import { StyleSheet, TextInput as NTextInput } from "react-native";
// import { scale } from "react-native-size-matters";

// import { palette, type Theme } from "@/theme";
// import { Text, View } from "@/ui";

// export interface NMultiInputProps extends TextInputProps {
//   label?: string;
//   disabled?: boolean;
//   error?: string;
// }

// export const MultiTextField = React.forwardRef<TextInput, NMultiInputProps>((props, ref) => {
//   const { label, error, value, ...inputProps } = props;

//   const theme = useTheme<Theme>();

//   const [isFocussed, setIsFocussed] = React.useState(false);

//   const onBlur = React.useCallback(() => setIsFocussed(false), []);
//   const onFocus = React.useCallback(() => setIsFocussed(true), []);

//   return (
//     <View>
//       {label && (
//         <Text paddingVertical={"small"} variant="medium14" color={"black"}>
//           {label}
//         </Text>
//       )}
//       <View
//         //flexDirection={"row"}
//         //alignItems={"center"}
//         borderRadius={scale(8)}
//         height={scale(160)}
//         paddingHorizontal={"medium"}
//         borderColor={error ? "error" : isFocussed ? "black" : "grey500"}
//         borderWidth={1}
//         backgroundColor={isFocussed ? "white" : "grey500"}
//         paddingTop={"small"}
//       >
//         <NTextInput
//           testID="STextInput"
//           ref={ref}
//           placeholderTextColor={theme.colors.grey300}
//           onBlur={onBlur}
//           onFocus={onFocus}
//           {...inputProps}
//           style={styles.input}
//           textAlignVertical="top"
//           multiline={true}
//         />
//         <View padding={"small"} alignSelf={"flex-end"}>
//           <Text variant={"regular12"} color={"grey300"}>
//             {`${value?.length ?? 0}/500`}
//           </Text>
//         </View>
//       </View>
//       {error && (
//         <Text paddingTop={"small"} variant="regular14" color={"error"}>
//           {error}
//         </Text>
//       )}
//     </View>
//   );
// });

// const styles = StyleSheet.create({
//   input: {
//     height: scale(160),
//     flex: 1,
//     color: palette.black,
//     //padding: scale(16),
//     // borderRadius: scale(8),
//     // paddingRight: scale(4),
//     //backgroundColor: "red",
//   },
// });
import { useTheme } from "@shopify/restyle";
import { Image } from "expo-image";
import * as React from "react";
import type { TextInput, TextInputProps } from "react-native";
import { StyleSheet, TextInput as NTextInput } from "react-native";
import { scale } from "react-native-size-matters";

import { icons } from "@/assets/icons";
import { palette, type Theme } from "@/theme";
import { PressableScale, Text, View } from "@/ui";

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
  isSecure?: boolean;
  icon?: React.ReactElement;
}

export const MultiTextField = React.forwardRef<TextInput, NInputProps>((props, ref) => {
  const { label, error, isSecure, icon, ...inputProps } = props;

  const theme = useTheme<Theme>();

  const [isFocussed, setIsFocussed] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(isSecure);

  const onBlur = React.useCallback(() => setIsFocussed(false), []);
  const onFocus = React.useCallback(() => setIsFocussed(true), []);

  const togglePassword = React.useCallback(
    () => setShowPassword(!showPassword),
    [showPassword]
  );

  return (
    <View>
      {label && (
        <Text paddingVertical={"small"} variant="medium14" color={"black"}>
          {label}
        </Text>
      )}
      <View
        flexDirection={"row"}
        alignItems={"center"}
        borderRadius={scale(8)}
        height={scale(160)}
        paddingHorizontal={"medium"}
        borderColor={error ? "error" : isFocussed ? "black" : "grey500"}
        borderWidth={1}
        backgroundColor={isFocussed ? "white" : "grey500"}
      >
        <NTextInput
          testID="STextInput"
          ref={ref}
          placeholderTextColor={theme.colors.grey300}
          onBlur={onBlur}
          onFocus={onFocus}
          style={[styles.input, { textAlignVertical:  'top'}]}
          secureTextEntry={showPassword}
          multiline={true}
          {...inputProps}
        />
        {isSecure ? (
          <PressableScale onPress={togglePassword}>
            <Image
              source={showPassword ? icons["eye-closed"] : icons.eye}
              style={styles.icon}
              contentFit="contain"
            />
          </PressableScale>
        ) : null}
        {icon && icon}
      </View>
      {error && (
        <Text paddingTop={"small"} variant="regular14" color={"error"}>
          {error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    height: scale(160),
    flex: 1,
    borderRadius: scale(8),
    paddingRight: scale(4),
    color: palette.black,
  },
  icon: { height: 24, width: 24 },
});
