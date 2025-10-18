'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@stackframe/stack';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Timer, BarChart3, History } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const navigation = [
  { name: 'Timer', href: '/timer', icon: Timer },
  { name: 'Statistics', href: '/stats', icon: BarChart3 },
  { name: 'History', href: '/history', icon: History },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  
  // Sliding animation state
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  
  // Update slider position when pathname changes
  useEffect(() => {
    if (navRef.current) {
      const activeIndex = navigation.findIndex(item => item.href === pathname);
      if (activeIndex !== -1) {
        const navItems = navRef.current.querySelectorAll('[data-nav-item]');
        const activeItem = navItems[activeIndex] as HTMLElement;
        if (activeItem) {
          const navRect = navRef.current.getBoundingClientRect();
          const itemRect = activeItem.getBoundingClientRect();
          setSliderStyle({
            left: itemRect.left - navRect.left,
            width: itemRect.width,
          });
        }
      }
    }
  }, [pathname]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/timer" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Timer className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Cube Timer
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-12">
            <div className="relative flex" ref={navRef}>
              {/* Sliding background */}
              <div
                className="absolute top-0 h-full bg-blue-100 dark:bg-blue-900 rounded-md transition-all duration-300 ease-out"
                style={{
                  left: `${sliderStyle.left}px`,
                  width: `${sliderStyle.width}px`,
                }}
              />
              
              {/* Navigation items */}
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-nav-item
                    className={cn(
                      'relative flex items-center space-x-3 px-6 py-3 rounded-md text-base font-semibold transition-colors duration-200 z-10',
                      isActive
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserButton />
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-6 py-4">
            <div className="relative flex">
              {/* Sliding background for mobile */}
              <div
                className="absolute top-0 h-full bg-blue-100 dark:bg-blue-900 rounded-md transition-all duration-300 ease-out"
                style={{
                  left: `${sliderStyle.left}px`,
                  width: `${sliderStyle.width}px`,
                }}
              />
              
              {/* Mobile navigation items */}
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-nav-item
                    className={cn(
                      'relative flex items-center space-x-2 px-4 py-3 rounded-md text-base font-semibold transition-colors duration-200 z-10',
                      isActive
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}