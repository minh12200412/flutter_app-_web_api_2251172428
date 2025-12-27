import 'package:flutter/material.dart';

import '../models/order.dart';
import '../services/order_service.dart';

class OrdersProvider extends ChangeNotifier {
  List<Order> _orders = [];
  bool _loading = false;
  String? _error;

  List<Order> get orders => _orders;
  bool get isLoading => _loading;
  String? get error => _error;

  Future<void> loadOrders(String token, int customerId) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final service = OrderService(token);
      _orders = await service.fetchOrders(customerId);
    } catch (e) {
      _error = e.toString();
      _orders = [];
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<bool> placeOrder(
    String token,
    List<Map<String, dynamic>> items, {
    String shippingAddress = 'N/A',
    String paymentMethod = 'cod',
  }) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final service = OrderService(token);
      final created = await service.createOrder(
        items,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      );
      _orders = [created, ..._orders];
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
}
