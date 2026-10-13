import { mediasAtom } from '@/atoms/medias-atom';
import VideoPreview from '@/components/video-preview';
import { router, useLocalSearchParams } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VideoPreviewScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const medias = useAtomValue(mediasAtom);
  const mediaId = Array.isArray(id) ? id[0] : id;
  const video = medias.find(
    (media) => media.id === mediaId && media.type === 'video',
  );

  function closePreview() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/gallery');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="text-[17px] font-semibold text-white">Video preview</Text>
        <Pressable
          onPress={closePreview}
          className="min-h-[44px] min-w-[64px] items-center justify-center rounded-full bg-zinc-800 active:opacity-60"
        >
          <Text className="text-[15px] font-semibold text-white">Close</Text>
        </Pressable>
      </View>

      {video ? (
        <VideoPreview key={video.uri} uri={video.uri} />
      ) : (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-center text-base text-white">
            This video is no longer available.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
