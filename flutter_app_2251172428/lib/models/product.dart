class Product {
  Product(
      {required this.id,
      required this.name,
      required this.price,
      this.description});

  final int id;
  final String name;
  final num price;
  final String? description;

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      price: _toNum(json['price']),
      description: json['description'] as String?,
    );
  }
}

num _toNum(dynamic v) {
  if (v is num) return v;
  if (v is String) return num.tryParse(v) ?? 0;
  return 0;
}
