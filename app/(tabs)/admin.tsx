import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Redirect, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { moviesAPI } from '@/services/api';

export default function AdminScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const rootNavigationState = useRootNavigationState();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [poster, setPoster] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [movie, setMovie] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickPoster = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*'],
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.length) {
      setPoster(result.assets[0]);
    }
  };

  const pickMovie = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['video/*'],
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.length) {
      setMovie(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
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
        movie: movie
          ? {
              uri: movie.uri,
              name: movie.name,
              mimeType: movie.mimeType,
              file: (movie as any).file,
            }
          : null,
      });

      setTitle('');
      setDescription('');
      setPrice('');
      setPoster(null);
      setMovie(null);

      Alert.alert('Готово', 'Фильм успешно добавлен');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить фильм');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!rootNavigationState?.key) {
    return null;
  }

  if (!isAdmin) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
          <TouchableOpacity style={styles.fileButton} onPress={pickPoster}>
            <Text style={styles.fileButtonText}>
              {poster?.name || 'Выбрать файл'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Фильм</Text>
          <TouchableOpacity style={styles.fileButton} onPress={pickMovie}>
            <Text style={styles.fileButtonText}>
              {movie?.name || 'Выбрать файл'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Добавить фильм</Text>
          )}
        </TouchableOpacity>

        {Platform.OS === 'web' ? (
          <Text style={styles.helper}>Для загрузки больших файлов лучше использовать стабильное подключение.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
