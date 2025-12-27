class Customer {
  Customer({required this.id, required this.email, required this.fullName, required this.city});

  final int id;
  final String email;
  final String fullName;
  final String city;

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['id'] as int,
      email: json['email'] as String? ?? '',
      fullName: json['full_name'] as String? ?? '',
      city: json['city'] as String? ?? '',
    );
  }
}
