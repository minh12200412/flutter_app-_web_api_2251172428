import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/product_provider.dart';
import '../providers/cart_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/empty_state.dart';
import '../widgets/loading_view.dart';
import 'product_detail_screen.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final auth = context.read<AuthProvider>();
    final token = auth.token;
    if (token != null) {
      await context.read<ProductProvider>().loadProducts(token);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final provider = context.watch<ProductProvider>();

    if (auth.token == null) {
      return const Center(child: Text('Login required'));
    }

    if (provider.isLoading) {
      return const LoadingView();
    }

    if (provider.error != null) {
      return EmptyState(
        title: 'Error',
        message: provider.error!,
        onRetry: _load,
      );
    }

    if (provider.items.isEmpty) {
      return EmptyState(
        title: 'No products',
        message: 'Nothing to show yet.',
        onRetry: _load,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: provider.items.length,
        itemBuilder: (context, index) {
          final p = provider.items[index];
          return ProductCard(
            product: p,
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => ProductDetailScreen(productId: p.id)),
            ),
            onAdd: () => context.read<CartProvider>().add(p),
          );
        },
      ),
    );
  }
}
