'use client';

import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/store/useTimerStore';
import { useSessionStore } from '@/store/useSessionStore';
import { generateScramble } from '@/lib/scramble';
import { formatTime } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Timer() {
  const {
    isRunning,
    isReady,
    currentTime,
    setRunning,
    setReady,
    setStartTime,
    setCurrentTime,
    reset,
  } = useTimerStore();

  const {
    currentSessionId,
    currentScramble,
    currentPuzzleType,
    setScramble,
    addSolve,
    sessions,
    createSession,
    setCurrentSession,
  } = useSessionStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Create default session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createSession('Default Session', '3x3');
    } else if (!currentSessionId) {
      setCurrentSession(sessions[0].id);
    }
  }, [sessions, currentSessionId, createSession, setCurrentSession]);

  // Generate initial scramble
  useEffect(() => {
    if (!currentScramble) {
      generateScramble(currentPuzzleType).then(setScramble);
    }
  }, [currentPuzzleType, currentScramble, setScramble]);

  // Timer logic
  useEffect(() => {
    if (isRunning && startTimeRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(Date.now() - startTimeRef.current!);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, setCurrentTime]);

  const handleSpacePress = () => {
    if (!isReady && !isRunning) {
      // Start ready state
      setReady(true);
    } else if (isReady && !isRunning) {
      // Start timer
      setReady(false);
      setRunning(true);
      startTimeRef.current = Date.now();
      setStartTime(startTimeRef.current);
    } else if (isRunning) {
      // Stop timer
      setRunning(false);
      if (currentTime > 0) {
        // Use current session or first available session
        const sessionId = currentSessionId || (sessions.length > 0 ? sessions[0].id : null);
        if (sessionId) {
          addSolve({
            time: currentTime,
            scramble: currentScramble,
            puzzleType: currentPuzzleType,
            sessionId: sessionId,
          });
        }
      }
      // Generate new scramble
      generateScramble(currentPuzzleType).then(setScramble);
    }
  };

  const handleSpaceRelease = () => {
    if (isReady) {
      setReady(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        handleSpacePress();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        handleSpaceRelease();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isReady, isRunning]);

  // Focus the timer area when component mounts
  useEffect(() => {
    const timerElement = document.querySelector('[tabindex="0"]') as HTMLElement;
    if (timerElement) {
      timerElement.focus();
    }
  }, []);

  const getTimerColor = () => {
    if (isReady) return 'text-yellow-500 animate-pulse';
    if (isRunning) return 'text-green-500';
    return 'text-gray-500';
  };

  const getTimerText = () => {
    if (isReady) return 'Ready...';
    if (isRunning) return formatTime(currentTime);
    return 'Hold spacebar to start';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div 
          className="text-center space-y-8 focus:outline-none cursor-pointer" 
          tabIndex={0}
          onClick={() => {
            // Focus the timer area when clicked
            (document.activeElement as HTMLElement)?.blur();
            setTimeout(() => {
              (document.querySelector('[tabindex="0"]') as HTMLElement)?.focus();
            }, 0);
          }}
          onKeyDown={(e) => {
            if (e.code === 'Space') {
              e.preventDefault();
              e.stopPropagation();
              handleSpacePress();
            }
          }}
          onKeyUp={(e) => {
            if (e.code === 'Space') {
              e.preventDefault();
              e.stopPropagation();
              handleSpaceRelease();
            }
          }}
        >
          {/* Timer Display */}
          <div className="space-y-4">
            <div
              className={`text-6xl md:text-8xl font-mono font-bold transition-all duration-300 ${getTimerColor()}`}
            >
              {getTimerText()}
            </div>
            <div className="text-sm text-gray-500">
              {isReady && 'Release spacebar to start'}
              {isRunning && 'Press spacebar to stop'}
              {!isReady && !isRunning && 'Hold spacebar to ready'}
            </div>
          </div>

          {/* Manual Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleSpacePress}
              onMouseUp={handleSpaceRelease}
              variant={isReady ? 'destructive' : isRunning ? 'destructive' : 'default'}
              size="lg"
              className="px-8 transition-all duration-200 hover:scale-105"
            >
              {isReady ? 'Release to Start' : isRunning ? 'Stop' : 'Ready'}
            </Button>
            <Button
              onClick={() => {
                reset();
                generateScramble(currentPuzzleType).then(setScramble);
              }}
              variant="outline"
              size="lg"
              className="transition-all duration-200 hover:scale-105"
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
