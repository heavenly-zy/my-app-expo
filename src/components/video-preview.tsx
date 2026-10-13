import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { cssInterop } from 'nativewind';
import { ActivityIndicator, Text, View } from 'react-native';

const StyledVideoView = cssInterop(VideoView, { className: 'style' });

export default function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => player.play());
  const { status } = useEvent(player, 'statusChange', { status: player.status });

  return (
    <View className="flex-1 bg-black">
      <StyledVideoView
        player={player}
        className="size-full"
        contentFit="contain"
        nativeControls
        playsInline
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
        <View className="absolute inset-0 items-center justify-center px-6">
          <Text className="text-center text-base text-white">
            Unable to play this video.
          </Text>
        </View>
      )}
    </View>
  );
}
