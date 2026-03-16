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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Movie } from '@/types';
import { moviesAPI } from '@/services/api';
import { Film, LogOut, Mail, Star } from 'lucide-react-native';

export default function ProfileScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Вы уверены, что хотите выйти?');
      if (confirmed) {
        logout();
        router.replace('/auth');
      }
      return;
    }

    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/auth');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/200' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name}</Text>
          <View style={styles.emailContainer}>
            <Mail size={16} color="#999" strokeWidth={2} />
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Film size={24} color="#E50914" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Фильмы</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E50914" />
            </View>
          ) : movies.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Film size={48} color="#666" strokeWidth={2} />
              <Text style={styles.emptyText}>Фильмы не найдены</Text>
            </View>
          ) : (
            movies.map((movie) => (
              <TouchableOpacity
                key={movie.id}
                style={styles.movieCard}
                onPress={() => router.push(`/movie/${movie.id}`)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: movie.poster }} style={styles.moviePoster} />
                <View style={styles.movieContent}>
                  <Text style={styles.movieTitle} numberOfLines={1}>
                    {movie.title}
                  </Text>
                  <Text style={styles.movieGenre} numberOfLines={1}>
                    {movie.genre}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" strokeWidth={2} />
                    <Text style={styles.rating}>{movie.rating.toFixed(1)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" strokeWidth={2} />
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#E50914',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
  movieCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },
  moviePoster: {
    width: 96,
    height: 144,
    resizeMode: 'cover',
  },
  movieContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  movieGenre: {
    fontSize: 13,
    color: '#999',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
