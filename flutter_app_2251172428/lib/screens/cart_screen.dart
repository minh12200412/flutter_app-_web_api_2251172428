import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../providers/orders_provider.dart';
import '../widgets/empty_state.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  Future<void> _placeOrder(BuildContext context) async {
    final auth = context.read<AuthProvider>();
    final token = auth.token;
    if (token == null) return;

    final cart = context.read<CartProvider>();
    final orders = context.read<OrdersProvider>();
    final ok = await orders.placeOrder(
      token,
      cart.toOrderPayload(),
      shippingAddress: 'Default address',
      paymentMethod: 'cod',
    );
    if (ok) {
      cart.clear();
      if (context.mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Order placed')));
      }
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(orders.error ?? 'Order failed')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (auth.token == null) return const Center(child: Text('Login required'));

    return Consumer<CartProvider>(
      builder: (context, cart, _) {
        if (cart.items.isEmpty) {
          return const EmptyState(
              title: 'Cart empty', message: 'Add products to start.');
        }
        return Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              Expanded(
                child: ListView.separated(
                  itemCount: cart.items.length,
                  separatorBuilder: (_, __) => const Divider(),
                  itemBuilder: (context, index) {
                    final item = cart.items[index];
                    return ListTile(
                      title: Text(item.product.name),
                      subtitle: Text('Qty: ${item.quantity}'),
                      trailing: Text('${item.lineTotal}'),
                      leading: IconButton(
                        icon: const Icon(Icons.remove_circle_outline),
                        onPressed: () => cart.decrement(item.product),
                      ),
                      onTap: () => cart.add(item.product),
                    );
                  },
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Total: ${cart.total}',
                      style: Theme.of(context).textTheme.titleMedium),
                  FilledButton.icon(
                    onPressed: () => _placeOrder(context),
                    icon: const Icon(Icons.check),
                    label: const Text('Place order'),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
