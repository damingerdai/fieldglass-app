import 'package:flutter/material.dart';

import '../dashboard/dashboard_page.dart';
import 'leave_repository.dart';

class LeaveRecordsPage extends StatefulWidget {
  const LeaveRecordsPage({
    super.key,
    required this.repository,
    required this.section,
  });
  final LeaveRepository repository;
  final LeaveSection section;

  @override
  State<LeaveRecordsPage> createState() => _LeaveRecordsPageState();
}

class _LeaveRecordsPageState extends State<LeaveRecordsPage> {
  final List<LeaveRecord> _records = [];
  bool _loading = false;
  bool _hasMore = true;
  String? _error;
  bool _retryRefresh = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load({bool refresh = false}) async {
    if (_loading) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final rows = await widget.repository.load(
        widget.section,
        offset: refresh ? 0 : _records.length,
      );
      if (!mounted) return;
      setState(() {
        if (refresh) _records.clear();
        _records.addAll(rows);
        _hasMore = rows.length == LeaveRepository.pageSize;
      });
    } catch (_) {
      if (mounted) {
        setState(() {
          _retryRefresh = refresh;
          _error = 'Could not load records. Please try again.';
        });
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final entitlement = widget.section == LeaveSection.entitlements;
    final theme = Theme.of(context);
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () => _load(refresh: true),
        child: ListView(
          key: PageStorageKey(widget.section),
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(24),
          children: [
            Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 680),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      entitlement
                          ? 'Your Leave Entitlements'
                          : 'My Leave Requests',
                      style: theme.textTheme.headlineLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      entitlement
                          ? 'View your granted leave and validity periods.'
                          : 'Track your leave applications and their status.',
                    ),
                    const SizedBox(height: 24),
                    if (!_loading && _error == null && _records.isEmpty)
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Text(
                            entitlement
                                ? 'No leave entitlements yet.'
                                : 'No leave requests yet.',
                          ),
                        ),
                      ),
                    ..._records.map(
                      (record) => Card(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                leaveLabel(record.type),
                                style: theme.textTheme.titleMedium,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                '${days(record.amount)} days',
                                style: theme.textTheme.titleLarge,
                              ),
                              const SizedBox(height: 12),
                              Text(
                                entitlement
                                    ? 'Effective: ${record.startDate}'
                                    : 'From: ${record.startDate}',
                              ),
                              Text(
                                entitlement
                                    ? 'Expires: ${record.endDate ?? 'No expiry'}'
                                    : 'To: ${record.endDate ?? '—'}',
                              ),
                              if (record.status != null) ...[
                                const SizedBox(height: 8),
                                Chip(label: Text(record.status!)),
                              ],
                              if (record.notes?.isNotEmpty ?? false) ...[
                                const SizedBox(height: 12),
                                Text(record.notes!),
                              ],
                            ],
                          ),
                        ),
                      ),
                    ),
                    if (_loading)
                      const Padding(
                        padding: EdgeInsets.all(24),
                        child: Center(child: CircularProgressIndicator()),
                      )
                    else if (_error != null) ...[
                      const SizedBox(height: 16),
                      Text(_error!, textAlign: TextAlign.center),
                      TextButton(
                        onPressed: () => _load(refresh: _retryRefresh),
                        child: const Text('Try again'),
                      ),
                    ] else if (_hasMore)
                      OutlinedButton(
                        onPressed: () => _load(),
                        child: const Text('Load more'),
                      ),
                    const SizedBox(height: 20),
                    Text(
                      entitlement
                          ? 'Use the web app to add or update leave entitlements.'
                          : 'Use the web app to create or cancel leave requests.',
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
