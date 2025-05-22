import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Progress } from '@/components/ui/progress';

    const AdminSellersTable = ({ sellers, itemVariants }) => {
      return (
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
            <CardHeader>
              <CardTitle className="text-xl text-slate-200">Rendimiento de Vendedores</CardTitle>
              <CardDescription className="text-slate-400">Detalle del desempeño individual de cada vendedor.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-slate-700">
                    <TableHead className="text-slate-300">Nombre</TableHead>
                    <TableHead className="text-slate-300">Ventas</TableHead>
                    <TableHead className="text-slate-300">Objetivo</TableHead>
                    <TableHead className="text-slate-300">Progreso</TableHead>
                    <TableHead className="text-slate-300">Clientes</TableHead>
                    <TableHead className="text-right text-slate-300">Tasa Conversión</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(sellers) && sellers.map((seller) => (
                    <TableRow key={seller.id} className="border-b-slate-700 hover:bg-slate-700/50">
                      <TableCell className="font-medium text-slate-100">{seller.name}</TableCell>
                      <TableCell className="text-slate-200">${(seller.sales || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-slate-200">${(seller.target || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Progress value={seller.target > 0 ? ((seller.sales || 0) / seller.target) * 100 : 0} className="w-full h-2 bg-slate-600 [&>div]:bg-gradient-to-r [&>div]:from-sky-500 [&>div]:to-cyan-400" />
                      </TableCell>
                      <TableCell className="text-slate-200">{seller.clients || 0}</TableCell>
                      <TableCell className="text-right text-slate-200">{((seller.conversionRate || 0) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(!Array.isArray(sellers) || sellers.length === 0) && (
                <p className="text-center py-4 text-slate-400">No hay vendedores para mostrar.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AdminSellersTable;