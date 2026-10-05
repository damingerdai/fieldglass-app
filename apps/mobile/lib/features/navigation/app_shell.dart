import 'package:flutter/material.dart';

import '../dashboard/dashboard_page.dart';
import '../dashboard/dashboard_repository.dart';
import '../leave/leave_records_page.dart';
import '../leave/leave_repository.dart';
import '../profile/profile_page.dart';
import '../profile/user_avatar.dart';

class AppShell extends StatefulWidget {
  const AppShell({
    super.key,
    required this.dashboardRepository,
    required this.leaveRepository,
    required this.email,
    this.avatarUrl,
    required this.onSignOut,
  });

  final DashboardRepository dashboardRepository;
  final LeaveRepository leaveRepository;
  final String email;
  final String? avatarUrl;
  final Future<void> Function() onSignOut;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  static const _titles = [
    'Dashboard',
    'Leave Entitlements',
    'Leave Requests',
    'Profile',
  ];
  static const _icons = [
    Icons.dashboard_outlined,
    Icons.account_balance_wallet_outlined,
    Icons.event_note_outlined,
  ];
  final _visited = <int>{0};
  int _selected = 0;
  bool _signingOut = false;

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
    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_selected]),
        actions: [
          IconButton(
            onPressed: _signingOut ? null : _signOut,
            tooltip: 'Sign out',
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      drawer: Drawer(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Fieldglass',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.email,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const Divider(),
              Expanded(
                child: ListView(
                  children: List.generate(
                    3,
                    (index) => ListTile(
                      leading: Icon(_icons[index]),
                      title: Text(_titles[index]),
                      selected: _selected == index,
                      selectedTileColor: Theme.of(context)
                          .colorScheme
                          .secondaryContainer,
                      onTap: () {
                        setState(() {
                          _selected = index;
                          _visited.add(index);
                        });
                        Navigator.of(context).pop();
                      },
                    ),
                  ),
                ),
              ),
              const Divider(height: 1),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: ListTile(
                  leading: UserAvatar(
                    email: widget.email,
                    avatarUrl: widget.avatarUrl,
                  ),
                  title: const Text('Profile'),
                  subtitle: Text(
                    widget.email,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  selected: _selected == 3,
                  selectedTileColor: Theme.of(context)
                      .colorScheme
                      .secondaryContainer,
                  onTap: () {
                    setState(() => _selected = 3);
                    Navigator.of(context).pop();
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      body: IndexedStack(
        index: _selected,
        children: [
          DashboardPage(
            repository: widget.dashboardRepository,
            email: widget.email,
          ),
          for (var index = 1; index < 3; index++)
            if (_visited.contains(index))
              LeaveRecordsPage(
                key: ValueKey(index),
                repository: widget.leaveRepository,
                section: index == 1
                    ? LeaveSection.entitlements
                    : LeaveSection.requests,
              )
            else
              const SizedBox.shrink(),
          ProfilePage(
            email: widget.email,
            avatarUrl: widget.avatarUrl,
            onSignOut: _signingOut ? null : _signOut,
          ),
        ],
      ),
    );
  }
}
