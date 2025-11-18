/**
 * TrendCard Component
 * Atomic Design - Organism
 * 트렌드 정보를 표시하는 카드
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Globe, Code, TrendingUp, Users } from 'lucide-react';
import { TrendData } from '../../types';
import { COUNTRY_EMOJIS } from '../../config/constants';
import { Card } from '../molecules/Card';
import { Tag } from '../atoms/Tag';
import { Button } from '../atoms/Button';
import ShareButton from '../ShareButton';

export interface TrendCardProps {
  /** 트렌드 데이터 */
  trend: TrendData;
  /** 애니메이션 딜레이 인덱스 */
  index: number;
  /** 프리미엄 사용자 여부 */
  isPremium: boolean;
}

/**
 * TrendCard 컴포넌트
 *
 * @example
 * ```tsx
 * <TrendCard
 *   trend={trendData}
 *   index={0}
 *   isPremium={user?.subscription_status === 'premium'}
 * />
 * ```
 */
export function TrendCard({ trend, index, isPremium }: TrendCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLocked = trend.is_premium && !isPremium;

  const countryEmoji = COUNTRY_EMOJIS[trend.country] || '🌐';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <Card variant="default" padding="md" className={isLocked ? 'opacity-75' : ''}>
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center z-10">
            <div className="text-center p-6">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">프리미엄 전용</p>
              <Link to="/pricing">
                <Button variant="primary">업그레이드</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">
              <span className="mr-2">{countryEmoji}</span>
              {trend.title}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {trend.decade}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isLocked && <ShareButton trend={trend} />}
            {trend.is_premium && (
              <span className="premium-badge">Premium</span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {trend.description}
        </p>

        {!isLocked && (
          <>
            {/* Websites */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Globe className="w-5 h-5 mr-2 text-primary-600" />
                <h4 className="font-semibold">주요 웹사이트</h4>
              </div>
              <div className="space-y-2">
                {trend.websites.slice(0, isExpanded ? undefined : 3).map((site, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{site.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {site.description}
                        </div>
                      </div>
                      <Tag color="primary">{site.category}</Tag>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Trends */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Code className="w-5 h-5 mr-2 text-purple-600" />
                <h4 className="font-semibold">디자인 트렌드</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {trend.design_trends.map((dt, idx) => (
                  <Tag key={idx} color="purple">{dt}</Tag>
                ))}
              </div>
            </div>

            {isExpanded && (
              <>
                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                    <h4 className="font-semibold">기술 스택</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trend.tech_stack.map((tech, idx) => (
                      <Tag key={idx} color="orange">{tech}</Tag>
                    ))}
                  </div>
                </div>

                {/* User Behavior */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    <h4 className="font-semibold">사용자 행동</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trend.user_behavior.map((behavior, idx) => (
                      <Tag key={idx} color="green">{behavior}</Tag>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button
              variant="link"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4"
            >
              {isExpanded ? '접기' : '더 보기'}
            </Button>
          </>
        )}
      </Card>
    </motion.div>
  );
}
