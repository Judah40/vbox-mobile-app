import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  FontAwesome,
  Feather,
} from '@expo/vector-icons';

type data = {
  title: string;
  id: number;
  icon: string;
  iconSet:
    | 'MaterialIcons'
    | 'Ionicons'
    | 'FontAwesome5'
    | 'MaterialCommunityIcons'
    | 'AntDesign'
    | 'Entypo'
    | 'FontAwesome'
    | 'Feather';
};

export const data: data[] = [
  {
    id: 1,
    title: 'fashion',
    icon: 'content-cut',
    iconSet: 'MaterialIcons',
  },
  {
    id: 2,
    title: 'comedy',
    icon: 'theater-comedy',
    iconSet: 'MaterialIcons',
  },
  {
    id: 3,
    title: 'Music',
    icon: 'headphones',
    iconSet: 'FontAwesome5',
  },
  {
    id: 4,
    title: 'sports',
    icon: 'basketball',
    iconSet: 'Ionicons',
  },
  {
    id: 5,
    title: 'lifestyle',
    icon: 'leaf',
    iconSet: 'FontAwesome',
  },
  {
    id: 6,
    title: 'documentaries',
    icon: 'video-library',
    iconSet: 'MaterialIcons',
  },
  {
    id: 7,
    title: 'tech',
    icon: 'laptop-code',
    iconSet: 'FontAwesome5',
  },
  {
    id: 8,
    title: 'news',
    icon: 'newspaper',
    iconSet: 'Ionicons',
  },
  {
    id: 9,
    title: 'films',
    icon: 'film',
    iconSet: 'Feather',
  },
  {
    id: 10,
    title: 'tv shows',
    icon: 'youtube-tv',
    iconSet: 'MaterialCommunityIcons',
  },
  {
    id: 11,
    title: 'podcasts',
    icon: 'podcast',
    iconSet: 'FontAwesome5',
  },
  {
    id: 12,
    title: 'personal development',
    icon: 'brain',
    iconSet: 'FontAwesome5',
  },
  {
    id: 13,
    title: 'adult education',
    icon: 'school',
    iconSet: 'MaterialIcons',
  },
  {
    id: 14,
    title: 'health & fitness',
    icon: 'fitness-center',
    iconSet: 'MaterialIcons',
  },
  {
    id: 15,
    title: 'tv series',
    icon: 'playlist-play',
    iconSet: 'MaterialCommunityIcons',
  },
  {
    id: 16,
    title: 'kids entertainment',
    icon: 'toys',
    iconSet: 'MaterialIcons',
  },
  {
    id: 17,
    title: 'kids education',
    icon: 'child',
    iconSet: 'FontAwesome',
  },
  {
    id: 18,
    title: 'culture and tradition',
    icon: 'globe',
    iconSet: 'FontAwesome',
  },
  {
    id: 19,
    title: 'international',
    icon: 'language',
    iconSet: 'MaterialIcons',
  },
];

// Example of how to use these icons in your component
export const renderCategoryIcon = (item: data, isSelected: boolean) => {
  const color = isSelected ? 'white' : 'gray';
  const size = 20;

  switch (item.iconSet) {
    case 'MaterialIcons':
      return <MaterialIcons name={item.icon as any} size={size} color={color} />;
    case 'Ionicons':
      return <Ionicons name={item.icon as any} size={size} color={color} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={item.icon as any} size={size} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={item.icon as any} size={size} color={color} />;
    case 'AntDesign':
      return <AntDesign name={item.icon as any} size={size} color={color} />;
    case 'Entypo':
      return <Entypo name={item.icon as any} size={size} color={color} />;
    case 'FontAwesome':
      return <FontAwesome name={item.icon as any} size={size} color={color} />;
    case 'Feather':
      return <Feather name={item.icon as any} size={size} color={color} />;
    default:
      return <MaterialIcons name="category" size={size} color={color} />;
  }
};
