import '../config/api_config.dart';
import '../models/customer.dart';
import 'api_client.dart';

class CustomerService {
  CustomerService(this.token);
  final String token;

  Future<Customer> fetchProfile() async {
    final api = ApiClient(token: token);
    final res = await api.get(Endpoints.authMe);
    final data = res['data'] as Map<String, dynamic>? ?? {};
    return Customer.fromJson(data);
  }
}
