export const ColorPalette = [
  {
    name: 'Sky Blue',
    hex: '#4A90E2',
    bg: '#D0E4FA',
    dark: {
      hex: '#2B6CB0',
      bg: '#2C3E50',
    },
  },
  {
    name: 'Coral Red',
    hex: '#FF6B6B',
    bg: '#FFE3E3',
    dark: {
      hex: '#CC3C3C',
      bg: '#442A2A',
    },
  },
  {
    name: 'Lemon Yellow',
    hex: '#F7D154',
    bg: '#FFF7D1',
    dark: {
      hex: '#C2A520',
      bg: '#4D4422',
    },
  },
  {
    name: 'Mint Green',
    hex: '#3DDC97',
    bg: '#D2F8E4',
    dark: {
      hex: '#249D70',
      bg: '#1D3F33',
    },
  },
  {
    name: 'Lavender',
    hex: '#A78BFA',
    bg: '#E8E1FE',
    dark: {
      hex: '#6C5BCC',
      bg: '#3C3653',
    },
  },
  {
    name: 'Peach Orange',
    hex: '#FFA06A',
    bg: '#FFE7D6',
    dark: {
      hex: '#CC6A35',
      bg: '#4A382E',
    },
  },
  {
    name: 'Sky Teal',
    hex: '#5CC8D7',
    bg: '#D6F5F9',
    dark: {
      hex: '#2B99A6',
      bg: '#2D4447',
    },
  },
  {
    name: 'Rose Pink',
    hex: '#FF8FAB',
    bg: '#FFE4ED',
    dark: {
      hex: '#CC5A7D',
      bg: '#4A2F3B',
    },
  },
  {
    name: 'Soft Violet',
    hex: '#B980F2',
    bg: '#F1E3FD',
    dark: {
      hex: '#8651C8',
      bg: '#3D3552',
    },
  },
  {
    name: 'Apple Green',
    hex: '#A3E635',
    bg: '#F0FBCF',
    dark: {
      hex: '#6FA60D',
      bg: '#394429',
    },
  },
  {
    name: 'Cobalt Blue',
    hex: '#3B82F6',
    bg: '#D4E7FD',
    dark: {
      hex: '#1E60C2',
      bg: '#2C3B59',
    },
  },
  {
    name: 'Warm Sand',
    hex: '#E2B07A',
    bg: '#F8E9D4',
    dark: {
      hex: '#B57E49',
      bg: '#4D4032',
    },
  },
  {
    name: 'Cool Gray',
    hex: '#9CA3AF',
    bg: '#E5E7EB',
    dark: {
      hex: '#6B7280',
      bg: '#2C2F36',
    },
  },
  {
    name: 'Plum Purple',
    hex: '#9F7AEA',
    bg: '#E6DCFD',
    dark: {
      hex: '#6B4BC7',
      bg: '#3D3455',
    },
  },
  {
    name: 'Cherry Red',
    hex: '#EF4444',
    bg: '#FDE2E2',
    dark: {
      hex: '#B91C1C',
      bg: '#4B2A2A',
    },
  },
] as const;

export type ColorEntry = (typeof ColorPalette)[number];
type Mode = 'light' | 'dark';
type ColorType = 'hex' | 'bg';

export function isDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getCurrentColors(): { hex: string; bg: string }[] {
  const darkMode = isDarkMode();
  return ColorPalette.map((color) => {
    return darkMode ? { hex: color.dark.hex, bg: color.dark.bg } : { hex: color.hex, bg: color.bg };
  });
}

export function getColorsByType(type: ColorType): string[] {
  const dark = isDarkMode();
  return ColorPalette.map((color) => {
    if (type === 'hex') {
      return dark ? color.dark.hex : color.hex;
    } else {
      return dark ? color.dark.bg : color.bg;
    }
  });
}

export function getColorIndexFromHex(hexCode: string | undefined): number {
  if (!hexCode) {
    return 0;
  }

  const lowerHex = hexCode.toLowerCase();

  return ColorPalette.findIndex(
    (color) =>
      color.hex.toLowerCase() === lowerHex ||
      color.bg.toLowerCase() === lowerHex ||
      color.dark.hex.toLowerCase() === lowerHex ||
      color.dark.bg.toLowerCase() === lowerHex,
  );
}

export function getColorByIndex(index: number | undefined, type: ColorType = 'hex'): string | undefined {
  if (index === undefined) return undefined;

  const color = ColorPalette[index];
  const darkMode = isDarkMode();
  if (!color) return undefined;

  if (darkMode) {
    return type === 'hex' ? color.dark.hex : color.dark.bg;
  } else {
    return type === 'hex' ? color.hex : color.bg;
  }
}

export function getStandardBackground(type: ColorType = 'hex'): string {
  if (isDarkMode()) {
    return type === 'hex' ? '#fff' : 'var(--joy-palette-neutral-800, #171A1C)';
  } else {
    return type === 'hex' ? '#000' : 'var(--joy-palette-neutral-100, #F0F4F8)';
  }
}
