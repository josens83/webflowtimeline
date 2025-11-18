import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  Users,
  Crown,
  MessageSquare,
  TrendingUp,
  Server,
  Calendar,
  Mail,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name: string;
  subscription_status: string;
  created_at: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  user_email?: string;
}

interface Stats {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
  recentSignups: number;
}

interface ContactStats {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  recent: number;
}

export default function AdminPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'contacts'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [contactStats, setContactStats] = useState<ContactStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
  const isAdmin = user && adminEmails.includes(user.email);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('관리자 권한이 필요합니다');
      navigate('/');
      return;
    }

    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, contactStatsRes, usersRes, contactsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getContactStats(),
        adminAPI.getUsers(),
        adminAPI.getContacts({ limit: 50 })
      ]);

      setStats(statsRes.data);
      setContactStats(contactStatsRes.data);
      setUsers(usersRes.data.users);
      setContacts(contactsRes.data.contacts);
    } catch (error: any) {
      console.error('Failed to load admin data:', error);
      toast.error('데이터 로드 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubscription = async (userId: number, newStatus: string) => {
    try {
      await adminAPI.updateSubscription(userId, newStatus);
      toast.success('구독 상태가 업데이트되었습니다');
      loadData();
    } catch (error) {
      toast.error('구독 상태 업데이트 실패');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;

    try {
      await adminAPI.deleteUser(userId);
      toast.success('사용자가 삭제되었습니다');
      loadData();
    } catch (error) {
      toast.error('사용자 삭제 실패');
    }
  };

  const handleUpdateContactStatus = async (contactId: number, newStatus: string) => {
    try {
      await adminAPI.updateContact(contactId, { status: newStatus });
      toast.success('문의 상태가 업데이트되었습니다');
      loadData();
    } catch (error) {
      toast.error('문의 상태 업데이트 실패');
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!confirm('정말로 이 문의를 삭제하시겠습니까?')) return;

    try {
      await adminAPI.deleteContact(contactId);
      toast.success('문의가 삭제되었습니다');
      loadData();
    } catch (error) {
      toast.error('문의 삭제 실패');
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">관리자 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-400">
            시스템 관리 및 모니터링
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'overview'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Server className="w-5 h-5 inline mr-2" />
            개요
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'users'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            사용자 관리
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'contacts'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <MessageSquare className="w-5 h-5 inline mr-2" />
            문의 관리
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">시스템 개요</h2>
              <button
                onClick={loadData}
                className="btn-secondary flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </button>
            </div>

            {/* User Stats */}
            <div>
              <h3 className="text-xl font-semibold mb-4">사용자 통계</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Users className="w-8 h-8 mb-2" />
                  <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                  <div className="text-sm opacity-90">전체 사용자</div>
                </div>

                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  <div className="text-3xl font-bold">{stats?.freeUsers || 0}</div>
                  <div className="text-sm opacity-90">무료 사용자</div>
                </div>

                <div className="card bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                  <Crown className="w-8 h-8 mb-2" />
                  <div className="text-3xl font-bold">{stats?.premiumUsers || 0}</div>
                  <div className="text-sm opacity-90">프리미엄 사용자</div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <Calendar className="w-8 h-8 mb-2" />
                  <div className="text-3xl font-bold">{stats?.recentSignups || 0}</div>
                  <div className="text-sm opacity-90">최근 7일 가입</div>
                </div>
              </div>
            </div>

            {/* Contact Stats */}
            <div>
              <h3 className="text-xl font-semibold mb-4">문의 통계</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="card">
                  <MessageSquare className="w-8 h-8 mb-2 text-blue-600" />
                  <div className="text-3xl font-bold">{contactStats?.total || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">전체 문의</div>
                </div>

                <div className="card">
                  <Clock className="w-8 h-8 mb-2 text-yellow-600" />
                  <div className="text-3xl font-bold">{contactStats?.pending || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">대기 중</div>
                </div>

                <div className="card">
                  <RefreshCw className="w-8 h-8 mb-2 text-orange-600" />
                  <div className="text-3xl font-bold">{contactStats?.in_progress || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">처리 중</div>
                </div>

                <div className="card">
                  <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
                  <div className="text-3xl font-bold">{contactStats?.resolved || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">해결됨</div>
                </div>

                <div className="card">
                  <Calendar className="w-8 h-8 mb-2 text-purple-600" />
                  <div className="text-3xl font-bold">{contactStats?.recent || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">최근 7일</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">사용자 관리</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                총 {users.length}명
              </div>
            </div>

            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left p-4">ID</th>
                    <th className="text-left p-4">이름</th>
                    <th className="text-left p-4">이메일</th>
                    <th className="text-left p-4">구독 상태</th>
                    <th className="text-left p-4">가입일</th>
                    <th className="text-left p-4">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">{u.id}</td>
                      <td className="p-4">{u.name}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {u.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.subscription_status}
                          onChange={(e) => handleUpdateSubscription(u.id, e.target.value)}
                          className="px-3 py-1 rounded border dark:border-gray-700 bg-white dark:bg-gray-800"
                        >
                          <option value="free">무료</option>
                          <option value="premium">프리미엄</option>
                        </select>
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(u.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={u.id === user?.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">문의 관리</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                총 {contacts.length}건
              </div>
            </div>

            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{contact.name}</h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {contact.email}
                        </span>
                        {contact.user_email && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            회원
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {contact.subject} • {new Date(contact.created_at).toLocaleString('ko-KR')}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {contact.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t dark:border-gray-700">
                    <select
                      value={contact.status}
                      onChange={(e) => handleUpdateContactStatus(contact.id, e.target.value)}
                      className="px-4 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                      <option value="pending">대기 중</option>
                      <option value="in_progress">처리 중</option>
                      <option value="resolved">해결됨</option>
                      <option value="closed">종료됨</option>
                    </select>

                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="ml-auto text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {contacts.length === 0 && (
                <div className="card text-center py-12 text-gray-500">
                  문의 내역이 없습니다
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
