import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

    const AdminSalesChart = ({ salesData, itemVariants }) => {
      const maxSale = Math.max(...salesData.map(s => s.sales), 0);
      return (
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
            <CardHeader>
              <CardTitle className="text-xl text-slate-200">Progreso de Ventas Mensuales</CardTitle>
              <CardDescription className="text-slate-400"></CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[350px]">
              <div className="w-full h-full flex items-end space-x-2 md:space-x-4 p-4 bg-slate-700/50 rounded-lg">
                {salesData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <motion.div
                      className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: maxSale > 0 ? `${(data.sales / maxSale) * 90}%` : '0%' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                    <span className="text-xs mt-2 text-slate-300">{data.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AdminSalesChart;