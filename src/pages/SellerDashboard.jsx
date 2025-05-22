
    import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Progress } from '@/components/ui/progress';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { DollarSign, Users, Target, LogOut, UserPlus, Edit3, Trash2, PlusCircle } from 'lucide-react';
    import { useAuth } from '@/contexts/AuthContext';
    import { useNavigate } from 'react-router-dom';

    const initialClients = [
      { id: 1, name: 'Empresa Alfa', contact: 'juan.perez@alfa.com', status: 'Contactado', lastInteraction: '2025-05-15', potentialValue: 5000 },
      { id: 2, name: 'Beta Corp', contact: 'maria.gomez@beta.com', status: 'Propuesta Enviada', lastInteraction: '2025-05-10', potentialValue: 12000 },
      { id: 3, name: 'Gamma Inc', contact: 'carlos.ruiz@gamma.com', status: 'Negociación', lastInteraction: '2025-05-18', potentialValue: 8000 },
    ];

    const SellerDashboard = () => {
      const { user, logout, updateSellerData, getSellerData } = useAuth();
      const navigate = useNavigate();
      const { toast } = useToast();
      
      const sellerData = getSellerData(user?.id) || { sales: 0, target: 10000, clients: 0, conversionRate: 0, name: user?.username };
      
      const [clients, setClients] = useState(() => {
        const savedClients = localStorage.getItem(`clients_${user?.id}`);
        return savedClients ? JSON.parse(savedClients) : initialClients;
      });

      const [isClientModalOpen, setIsClientModalOpen] = useState(false);
      const [editingClient, setEditingClient] = useState(null);
      const [clientForm, setClientForm] = useState({ name: '', contact: '', status: 'Nuevo', potentialValue: '' });

      useEffect(() => {
        localStorage.setItem(`clients_${user?.id}`, JSON.stringify(clients));
        // Update seller's client count
        const currentSellerData = getSellerData(user?.id);
        if (currentSellerData) {
            updateSellerData(user.id, { ...currentSellerData, clients: clients.length });
        }
      }, [clients, user?.id, getSellerData, updateSellerData]);


      const handleLogout = () => {
        logout();
        toast({ title: 'Sesión Cerrada', description: 'Has cerrado sesión exitosamente.' });
        navigate('/login');
      };

      const handleClientInputChange = (e) => {
        const { name, value } = e.target;
        setClientForm(prev => ({ ...prev, [name]: value }));
      };

      const handleSaveClient = () => {
        if (!clientForm.name || !clientForm.contact) {
          toast({ variant: "destructive", title: "Error", description: "Nombre y contacto son requeridos." });
          return;
        }

        const newClient = {
          ...clientForm,
          id: editingClient ? editingClient.id : Date.now(),
          potentialValue: parseFloat(clientForm.potentialValue) || 0,
          lastInteraction: new Date().toISOString().split('T')[0],
        };

        if (editingClient) {
          setClients(clients.map(c => c.id === editingClient.id ? newClient : c));
          toast({ title: "Cliente Actualizado", description: `${newClient.name} ha sido actualizado.` });
        } else {
          setClients([...clients, newClient]);
          toast({ title: "Cliente Agregado", description: `${newClient.name} ha sido agregado.` });
        }
        
        setIsClientModalOpen(false);
        setEditingClient(null);
        setClientForm({ name: '', contact: '', status: 'Nuevo', potentialValue: '' });
      };

      const openEditClientModal = (client) => {
        setEditingClient(client);
        setClientForm({ 
          name: client.name, 
          contact: client.contact, 
          status: client.status, 
          potentialValue: client.potentialValue.toString() 
        });
        setIsClientModalOpen(true);
      };
      
      const openAddClientModal = () => {
        setEditingClient(null);
        setClientForm({ name: '', contact: '', status: 'Nuevo', potentialValue: '' });
        setIsClientModalOpen(true);
      };

      const handleDeleteClient = (clientId) => {
        setClients(clients.filter(c => c.id !== clientId));
        toast({ title: "Cliente Eliminado", description: "El cliente ha sido eliminado." });
      };
      
      const handleRecordSale = (client) => {
        const saleAmount = client.potentialValue; // Assuming potential value becomes sale amount
        const currentSellerData = getSellerData(user.id);
        if (currentSellerData) {
          const updatedSales = currentSellerData.sales + saleAmount;
          const updatedClientsWon = (currentSellerData.clientsWon || 0) + 1;
          const totalInteractions = clients.length; // Or a more specific count of interacted clients
          const newConversionRate = totalInteractions > 0 ? updatedClientsWon / totalInteractions : 0;

          updateSellerData(user.id, { 
            ...currentSellerData, 
            sales: updatedSales,
            clientsWon: updatedClientsWon, // You might need to add this field to seller data
            conversionRate: newConversionRate
          });
          
          // Update client status to 'Ganado' or similar
          setClients(clients.map(c => c.id === client.id ? { ...c, status: 'Ganado' } : c));

          toast({ title: "Venta Registrada", description: `Venta de $${saleAmount.toLocaleString()} a ${client.name} registrada.` });
        }
      };


      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8 text-slate-50">
          <header className="flex justify-between items-center mb-8">
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
              Panel de Vendedor
            </motion.h1>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300 hidden md:block">Bienvenido, {sellerData.name}</span>
              <Button onClick={handleLogout} variant="destructive" size="sm" className="bg-pink-600 hover:bg-pink-700">
                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
              </Button>
            </div>
          </header>

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Mis Ventas</CardTitle>
                  <DollarSign className="h-5 w-5 text-sky-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-sky-300">${sellerData.sales.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Mi Objetivo</CardTitle>
                  <Target className="h-5 w-5 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-300">${sellerData.target.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Progreso</CardTitle>
                  <Progress value={(sellerData.sales / sellerData.target) * 100} className="w-10 h-10" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-100">{((sellerData.sales / sellerData.target) * 100).toFixed(1)}%</div>
                  <Progress value={(sellerData.sales / sellerData.target) * 100} className="w-full h-2 mt-2 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-sky-500 [&>div]:to-cyan-400" />
                </CardContent>
              </Card>
              <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Clientes Gestionados</CardTitle>
                  <Users className="h-5 w-5 text-teal-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-300">{clients.length}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-slate-800/70 border-slate-700 glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-slate-200">Mis Clientes</CardTitle>
                    <CardDescription className="text-slate-400">Gestiona tus prospectos y clientes.</CardDescription>
                  </div>
                  <Button onClick={openAddClientModal} className="bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white">
                    <UserPlus className="mr-2 h-4 w-4" /> Agregar Cliente
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-slate-700">
                        <TableHead className="text-slate-300">Nombre</TableHead>
                        <TableHead className="text-slate-300">Contacto</TableHead>
                        <TableHead className="text-slate-300">Estado</TableHead>
                        <TableHead className="text-slate-300">Valor Potencial</TableHead>
                        <TableHead className="text-slate-300">Última Interacción</TableHead>
                        <TableHead className="text-right text-slate-300">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id} className="border-b-slate-700 hover:bg-slate-700/50">
                          <TableCell className="font-medium text-slate-100">{client.name}</TableCell>
                          <TableCell className="text-slate-200">{client.contact}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              client.status === 'Ganado' ? 'bg-green-500/20 text-green-300' :
                              client.status === 'Propuesta Enviada' ? 'bg-yellow-500/20 text-yellow-300' :
                              client.status === 'Negociación' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-slate-600 text-slate-300'
                            }`}>
                              {client.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-200">${client.potentialValue.toLocaleString()}</TableCell>
                          <TableCell className="text-slate-200">{client.lastInteraction}</TableCell>
                          <TableCell className="text-right space-x-2">
                            {client.status !== 'Ganado' && (
                               <Button variant="ghost" size="icon" onClick={() => handleRecordSale(client)} className="text-green-400 hover:text-green-300 hover:bg-green-500/10">
                                <PlusCircle className="h-4 w-4" />
                                <span className="sr-only">Registrar Venta</span>
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => openEditClientModal(client)} className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10">
                              <Edit3 className="h-4 w-4" />
                               <span className="sr-only">Editar</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)} className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10">
                              <Trash2 className="h-4 w-4" />
                               <span className="sr-only">Eliminar</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {clients.length === 0 && (
                    <p className="text-center text-slate-400 py-8">No tienes clientes registrados aún. ¡Empieza agregando algunos!</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <Dialog open={isClientModalOpen} onOpenChange={setIsClientModalOpen}>
            <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-slate-50">
              <DialogHeader>
                <DialogTitle className="text-sky-400">{editingClient ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</DialogTitle>
                <DialogDescription className="text-slate-400">
                  {editingClient ? 'Actualiza los detalles del cliente.' : 'Completa los detalles del nuevo cliente.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-name" className="text-right text-slate-300">Nombre</Label>
                  <Input id="client-name" name="name" value={clientForm.name} onChange={handleClientInputChange} className="col-span-3 bg-slate-700 border-slate-600" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-contact" className="text-right text-slate-300">Contacto</Label>
                  <Input id="client-contact" name="contact" value={clientForm.contact} onChange={handleClientInputChange} className="col-span-3 bg-slate-700 border-slate-600" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-status" className="text-right text-slate-300">Estado</Label>
                  <select id="client-status" name="status" value={clientForm.status} onChange={handleClientInputChange} className="col-span-3 bg-slate-700 border-slate-600 p-2 rounded-md text-slate-50 focus:ring-sky-500 focus:border-sky-500">
                    <option value="Nuevo">Nuevo</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Propuesta Enviada">Propuesta Enviada</option>
                    <option value="Negociación">Negociación</option>
                    <option value="Perdido">Perdido</option>
                    <option value="Ganado">Ganado</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client-potential" className="text-right text-slate-300">Valor Potencial</Label>
                  <Input id="client-potential" name="potentialValue" type="number" value={clientForm.potentialValue} onChange={handleClientInputChange} className="col-span-3 bg-slate-700 border-slate-600" placeholder="$"/>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleSaveClient} className="bg-sky-600 hover:bg-sky-700 text-white">{editingClient ? 'Guardar Cambios' : 'Agregar Cliente'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    };

    export default SellerDashboard;
  