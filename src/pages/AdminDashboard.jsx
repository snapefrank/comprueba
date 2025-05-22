import React, { useState, useEffect } from 'react';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext';
    import { useNavigate } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast';
    import AdminHeader from '@/components/admin/AdminHeader';
    import AdminStatsCards from '@/components/admin/AdminStatsCards';
    import AdminSalesChart from '@/components/admin/AdminSalesChart';
    import AdminSellersTable from '@/components/admin/AdminSellersTable';
    import AddSellerDialog from '@/components/admin/AddSellerDialog';
    import { BarChart } from 'lucide-react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

    const initialSalesData = [
      { month: 'Ene', sales: 25000 }, { month: 'Feb', sales: 30000 }, { month: 'Mar', sales: 45000 },
      { month: 'Abr', sales: 40000 }, { month: 'May', sales: 55000 }, { month: 'Jun', sales: 60000 },
    ];

    const AdminDashboard = () => {
      const { user, logout, getAllSellersData, addSellerUser, sellersData: sellersDataFromContext } = useAuth();
      const navigate = useNavigate();
      const { toast } = useToast();

      const [sellers, setSellers] = useState([]);
      
      const [salesData, setSalesData] = useState(() => {
        const savedSales = localStorage.getItem('salesData');
        return savedSales ? JSON.parse(savedSales) : initialSalesData;
      });

      useEffect(() => {
        const allSellers = getAllSellersData();
        setSellers(Array.isArray(allSellers) ? allSellers : []);
      }, [sellersDataFromContext, getAllSellersData]);


      useEffect(() => {
        localStorage.setItem('salesData', JSON.stringify(salesData));
      }, [salesData]);

      const totalSales = Array.isArray(sellers) ? sellers.reduce((sum, seller) => sum + (seller.sales || 0), 0) : 0;
      const totalTarget = Array.isArray(sellers) ? sellers.reduce((sum, seller) => sum + (seller.target || 0), 0) : 0;
      const overallProgress = totalTarget > 0 ? (totalSales / totalTarget) * 100 : 0;
      const averageConversionRate = Array.isArray(sellers) && sellers.length > 0 
        ? (sellers.reduce((acc, s) => acc + (s.conversionRate || 0), 0) / sellers.length * 100)
        : 0;

      const handleLogout = () => {
        logout();
        toast({ title: 'Sesión Cerrada', description: 'Has cerrado sesión exitosamente.' });
        navigate('/login');
      };

      const handleAddSeller = (newSellerName, newSellerTarget) => {
        const success = addSellerUser(newSellerName, newSellerName, newSellerTarget); // Assuming username is same as name for simplicity
        if (success) {
          toast({ title: "Vendedor Agregado", description: `${newSellerName} ha sido agregado.` });
          // Data will be updated via context and useEffect
        } else {
          toast({ variant: "destructive", title: "Error", description: "El vendedor ya existe o hubo un problema." });
        }
      };
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8 text-slate-50">
          <AdminHeader user={user} onLogout={handleLogout} itemVariants={itemVariants} />

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Tabs defaultValue="overview" className="space-y-4">
              <motion.div variants={itemVariants}>
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 bg-slate-800 p-1 rounded-lg">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Resumen General</TabsTrigger>
                  <TabsTrigger value="sellers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Vendedores</TabsTrigger>
                  <TabsTrigger value="reports" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Reportes (Próximamente)</TabsTrigger>
                </TabsList>
              </motion.div>

              <TabsContent value="overview" className="space-y-6">
                <AdminStatsCards
                  totalSales={totalSales}
                  totalTarget={totalTarget}
                  overallProgress={overallProgress}
                  activeSellersCount={Array.isArray(sellers) ? sellers.length : 0}
                  averageConversionRate={averageConversionRate}
                  itemVariants={itemVariants}
                />
                <AdminSalesChart salesData={salesData} itemVariants={itemVariants} />
              </TabsContent>

              <TabsContent value="sellers" className="space-y-6">
                <motion.div variants={itemVariants} className="flex justify-end">
                  <AddSellerDialog onAddSeller={handleAddSeller} />
                </motion.div>
                <AdminSellersTable sellers={sellers} itemVariants={itemVariants} />
              </TabsContent>
              
              <TabsContent value="reports">
                 <motion.div variants={itemVariants}>
                    <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
                        <CardHeader>
                        <CardTitle className="text-xl text-slate-200">Reportes Avanzados</CardTitle>
                        <CardDescription className="text-slate-400"></CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center h-64">
                            <BarChart className="h-16 w-16 text-purple-400 mb-4" />
                            <p className="text-slate-300"></p>
                        </CardContent>
                    </Card>
                 </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      );
    };

    export default AdminDashboard;