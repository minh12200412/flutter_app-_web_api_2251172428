class AuthSession {
  AuthSession({required this.token, required this.customerId, required this.email});

  final String token;
  final int customerId;
  final String email;
}
