import 'package:supabase_flutter/supabase_flutter.dart';

enum LeaveSection { entitlements, requests }

class LeaveRecord {
  const LeaveRecord({
    required this.type,
    required this.amount,
    required this.startDate,
    this.endDate,
    this.status,
    this.notes,
  });

  final String type;
  final double amount;
  final String startDate;
  final String? endDate;
  final String? status;
  final String? notes;

  factory LeaveRecord.fromJson(
    Map<String, dynamic> json,
    LeaveSection section,
  ) {
    final entitlement = section == LeaveSection.entitlements;
    return LeaveRecord(
      type: json['leave_type'] as String,
      amount: (json[entitlement ? 'amount_days' : 'days'] as num).toDouble(),
      startDate: json[entitlement ? 'effective_date' : 'start_date'] as String,
      endDate: json[entitlement ? 'expiry_date' : 'end_date'] as String?,
      status: json['status'] as String?,
      notes: json[entitlement ? 'notes' : 'reason'] as String?,
    );
  }
}

abstract class LeaveRepository {
  static const pageSize = 20;
  Future<List<LeaveRecord>> load(LeaveSection section, {required int offset});
}

class SupabaseLeaveRepository implements LeaveRepository {
  SupabaseLeaveRepository(this.client);
  final SupabaseClient client;

  @override
  Future<List<LeaveRecord>> load(
    LeaveSection section, {
    required int offset,
  }) async {
    final user = client.auth.currentUser;
    if (user == null) throw StateError('Sign in to view your leave records.');
    final entitlement = section == LeaveSection.entitlements;
    final rows = await client
        .from(entitlement ? 'leave_entitlements' : 'leave_requests')
        .select(
          entitlement
              ? 'leave_type, amount_days, effective_date, expiry_date, notes'
              : 'leave_type, days, start_date, end_date, status, reason',
        )
        .eq('user_id', user.id)
        .isFilter('deleted_at', null)
        .order('created_at', ascending: false)
        .order('id')
        .range(offset, offset + LeaveRepository.pageSize - 1);
    return rows.map((row) => LeaveRecord.fromJson(row, section)).toList();
  }
}
