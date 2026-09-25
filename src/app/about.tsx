import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

const AboutScreen = () => {
  const router = useRouter()
  return (
    <View>
      <Text>AboutScreen</Text>
    </View>
  );
};

export default AboutScreen;