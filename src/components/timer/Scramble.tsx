'use client';

import { useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { generateScramble } from '@/lib/scramble';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PuzzleType } from '@/types';
import { RefreshCw } from 'lucide-react';

export default function Scramble() {
  const {
    currentScramble,
    currentPuzzleType,
    setScramble,
    setPuzzleType,
  } = useSessionStore();

  const [isGenerating, setIsGenerating] = useState(false);

  const handlePuzzleTypeChange = async (puzzleType: PuzzleType) => {
    setPuzzleType(puzzleType);
    setIsGenerating(true);
    const scramble = await generateScramble(puzzleType);
    setScramble(scramble);
    setIsGenerating(false);
  };

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    const scramble = await generateScramble(currentPuzzleType);
    setScramble(scramble);
    setIsGenerating(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            Scramble
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={currentPuzzleType} onValueChange={handlePuzzleTypeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2x2">2x2</SelectItem>
                <SelectItem value="3x3">3x3</SelectItem>
                <SelectItem value="4x4">4x4</SelectItem>
                <SelectItem value="5x5">5x5</SelectItem>
                <SelectItem value="pyraminx">Pyraminx</SelectItem>
                <SelectItem value="megaminx">Megaminx</SelectItem>
                <SelectItem value="skewb">Skewb</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerateNew}
              disabled={isGenerating}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-center">
            <div className="text-lg font-mono text-gray-800 dark:text-gray-200 break-all">
              {currentScramble || 'Generating scramble...'}
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Click the refresh button or change puzzle type to generate a new scramble
        </div>
      </CardContent>
    </Card>
  );
}
