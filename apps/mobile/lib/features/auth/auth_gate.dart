import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../navigation/app_shell.dart';
import '../leave/leave_repository.dart';
import '../dashboard/dashboard_repository.dart';
import 'login_page.dart';
import 'otp_page.dart';

class AuthGate extends StatefulWidget {
  const AuthGate({super.key, required this.client});
  final SupabaseClient client;

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  late final Stream<AuthState> _authChanges =
      widget.client.auth.onAuthStateChange;

  @override
  Widget build(BuildContext context) {
    final client = widget.client;
    return StreamBuilder<AuthState>(
      stream: _authChanges,
      builder: (context, snapshot) {
        final session = client.auth.currentSession;
        if (session == null) return LoginPage(client: client);
        return _SessionGate(key: ValueKey(session), client: client);
      },
    );
  }
}

// Recheck assurance when the session changes. MFA accounts must not enter
// the dashboard with only a first-factor session.
class _SessionGate extends StatefulWidget {
  const _SessionGate({super.key, required this.client});
  final SupabaseClient client;

  @override
  State<_SessionGate> createState() => _SessionGateState();
}

class _SessionGateState extends State<_SessionGate> {
  late final _assurance = Future.sync(
    () => widget.client.auth.mfa.getAuthenticatorAssuranceLevel(),
  );
  late final _repository = SupabaseDashboardRepository(widget.client);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _assurance,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        final aal = snapshot.data;
        if (!snapshot.hasError &&
            aal != null &&
            aal.nextLevel == AuthenticatorAssuranceLevels.aal2 &&
            aal.currentLevel != AuthenticatorAssuranceLevels.aal2) {
          return OtpPage(
            onVerify: (code) async {
              final factors = await widget.client.auth.mfa.listFactors();
              final totp = factors.totp.where(
                (factor) => factor.status == FactorStatus.verified,
              );
              if (totp.isEmpty) {
                throw const AuthException(
                  'No authenticator is available. Manage two-factor authentication in the web app.',
                );
              }
              await widget.client.auth.mfa.challengeAndVerify(
                factorId: totp.first.id,
                code: code,
              );
              // The auth event rebuilds this gate with the verified session.
            },
            onSignOut: () =>
                widget.client.auth.signOut(scope: SignOutScope.local),
          );
        }
        if (snapshot.hasError || aal == null) {
          return Scaffold(
            appBar: AppBar(title: const Text('Account verification')),
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Could not verify your session. Sign out and try again.',
                    ),
                    const SizedBox(height: 24),
                    FilledButton(
                      onPressed: () async {
                        try {
                          await widget.client.auth.signOut(
                            scope: SignOutScope.local,
                          );
                        } catch (_) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Could not sign out. Try again.'),
                              ),
                            );
                          }
                        }
                      },
                      child: const Text('Sign out'),
                    ),
                  ],
                ),
              ),
            ),
          );
        }
        return AppShell(
          dashboardRepository: _repository,
          leaveRepository: SupabaseLeaveRepository(widget.client),
          email: widget.client.auth.currentUser?.email ?? '',
          avatarUrl:
              widget.client.auth.currentUser?.userMetadata?['avatar_url']
                  as String?,
          onSignOut: () =>
              widget.client.auth.signOut(scope: SignOutScope.local),
        );
      },
    );
  }
}
