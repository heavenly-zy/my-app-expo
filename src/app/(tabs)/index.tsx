import { FeedCard } from '@/components/feed-card';
import { getFeeds } from '@/services/apiFeed';
import { useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const {
    data: feeds,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['feeds'],
    queryFn: getFeeds,
  });

  const [showStatusBar, setShowStatusBar] = useState(true);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 flex justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  function handleScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const verticalScrollVelocity = event.nativeEvent.velocity?.y;
    if (!verticalScrollVelocity) return;

    const isScrollingUp = Platform.select({
      ios: verticalScrollVelocity > 0,
      android: verticalScrollVelocity < 0,
      default: verticalScrollVelocity > 0,
    });

    setShowStatusBar(!isScrollingUp);
  }

  return (
    <SafeAreaView edges={['bottom']} className="android:mt-8">
      <StatusBar style="auto" hidden={!showStatusBar} animated />

      <FlatList
        data={feeds}
        renderItem={({ item: feed }) => <FeedCard feed={feed} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        // onScroll={handleScroll} // 仅安卓生效
        onScrollEndDrag={handleScrollEndDrag} // ios、安卓都生效
        scrollEventThrottle={160}
      />
    </SafeAreaView>
  );
}
