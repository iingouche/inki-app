import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Movie } from '@/types';
import { moviesAPI } from '@/services/api';
import {
  ArrowLeft,
} from 'lucide-react-native';
import { Linking } from 'react-native';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadMovie(id);
    }
  }, [id]);

  const loadMovie = async (movieId: string) => {
    try {
      setIsLoading(true);
      const data = await moviesAPI.getMovieById(movieId);
      setMovie(data);
    } catch (error) {
      console.error('Ошибка загрузки фильма:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить информацию о фильме');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenVideo = async () => {
    if (!movie?.videoUrl) {
      Alert.alert('Видео недоступно', 'Ссылка на видео отсутствует');
      return;
    }

    try {
      await Linking.openURL(movie.videoUrl);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось открыть видео');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Фильм не найден</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: movie.previewImage || 'https://via.placeholder.com/600x900',
            }}
            style={styles.poster}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>
                {typeof movie.price === 'number' && movie.price > 0
                  ? `Цена: ${movie.price} ₽`
                  : 'Бесплатно'}
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>
                {movie.isPaid ? 'Платный доступ' : 'Свободный доступ'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.description}>{movie.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Видео</Text>
            <TouchableOpacity
              style={[
                styles.videoButton,
                !movie.videoUrl && styles.videoButtonDisabled,
              ]}
              onPress={handleOpenVideo}
              disabled={!movie.videoUrl}
            >
              <Text
                style={[
                  styles.videoButtonText,
                  !movie.videoUrl && styles.videoButtonTextDisabled,
                ]}
              >
                {movie.videoUrl ? 'Открыть видео' : 'Видео не загружено'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#999',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#999',
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 500,
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: '#333',
    marginHorizontal: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 24,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  videoButtonDisabled: {
    backgroundColor: '#333',
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoButtonTextDisabled: {
    color: '#666',
  },
});
