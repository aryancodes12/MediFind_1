import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { getFilteredOrders } from '../utils/orderUtils';
import { Order, Prescription } from '../types';

describe('getFilteredOrders', () => {
  const mockOrders: Order[] = [
    {
      id: 'ORD-1',
      status: 'reserved',
      medicineName: 'Aspirin',
      genericName: 'Acetylsalicylic acid',
      quantity: 10,
      unit: 'Tablets',
      pharmacyName: 'Pharm A',
      pharmacyAddress: 'Addr A'
    },
    {
      id: 'ORD-2',
      status: 'ready',
      medicineName: 'Ibuprofen',
      genericName: 'Ibuprofen',
      quantity: 20,
      unit: 'Tablets',
      pharmacyName: 'Pharm B',
      pharmacyAddress: 'Addr B'
    }
  ];

  const mockHistory: Order[] = [
    {
      id: 'ORD-3',
      status: 'completed',
      medicineName: 'Paracetamol',
      genericName: 'Acetaminophen',
      quantity: 15,
      unit: 'Tablets',
      pharmacyName: 'Pharm C',
      pharmacyAddress: 'Addr C'
    }
  ];

  const mockPrescriptions: Prescription[] = [
    {
      id: 'RX-1',
      doctorName: 'Dr. House',
      date: '2025-01-01',
      medicines: ['Vicodin'],
      status: 'active',
      refillsLeft: 10
    }
  ];

  it('should filter reservations by medicine name', () => {
    const result = getFilteredOrders('reservations', 'aspirin', mockOrders, mockHistory, mockPrescriptions);
    assert.strictEqual(result.length, 1);
    assert.strictEqual((result[0] as Order).id, 'ORD-1');
  });

  it('should filter reservations by order ID', () => {
    const result = getFilteredOrders('reservations', 'ord-2', mockOrders, mockHistory, mockPrescriptions);
    assert.strictEqual(result.length, 1);
    assert.strictEqual((result[0] as Order).id, 'ORD-2');
  });

  it('should filter history by medicine name', () => {
    const result = getFilteredOrders('history', 'paracetamol', mockOrders, mockHistory, mockPrescriptions);
    assert.strictEqual(result.length, 1);
    assert.strictEqual((result[0] as Order).id, 'ORD-3');
  });

  it('should filter prescriptions by doctor name', () => {
    const result = getFilteredOrders('prescriptions', 'house', mockOrders, mockHistory, mockPrescriptions);
    assert.strictEqual(result.length, 1);
    assert.strictEqual((result[0] as Prescription).id, 'RX-1');
  });

  it('should return empty array for unknown tab', () => {
    const result = getFilteredOrders('unknown', '', mockOrders, mockHistory, mockPrescriptions);
    assert.deepStrictEqual(result, []);
  });

  it('should return all items if search query is empty', () => {
      const result = getFilteredOrders('reservations', '', mockOrders, mockHistory, mockPrescriptions);
      assert.strictEqual(result.length, 2);
  });
});
