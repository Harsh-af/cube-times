'use client';

import { useEffect, useRef, useCallback } from 'react';
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
    isFullscreen,
    setRunning,
    setReady,
    setStartTime,
    setCurrentTime,
    setFullscreen,
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
  const lastKeyPressRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  // Set current session if none is selected
  useEffect(() => {
    if (sessions.length > 0 && !currentSessionId) {
      setCurrentSession(sessions[0].id);
    }
  }, [sessions, currentSessionId, setCurrentSession]);

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

  const handleSpacePress = useCallback(() => {
    // Prevent multiple simultaneous executions
    if (isProcessingRef.current) {
      return;
    }
    
    const now = Date.now();
    // Debounce: prevent multiple rapid presses within 200ms
    if (now - lastKeyPressRef.current < 200) {
      return;
    }
    
    isProcessingRef.current = true;
    lastKeyPressRef.current = now;

    if (!isReady && !isRunning && currentTime === 0) {
      // Start ready state - timer shows 0.00
      setReady(true);
      setCurrentTime(0);
      setFullscreen(true); // Enter fullscreen mode
    } else if (isRunning) {
      // Stop timer and record solve
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
      setFullscreen(false); // Exit fullscreen mode after stopping
    } else if (!isReady && !isRunning && currentTime > 0) {
      // Reset timer after showing final time
      setCurrentTime(0);
      setFullscreen(false); // Exit fullscreen mode after reset
    }
    
    // Reset processing flag after a short delay
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 100);
  }, [isReady, isRunning, currentTime, currentSessionId, sessions, addSolve, currentScramble, currentPuzzleType, setScramble, setReady, setRunning, setCurrentTime, setFullscreen]);

  const handleSpaceRelease = useCallback(() => {
    if (isReady) {
      // Release spacebar - start timer immediately
      setReady(false);
      setRunning(true);
      startTimeRef.current = Date.now();
      setStartTime(startTimeRef.current);
    }
  }, [isReady, setReady, setRunning, setStartTime]);

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
  }, [handleSpacePress, handleSpaceRelease]);

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
    if (isReady) return '0.00';
    if (isRunning) return formatTime(currentTime);
    if (currentTime > 0) return formatTime(currentTime); // Show final time after stopping
    return 'Hold spacebar to start';
  };

  // Fullscreen timer component
  if (isFullscreen) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center transition-all duration-500 ease-in-out"
        tabIndex={0}
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
        {/* Fullscreen Timer Display */}
        <div className="text-center">
          <div
            className={`font-mono font-bold transition-all duration-300 ${getTimerColor()}`}
            style={{ fontSize: 'clamp(8rem, 20vw, 16rem)' }}
          >
            {getTimerText()}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-base mt-8">
            {isReady && 'Release spacebar to start'}
            {isRunning && 'Press spacebar to stop'}
            {!isReady && !isRunning && currentTime > 0 && 'Press spacebar to reset'}
          </div>
        </div>
      </div>
    );
  }

  // Regular timer component
  return (
    <Card className="w-full max-w-4xl mx-auto">
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
              className={`font-mono font-bold transition-all duration-300 ${getTimerColor()}`}
              style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
            >
              {getTimerText()}
            </div>
            <div className="text-sm text-gray-500">
              {isReady && 'Release spacebar to start'}
              {isRunning && 'Press spacebar to stop'}
              {!isReady && !isRunning && currentTime > 0 && 'Press spacebar to reset'}
              {!isReady && !isRunning && currentTime === 0 && 'Hold spacebar to start'}
            </div>
          </div>

          {/* Manual Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleSpacePress}
              onMouseUp={handleSpaceRelease}
              variant={isReady ? 'destructive' : isRunning ? 'destructive' : currentTime > 0 ? 'outline' : 'default'}
              size="lg"
              className="px-8 transition-all duration-200 hover:scale-105"
            >
              {isReady ? 'Release to Start' : isRunning ? 'Stop' : currentTime > 0 ? 'Reset' : 'Ready'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
