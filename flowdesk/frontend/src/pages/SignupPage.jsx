import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError('All fields required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try {
      await signup(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
    padding: '10px 14px 10px 36px', color: 'white', fontSize: 14, outline: 'none'
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
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

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">FlowDesk</span>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Join your team<br />
              <span style={{ color: '#a78bfa' }}>on FlowDesk.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7 }}>
              Create your account and start collaborating<br />with your team today.
            </p>

            <div className="mt-8 space-y-3">
              {[
                { icon: '✦', text: 'Assign & track tasks in real-time' },
                { icon: '✦', text: 'Manage projects across teams' },
                { icon: '✦', text: 'Role-based access control' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3">
                  <span style={{ color: '#a78bfa', fontSize: 12 }}>{item.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>{item.text}</span>
                </div>
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
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">FlowDesk</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Join your team on FlowDesk
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
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input placeholder="John Doe" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputStyle} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input type="password" placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={inputStyle} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Role</label>
              <div className="relative">
                <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <select value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                  <option value="member" style={{ background: '#1a1a2e' }}>Member</option>
                  <option value="admin" style={{ background: '#1a1a2e' }}>Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: 12, color: 'white',
              fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}