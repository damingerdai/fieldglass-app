import 'package:fieldglass_mobile/app.dart';
import 'package:fieldglass_mobile/features/auth/login_page.dart';
import 'package:fieldglass_mobile/features/dashboard/dashboard_page.dart';
import 'package:fieldglass_mobile/features/dashboard/dashboard_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class RetryRepository implements DashboardRepository {
  int calls = 0;
  @override
  Future<DashboardData> load() async {
    if (calls++ == 0) throw Exception('offline');
    return const DashboardData([], []);
  }
}

void main() {
  final client = SupabaseClient(
    'https://test.supabase.co',
    'test-key',
    authOptions: const AuthClientOptions(autoRefreshToken: false),
  );
  tearDownAll(client.dispose);

  testWidgets('invalid credentials are validated before contacting auth', (
    tester,
  ) async {
    await tester.pumpWidget(MaterialApp(home: LoginPage(client: client)));
    await tester.enterText(find.byType(TextFormField).first, 'invalid');
    await tester.tap(find.text('Sign in'));
    await tester.pumpAndSettle();
    expect(find.text('Enter a valid email address.'), findsOneWidget);
    expect(find.text('Enter your password.'), findsOneWidget);
  });

  testWidgets('dashboard retries a failed request and renders empty data', (
    tester,
  ) async {
    final repository = RetryRepository();
    await tester.pumpWidget(
      MaterialApp(
        home: DashboardPage(
          repository: repository,
          email: 'test@example.com',
          onSignOut: () async {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Try again'), findsOneWidget);
    await tester.tap(find.text('Try again'));
    await tester.pumpAndSettle();
    expect(find.text('0 days'), findsOneWidget);
    expect(find.textContaining('No leave balances yet'), findsOneWidget);
    expect(repository.calls, 2);
    expect(tester.takeException(), isNull);
  });

  testWidgets('missing configuration shows setup instructions', (tester) async {
    await tester.pumpWidget(
      const FieldglassApp(setupError: 'Configuration required'),
    );
    expect(find.text('Configuration required'), findsOneWidget);
    expect(find.byType(LoginPage), findsNothing);
  });

  test('balances preserve fractional days from Postgres', () {
    final balance = LeaveBalance.fromJson({
      'leave_type': 'annual',
      'granted': 20,
      'used': 2.5,
      'remaining_balance': 17.5,
    });
    final data = DashboardData([balance], []);
    expect(data.used, 2.5);
    expect(data.remaining, 17.5);
    expect(days(data.remaining), '17.5');
  });
}
