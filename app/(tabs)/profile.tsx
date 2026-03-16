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
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Ticket } from '@/types';
import { userAPI } from '@/services/api';
import { LogOut, Mail, Ticket as TicketIcon, Calendar, Clock } from 'lucide-react-native';

export default function ProfileScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await userAPI.getTickets();
      setTickets(data);
    } catch (error) {
      console.error('Ошибка загрузки билетов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
            <TicketIcon size={24} color="#E50914" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Мои билеты</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E50914" />
            </View>
          ) : tickets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <TicketIcon size={48} color="#666" strokeWidth={2} />
              <Text style={styles.emptyText}>У вас пока нет билетов</Text>
            </View>
          ) : (
            tickets.map((ticket) => (
              <View key={ticket.id} style={styles.ticketCard}>
                <Image
                  source={{ uri: ticket.poster }}
                  style={styles.ticketPoster}
                />
                <View style={styles.ticketContent}>
                  <Text style={styles.ticketTitle} numberOfLines={1}>
                    {ticket.movieTitle}
                  </Text>
                  <View style={styles.ticketInfo}>
                    <View style={styles.ticketRow}>
                      <Calendar size={14} color="#999" strokeWidth={2} />
                      <Text style={styles.ticketText}>
                        {formatDate(ticket.date)}
                      </Text>
                    </View>
                    <View style={styles.ticketRow}>
                      <Clock size={14} color="#999" strokeWidth={2} />
                      <Text style={styles.ticketText}>{ticket.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.ticketSeat}>
                    Ряд {ticket.row}, Место {ticket.seat}
                  </Text>
                </View>
              </View>
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
  ticketCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },
  ticketPoster: {
    width: 80,
    height: 120,
    resizeMode: 'cover',
  },
  ticketContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  ticketInfo: {
    gap: 6,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketText: {
    fontSize: 13,
    color: '#999',
  },
  ticketSeat: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E50914',
    marginTop: 4,
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
