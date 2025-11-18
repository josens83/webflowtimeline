import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogIn } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import { Card } from '../components/molecules/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
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
              <LogIn className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">로그인</h2>
            <p className="text-gray-600 dark:text-gray-400">
              계정에 로그인하여 웹 트렌드를 탐색하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="로그인 중..."
            >
              로그인
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              계정이 없으신가요?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
