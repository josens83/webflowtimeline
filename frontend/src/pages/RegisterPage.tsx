import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { UserPlus } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import { Card } from '../components/molecules/Card';
import { Alert } from '../components/molecules/Alert';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    try {
      await register(email, password, name);
      navigate('/timeline');
    } catch (error) {
      // Error handling is done in the store
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <Card variant="elevated" padding="lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">회원가입</h2>
            <p className="text-gray-600 dark:text-gray-400">
              무료로 시작하고 언제든지 프리미엄으로 업그레이드
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6" closable onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="이름"
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
            />

            <FormField
              label="이메일"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />

            <FormField
              label="비밀번호"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              helperText="최소 6자 이상"
            />

            <FormField
              label="비밀번호 확인"
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="가입 중..."
            >
              회원가입
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
