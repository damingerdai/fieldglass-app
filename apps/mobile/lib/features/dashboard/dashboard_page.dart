import 'package:flutter/material.dart';

import 'dashboard_repository.dart';

String days(double value) => value == value.roundToDouble()
    ? value.toInt().toString()
    : value.toStringAsFixed(1);
String leaveLabel(String type) => switch (type) {
  'annual' => 'Annual leave',
  'sick' => 'Sick leave',
  'unpaid' => 'Unpaid leave',
  _ => type,
};

class DashboardPage extends StatefulWidget {
  const DashboardPage({
    super.key,
    required this.repository,
    required this.email,
    required this.onSignOut,
  });
  final DashboardRepository repository;
  final String email;
  final Future<void> Function() onSignOut;

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  late Future<DashboardData> _data = widget.repository.load();
  bool _signingOut = false;

  Future<void> _refresh() async {
    final request = widget.repository.load();
    setState(() {
      _data = request;
    });
    try {
      await request;
    } catch (_) {
      /* FutureBuilder renders the error. */
    }
  }

  Future<void> _signOut() async {
    setState(() => _signingOut = true);
    try {
      await widget.onSignOut();
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not sign out. Please try again.'),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _signingOut = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fieldglass'),
        actions: [
          IconButton(
            onPressed: _signingOut ? null : _signOut,
            tooltip: 'Sign out',
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _refresh,
          child: FutureBuilder<DashboardData>(
            future: _data,
            builder: (context, snapshot) {
              return ListView(
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
                            'Dashboard',
                            style: theme.textTheme.headlineLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Welcome back, ${widget.email.split('@').first}.',
                            style: theme.textTheme.titleMedium,
                          ),
                          const SizedBox(height: 24),
                          if (snapshot.connectionState != ConnectionState.done)
                            const Padding(
                              padding: EdgeInsets.all(48),
                              child: Center(child: CircularProgressIndicator()),
                            )
                          else if (snapshot.hasError) ...[
                            const Icon(Icons.cloud_off_outlined, size: 48),
                            const SizedBox(height: 16),
                            const Text(
                              'We could not load your leave data. Check your connection and try again.',
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 16),
                            FilledButton(
                              onPressed: _refresh,
                              child: const Text('Try again'),
                            ),
                          ] else if (snapshot.hasData)
                            ..._content(snapshot.data!, theme),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  List<Widget> _content(DashboardData data, ThemeData theme) => [
    Card.filled(
      color: theme.colorScheme.primary,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: DefaultTextStyle(
          style: TextStyle(color: theme.colorScheme.onPrimary),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('AVAILABLE BALANCE'),
              const SizedBox(height: 12),
              Text(
                '${days(data.remaining)} days',
                style: const TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              const Text('Make time for what matters.'),
            ],
          ),
        ),
      ),
    ),
    const SizedBox(height: 12),
    Wrap(
      spacing: 12,
      runSpacing: 12,
      children: [
        Chip(
          avatar: const Icon(Icons.calendar_month, size: 18),
          label: Text('${days(data.granted)} days granted'),
        ),
        Chip(
          avatar: const Icon(Icons.check_circle_outline, size: 18),
          label: Text('${days(data.used)} days used'),
        ),
      ],
    ),
    const SizedBox(height: 28),
    Text('Leave breakdown', style: theme.textTheme.titleLarge),
    const SizedBox(height: 12),
    if (data.balances.isEmpty)
      const Card(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Text(
            'No leave balances yet. Add an entitlement in the web app to get started.',
          ),
        ),
      ),
    ...data.balances.map(
      (balance) => Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                leaveLabel(balance.type),
                style: theme.textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Text(
                '${days(balance.remaining)} of ${days(balance.granted)} days left',
              ),
              const SizedBox(height: 12),
              LinearProgressIndicator(
                value: balance.granted > 0
                    ? (balance.used / balance.granted).clamp(0.0, 1.0)
                    : 0,
                minHeight: 6,
                borderRadius: BorderRadius.circular(8),
              ),
              const SizedBox(height: 8),
              Text(
                '${days(balance.used)} days used',
                style: theme.textTheme.bodySmall,
              ),
            ],
          ),
        ),
      ),
    ),
    const SizedBox(height: 28),
    Text('Recent requests', style: theme.textTheme.titleLarge),
    const SizedBox(height: 12),
    if (data.activity.isEmpty)
      const Card(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Text(
            'No leave requests yet. Your recent requests will appear here.',
          ),
        ),
      ),
    ...data.activity.map(
      (item) => Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(leaveLabel(item.type), style: theme.textTheme.titleMedium),
              const SizedBox(height: 6),
              Text('${item.date} · ${days(item.days)} days'),
              const SizedBox(height: 8),
              Chip(label: Text(item.status)),
            ],
          ),
        ),
      ),
    ),
    const SizedBox(height: 20),
    const Text(
      'Pending requests are deducted once approved. Use the web app to create and manage leave requests.',
    ),
    const SizedBox(height: 16),
  ];
}
