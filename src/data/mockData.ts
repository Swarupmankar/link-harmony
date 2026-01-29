export interface UrlItem {
  id: string;
  url: string;
  title: string;
  status: "pending" | "downloaded" | "scraped";
  addedAt: Date;
  thumbnail?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  files: FileItem[];
  isExpanded: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  content: string;
}

export interface StatsData {
  totalLinks: number;
  downloaded: number;
  scraped: number;
  pending: number;
  dailyLinks: { day: string; count: number }[];
}

export const mockUrls: UrlItem[] = [
  {
    id: "1",
    url: "https://example.com/article/how-to-build-apps",
    title: "How to Build Modern Web Applications",
    status: "scraped",
    addedAt: new Date(Date.now() - 86400000 * 2),
    thumbnail: "https://picsum.photos/seed/1/200/150",
  },
  {
    id: "2",
    url: "https://medium.com/design-patterns",
    title: "Design Patterns in Frontend Development",
    status: "downloaded",
    addedAt: new Date(Date.now() - 86400000),
    thumbnail: "https://picsum.photos/seed/2/200/150",
  },
  {
    id: "3",
    url: "https://dev.to/react-best-practices",
    title: "React Best Practices for 2024",
    status: "pending",
    addedAt: new Date(),
    thumbnail: "https://picsum.photos/seed/3/200/150",
  },
  {
    id: "4",
    url: "https://css-tricks.com/modern-css",
    title: "Modern CSS Techniques You Should Know",
    status: "downloaded",
    addedAt: new Date(Date.now() - 86400000 * 3),
    thumbnail: "https://picsum.photos/seed/4/200/150",
  },
  {
    id: "5",
    url: "https://smashingmagazine.com/ux-tips",
    title: "UX Tips for Mobile Applications",
    status: "pending",
    addedAt: new Date(Date.now() - 43200000),
    thumbnail: "https://picsum.photos/seed/5/200/150",
  },
];

export const mockStats: StatsData = {
  totalLinks: 3255,
  downloaded: 1245,
  scraped: 666,
  pending: 1344,
  dailyLinks: [
    { day: "Mon", count: 45 },
    { day: "Tue", count: 62 },
    { day: "Wed", count: 38 },
    { day: "Thu", count: 71 },
    { day: "Fri", count: 55 },
    { day: "Sat", count: 28 },
    { day: "Sun", count: 33 },
  ],
};

export const mockFolders: FolderItem[] = [
  {
    id: "1",
    name: "Development Resources",
    isExpanded: true,
    files: [
      { id: "f1", name: "React Notes.txt", content: "React hooks and patterns..." },
      { id: "f2", name: "CSS Tips.txt", content: "Modern CSS techniques..." },
    ],
  },
  {
    id: "2",
    name: "Design Inspiration",
    isExpanded: false,
    files: [
      { id: "f3", name: "Color Palettes.txt", content: "Warm beige tones..." },
    ],
  },
  {
    id: "3",
    name: "Articles to Read",
    isExpanded: false,
    files: [],
  },
];

export const mockProfile = {
  username: "LinkCollector",
  avatar: null,
  totalLinks: 3255,
  joinedDate: "January 2024",
};
