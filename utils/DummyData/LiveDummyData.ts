interface CardItem {
  id: string;
  title: string;
  views: number;
  isLive: boolean;
  imageUri: string;
}

export const cardItems: CardItem[] = [
  {
    id: '1',
    title: 'Live Football Match',
    views: 12000,
    isLive: true,
    imageUri: 'https://picsum.photos/id/237/200/300',
  },
  {
    id: '2',
    title: 'Fashion Week Highlights',
    views: 8500,
    isLive: false,
    imageUri: 'https://picsum.photos/seed/picsum/200/300',
  },
  {
    id: '3',
    title: 'Comedy Night Special',
    views: 6200,
    isLive: true,
    imageUri: 'https://picsum.photos/200/300?grayscale',
  },
  {
    id: '4',
    title: 'Tech Conference 2025',
    views: 4300,
    isLive: false,
    imageUri: 'https://picsum.photos/200/300/?blur',
  },
  {
    id: '5',
    title: 'Cooking Show: Gourmet Edition',
    views: 9700,
    isLive: true,
    imageUri:
      'https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=GDjZ2uNWE3V59PkdDaOzTOuV3tPWWxJSf4fNcxu4S2g',
  },
];

export default cardItems;
