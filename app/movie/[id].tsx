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
import { Movie, Showtime } from '@/types';
import { moviesAPI } from '@/services/api';
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  ShoppingCart,
} from 'lucide-react-native';

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

  const handleBuyTicket = (showtime: Showtime) => {
    if (!showtime.available) {
      Alert.alert('Недоступно', 'Все билеты на этот сеанс распроданы');
      return;
    }

    Alert.alert(
      'Покупка билета',
      `Вы хотите купить билет на фильм "${movie?.title}"?\n\nВремя: ${showtime.time}\nЗал: ${showtime.hall}`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Купить',
          onPress: () => {
            Alert.alert('Успех', 'Билет успешно куплен!');
          },
        },
      ]
    );
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
          <Image source={{ uri: movie.poster }} style={styles.poster} />
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
              <Star size={18} color="#FFD700" fill="#FFD700" strokeWidth={2} />
              <Text style={styles.metaText}>{movie.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.metaItem}>
              <Calendar size={18} color="#999" strokeWidth={2} />
              <Text style={styles.metaText}>{movie.year}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.metaItem}>
              <Clock size={18} color="#999" strokeWidth={2} />
              <Text style={styles.metaText}>{movie.duration} мин</Text>
            </View>
          </View>

          <View style={styles.genreContainer}>
            <Text style={styles.genreBadge}>{movie.genre}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.description}>{movie.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Расписание сеансов</Text>
            {movie.showtimes.map((showtime) => (
              <View
                key={showtime.id}
                style={[
                  styles.showtimeCard,
                  !showtime.available && styles.showtimeDisabled,
                ]}
              >
                <View style={styles.showtimeInfo}>
                  <Text style={styles.showtimeTime}>{showtime.time}</Text>
                  <Text style={styles.showtimeHall}>{showtime.hall}</Text>
                  {!showtime.available && (
                    <Text style={styles.soldOut}>Продано</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.buyButton,
                    !showtime.available && styles.buyButtonDisabled,
                  ]}
                  onPress={() => handleBuyTicket(showtime)}
                  disabled={!showtime.available}
                >
                  <ShoppingCart
                    size={18}
                    color={showtime.available ? '#fff' : '#666'}
                    strokeWidth={2}
                  />
                  <Text
                    style={[
                      styles.buyButtonText,
                      !showtime.available && styles.buyButtonTextDisabled,
                    ]}
                  >
                    Купить
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
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
  genreContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  genreBadge: {
    backgroundColor: '#E50914',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '600',
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
  showtimeCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  showtimeDisabled: {
    opacity: 0.5,
  },
  showtimeInfo: {
    flex: 1,
  },
  showtimeTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  showtimeHall: {
    fontSize: 14,
    color: '#999',
  },
  soldOut: {
    fontSize: 12,
    color: '#E50914',
    marginTop: 4,
    fontWeight: '600',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buyButtonDisabled: {
    backgroundColor: '#333',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyButtonTextDisabled: {
    color: '#666',
  },
});
