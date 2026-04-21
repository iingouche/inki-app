import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Movie } from '@/types';
import { API_BASE_URL, moviesAPI } from '@/services/api';
import { Film } from 'lucide-react-native';

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setIsLoading(true);
      const data = await moviesAPI.getNowPlaying();
      setMovies(data);
    } catch (error) {
      console.error('Ошибка загрузки фильмов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMovieCard = ({ item }: { item: Movie }) => {
    const movieId = item._id ?? item.id ?? '';
    console.log(item._id
            ? `${API_BASE_URL}/movies/${item._id}/preview`
            : item.previewImage || 'https://via.placeholder.com/300x450');
    return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => movieId && router.push(`/movie/${movieId}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: item._id
            ? `${API_BASE_URL}/movies/${item._id}/preview`
            : item.previewImage || 'https://via.placeholder.com/300x450',
        }}
        style={styles.poster}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Загрузка ваших фильмов...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Film size={60} color="#E50914" strokeWidth={2} />
        <Text style={styles.title}>INKI</Text>
        <Text style={styles.headerTitle}>Все фильмы</Text>
        <Text style={styles.headerSubtitle}>
          {movies.length} {movies.length === 1 ? 'фильм' : 'фильмов'} в коллекции
        </Text>
      </View>

      <FlatList
        data={movies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item._id ?? item.id ?? item.title}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    color: '#999',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },
  poster: {
    width: 120,
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
    lineHeight: 18,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E50914',
  },
});
