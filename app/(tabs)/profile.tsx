import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Movie } from '@/types';
import { moviesAPI } from '@/services/api';
import * as DocumentPicker from 'expo-document-picker';
import { Film, LogOut, Mail } from 'lucide-react-native';

const MB = 1024 * 1024;
const MAX_POSTER_MB = 10;
const MAX_MOVIE_MB = 250;

const bytesToMb = (bytes?: number) =>
  typeof bytes === 'number' ? (bytes / MB).toFixed(1) : null;

export default function ProfileScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [poster, setPoster] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [movieFile, setMovieFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const validateAssetSize = (
    asset: DocumentPicker.DocumentPickerAsset,
    maxMb: number,
    label: string
  ) => {
    if (typeof asset.size !== 'number') {
      return true;
    }

    if (asset.size > maxMb * MB) {
      const currentSizeMb = bytesToMb(asset.size);
      Alert.alert(
        'Файл слишком большой',
        `${label} (${currentSizeMb} MB) превышает лимит ${maxMb} MB. Выберите файл меньше.`
      );
      return false;
    }

    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/200' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name}</Text>
          {user?.role === 'admin' ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Film size={16} color="#fff" strokeWidth={2} />
              <Text style={styles.addButtonText}>Добавить фильм</Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.emailContainer}>
            <Mail size={16} color="#999" strokeWidth={2} />
            <Text>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <Modal
          visible={showAddModal}
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
              <Text style={styles.title}>Добавить фильм</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Название</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Введите название"
                  placeholderTextColor="#666"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Описание</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Короткое описание"
                  placeholderTextColor="#666"
                  style={[styles.input, styles.textArea]}
                  multiline
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Цена (₽)</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Постер</Text>
                <TouchableOpacity
                  style={styles.fileButton}
                  onPress={async () => {
                    const result = await DocumentPicker.getDocumentAsync({
                      type: ['image/*'],
                      multiple: false,
                      copyToCacheDirectory: true,
                    });
                    if (!result.canceled && result.assets?.length) {
                      const selected = result.assets[0];
                      if (!validateAssetSize(selected, MAX_POSTER_MB, 'Постер')) {
                        return;
                      }
                      setPoster(selected);
                    }
                  }}
                >
                  <Text style={styles.fileButtonText}>{poster?.name || 'Выбрать файл'}</Text>
                </TouchableOpacity>
                {poster ? (
                  <Image
                    source={{ uri: poster.uri }}
                    style={styles.posterPreview}
                  />
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Фильм</Text>
                <TouchableOpacity
                  style={styles.fileButton}
                  onPress={async () => {
                    const result = await DocumentPicker.getDocumentAsync({
                      type: ['video/*'],
                      multiple: false,
                      copyToCacheDirectory: true,
                    });
                    if (!result.canceled && result.assets?.length) {
                      const selected = result.assets[0];
                      if (!validateAssetSize(selected, MAX_MOVIE_MB, 'Видео')) {
                        return;
                      }
                      setMovieFile(selected);
                    }
                  }}
                >
                  <Text style={styles.fileButtonText}>{movieFile?.name || 'Выбрать файл'}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
                onPress={async () => {
                  if (!title.trim() || !description.trim()) {
                    Alert.alert('Ошибка', 'Укажите название и описание фильма');
                    return;
                  }
                  try {
                    setIsSubmitting(true);
                    await moviesAPI.createMovie({
                      title: title.trim(),
                      description: description.trim(),
                      price: price ? Number(price) : 0,
                      poster: poster
                        ? {
                            uri: poster.uri,
                            name: poster.name,
                            mimeType: poster.mimeType,
                            file: (poster as any).file,
                          }
                        : null,
                      movie: movieFile
                        ? {
                            uri: movieFile.uri,
                            name: movieFile.name,
                            mimeType: movieFile.mimeType,
                            file: (movieFile as any).file,
                          }
                        : null,
                    });

                    setTitle('');
                    setDescription('');
                    setPrice('');
                    setPoster(null);
                    setMovieFile(null);
                    setShowAddModal(false);

                    Alert.alert('Готово', 'Фильм успешно добавлен');
                  } catch (error: any) {
                    console.error('Ошибка добавления фильма:', error);
                    const status = error?.response?.status;
                    const serverMessage = error?.response?.data?.message;
                    const fallbackMessage = error?.message;

                    if (status === 413) {
                      Alert.alert(
                        'Ошибка 413',
                        'Файл слишком большой для текущего лимита сервера или туннеля. Попробуйте уменьшить размер видео.'
                      );
                    } else {
                      Alert.alert(
                        'Ошибка',
                        serverMessage || fallbackMessage || 'Не удалось добавить фильм'
                      );
                    }
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Добавить фильм</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: '#222', marginTop: 8 }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.primaryButtonText}>Отмена</Text>
              </TouchableOpacity>

              {Platform.OS === 'web' ? (
                <Text style={styles.helper}>Для загрузки больших файлов лучше использовать стабильное подключение.</Text>
              ) : null}
            </ScrollView>
          </SafeAreaView>
        </Modal>

      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" strokeWidth={2} />
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 20,
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
  movieDescription: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E50914',
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    margin: 0,
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  footer: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#000',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E50914',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111',
    borderColor: '#222',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fileButton: {
    backgroundColor: '#141414',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  fileButtonText: {
    color: '#E50914',
    fontWeight: '600',
  },
  posterPreview: {
    width: 120,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#E50914',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helper: {
    marginTop: 16,
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
  },
});
