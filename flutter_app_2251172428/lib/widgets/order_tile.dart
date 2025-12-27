import 'package:flutter/material.dart';

import '../models/order.dart';

class OrderTile extends StatelessWidget {
  const OrderTile({super.key, required this.order});

  final Order order;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text('Order #${order.orderNumber}'),
        subtitle: Text('Status: ${order.status}\nItems: ${order.items.length}'),
        trailing: Text('${order.totalAmount}'),
      ),
    );
  }
}
