"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date | string; // Target date for countdown
  onExpire?: () => void; // Callback when countdown expires
  label?: string; // Optional label
  showDays?: boolean; // Whether to show days
  className?: string; // Additional CSS classes
}

/**
 * Countdown Timer Component
 * Displays a countdown timer for bidding/lock order offers
 */
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onExpire,
  label = "الوقت المتبقي لقفل الطلب",
  showDays = true,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetTime = target.getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onExpire) {
          onExpire();
        }
        return;
      }

      setIsExpired(false);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  if (isExpired) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-3 sm:p-4 lg:p-6 ${className}`}>
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-red-900 dark:text-red-300 mb-1">
              انتهى الوقت
            </h3>
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 leading-relaxed break-words">
              تم قفل الطلب. لم يعد بإمكان المقدمين تقديم عروض جديدة.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg ${className}`}>
      <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 break-words">
            {label}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            سيتم قفل الطلب تلقائياً عند انتهاء الوقت
          </p>
        </div>
      </div>

      <div className={`grid ${showDays ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-2 sm:gap-3 lg:gap-4`}>
        {showDays && (
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 text-center border-2 border-orange-200 dark:border-orange-700">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-0.5 sm:mb-1 font-mono">
              {String(timeLeft.days).padStart(2, "0")}
            </div>
            <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
              يوم
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 text-center border-2 border-orange-200 dark:border-orange-700">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-0.5 sm:mb-1 font-mono">
            {String(timeLeft.hours).padStart(2, "0")}
          </div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
            ساعة
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 text-center border-2 border-orange-200 dark:border-orange-700">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-0.5 sm:mb-1 font-mono">
            {String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
            دقيقة
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 text-center border-2 border-orange-200 dark:border-orange-700">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-0.5 sm:mb-1 font-mono">
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
            ثانية
          </div>
        </div>
      </div>
    </div>
  );
};

