import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { LogOut } from 'lucide-react';

    const AdminHeader = ({ user, onLogout, itemVariants }) => {
      return (
        <header className="flex justify-between items-center mb-8">
          <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Panel de Daniel Villaseñor
          </motion.h1>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300 hidden md:block">Bienvenido Daniel,</span>
            <Button onClick={onLogout} variant="destructive" size="sm" className="bg-pink-600 hover:bg-pink-700">
              <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </Button>
          </div>
        </header>
      );
    };

    export default AdminHeader;