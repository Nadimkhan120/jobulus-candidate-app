import React from 'react';
import { View } from '@/ui';
import { WebView } from 'react-native-webview';
import { useWindowDimensions } from 'react-native';

type OverViewProps = {
  data: any;
};

const OverView = ({ data }: OverViewProps) => {
  const { height } = useWindowDimensions();

  return (
    <View>
      <WebView
        style={{
          height: height,
        }}
        useWebKit={true}
        scrollEnabled={true}
        hideKeyboardAccessoryView={true}
        keyboardDisplayRequiresUserAction={false}
        originWhitelist={['*']}
        dataDetectorTypes={'none'}
        domStorageEnabled={false}
        bounces={false}
        javaScriptEnabled={true}
        //source={{ html }}
        source={{
          html: data,
        }}
        onError={(error) => {
          console.log('error', error);
        }}
      />
    </View>
  );
};

export default OverView;
