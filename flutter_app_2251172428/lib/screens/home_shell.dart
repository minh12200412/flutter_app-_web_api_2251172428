import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../config/api_config.dart';
import '../providers/auth_provider.dart';
import '../providers/customer_provider.dart';
import 'products_screen.dart';
import 'orders_screen.dart';
import 'profile_screen.dart';
import 'cart_screen.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;

  @override
  void initState() {
    super.initState();
    _loadInitial();
  }

  Future<void> _loadInitial() async {
    final auth = context.read<AuthProvider>();
    final token = auth.token;
    if (token != null) {
      await context.read<CustomerProvider>().loadProfile(token);
    }
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      const ProductsScreen(),
      const OrdersScreen(),
      const CartScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Web API Mobile'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.storefront_outlined), label: 'Products'),
          NavigationDestination(icon: Icon(Icons.receipt_long_outlined), label: 'Orders'),
          NavigationDestination(icon: Icon(Icons.shopping_cart_outlined), label: 'Cart'),
          NavigationDestination(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
    );
  }
}
