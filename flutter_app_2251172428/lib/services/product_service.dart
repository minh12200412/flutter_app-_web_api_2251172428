import '../config/api_config.dart';
import '../models/product.dart';
import 'api_client.dart';

class ProductService {
  ProductService(this.token);
  final String token;

  Future<List<Product>> fetchProducts() async {
    final api = ApiClient(token: token);
    final res = await api.get(Endpoints.products);
    final data = res['data'] as Map<String, dynamic>? ?? {};
    final items = data['items'] as List<dynamic>? ?? [];
    return items
        .map((e) => Product.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Product> fetchProduct(int id) async {
    final api = ApiClient(token: token);
    final res = await api.get('${Endpoints.products}/$id');
    final data = res['data'] as Map<String, dynamic>? ?? {};
    return Product.fromJson(data);
  }
}
