import { PuzzleType } from '@/types';

// Scramble generation for different puzzle types
const CUBE_MOVES = {
  '2x2': ['R', 'U', 'F'],
  '3x3': ['R', 'L', 'U', 'D', 'F', 'B'],
  '4x4': ['R', 'L', 'U', 'D', 'F', 'B', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw'],
  '5x5': ['R', 'L', 'U', 'D', 'F', 'B', 'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw'],
  'pyraminx': ['U', 'L', 'R', 'B'],
  'megaminx': ['R', 'D'],
  'skewb': ['R', 'L', 'U', 'B'],
};

const MODIFIERS = ['', "'", '2'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateScrambleForType(puzzleType: PuzzleType, length: number): string {
  const moves = CUBE_MOVES[puzzleType] || CUBE_MOVES['3x3'];
  const scramble: string[] = [];
  let lastMove = '';

  for (let i = 0; i < length; i++) {
    let move: string;
    do {
      move = getRandomElement(moves);
    } while (move === lastMove); // Avoid consecutive same moves

    const modifier = getRandomElement(MODIFIERS);
    scramble.push(move + modifier);
    lastMove = move;
  }

  return scramble.join(' ');
}

export async function generateScramble(puzzleType: PuzzleType): Promise<string> {
  // Simulate async operation for consistency with original API
  return new Promise((resolve) => {
    setTimeout(() => {
      const scrambleLengths = {
        '2x2': 9,
        '3x3': 20,
        '4x4': 40,
        '5x5': 60,
        'pyraminx': 10,
        'megaminx': 7,
        'skewb': 9,
      };
      
      const length = scrambleLengths[puzzleType] || 20;
      const scramble = generateScrambleForType(puzzleType, length);
      resolve(scramble);
    }, 10);
  });
}

export function getPuzzleDisplayName(puzzleType: PuzzleType): string {
  const displayNames: Record<PuzzleType, string> = {
    '2x2': '2x2 Cube',
    '3x3': '3x3 Cube',
    '4x4': '4x4 Cube',
    '5x5': '5x5 Cube',
    'pyraminx': 'Pyraminx',
    'megaminx': 'Megaminx',
    'skewb': 'Skewb',
  };
  return displayNames[puzzleType];
}
