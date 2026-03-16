import { Movie, Ticket, User } from '@/types';

export const MOCK_USER: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Иван Петров',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
};

export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Звездный путь',
    description: 'Эпическое космическое приключение о команде исследователей, отправившихся в неизведанные уголки галактики. Им предстоит столкнуться с невероятными опасностями и открыть тайны древней цивилизации.',
    previewImage: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: '',
    price: 0,
    isPaid: false,
  },
  {
    id: '2',
    title: 'Таинственный детектив',
    description: 'Блестящий детектив расследует серию загадочных преступлений в городе. Каждая улика ведет к новым тайнам, а время неумолимо истекает.',
    previewImage: 'https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: '',
    price: 199,
    isPaid: true,
  },
  {
    id: '3',
    title: 'Комедия года',
    description: 'Уморительная история о друзьях, которые решили организовать идеальную вечеринку, но все пошло не по плану. Смех гарантирован!',
    previewImage: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: '',
    price: 0,
    isPaid: false,
  },
  {
    id: '4',
    title: 'Драма сердец',
    description: 'Трогательная история о семье, переживающей трудные времена. Фильм о любви, прощении и силе человеческого духа.',
    previewImage: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: '',
    price: 149,
    isPaid: true,
  },
  {
    id: '5',
    title: 'Боевик: Возмездие',
    description: 'Захватывающий боевик о агенте спецслужб, который выходит на охоту за международной преступной организацией. Невероятные трюки и спецэффекты!',
    previewImage: 'https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: '',
    price: 0,
    isPaid: false,
  },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 't1',
    movieTitle: 'Звездный путь',
    date: '2024-03-20',
    time: '20:30',
    row: 5,
    seat: 12,
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 't2',
    movieTitle: 'Таинственный детектив',
    date: '2024-03-18',
    time: '18:00',
    row: 8,
    seat: 7,
    poster: 'https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 't3',
    movieTitle: 'Драма сердец',
    date: '2024-03-15',
    time: '17:30',
    row: 3,
    seat: 15,
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];
