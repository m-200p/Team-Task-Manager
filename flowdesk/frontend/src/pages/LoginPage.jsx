import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('All fields required');
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 bg-brand-500 rounded-2xl flex items-center justify-center shadow-glow">
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-ink-900">FlowDesk</span>
        </div>

        <div className="card p-6 shadow-panel">
          <h1 className="text-xl font-bold text-ink-900 mb-1">Welcome back</h1>
          <p className="text-sm text-ink-400 mb-6">Sign in to your FlowDesk account</p>

          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Email</label>
              <input type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1">Password</label>
              <input type="password" className="input" placeholder="Your password"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-400 mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-600 font-medium hover:text-brand-700">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}