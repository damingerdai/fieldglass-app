import 'package:flutter/material.dart';

import 'user_avatar.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({
    super.key,
    required this.email,
    this.avatarUrl,
    required this.onSignOut,
  });

  final String email;
  final String? avatarUrl;
  final VoidCallback? onSignOut;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 680),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Your Profile',
                    style: theme.textTheme.headlineLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          UserAvatar(
                            email: email,
                            avatarUrl: avatarUrl,
                            radius: 32,
                          ),
                          const SizedBox(height: 24),
                          Text('Email', style: theme.textTheme.labelLarge),
                          const SizedBox(height: 8),
                          SelectableText(email),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Use the web app to manage your password and two-factor authentication.',
                  ),
                  const SizedBox(height: 24),
                  OutlinedButton.icon(
                    onPressed: onSignOut,
                    icon: const Icon(Icons.logout),
                    label: const Text('Sign out'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
