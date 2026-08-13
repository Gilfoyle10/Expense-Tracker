import React from 'react';
import { ExpenseCategory } from '@/lib/types';
import { getCategoryConfig } from '@/lib/constants';

interface CategoryBadgeProps {
  category: ExpenseCategory;
  showEmoji?: boolean;
  showIcon?: boolean; // Alias
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  showEmoji = true,
  showIcon = true,
  size = 'md',
}) => {
  const config = getCategoryConfig(category);

  const displayEmoji = showEmoji && showIcon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-semibold gap-1 rounded-lg',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5 rounded-xl',
    lg: 'px-3 py-1.5 text-xs font-bold gap-2 rounded-xl',
  }[size];

  return (
    <span
      className={`inline-flex items-center border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} ${sizeClasses} shadow-2xs whitespace-nowrap`}
    >
      {displayEmoji && <span className="text-xs">{config.emoji}</span>}
      <span>{config.label}</span>
    </span>
  );
};
