import 'package:flutter/material.dart';

import '../models/auth_session.dart';
import '../models/customer.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final _service = AuthService();
  AuthSession? _session;
  Customer? _registered;
  bool _loading = false;
  String? _error;

  bool get isLoading => _loading;
  bool get isAuthenticated => _session != null;
  String? get token => _session?.token;
  int? get customerId => _session?.customerId;
  String? get error => _error;

  Future<bool> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      _session = await _service.login(email, password);
      return true;
    } catch (e) {
      _error = e.toString();
      _session = null;
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<bool> register(String email, String password, String fullName, String city) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      _registered = await _service.register(email: email, password: password, fullName: fullName, city: city);
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void logout() {
    _session = null;
    notifyListeners();
  }

  Customer? get registeredCustomer => _registered;
}
