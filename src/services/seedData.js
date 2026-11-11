export const CATEGORIES = [
  'All',
  'Technical',
  'Cultural',
  'Sports',
  'Workshop'
];

export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'HackCampus 2026: 24-Hour Hackathon',
    category: 'Technical',
    description: 'Join over 300 passionate student developers, designers, and innovators for 24 hours of hacking, building, and learning! Free food, swag packs, hardware lab access, and $5,000 in prizes await. Mentors from top tech companies will be on-site to assist your team.',
    date: '2026-11-20',
    startTime: '10:00 AM',
    endTime: '10:00 AM (Next Day)',
    venue: 'Student Activity Center, Great Hall',
    organizer: 'Computer Science & ACM Student Chapter',
    capacity: 250,
    registeredCount: 184,
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Hackathon', 'Coding', 'Prizes', 'Teamwork'],
    isFeatured: true,
    createdAt: '2026-11-01T08:00:00Z'
  },
  {
    id: 'evt-2',
    title: 'Autumn Beats: Inter-College Music Fest',
    category: 'Cultural',
    description: 'An electrifying evening of indie bands, acoustic solos, and collegiate beatbox battles. Special guest performances by alumni bands and outdoor food truck court on the central lawn. Bring your friends and student ID!',
    date: '2026-11-22',
    startTime: '05:30 PM',
    endTime: '10:00 PM',
    venue: 'Open Air Amphitheatre',
    organizer: 'Campus Cultural Council',
    capacity: 600,
    registeredCount: 412,
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    tags: ['Music', 'Concert', 'Live Bands', 'Social'],
    isFeatured: true,
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'evt-3',
    title: 'Mastering AI & Large Language Models Workshop',
    category: 'Workshop',
    description: 'Hands-on workshop introducing prompt engineering, fine-tuning lightweight models, and building agentic AI applications with modern frameworks. Prerequisite: Basic Python understanding. Please bring your laptop with VS Code installed.',
    date: '2026-11-18',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    venue: 'Turing Computing Lab, Room 302',
    organizer: 'AI & Data Science Student Society',
    capacity: 60,
    registeredCount: 58,
    bannerUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI', 'Python', 'Machine Learning', 'Hands-on'],
    isFeatured: false,
    createdAt: '2026-11-04T12:00:00Z'
  },
  {
    id: 'evt-4',
    title: 'Inter-Departmental Football Championship',
    category: 'Sports',
    description: 'Cheer for your department in the grand finals of the Annual Football Cup! High-energy knockouts, halftime performances by the university cheer squad, and trophy ceremony.',
    date: '2026-11-25',
    startTime: '04:00 PM',
    endTime: '07:30 PM',
    venue: 'University Sports Complex Main Arena',
    organizer: 'Department of Physical Education',
    capacity: 400,
    registeredCount: 195,
    bannerUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    tags: ['Football', 'Tournament', 'Sports', 'Championship'],
    isFeatured: false,
    createdAt: '2026-11-05T09:00:00Z'
  },
  {
    id: 'evt-5',
    title: 'Hands-On Full-Stack Web Development Workshop',
    category: 'Workshop',
    description: 'Build and deploy a full-stack interactive application from scratch using React and modern serverless architectures. Mentorship by senior alumni software engineers.',
    date: '2026-11-28',
    startTime: '10:00 AM',
    endTime: '04:30 PM',
    venue: 'Campus Convention Center, Lab 4',
    organizer: 'Developer Student Club',
    capacity: 80,
    registeredCount: 45,
    bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Workshop', 'WebDev', 'React', 'Hands-on'],
    isFeatured: true,
    createdAt: '2026-11-06T14:00:00Z'
  },
  {
    id: 'evt-6',
    title: 'Robotics & Autonomous Drones Showcase',
    category: 'Technical',
    description: 'Experience live obstacle navigation, autonomous drone racing, and humanoid robotic demonstrations developed by senior engineering students. Interactive robotics station available for attendees to test manual drone flight.',
    date: '2026-12-02',
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    venue: 'Robotics Mechatronics Arena, Hall 1',
    organizer: 'Robotics & Hardware Club',
    capacity: 120,
    registeredCount: 110,
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Robotics', 'Hardware', 'Drones', 'Innovation'],
    isFeatured: false,
    createdAt: '2026-11-07T11:00:00Z'
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    id: 'reg-demo-1',
    eventId: 'evt-1',
    userId: 'student-default',
    studentName: 'Alex Morgan',
    studentEmail: 'alex.morgan@campus.edu',
    studentRoll: 'CS-2023-042',
    registeredAt: '2026-11-08T10:15:00Z'
  },
  {
    id: 'reg-demo-2',
    eventId: 'evt-3',
    userId: 'student-default',
    studentName: 'Alex Morgan',
    studentEmail: 'alex.morgan@campus.edu',
    studentRoll: 'CS-2023-042',
    registeredAt: '2026-11-09T14:30:00Z'
  }
];

export const INITIAL_BOOKMARKS = ['evt-2', 'evt-5'];
