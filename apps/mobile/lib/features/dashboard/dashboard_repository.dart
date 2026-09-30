import 'package:supabase_flutter/supabase_flutter.dart';

class LeaveBalance {
  const LeaveBalance({
    required this.type,
    required this.granted,
    required this.used,
    required this.remaining,
  });
  final String type;
  final double granted;
  final double used;
  final double remaining;

  factory LeaveBalance.fromJson(Map<String, dynamic> json) => LeaveBalance(
    type: json['leave_type'] as String,
    granted: (json['granted'] as num).toDouble(),
    used: (json['used'] as num).toDouble(),
    remaining: (json['remaining_balance'] as num).toDouble(),
  );
}

class LeaveActivity {
  const LeaveActivity({
    required this.type,
    required this.days,
    required this.date,
    required this.status,
  });
  final String type;
  final double days;
  final String date;
  final String status;

  factory LeaveActivity.fromJson(Map<String, dynamic> json) => LeaveActivity(
    type: json['leave_type'] as String,
    days: (json['days'] as num).toDouble(),
    date: json['start_date'] as String,
    status: json['status'] as String,
  );
}

class DashboardData {
  const DashboardData(this.balances, this.activity);
  final List<LeaveBalance> balances;
  final List<LeaveActivity> activity;
  double get granted => balances.fold(0, (sum, b) => sum + b.granted);
  double get used => balances.fold(0, (sum, b) => sum + b.used);
  double get remaining => balances.fold(0, (sum, b) => sum + b.remaining);
}

abstract class DashboardRepository {
  Future<DashboardData> load();
}

class SupabaseDashboardRepository implements DashboardRepository {
  SupabaseDashboardRepository(this.client);
  final SupabaseClient client;

  @override
  Future<DashboardData> load() async {
    final user = client.auth.currentUser;
    if (user == null) throw StateError('Sign in to view your dashboard.');
    final results = await Future.wait([
      client
          .from('user_leave_balances')
          .select('leave_type, granted, used, remaining_balance')
          .eq('user_id', user.id)
          .order('leave_type'),
      client
          .from('leave_requests')
          .select('leave_type, days, start_date, status')
          .eq('user_id', user.id)
          .isFilter('deleted_at', null)
          .order('created_at', ascending: false)
          .limit(5),
    ]);
    return DashboardData(
      results[0].map(LeaveBalance.fromJson).toList(),
      results[1].map(LeaveActivity.fromJson).toList(),
    );
  }
}
