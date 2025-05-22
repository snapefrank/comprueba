import React, { createContext, useState, useContext, useEffect } from 'react';

    const AuthContext = createContext(null);

    const initialUsers = {
      admin: { password: 'admin', role: 'admin', id: 'admin' },
      vendedor1: { password: 'vendedor1', role: 'seller', id: 'vendedor1' },
      vendedor2: { password: 'vendedor2', role: 'seller', id: 'vendedor2' },
    };
    
    const initialSellersDataFromCode = {
      vendedor1: { id: 'vendedor1', name: 'Carol Salcedo', sales: 15000, target: 20000, clients: 25, conversionRate: 0.6 },
      vendedor2: { id: 'vendedor2', name: 'Miguel Rosales', sales: 12000, target: 18000, clients: 20, conversionRate: 0.5 },
    };


    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('crmUser');
        return savedUser ? JSON.parse(savedUser) : null;
      });
      
      const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('crmUsersList');
        return savedUsers ? JSON.parse(savedUsers) : initialUsers;
      });

      const [sellersData, setSellersData] = useState(() => {
        const savedSellers = localStorage.getItem('sellersData');
        let baseSellers = {};
        try {
            baseSellers = savedSellers ? JSON.parse(savedSellers) : initialSellersDataFromCode;
            if (typeof baseSellers !== 'object' || baseSellers === null) {
                 baseSellers = { ...initialSellersDataFromCode };
            }
        } catch (error) {
            baseSellers = { ...initialSellersDataFromCode };
        }
        
        const currentSellers = { ...baseSellers };
        Object.keys(users).forEach(username => {
            if (users[username].role === 'seller' && !currentSellers[users[username].id]) {
                currentSellers[users[username].id] = { 
                    id: users[username].id, 
                    name: username, 
                    sales: 0, 
                    target: 10000, 
                    clients: 0, 
                    conversionRate: 0 
                };
            }
        });
        return currentSellers;
      });

      useEffect(() => {
        if (user) {
          localStorage.setItem('crmUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('crmUser');
        }
      }, [user]);

      useEffect(() => {
        localStorage.setItem('crmUsersList', JSON.stringify(users));
      }, [users]);
      
      useEffect(() => {
        localStorage.setItem('sellersData', JSON.stringify(sellersData));
      }, [sellersData]);


      const login = (username, password) => {
        const userData = users[username];
        if (userData && userData.password === password) {
          const userToLogin = { username, role: userData.role, id: userData.id };
          setUser(userToLogin);
          
          if(userData.role === 'seller' && !sellersData[userData.id]) {
            setSellersData(prev => ({
              ...prev,
              [userData.id]: {
                id: userData.id,
                name: username,
                sales: 0,
                target: 10000,
                clients: 0,
                conversionRate: 0,
              }
            }));
          }
          return true;
        }
        return false;
      };

      const logout = () => {
        setUser(null);
      };
      
      const addSellerUser = (username, name, target) => {
        if (users[username]) {
          return false; 
        }
        const newId = username; 
        setUsers(prevUsers => ({
          ...prevUsers,
          [username]: { password: 'vendedor', role: 'seller', id: newId }
        }));
        setSellersData(prevData => ({
          ...prevData,
          [newId]: { id: newId, name: name, sales: 0, target: parseFloat(target) || 10000, clients: 0, conversionRate: 0 }
        }));
        return true;
      };

      const updateSellerData = (sellerId, data) => {
        setSellersData(prev => {
          const updated = {
            ...prev,
            [sellerId]: { ...(prev[sellerId] || {}), ...data }
          };
          return updated;
        });
      };

      const getSellerData = (sellerId) => {
        return sellersData[sellerId];
      };
      
      const getAllSellersData = () => {
        return Object.values(sellersData || {});
      };


      return (
        <AuthContext.Provider value={{ user, users, login, logout, addSellerUser, updateSellerData, getSellerData, getAllSellersData, sellersData }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => {
      return useContext(AuthContext);
    };