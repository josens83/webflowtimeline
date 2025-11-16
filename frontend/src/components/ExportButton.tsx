import { useState } from 'react';
import { Download, FileText, Table, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendData } from '../types';
import { exportToPDF, exportToExcel, exportToJSON } from '../utils/exportUtils';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ExportButtonProps {
  data: TrendData[];
  filename?: string;
}

export default function ExportButton({ data, filename = 'web-trends' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const isPremium = user?.subscription_status === 'premium';

  const handleExport = (format: 'pdf' | 'excel' | 'json') => {
    if (!isPremium) {
      toast.error('프리미엄 회원만 내보내기를 사용할 수 있습니다');
      return;
    }

    if (!data || data.length === 0) {
      toast.error('내보낼 데이터가 없습니다');
      return;
    }

    try {
      switch (format) {
        case 'pdf':
          exportToPDF(data, `${filename} 리포트`);
          toast.success('PDF 파일이 다운로드되었습니다');
          break;
        case 'excel':
          exportToExcel(data, filename);
          toast.success('Excel 파일이 다운로드되었습니다');
          break;
        case 'json':
          exportToJSON(data, filename);
          toast.success('JSON 파일이 다운로드되었습니다');
          break;
      }
      setIsOpen(false);
    } catch (error) {
      toast.error('내보내기에 실패했습니다');
      console.error('Export error:', error);
    }
  };

  if (!isPremium) {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg cursor-not-allowed"
          title="프리미엄 전용 기능"
        >
          <Download className="w-5 h-5 mr-2" />
          내보내기 (프리미엄)
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition"
      >
        <Download className="w-5 h-5 mr-2" />
        내보내기
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
            >
              <div className="py-2">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                >
                  <FileText className="w-5 h-5 mr-3 text-red-600" />
                  <div>
                    <div className="font-semibold">PDF</div>
                    <div className="text-xs text-gray-500">프레젠테이션용</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('excel')}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                >
                  <Table className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <div className="font-semibold">Excel</div>
                    <div className="text-xs text-gray-500">데이터 분석용</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                >
                  <Code className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-semibold">JSON</div>
                    <div className="text-xs text-gray-500">개발자용</div>
                  </div>
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  총 {data.length}개 트렌드 데이터
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
