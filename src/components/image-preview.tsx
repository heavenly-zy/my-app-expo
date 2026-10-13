import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

const StyledImage = cssInterop(Image, { className: 'style' });

export default function ImagePreview({ uri }: { uri: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  function retry() {
    setStatus('loading');
    setAttempt((value) => value + 1);
  }

  return (
    <View className="flex-1 bg-black">
      <StyledImage
        key={attempt}
        source={uri}
        className="size-full"
        contentFit="contain"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />

      {status === 'loading' && (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {status === 'error' && (
        <View className="absolute inset-0 items-center justify-center">
          <Text className="mx-6 text-center text-base text-white">
            Unable to load this image.
          </Text>
          <Pressable
            onPress={retry}
            className="mt-4 min-h-[44px] justify-center rounded-full bg-zinc-800 px-6"
          >
            <Text className="text-base font-semibold text-white">Retry</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
