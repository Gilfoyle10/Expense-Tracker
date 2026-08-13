'use client';

import React, { useState } from 'react';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { saveCustomCategory } from '@/lib/constants';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: (newCategoryName: string) => void;
}

const EMOJI_OPTIONS = ['✨', '🍔', '🛒', '⛽', '🏠', '🍿', '🎁', '💊', '🎮', '✈️', '🐾', '📚', '⚡', '☕', '💡'];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryAdded,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = categoryName.trim();
    if (!trimmed) {
      setError('Category name is mandatory.');
      return;
    }

    try {
      const added = saveCustomCategory(trimmed, selectedEmoji, description);
      onCategoryAdded(added.name);
      setCategoryName('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to add custom category.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E24] text-[#F5F5F5] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16161A]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-[#F5F5F5]">Add Custom Category</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#9A9AA2] hover:text-[#F5F5F5] hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1.5">
              Category Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pet Care, FastTag, OTT..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl light-input text-xs text-[#F5F5F5] placeholder-[#9A9AA2] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1.5">
              Select Emoji Icon
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#16161A] border border-white/10">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-white/20 scale-110 border border-white/30'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9A9AA2] mb-1.5">
              Description <span className="text-[#9A9AA2]">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl light-input text-xs text-[#F5F5F5] placeholder-[#9A9AA2] focus:outline-none"
            />
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
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#FFC72C] hover:bg-[#E5B324] text-slate-950 shadow-2xs transition-all"
            >
              <Plus size={15} />
              <span>Create Category</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
