import 'package:flutter/material.dart';

import '../models/product.dart';
import '../services/product_service.dart';

class ProductProvider extends ChangeNotifier {
  List<Product> _items = [];
  bool _loading = false;
  String? _error;

  List<Product> get items => _items;
  bool get isLoading => _loading;
  String? get error => _error;

  Future<void> loadProducts(String token) async {
    if (_loading) return;
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final service = ProductService(token);
      _items = await service.fetchProducts();
    } catch (e) {
      _error = e.toString();
      _items = [];
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Product? getById(int id) {
    try {
      return _items.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }
}
