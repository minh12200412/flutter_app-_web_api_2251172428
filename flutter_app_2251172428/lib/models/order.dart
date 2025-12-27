import 'order_item.dart';

class Order {
  Order(
      {required this.id,
      required this.orderNumber,
      required this.totalAmount,
      required this.status,
      required this.items});

  final int id;
  final String orderNumber;
  final num totalAmount;
  final String status;
  final List<OrderItem> items;

  factory Order.fromJson(Map<String, dynamic> json) {
    final itemsJson = json['items'] as List<dynamic>?;
    return Order(
      id: json['id'] as int,
      orderNumber: json['order_number'] as String? ?? '',
      totalAmount: _toNum(json['total_amount'] ?? json['total']),
      status: json['status'] as String? ?? 'pending',
      items: itemsJson != null
          ? itemsJson
              .map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
              .toList()
          : <OrderItem>[],
    );
  }
}

num _toNum(dynamic v) {
  if (v is num) return v;
  if (v is String) return num.tryParse(v) ?? 0;
  return 0;
}
