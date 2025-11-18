/**
 * CommandPalette - ⌘K Quick Actions
 * Inspired by Linear, Vercel, n8n
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  Home,
  Clock,
  BarChart3,
  Bookmark,
  Lightbulb,
  DollarSign,
  User,
  Settings,
  LogOut,
  FileDown,
  Search,
  HelpCircle,
  Keyboard,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import './CommandPalette.css';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [search, setSearch] = useState('');

  // ESC 키로 닫기
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange]);

  const handleSelect = useCallback((callback: () => void) => {
    callback();
    onOpenChange(false);
  }, [onOpenChange]);

  const pages = [
    { name: '홈', path: '/', icon: Home, keywords: ['home', 'main', '메인'] },
    { name: '타임라인', path: '/timeline', icon: Clock, keywords: ['timeline', 'history', '역사'], protected: true },
    { name: '비교 분석', path: '/compare', icon: BarChart3, keywords: ['compare', 'analysis', '분석'], protected: true },
    { name: '북마크', path: '/bookmarks', icon: Bookmark, keywords: ['bookmark', 'saved', '저장'], protected: true },
    { name: '인사이트', path: '/insights', icon: Lightbulb, keywords: ['insights', 'trends', '트렌드'], protected: true },
    { name: '요금제', path: '/pricing', icon: DollarSign, keywords: ['pricing', 'plan', '가격'] },
    { name: '내 계정', path: '/account', icon: User, keywords: ['account', 'profile', '프로필'], protected: true },
    { name: '관리자', path: '/admin', icon: Settings, keywords: ['admin', 'management', '관리'], protected: true },
  ];

  const actions = [
    { name: '데이터 내보내기', action: () => console.log('Export'), icon: FileDown, keywords: ['export', 'download', '다운로드'], protected: true },
    { name: '검색', action: () => console.log('Search'), icon: Search, keywords: ['search', 'find', '찾기'] },
    { name: '단축키 도움말', action: () => console.log('Shortcuts'), icon: Keyboard, keywords: ['shortcuts', 'hotkeys', '단축키', '도움말'] },
    { name: 'FAQ', action: () => navigate('/faq'), icon: HelpCircle, keywords: ['faq', 'help', '도움말'] },
  ];

  if (isAuthenticated) {
    actions.push({
      name: '로그아웃',
      action: () => {
        logout();
        navigate('/');
      },
      icon: LogOut,
      keywords: ['logout', 'signout', '로그아웃'],
    });
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Global Command Menu"
      className="command-palette"
    >
      <div className="command-palette-container">
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="검색 또는 명령 입력..."
          className="command-input"
        />

        <Command.List className="command-list">
          <Command.Empty className="command-empty">
            검색 결과가 없습니다
          </Command.Empty>

          {/* Pages */}
          <Command.Group heading="페이지" className="command-group">
            {pages
              .filter(page => !page.protected || isAuthenticated)
              .map((page) => (
                <Command.Item
                  key={page.path}
                  value={`${page.name} ${page.keywords.join(' ')}`}
                  onSelect={() => handleSelect(() => navigate(page.path))}
                  className="command-item"
                >
                  <page.icon className="command-icon" />
                  <span>{page.name}</span>
                </Command.Item>
              ))}
          </Command.Group>

          {/* Actions */}
          <Command.Group heading="액션" className="command-group">
            {actions
              .filter(action => !action.protected || isAuthenticated)
              .map((action) => (
                <Command.Item
                  key={action.name}
                  value={`${action.name} ${action.keywords.join(' ')}`}
                  onSelect={() => handleSelect(action.action)}
                  className="command-item"
                >
                  <action.icon className="command-icon" />
                  <span>{action.name}</span>
                </Command.Item>
              ))}
          </Command.Group>
        </Command.List>

        <div className="command-footer">
          <div className="command-footer-shortcuts">
            <kbd>↑↓</kbd> 탐색
            <kbd>↵</kbd> 선택
            <kbd>esc</kbd> 닫기
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}

// Hook for keyboard shortcut
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return { open, setOpen };
}
