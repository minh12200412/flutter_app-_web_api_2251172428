import 'product.dart';

class OrderItem {
  OrderItem(
      {required this.productId,
      required this.quantity,
      required this.price,
      this.product});

  final int productId;
  final int quantity;
  final num price;
  final Product? product;

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      productId: json['product_id'] as int,
      quantity: json['quantity'] as int? ?? 0,
      price: _toNum(json['price']),
      product: json['product'] != null
          ? Product.fromJson(json['product'] as Map<String, dynamic>)
          : null,
    );
  }
}

num _toNum(dynamic v) {
  if (v is num) return v;
  if (v is String) return num.tryParse(v) ?? 0;
  return 0;
}
