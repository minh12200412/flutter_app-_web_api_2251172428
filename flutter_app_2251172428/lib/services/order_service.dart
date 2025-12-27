import '../config/api_config.dart';
import '../models/order.dart';
import 'api_client.dart';

class OrderService {
  OrderService(this.token);
  final String token;

  Future<Order> createOrder(
    List<Map<String, dynamic>> items, {
    String shippingAddress = 'N/A',
    String paymentMethod = 'cod',
  }) async {
    final api = ApiClient(token: token);
    final res = await api.post(Endpoints.orders, {
      'items': items,
      'shipping_address': shippingAddress,
      'payment_method': paymentMethod,
    });
    final data = res['data'] as Map<String, dynamic>? ?? {};
    return Order.fromJson(data);
  }

  Future<List<Order>> fetchOrders(int customerId) async {
    final api = ApiClient(token: token);
    final res = await api.get(Endpoints.customerOrders(customerId));
    final data = res['data'] as Map<String, dynamic>? ?? {};
    final items = data['items'] as List<dynamic>? ?? [];
    return items.map((e) => Order.fromJson(e as Map<String, dynamic>)).toList();
  }
}
