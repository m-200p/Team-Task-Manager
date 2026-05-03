import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SceneBg = () => (
  <div style={{
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)',
    overflow: 'hidden'
  }}>
    {/* glow blobs */}
    <div style={{
      position: 'absolute',
      width: 400,
      height: 400,
      background: 'rgba(99,102,241,0.25)',
      filter: 'blur(120px)',
      top: 50,
      left: 80
    }} />
    <div style={{
      position: 'absolute',
      width: 300,
      height: 300,
      background: 'rgba(20,184,166,0.2)',
      filter: 'blur(100px)',
      bottom: 50,
      right: 80
    }} />
  </div>
);

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return setError('All fields required');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters');

    setLoading(true);
    setError('');
    try {
      await signup(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: '11px 12px 11px 38px',
    color: 'white',
    fontSize: 13,
    outline: 'none',
    transition: 'all 0.25s ease'
  };

  const handleFocus = (e) => {
    e.target.style.border = '1px solid #8b5cf6';
    e.target.style.boxShadow = '0 0 10px rgba(139,92,246,0.6)';
  };

  const handleBlur = (e) => {
    e.target.style.border = '1px solid rgba(255,255,255,0.15)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <SceneBg />

      {/* LEFT */}
      <div style={{
        flex: 1,
        padding: '40px 60px',
        color: 'white',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={16} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>FlowDesk</span>
        </div>

        <div style={{ marginTop: 80 }}>
          <h1 style={{
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.3,
            background: 'linear-gradient(90deg,#fff,#a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Join your team.<br />Start building faster.
          </h1>

          <p style={{
            marginTop: 12,
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14
          }}>
            Manage tasks, collaborate, and stay productive.
          </p>

          <div style={{ marginTop: 25, display: 'flex', gap: 10 }}>
            {['Tasks', 'Projects', 'Team'].map((item) => (
              <span key={item} style={{
                padding: '6px 12px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.08)',
                fontSize: 12
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div
        style={{
          width: 320,
          marginRight: 60,
          padding: 26,
          borderRadius: 20,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          zIndex: 2,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>
          Create Account
        </h2>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Join FlowDesk today
        </p>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            padding: 8,
            borderRadius: 10,
            marginTop: 10,
            fontSize: 12,
            color: '#f87171'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* NAME */}
          <div style={{ position: 'relative' }}>
            <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputBase}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* EMAIL */}
          <div style={{ position: 'relative' }}>
            <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputBase}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ position: 'relative' }}>
            <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputBase}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* ROLE */}
          <div style={{ position: 'relative' }}>
            <Shield size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ ...inputBase, cursor: 'pointer' }}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: 12,
              borderRadius: 12,
              border: 'none',
              color: 'white',
              fontWeight: 600,
              background: loading
                ? 'rgba(99,102,241,0.5)'
                : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, marginTop: 14, color: 'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a5b4fc' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}