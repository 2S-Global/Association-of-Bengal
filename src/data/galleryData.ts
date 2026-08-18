// src/data/galleryData.ts

export interface GalleryItem {
  id: string;
  title: string;
  category: "Festivals" | "Exhibitions" | "Corporate";
  year: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  album: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    title: "Press Conference on Cultural Restoration",
    category: "Corporate",
    year: "2026",
    location: "Kolkata Press Club",
    imageUrl: "/gallery/kolkataPressClub1.jpg",
    imageAlt: "A press conference panel at Kolkata Press Club discussing literature, culture, and submitting a memorandum.",
    album: "Kolkata Press Club Meet",
  },
  {
    id: "2",
    title: "Panelists Addressing the Media",
    category: "Corporate",
    year: "2026",
    location: "Kolkata Press Club",
    imageUrl: "/gallery/kolkataPressClub2.jpg",
    imageAlt: "Speakers and media personnel gathered during an event at Kolkata Press Club.",
    album: "Kolkata Press Club Meet",
  },
  {
    id: "3",
    title: "Cultural Discussion & Memorandum Presentation",
    category: "Corporate",
    year: "2026",
    location: "Kolkata Press Club",
    imageUrl: "/gallery/kolkataPressClub3.jpg",
    imageAlt: "A focused view of the discussion panel under the Press Club Kolkata banner.",
    album: "Kolkata Press Club Meet",
  },
  {
    id: "4",
    title: "Media Gathering at Press Club",
    category: "Corporate",
    year: "2026",
    location: "Kolkata Press Club",
    imageUrl: "/gallery/kolkataPressClub4.jpg",
    imageAlt: "An interactive session with members and attendees at Kolkata Press Club.",
    album: "Kolkata Press Club Meet",
  },
  {
    id: "5",
    title: "Dr. Syama Prasad Mookerjee 125th Birth Anniversary",
    category: "Festivals",
    year: "2026",
    location: "Ramamohan Hall",
    imageUrl: "/gallery/dr1.jpg",
    imageAlt: "Stage setup and gathering for the 125th birth anniversary celebration.",
    album: "Dr. Syama Prasad Mookerjee Jayanti",
  },
  {
    id: "6",
    title: "Dr. Syama Prasad Mookerjee 125th Birth Anniversary",
    category: "Festivals",
    year: "2026",
    location: "Ramamohan Hall",
    imageUrl: "/gallery/dr2.jpg",
    imageAlt: "Honored guests and speakers on stage during the birth anniversary event.",
    album: "Dr. Syama Prasad Mookerjee Jayanti",
  },
  {
    id: "7",
    title: "Dr. Syama Prasad Mookerjee 125th Birth Anniversary",
    category: "Festivals",
    year: "2026",
    location: "Ramamohan Hall",
    imageUrl: "/gallery/dr3.jpg",
    imageAlt: "Speakers addressing the audience during the commemorative event.",
    album: "Dr. Syama Prasad Mookerjee Jayanti",
  },
  {
    id: "8",
    title: "Dr. Syama Prasad Mookerjee 125th Birth Anniversary",
    category: "Festivals",
    year: "2026",
    location: "Ramamohan Hall",
    imageUrl: "/gallery/dr4.jpg",
    imageAlt: "Event banner for the 125th birth anniversary celebration.",
    album: "Dr. Syama Prasad Mookerjee Jayanti",
  },
  {
    id: "9",
    title: "Dr. Syama Prasad Mookerjee 125th Birth Anniversary",
    category: "Festivals",
    year: "2026",
    location: "Ramamohan Hall",
    imageUrl: "/gallery/dr5.jpg",
    imageAlt: "Attendees and organization members participating in the program.",
    album: "Dr. Syama Prasad Mookerjee Jayanti",
  },
  {
    id: "10",
    title: "Panelists Addressing the Media",
    category: "Corporate",
    year: "2026",
    location: "Kolkata Press Club",
    imageUrl: "/gallery/kolkataPressClub5.jpg",
    imageAlt: "Speakers and media personnel gathered during an event at Kolkata Press Club.",
    album: "Kolkata Press Club Meet",
  },
];