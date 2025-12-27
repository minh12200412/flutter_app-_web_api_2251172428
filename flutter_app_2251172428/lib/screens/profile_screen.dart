import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/customer_provider.dart';
import '../widgets/loading_view.dart';
import '../widgets/empty_state.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final auth = context.read<AuthProvider>();
    final token = auth.token;
    if (token != null) {
      await context.read<CustomerProvider>().loadProfile(token);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (!auth.isAuthenticated) {
      return const Center(child: Text('Login required'));
    }

    final customer = context.watch<CustomerProvider>();
    if (customer.isLoading) return const LoadingView();
    if (customer.error != null) {
      return EmptyState(title: 'Error', message: customer.error!, onRetry: _load);
    }
    if (customer.customer == null) {
      return const EmptyState(title: 'No profile', message: 'Pull to refresh.');
    }

    final c = customer.customer!;
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          ListTile(title: const Text('Email'), subtitle: Text(c.email)),
          ListTile(title: const Text('Full name'), subtitle: Text(c.fullName)),
          ListTile(title: const Text('City'), subtitle: Text(c.city)),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: () {
              context.read<AuthProvider>().logout();
              context.read<CustomerProvider>().clear();
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}
