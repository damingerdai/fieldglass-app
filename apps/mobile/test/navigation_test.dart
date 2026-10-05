import 'package:fieldglass_mobile/features/dashboard/dashboard_repository.dart';
import 'package:fieldglass_mobile/features/leave/leave_records_page.dart';
import 'package:fieldglass_mobile/features/leave/leave_repository.dart';
import 'package:fieldglass_mobile/features/navigation/app_shell.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class EmptyDashboard implements DashboardRepository {
  int calls = 0;
  @override
  Future<DashboardData> load() async {
    calls++;
    return const DashboardData([], []);
  }
}

class FakeLeaves implements LeaveRepository {
  final calls = <(LeaveSection, int)>[];
  bool fail = false;
  @override
  Future<List<LeaveRecord>> load(
    LeaveSection section, {
    required int offset,
  }) async {
    calls.add((section, offset));
    if (fail) {
      fail = false;
      throw Exception('offline');
    }
    return section == LeaveSection.requests
        ? [
            const LeaveRecord(
              type: 'annual',
              amount: 2.5,
              startDate: '2026-10-05',
              endDate: '2026-10-07',
              status: 'pending',
            ),
          ]
        : [];
  }
}

void main() {
  testWidgets(
    'drawer switches pages, highlights selection and retains loaded data',
    (tester) async {
      final dashboard = EmptyDashboard();
      final leaves = FakeLeaves();
      var signedOut = false;
      await tester.pumpWidget(
        MaterialApp(
          home: AppShell(
            dashboardRepository: dashboard,
            leaveRepository: leaves,
            email: 'test@example.com',
            onSignOut: () async {
              signedOut = true;
            },
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(leaves.calls, isEmpty);

      Future<void> navigate(String title) async {
        await tester.tap(find.byTooltip('Open navigation menu'));
        await tester.pumpAndSettle();
        await tester.tap(find.widgetWithText(ListTile, title));
        await tester.pumpAndSettle();
      }

      await navigate('Leave Entitlements');
      expect(find.text('No leave entitlements yet.'), findsOneWidget);
      await navigate('Leave Requests');
      expect(find.text('2.5 days'), findsOneWidget);
      expect(find.text('pending'), findsOneWidget);
      await tester.tap(find.byTooltip('Open navigation menu'));
      await tester.pumpAndSettle();
      expect(
        tester
            .widget<ListTile>(find.widgetWithText(ListTile, 'Leave Requests'))
            .selected,
        isTrue,
      );
      await tester.tap(find.widgetWithText(ListTile, 'Dashboard'));
      await tester.pumpAndSettle();
      expect(find.text('AVAILABLE BALANCE'), findsOneWidget);
      await navigate('Leave Requests');
      expect(leaves.calls.length, 2);
      expect(dashboard.calls, 1);
      await navigate('Profile');
      expect(find.text('Your Profile'), findsOneWidget);
      expect(find.text('test@example.com'), findsOneWidget);
      await tester.tap(find.byTooltip('Open navigation menu'));
      await tester.pumpAndSettle();
      final profile = find.widgetWithText(ListTile, 'Profile');
      expect(tester.widget<ListTile>(profile).selected, isTrue);
      expect(tester.getBottomRight(profile).dy, greaterThan(500));
      await tester.tap(profile);
      await tester.pumpAndSettle();
      await tester.tap(find.byTooltip('Sign out'));
      await tester.pumpAndSettle();
      expect(signedOut, isTrue);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets('leave page retries errors and refreshes records', (
    tester,
  ) async {
    final leaves = FakeLeaves()..fail = true;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: LeaveRecordsPage(
            repository: leaves,
            section: LeaveSection.requests,
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(
      find.text('Could not load records. Please try again.'),
      findsOneWidget,
    );
    await tester.tap(find.text('Try again'));
    await tester.pumpAndSettle();
    expect(find.text('2.5 days'), findsOneWidget);
    await tester.drag(find.byType(ListView), const Offset(0, 400));
    await tester.pumpAndSettle();
    expect(leaves.calls, List.filled(3, (LeaveSection.requests, 0)));
    expect(find.text('2.5 days'), findsOneWidget);
  });
}
