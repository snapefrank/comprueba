import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      DialogFooter,
      DialogClose,
    } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { UserPlus } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const AddSellerDialog = ({ onAddSeller }) => {
      const [newSellerName, setNewSellerName] = useState('');
      const [newSellerTarget, setNewSellerTarget] = useState('');
      const [isOpen, setIsOpen] = useState(false);
      const { toast } = useToast();

      const handleSubmit = () => {
        if (!newSellerName || !newSellerTarget) {
          toast({ variant: "destructive", title: "Error", description: "Nombre y objetivo son requeridos." });
          return;
        }
        onAddSeller(newSellerName, newSellerTarget);
        setNewSellerName('');
        setNewSellerTarget('');
        setIsOpen(false);
      };

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
              <UserPlus className="mr-2 h-4 w-4" /> Agregar Vendedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-slate-50">
            <DialogHeader>
              <DialogTitle className="text-purple-400">Agregar Nuevo Vendedor</DialogTitle>
              <DialogDescription className="text-slate-400">
                Completa los detalles del nuevo vendedor. La contraseña será 'vendedor' por defecto. El nombre de usuario será el mismo que el nombre.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-seller-name" className="text-right text-slate-300">
                  Nombre
                </Label>
                <Input
                  id="new-seller-name"
                  value={newSellerName}
                  onChange={(e) => setNewSellerName(e.target.value)}
                  className="col-span-3 bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-seller-target" className="text-right text-slate-300">
                  Objetivo ($)
                </Label>
                <Input
                  id="new-seller-target"
                  type="number"
                  value={newSellerTarget}
                  onChange={(e) => setNewSellerTarget(e.target.value)}
                  className="col-span-3 bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-400"
                  placeholder="Ej: 15000"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                 <Button variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white">Guardar Vendedor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default AddSellerDialog;