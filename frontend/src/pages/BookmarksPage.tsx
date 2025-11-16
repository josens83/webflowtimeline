import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkPlus, Trash2, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

interface Bookmark {
  id: number;
  decade: string;
  country: string;
  title: string;
  timestamp: string;
}

const COUNTRY_FLAGS: { [key: string]: string } = {
  korea: '🇰🇷',
  usa: '🇺🇸',
  japan: '🇯🇵',
  china: '🇨🇳'
};

const COUNTRY_LABELS: { [key: string]: string } = {
  korea: '한국',
  usa: '미국',
  japan: '일본',
  china: '중국'
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
      const parsed = JSON.parse(saved);
      setBookmarks(parsed.sort((a: Bookmark, b: Bookmark) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    }
  };

  const removeBookmark = (id: number) => {
    const filtered = bookmarks.filter(b => b.id !== id);
    localStorage.setItem('bookmarks', JSON.stringify(filtered));
    setBookmarks(filtered);
    toast.success('북마크가 제거되었습니다');
  };

  const clearAll = () => {
    if (window.confirm('모든 북마크를 삭제하시겠습니까?')) {
      localStorage.removeItem('bookmarks');
      setBookmarks([]);
      toast.success('모든 북마크가 삭제되었습니다');
    }
  };

  const groupByDecade = () => {
    const groups: { [key: string]: Bookmark[] } = {};
    bookmarks.forEach(bookmark => {
      if (!groups[bookmark.decade]) {
        groups[bookmark.decade] = [];
      }
      groups[bookmark.decade].push(bookmark);
    });
    return groups;
  };

  const grouped = groupByDecade();

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <BookmarkPlus className="w-10 h-10 mr-3 text-primary-600" />
              내 북마크
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              저장한 웹 트렌드 {bookmarks.length}개
            </p>
          </div>

          {bookmarks.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              전체 삭제
            </button>
          )}
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <BookmarkPlus className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">북마크가 없습니다</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              관심있는 웹 트렌드를 북마크하여 나중에 쉽게 찾아보세요
            </p>
            <Link to="/timeline" className="btn-primary inline-block">
              타임라인 탐색하기
            </Link>
          </motion.div>
        )}

        {/* Bookmarks by Decade */}
        {bookmarks.length > 0 && (
          <div className="space-y-8">
            {Object.entries(grouped).sort().reverse().map(([decade, items]) => (
              <div key={decade}>
                <h2 className="text-2xl font-bold mb-4">{decade}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {items.map((bookmark, index) => (
                      <motion.div
                        key={bookmark.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="card hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="text-3xl mr-2">
                                {COUNTRY_FLAGS[bookmark.country]}
                              </span>
                              <div>
                                <h3 className="font-bold text-lg">
                                  {bookmark.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {COUNTRY_LABELS[bookmark.country]}
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => removeBookmark(bookmark.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="북마크 제거"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(bookmark.timestamp).toLocaleDateString('ko-KR')}
                          </div>

                          <Link
                            to={`/timeline?decade=${bookmark.decade}&country=${bookmark.country}`}
                            className="flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm"
                          >
                            보기
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {bookmarks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 card bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20"
          >
            <h3 className="text-xl font-bold mb-4">북마크 통계</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {bookmarks.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  전체 북마크
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Object.keys(grouped).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  시대
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {new Set(bookmarks.map(b => b.country)).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  국가
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {bookmarks.length > 0
                    ? Math.ceil((new Date().getTime() - new Date(bookmarks[bookmarks.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * 24))
                    : 0}일
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  첫 북마크 이후
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
