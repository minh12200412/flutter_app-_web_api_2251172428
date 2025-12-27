import 'package:flutter/material.dart';

import '../models/product.dart';

class CartItem {
  CartItem({required this.product, this.quantity = 1});
  final Product product;
  int quantity;
  num get lineTotal => product.price * quantity;
}

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);

  num get total => _items.fold<num>(0, (sum, item) => sum + item.lineTotal);

  void add(Product product) {
    final existing = _items.where((i) => i.product.id == product.id).toList();
    if (existing.isNotEmpty) {
      existing.first.quantity += 1;
    } else {
      _items.add(CartItem(product: product));
    }
    notifyListeners();
  }

  void decrement(Product product) {
    final idx = _items.indexWhere((i) => i.product.id == product.id);
    if (idx == -1) return;
    if (_items[idx].quantity > 1) {
      _items[idx].quantity -= 1;
    } else {
      _items.removeAt(idx);
    }
    notifyListeners();
  }

  void remove(Product product) {
    _items.removeWhere((i) => i.product.id == product.id);
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }

  List<Map<String, dynamic>> toOrderPayload() {
    return _items
        .map((i) => {
              'product_id': i.product.id,
              'quantity': i.quantity,
            })
        .toList();
  }
}
