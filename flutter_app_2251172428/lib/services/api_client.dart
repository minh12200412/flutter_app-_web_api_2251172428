import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';

class ApiClient {
  ApiClient({this.token});

  final String? token;

  Map<String, String> _headers() {
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Uri _uri(String path) => Uri.parse('${ApiConfig.baseUrl}$path');

  Future<Map<String, dynamic>> get(String path) async {
    final res = await http.get(_uri(path), headers: _headers());
    return _handleResponse(res);
  }

  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body) async {
    final res = await http.post(_uri(path), headers: _headers(), body: jsonEncode(body));
    return _handleResponse(res);
  }

  Future<Map<String, dynamic>> put(String path, Map<String, dynamic> body) async {
    final res = await http.put(_uri(path), headers: _headers(), body: jsonEncode(body));
    return _handleResponse(res);
  }

  Map<String, dynamic> _handleResponse(http.Response res) {
    final data = res.body.isNotEmpty ? jsonDecode(res.body) : {};
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return data as Map<String, dynamic>;
    }
    final message = data is Map<String, dynamic> && data['message'] != null ? data['message'] as String : 'Request failed';
    throw ApiException(message, statusCode: res.statusCode);
  }
}

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});
  final String message;
  final int? statusCode;
  @override
  String toString() => 'ApiException($statusCode): $message';
}
