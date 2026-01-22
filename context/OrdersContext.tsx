import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, Medicine } from '../types';

interface OrdersContextType {
    orders: Order[];
    orderHistory: Order[];
    addOrder: (medicines: Medicine[], type: 'reservation' | 'delivery') => void;
    cancelOrder: (orderId: string) => void;
    isMedicineReserved: (medicineId: string) => boolean;
    getReservation: (medicineId: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('medifind_active_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
        const saved = localStorage.getItem('medifind_order_history');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist changes
    useEffect(() => {
        localStorage.setItem('medifind_active_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('medifind_order_history', JSON.stringify(orderHistory));
    }, [orderHistory]);

    const addOrder = (medicines: Medicine[], type: 'reservation' | 'delivery') => {
        const newOrders: Order[] = medicines.map(med => ({
            id: `${type === 'reservation' ? 'RES' : 'ORD'}-${Math.floor(1000 + Math.random() * 9000)}`,
            status: type === 'reservation' ? 'reserved' : 'delivery',
            medicineName: med.name,
            genericName: med.brand, // Using brand as generic placeholder or add real generic name
            quantity: 1, // Default to 1 for quick reservation
            unit: 'Pack',
            pharmacyName: med.pharmacyName,
            pharmacyAddress: 'Local Pharmacy', // Placeholder or add to Medicine type
            reservationExpiry: type === 'reservation' ? Math.floor(Date.now() / 1000) + 3600 : undefined,
            estimatedArrival: type === 'delivery' ? 'Today, 4:00 PM' : undefined,
            image: med.image,
            date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
            medicineId: med.id,
            price: med.price
        }));

        setOrders(prev => [...newOrders, ...prev]);
    };

    const cancelOrder = (orderId: string) => {
        const orderToCancel = orders.find(o => o.id === orderId);
        if (orderToCancel) {
            setOrders(prev => prev.filter(o => o.id !== orderId));
            setOrderHistory(prev => [{ ...orderToCancel, status: 'cancelled' }, ...prev]);
        }
    };

    const isMedicineReserved = (medicineId: string) => {
        return orders.some(o => o.medicineId === medicineId && o.status === 'reserved');
    };

    const getReservation = (medicineId: string) => {
        return orders.find(o => o.medicineId === medicineId && o.status === 'reserved');
    };

    return (
        <OrdersContext.Provider value={{ orders, orderHistory, addOrder, cancelOrder, isMedicineReserved, getReservation }}>
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    return context;
};
