'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { getActiveCategories, getCategoryConfig, deleteCategory } from '@/lib/constants';
import { ExpenseCategory } from '@/lib/types';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryDeleted: (deletedCategoryName: string) => void;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryDeleted,
}) => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const active = getActiveCategories();
      setCategories(active);
      setSelectedCat(active.length > 0 ? active[0] : '');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = () => {
    if (!selectedCat) {
      setError('Please select a category to delete.');
      return;
    }

    try {
      deleteCategory(selectedCat);
      onCategoryDeleted(selectedCat);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E24] text-[#F5F5F5] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161A]">
          <div className="flex items-center gap-2 text-rose-400">
            <Trash2 className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-[#F5F5F5]">Delete Category</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#9A9AA2] hover:text-[#F5F5F5] hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-[#9A9AA2]">
            Select an unwanted category to remove it from your sidebar list and filters.
          </p>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1.5">
              Select Category
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl light-input text-xs font-semibold text-[#F5F5F5] focus:outline-none"
            >
              {categories.map((cat) => {
                const config = getCategoryConfig(cat);
                return (
                  <option key={cat} value={cat}>
                    {config.emoji} {cat}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9A9AA2] hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-all"
            >
              <Trash2 size={15} />
              <span>Delete Category</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
