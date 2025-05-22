import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Progress } from '@/components/ui/progress';
    import { DollarSign, Users, BarChart, TrendingUp, ShoppingCart } from 'lucide-react';

    const AdminStatsCards = ({ totalSales, totalTarget, overallProgress, activeSellersCount, averageConversionRate, itemVariants }) => {
      return (
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Ventas Totales</CardTitle>
              <DollarSign className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-300">${totalSales.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">
                {overallProgress >= 100 ? 
                  <span className="text-green-400 flex items-center"><TrendingUp className="h-4 w-4 mr-1"/> Objetivo Superado</span> : 
                  <span className="text-yellow-400 flex items-center"><TrendingUp className="h-4 w-4 mr-1"/> Hacia el objetivo</span>
                }
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Objetivo General</CardTitle>
              <ShoppingCart className="h-5 w-5 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-300">${totalTarget.toLocaleString()}</div>
              <Progress value={overallProgress} className="w-full h-2 mt-2 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500" />
            </CardContent>
          </Card>
          <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Vendedores Activos</CardTitle>
              <Users className="h-5 w-5 text-sky-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-300">{activeSellersCount}</div>
               <p className="text-xs text-slate-400 mt-1">Equipo en crecimiento</p>
            </CardContent>
          </Card>
           <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Tasa de Conversión Promedio</CardTitle>
              <BarChart className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-300">
                {averageConversionRate.toFixed(1)}%
              </div>
               <p className="text-xs text-slate-400 mt-1">Eficiencia del equipo</p>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AdminStatsCards;