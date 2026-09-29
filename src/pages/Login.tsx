import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/db';

export function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      
      const success = AuthService.register(username.trim(), password);
      if (!success) {
        setError('Username already exists.');
        return;
      }
    } else {
      const user = AuthService.login(username.trim(), password);
      if (!user) {
        setError('Invalid username or password.');
        return;
      }
    }
    
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-[#1C1917]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E7E0D5] shadow-xl text-center"
      >
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-[#1C1917] mb-2">Speak2Cart</h2>
          <p className="text-[#78716C] text-sm">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#78716C] mb-1 ml-1 uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F4EFE6] border border-[#E7E0D5] focus:border-[#2C4A3E] focus:ring-1 focus:ring-[#2C4A3E] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#78716C] mb-1 ml-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F4EFE6] border border-[#E7E0D5] focus:border-[#2C4A3E] focus:ring-1 focus:ring-[#2C4A3E] outline-none transition-colors"
            />
          </div>

          <AnimatePresence>
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-1">
                  <label className="block text-xs font-semibold text-[#78716C] mb-1 ml-1 uppercase tracking-wider">Confirm Password</label>
                  <input 
                    type="password" 
                    required={isRegister}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F4EFE6] border border-[#E7E0D5] focus:border-[#2C4A3E] focus:ring-1 focus:ring-[#2C4A3E] outline-none transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-3.5 bg-[#2C4A3E] text-white rounded-xl font-semibold shadow-md hover:bg-[#223B31] transition-colors"
            >
              {isRegister ? 'Create Account' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-sm text-[#78716C]">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="font-semibold text-[#2C4A3E] hover:underline"
          >
            {isRegister ? 'Login' : 'Create one'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
