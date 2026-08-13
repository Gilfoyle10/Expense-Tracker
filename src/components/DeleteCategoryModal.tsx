'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertCircle, ShieldAlert } from 'lucide-react';
import { getActiveCategories, deleteCategory, getCategoryConfig } from '@/lib/constants';
import { CategoryBadge } from './CategoryBadge';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryDeleted: (categoryName: string) => void;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryDeleted,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCategories(getActiveCategories());
      setSelectedCat(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (catName: string) => {
    deleteCategory(catName);
    const updated = getActiveCategories();
    setCategories(updated);
    onCategoryDeleted(catName);
    if (updated.length === 0) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Trash2 size={18} className="text-rose-600" />
            <h3 className="text-base font-extrabold text-slate-900">Manage & Delete Categories</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Click the delete icon next to any category to remove it from your categories list.
          </p>

          <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
            {categories.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
                No active categories found.
              </div>
            ) : (
              categories.map((cat) => {
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <CategoryBadge category={cat} size="sm" />
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title={`Delete ${cat} category`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-2xl text-xs font-extrabold bg-slate-900 text-white shadow-2xs hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
