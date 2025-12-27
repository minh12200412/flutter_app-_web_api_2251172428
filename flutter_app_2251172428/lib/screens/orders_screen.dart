import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/orders_provider.dart';
import '../widgets/loading_view.dart';
import '../widgets/empty_state.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final auth = context.read<AuthProvider>();
    final token = auth.token;
    final customerId = auth.customerId;
    if (token != null && customerId != null) {
      await context.read<OrdersProvider>().loadOrders(token, customerId);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (auth.token == null) return const Center(child: Text('Login required'));

    final orders = context.watch<OrdersProvider>();
    if (orders.isLoading) return const LoadingView();
    if (orders.error != null) {
      return EmptyState(title: 'Error', message: orders.error!, onRetry: _load);
    }
    if (orders.orders.isEmpty) {
      return EmptyState(
          title: 'No orders',
          message: 'Place your first order.',
          onRetry: _load);
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: orders.orders.length,
        itemBuilder: (context, index) {
          final o = orders.orders[index];
          return Card(
            child: ListTile(
              title: Text('Order #${o.orderNumber}'),
              subtitle: Text('Status: ${o.status}\nItems: ${o.items.length}'),
              trailing: Text('${o.totalAmount}'),
            ),
          );
        },
      ),
    );
  }
}
