import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock } from 'lucide-react';
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
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
          top: '10%', left: '-10%'
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, transparent 70%)',
          bottom: '15%', right: '10%'
        }} />
        <div style={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
          top: '50%', left: '40%'
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">FlowDesk</span>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Manage your team,<br />
              <span style={{ color: '#a78bfa' }}>effortlessly.</span>
            </h2>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Track tasks, collaborate with your team,<br />and ship faster with FlowDesk.
            </p>

            <div className="flex gap-3 mt-8">
              {['Tasks', 'Projects', 'Team', 'Analytics'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '4px 14px',
                  borderRadius: 999,
                  fontSize: 13
                }}>{tag}</span>
              ))}
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
            © 2026 FlowDesk. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6"
        style={{ background: '#0f0e17' }}>
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">FlowDesk</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Sign in to your FlowDesk account
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                    padding: '10px 14px 10px 36px', color: 'white', fontSize: 14, outline: 'none'
                  }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="password" placeholder="Your password"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                    padding: '10px 14px 10px 36px', color: 'white', fontSize: 14, outline: 'none'
                  }} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: 12, color: 'white',
              fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#818cf8', fontWeight: 500 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}