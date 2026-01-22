import { Order, Prescription } from '../types';

export const getFilteredOrders = (
  activeTab: string,
  searchQuery: string,
  orders: Order[],
  orderHistory: Order[],
  prescriptions: Prescription[]
): (Order | Prescription)[] => {
  const query = searchQuery.toLowerCase();

  switch (activeTab) {
    case 'reservations':
      return orders.filter(o =>
        o.medicineName.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query)
      );
    case 'history':
      return orderHistory.filter(o =>
        o.medicineName.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query)
      );
    case 'prescriptions':
      return prescriptions.filter(p =>
        p.doctorName.toLowerCase().includes(query) ||
        p.medicines.some(m => m.toLowerCase().includes(query))
      );
    default:
      return [];
  }
};
