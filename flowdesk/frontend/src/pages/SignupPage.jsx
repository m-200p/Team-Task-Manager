import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SceneBg = () => (
  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#050d1a"/>
        <stop offset="35%" stopColor="#0a1628"/>
        <stop offset="65%" stopColor="#1a0f2e"/>
        <stop offset="100%" stopColor="#0d1f1a"/>
      </linearGradient>
      <radialGradient id="s1" cx="25%" cy="30%" r="45%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.55"/>
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="s2" cx="70%" cy="25%" r="40%">
        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="s3" cx="50%" cy="50%" r="35%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.25"/>
        <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="moon2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.9"/>
        <stop offset="40%" stopColor="#a5b4fc" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="water2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a1a2e"/>
        <stop offset="100%" stopColor="#050d12"/>
      </linearGradient>
      <filter id="sb8"><feGaussianBlur stdDeviation="8"/></filter>
      <filter id="sb2"><feGaussianBlur stdDeviation="2"/></filter>
      <filter id="sb4"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <rect width="800" height="600" fill="url(#sky2)"/>
    <rect width="800" height="600" fill="url(#s1)" filter="url(#sb8)"/>
    <rect width="800" height="600" fill="url(#s2)" filter="url(#sb8)"/>
    <rect width="800" height="600" fill="url(#s3)" filter="url(#sb8)"/>
    {[80,150,220,300,380,460,540,620,700,760].map((x,i) => (
      <circle key={i} cx={x} cy={[40,20,55,15,35,10,45,25,50,18][i]} r="0.9" fill="white" opacity="0.5"/>
    ))}
    <circle cx="620" cy="80" r="22" fill="url(#moon2)" filter="url(#sb2)"/>
    <circle cx="620" cy="80" r="13" fill="#dde4ff" opacity="0.9"/>
    <path d="M0,350 L80,220 L160,290 L240,200 L320,260 L400,180 L480,250 L560,190 L640,240 L720,175 L800,230 L800,600 L0,600 Z" fill="#0a1520" opacity="0.8"/>
    <path d="M0,420 L120,280 L220,360 L320,285 L420,350 L420,600 L0,600 Z" fill="#060c14" opacity="0.95"/>
    <path d="M420,350 L520,278 L620,335 L720,262 L800,310 L800,600 L420,600 Z" fill="#050b12" opacity="0.95"/>
    <rect x="0" y="420" width="800" height="180" fill="url(#water2)" opacity="0.9"/>
    <ellipse cx="620" cy="460" rx="8" ry="28" fill="#a5b4fc" opacity="0.1" filter="url(#sb4)"/>
    <rect width="800" height="600" fill="rgba(5,8,20,0.38)"/>
  </svg>
);

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
    padding: '9px 12px 9px 34px', color: 'white', fontSize: 13, outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <SceneBg />

      {/* Left content */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1, padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 34, height: 34, background: '#6366f1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>FlowDesk</span>
        </div>

        <div>
          <h2 style={{ color: 'white', fontSize: 36, fontWeight: 700, lineHeight: 1.25, marginBottom: 12, textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
            Join your team.<br />
            <span style={{ color: '#a5b4fc' }}>Your team awaits.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Create your account and start collaborating<br />with your team today.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { color: '#a78bfa', text: 'Assign & track tasks in real-time' },
              { color: '#34d399', text: 'Manage projects across teams' },
              { color: '#22d3ee', text: 'Role-based access control' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: item.color, fontSize: 10 }}>✦</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© 2026 FlowDesk. All rights reserved.</p>
      </div>

      {/* Right glass form */}
      <div style={{ position: 'relative', zIndex: 2, width: 300, margin: '0 40px 0 0', background: 'rgba(10,12,25,0.75)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '28px 24px', backdropFilter: 'blur(20px)' }}>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>Create account</h1>
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, margin: '0 0 20px' }}>Join your team on FlowDesk</p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: 10, padding: '8px 12px', fontSize: 12, marginBottom: 16 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500, display: 'block', marginBottom: 5 }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input placeholder="John Doe" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500, display: 'block', marginBottom: 5 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500, display: 'block', marginBottom: 5 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500, display: 'block', marginBottom: 5 }}>Role</label>
            <div style={{ position: 'relative' }}>
              <Shield size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)' }}>
                <option value="member" style={{ background: '#1a1a2e' }}>Member</option>
                <option value="admin" style={{ background: '#1a1a2e' }}>Admin</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '11px',
            background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border: 'none', borderRadius: 10, color: 'white',
            fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}