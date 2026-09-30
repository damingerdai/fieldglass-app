import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  const url = String.fromEnvironment('SUPABASE_URL');
  const key = String.fromEnvironment('SUPABASE_ANON_KEY');
  String? setupError;
  SupabaseClient? client;
  final uri = Uri.tryParse(url);
  if (uri == null || uri.scheme != 'https' || uri.host.isEmpty || key.isEmpty) {
    setupError =
        'Add SUPABASE_URL and SUPABASE_ANON_KEY to .env, '
        'then restart with --dart-define-from-file=.env.';
  } else {
    try {
      await Supabase.initialize(url: url, publishableKey: key);
      client = Supabase.instance.client;
    } catch (_) {
      setupError =
          'Could not initialize Fieldglass. Check your configuration '
          'and connection, then restart the app.';
    }
  }
  runApp(FieldglassApp(client: client, setupError: setupError));
}
