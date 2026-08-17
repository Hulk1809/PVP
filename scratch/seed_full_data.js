// Standalone seed script to populate cloud database with 100% complete tournament data
const https = require('https');

// Helper to generate IDs and matches
const DEFAULT_BRACKETS = {
  'bracket-a': {
    id: 'bracket-a',
    name: 'Bảng A (Tối Thượng > 50)',
    divisionTitle: 'Hải Thần Truyền Nhân',
    tierName: 'Tối Thượng > 50',
    theme: 'ocean',
    posterUrl: '/assets/poster_a.jpg',
    description: 'Quy tụ các bậc cường giả đỉnh cao phân khúc Tối Thượng > 50.',
    primaryColor: '#06b6d4',
    accentColor: '#f59e0b',
    status: 'in_progress',
    totalRounds: 4,
  },
  'bracket-b': {
    id: 'bracket-b',
    name: 'Bảng B (Tối Thượng < 10)',
    divisionTitle: 'Sâm Lâm Bá Chủ',
    tierName: 'Tối Thượng < 10',
    theme: 'forest',
    posterUrl: '/assets/poster_b.jpg',
    description: 'Sân đấu của các chiến tướng phân khúc Tối Thượng < 10.',
    primaryColor: '#10b981',
    accentColor: '#ef4444',
    status: 'in_progress',
    totalRounds: 4,
  },
  'bracket-c': {
    id: 'bracket-c',
    name: 'Bảng C (Rực Rỡ Trở Xuống)',
    divisionTitle: 'Sử Lai Khắc Tân Tinh',
    tierName: 'Rực Rỡ Trở Xuống',
    theme: 'village',
    posterUrl: '/assets/poster_c.jpg',
    description: 'Vũ đài nhiệt huyết dành cho 34 tuyển thủ phân khúc Rực Rỡ Trở Xuống.',
    primaryColor: '#84cc16',
    accentColor: '#f8fafc',
    status: 'in_progress',
    totalRounds: 6,
  },
};

console.log('Seed generator ready');
