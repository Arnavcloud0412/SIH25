'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInSignUp() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-black mb-6">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          {mode === 'signin' ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-green-600 font-semibold"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-green-600 font-semibold"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
