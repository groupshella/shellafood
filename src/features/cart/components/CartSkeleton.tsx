'use client';

/**
 * CartSkeleton — shown while cart data is loading
 * Pure UI.
 */
import React from 'react';

function Bone({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse ${className ?? ''}`} />
  );
}

function ItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <Bone className="w-16 h-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Bone className="h-3.5 w-2/3" />
        <Bone className="h-3 w-1/3" />
        <Bone className="h-3 w-1/4" />
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Bone className="w-8 h-8 rounded-lg" />
        <Bone className="w-7 h-4" />
        <Bone className="w-8 h-8 rounded-lg" />
      </div>
      <Bone className="w-8 h-8 rounded-lg flex-shrink-0" />
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <Bone className="h-5 w-32" />
      <div className="space-y-2.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <Bone className="h-3.5 w-24" />
            <Bone className="h-3.5 w-16" />
          </div>
        ))}
      </div>
      <Bone className="h-12 w-full rounded-xl" />
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
      {/* Left — items */}
      <div className="lg:col-span-2 space-y-3">
        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-3 space-y-2 border border-gray-100 dark:border-gray-700">
          <Bone className="h-4 w-28 mb-3" />
          {[...Array(3)].map((_, i) => <ItemSkeleton key={i} />)}
        </div>
      </div>

      {/* Right — summary */}
      <div className="lg:col-span-1 space-y-4">
        <SummarySkeleton />
      </div>
    </div>
  );
}
