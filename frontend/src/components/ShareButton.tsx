import { Share2, Twitter, Facebook, Link2, BookmarkPlus, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { TrendData } from '../types';

interface ShareButtonProps {
  trend: TrendData;
}

export default function ShareButton({ trend }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/timeline?decade=${trend.decade}&country=${trend.country}`
    : '';

  const shareText = `${trend.title} - ${trend.decade}`;

  const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        break;

      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        break;

      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success('링크가 복사되었습니다');
        break;
    }
    setIsOpen(false);
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    if (isBookmarked) {
      // Remove bookmark
      const filtered = bookmarks.filter((b: any) => b.id !== trend.id);
      localStorage.setItem('bookmarks', JSON.stringify(filtered));
      setIsBookmarked(false);
      toast.info('북마크가 제거되었습니다');
    } else {
      // Add bookmark
      bookmarks.push({
        id: trend.id,
        decade: trend.decade,
        country: trend.country,
        title: trend.title,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
      toast.success('북마크에 추가되었습니다');
    }
  };

  // Check if already bookmarked on mount
  useState(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const exists = bookmarks.some((b: any) => b.id === trend.id);
    setIsBookmarked(exists);
  });

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-lg transition ${
            isBookmarked
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title={isBookmarked ? '북마크 제거' : '북마크 추가'}
        >
          {isBookmarked ? (
            <Check className="w-5 h-5" />
          ) : (
            <BookmarkPlus className="w-5 h-5" />
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          title="공유하기"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
            >
              <div className="py-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                >
                  <Twitter className="w-5 h-5 mr-3 text-blue-400" />
                  <span>Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                >
                  <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                  <span>Facebook</span>
                </button>

                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                >
                  <Link2 className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                  <span>링크 복사</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
