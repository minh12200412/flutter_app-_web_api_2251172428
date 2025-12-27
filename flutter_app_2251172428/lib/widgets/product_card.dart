import 'package:flutter/material.dart';

import '../models/product.dart';

class ProductCard extends StatelessWidget {
  const ProductCard(
      {super.key,
      required this.product,
      required this.onTap,
      required this.onAdd});

  final Product product;
  final VoidCallback onTap;
  final VoidCallback onAdd;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(product.name),
        subtitle: Text('${product.price}'),
        onTap: onTap,
        trailing: IconButton(
          icon: const Icon(Icons.add_shopping_cart),
          onPressed: onAdd,
        ),
      ),
    );
  }
}
