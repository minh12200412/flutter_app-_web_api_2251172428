import '../models/auth_session.dart';
import '../models/customer.dart';
import '../config/api_config.dart';
import 'api_client.dart';

class AuthService {
  Future<AuthSession> login(String email, String password) async {
    final api = ApiClient();
    final res =
        await api.post(Endpoints.login, {'email': email, 'password': password});
    final data = res['data'] as Map<String, dynamic>? ?? {};
    final token = data['token'] as String? ?? '';
    final customer = data['customer'] as Map<String, dynamic>? ?? {};
    final customerId = customer['id'] as int? ?? 0;
    return AuthSession(token: token, customerId: customerId, email: email);
  }

  Future<Customer> register(
      {required String email,
      required String password,
      required String fullName,
      required String city}) async {
    final api = ApiClient();
    final res = await api.post(Endpoints.register, {
      'email': email,
      'password': password,
      'full_name': fullName,
      'city': city,
    });
    final data = res['data'] as Map<String, dynamic>? ?? {};
    return Customer.fromJson(data);
  }
}
