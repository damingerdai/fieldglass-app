import 'dart:async';

import 'package:fieldglass_mobile/features/auth/otp_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() {
  testWidgets('validates code, handles failure, and allows retry', (
    tester,
  ) async {
    final codes = <String>[];
    await tester.pumpWidget(
      MaterialApp(
        home: OtpPage(
          onVerify: (code) async {
            codes.add(code);
            if (codes.length == 1) throw const AuthException('Invalid code');
          },
          onSignOut: () async {},
        ),
      ),
    );
    await tester.enterText(find.byType(TextFormField), '12');
    await tester.tap(find.text('Verify'));
    await tester.pumpAndSettle();
    expect(find.text('Enter a 6-digit code.'), findsOneWidget);
    expect(codes, isEmpty);
    await tester.enterText(find.byType(TextFormField), '012345');
    await tester.tap(find.text('Verify'));
    await tester.pumpAndSettle();
    expect(find.text('Invalid code'), findsOneWidget);
    await tester.enterText(find.byType(TextFormField), '654321');
    await tester.tap(find.text('Verify'));
    await tester.pumpAndSettle();
    expect(codes, ['012345', '654321']);
    expect(find.text('Invalid code'), findsNothing);
  });

  testWidgets('blocks duplicate requests and permits sign out without a code', (
    tester,
  ) async {
    final pending = Completer<void>();
    var calls = 0;
    var signedOut = false;
    await tester.pumpWidget(
      MaterialApp(
        home: OtpPage(
          onVerify: (_) {
            calls++;
            return pending.future;
          },
          onSignOut: () async {
            signedOut = true;
          },
        ),
      ),
    );
    await tester.enterText(find.byType(TextFormField), '123456');
    await tester.tap(find.text('Verify'));
    await tester.pump();
    expect(
      tester.widget<FilledButton>(find.byType(FilledButton)).onPressed,
      isNull,
    );
    expect(
      tester.widget<TextButton>(find.byType(TextButton)).onPressed,
      isNull,
    );
    expect(calls, 1);
    pending.complete();
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextFormField), '');
    await tester.tap(find.text('Sign out'));
    await tester.pumpAndSettle();
    expect(signedOut, isTrue);
    expect(tester.takeException(), isNull);
  });
}
