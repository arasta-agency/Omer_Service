export interface IraqProvincePlate {
  code: string;
  nameKrd: string;
  nameAr: string;
  nameEn: string;
  isKurdistanRegion: boolean;
  mark?: string; // e.g. "KR"
}

export const IRAQ_PLATE_PROVINCES: IraqProvincePlate[] = [
  // Kurdistan Region (features an additional "KR" mark)
  {
    code: '21',
    nameKrd: 'سلێمانی',
    nameAr: 'السليمانية',
    nameEn: 'Sulaymaniyah',
    isKurdistanRegion: true,
    mark: 'KR',
  },
  {
    code: '22',
    nameKrd: 'هەولێر',
    nameAr: 'أربيل',
    nameEn: 'Erbil',
    isKurdistanRegion: true,
    mark: 'KR',
  },
  {
    code: '23',
    nameKrd: 'هەڵەبجە',
    nameAr: 'حلبجة',
    nameEn: 'Halabja',
    isKurdistanRegion: true,
    mark: 'KR',
  },
  {
    code: '24',
    nameKrd: 'دهۆک',
    nameAr: 'دهوك',
    nameEn: 'Duhok',
    isKurdistanRegion: true,
    mark: 'KR',
  },

  // Federal Iraqi Governorates
  {
    code: '11',
    nameKrd: 'بەغداد',
    nameAr: 'بغداد',
    nameEn: 'Baghdad',
    isKurdistanRegion: false,
  },
  {
    code: '12',
    nameKrd: 'نەینەوا (مووسڵ)',
    nameAr: 'نينوى',
    nameEn: 'Nineveh',
    isKurdistanRegion: false,
  },
  {
    code: '13',
    nameKrd: 'میسان',
    nameAr: 'ميسان',
    nameEn: 'Maysan',
    isKurdistanRegion: false,
  },
  {
    code: '14',
    nameKrd: 'بەسرە',
    nameAr: 'البصرة',
    nameEn: 'Basra',
    isKurdistanRegion: false,
  },
  {
    code: '15',
    nameKrd: 'ئەنبار',
    nameAr: 'الأنبار',
    nameEn: 'Anbar',
    isKurdistanRegion: false,
  },
  {
    code: '16',
    nameKrd: 'قادسیە (دیوانیە)',
    nameAr: 'القادسية',
    nameEn: 'Qadissiyyah',
    isKurdistanRegion: false,
  },
  {
    code: '17',
    nameKrd: 'موسەننا',
    nameAr: 'المثنى',
    nameEn: 'Muthanna',
    isKurdistanRegion: false,
  },
  {
    code: '18',
    nameKrd: 'بابل',
    nameAr: 'بابل',
    nameEn: 'Babylon',
    isKurdistanRegion: false,
  },
  {
    code: '19',
    nameKrd: 'کەربەلا',
    nameAr: 'كربلاء',
    nameEn: 'Karbala',
    isKurdistanRegion: false,
  },
  {
    code: '20',
    nameKrd: 'دیالە',
    nameAr: 'ديالى',
    nameEn: 'Diyala',
    isKurdistanRegion: false,
  },
];

/**
 * Detect province from starting numbers of plate text (e.g. "21 H 11111" -> code "21")
 */
export function detectProvinceFromPlateString(plateString: string): IraqProvincePlate | null {
  const trimmed = plateString.trim();
  const match = trimmed.match(/^(\d{2})\b/);
  if (match) {
    const code = match[1];
    return IRAQ_PLATE_PROVINCES.find((p) => p.code === code) || null;
  }
  return null;
}

export function findProvinceByCode(code: string): IraqProvincePlate | undefined {
  return IRAQ_PLATE_PROVINCES.find((p) => p.code === code);
}

export function findProvinceByName(name: string): IraqProvincePlate | undefined {
  const norm = name.trim().toLowerCase();
  return IRAQ_PLATE_PROVINCES.find(
    (p) =>
      p.nameKrd.toLowerCase().includes(norm) ||
      p.nameAr.toLowerCase().includes(norm) ||
      p.nameEn.toLowerCase().includes(norm) ||
      norm.includes(p.nameKrd.toLowerCase())
  );
}
