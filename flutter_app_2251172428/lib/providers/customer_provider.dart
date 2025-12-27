import 'package:flutter/material.dart';

import '../models/customer.dart';
import '../services/customer_service.dart';

class CustomerProvider extends ChangeNotifier {
  Customer? _customer;
  bool _loading = false;
  String? _error;

  Customer? get customer => _customer;
  bool get isLoading => _loading;
  String? get error => _error;

  Future<void> loadProfile(String token) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final service = CustomerService(token);
      _customer = await service.fetchProfile();
    } catch (e) {
      _error = e.toString();
      _customer = null;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void clear() {
    _customer = null;
    notifyListeners();
  }
}
