export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem',
      background: 'radial-gradient(circle at center, rgba(212, 160, 23, 0.1), transparent 50%)',
      backgroundColor: 'var(--bg-black)'
    }}>
      {children}
    </div>
  );
}
