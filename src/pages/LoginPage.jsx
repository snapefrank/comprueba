
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Eye, EyeOff, LogIn } from 'lucide-react';
    import { useAuth } from '@/contexts/AuthContext';

    const LoginPage = () => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      const navigate = useNavigate();
      const { toast } = useToast();
      const { login } = useAuth();

      const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(username, password);
        if (success) {
          toast({
            title: 'Inicio de Sesión Exitoso',
            description: 'Bienvenido de nuevo!',
          });
          if (username === 'admin') {
            navigate('/admin');
          } else {
            navigate('/seller');
          }
        } else {
          toast({
            variant: 'destructive',
            title: 'Error de Inicio de Sesión',
            description: 'Usuario o contraseña incorrectos.',
          });
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-xl shadow-2xl glassmorphism"
          >
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
              >
                CRM CORPORATIVO VILLASEÑOR
              </motion.h1>
              <p className="mt-2 text-slate-300">Ingresa tus credenciales para continuar</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-slate-300">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej: admin o vendedor1"
                  className="mt-1 bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div className="relative">
                <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3">
                  <LogIn className="mr-2 h-5 w-5" /> Ingresar
                </Button>
              </motion.div>
            </form>
            <p className="text-xs text-center text-slate-400">
              
            </p>
          </motion.div>
        </div>
      );
    };

    export default LoginPage;
  