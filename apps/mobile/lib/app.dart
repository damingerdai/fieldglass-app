import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'features/auth/auth_gate.dart';

class FieldglassApp extends StatelessWidget {
  const FieldglassApp({super.key, this.client, this.setupError});

  final SupabaseClient? client;
  final String? setupError;

  @override
  Widget build(BuildContext context) {
    final colors = ColorScheme.fromSeed(seedColor: const Color(0xFF7C3AED));
    return MaterialApp(
      title: 'Fieldglass',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: colors,
        scaffoldBackgroundColor: const Color(0xFFF7F7FB),
        inputDecorationTheme: const InputDecorationTheme(
          border: OutlineInputBorder(),
          filled: true,
          fillColor: Colors.white,
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(minimumSize: const Size(0, 52)),
        ),
      ),
      home: setupError != null
          ? Scaffold(
              body: SafeArea(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32),
                    child: Text(setupError!, textAlign: TextAlign.center),
                  ),
                ),
              ),
            )
          : AuthGate(client: client!),
    );
  }
}
