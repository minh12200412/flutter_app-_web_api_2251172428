import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/product_provider.dart';
import '../providers/cart_provider.dart';
import '../models/product.dart';
import '../widgets/loading_view.dart';

class ProductDetailScreen extends StatefulWidget {
  const ProductDetailScreen({super.key, required this.productId});

  final int productId;

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  Product? _product;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    final auth = context.read<AuthProvider>();
    final token = auth.token;
    if (token == null) {
      setState(() {
        _error = 'No token';
        _loading = false;
      });
      return;
    }
    try {
      final provider = context.read<ProductProvider>();
      final cached = provider.getById(widget.productId);
      if (cached != null) {
        _product = cached;
      } else {
        await provider.loadProducts(token);
        _product = provider.getById(widget.productId);
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const LoadingView();
    if (_error != null) return Center(child: Text(_error!));
    if (_product == null) return const Center(child: Text('Product not found'));

    return Scaffold(
      appBar: AppBar(title: Text(_product!.name)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_product!.name,
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            Text('${_product!.price} VND'),
            const SizedBox(height: 12),
            Text(_product!.description ?? 'No description'),
            const Spacer(),
            ElevatedButton.icon(
              icon: const Icon(Icons.add_shopping_cart),
              onPressed: () {
                context.read<CartProvider>().add(_product!);
                ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Added to cart')));
              },
              label: const Text('Add to cart'),
            ),
          ],
        ),
      ),
    );
  }
}
