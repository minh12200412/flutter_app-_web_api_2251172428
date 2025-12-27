import 'package:flutter/material.dart';

class ApiConfig {
  static const String baseUrl =
      'http://localhost:4000/api'; // Update to your backend host/port/prefix
}

class AppColors {
  static const primary = Color(0xFF2563EB);
  static const accent = Color(0xFF16A34A);
}

class Endpoints {
  static const login = '/auth/login';
  static const register = '/auth/register';
  static const authMe = '/auth/me';
  static const products = '/products';
  static const customers = '/customers';
  static const orders = '/orders';

  static String customerOrders(int id) => '/customers/$id/orders';
}
