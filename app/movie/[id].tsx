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
import { API_BASE_URL, moviesAPI } from '@/services/api';
import {
  ArrowLeft,
} from 'lucide-react-native';
import Video from 'react-native-video';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const movieId = movie._id ?? movie.id ?? '';
  const streamUrl = movieId ? `${API_BASE_URL}/movies/${movieId}/video` : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
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
            <View style={styles.metaItem} />
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
            {movie.videoUrl ? (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.videoWrapper}
                onPress={() => setIsPlaying(true)}
              >
                <Video
                  source={{ uri: streamUrl || movie.videoUrl }}
                  controls
                  paused={!isPlaying}
                  resizeMode="contain"
                  style={styles.video}
                />
                {!isPlaying && (
                  <View style={styles.playOverlay}>
                    <View style={styles.playButton}>
                      <Text style={styles.playText}>Play</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.videoEmpty}>
                <Text style={styles.videoEmptyText}>Видео не загружено</Text>
              </View>
            )}
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
    height: 0,
  },
  headerRow: {
    padding: 12,
    paddingTop: 8,
    backgroundColor: '#000',
  },
  poster: {},
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
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
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  playButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: '#fff',
  },
  playText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  videoEmpty: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoEmptyText: {
    color: '#777',
    fontSize: 14,
    fontWeight: '600',
  },
});
