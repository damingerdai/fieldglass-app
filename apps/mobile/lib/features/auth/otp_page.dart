import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'otp_input.dart';

class OtpPage extends StatefulWidget {
  const OtpPage({super.key, required this.onVerify, required this.onSignOut});

  final Future<void> Function(String code) onVerify;
  final Future<void> Function() onSignOut;

  @override
  State<OtpPage> createState() => _OtpPageState();
}

class _OtpPageState extends State<OtpPage> {
  final _form = GlobalKey<FormState>();
  final _code = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  Future<void> _submit({bool signOut = false}) async {
    if (_busy || (!signOut && !_form.currentState!.validate())) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      if (signOut) {
        await widget.onSignOut();
      } else {
        await widget.onVerify(_code.text);
      }
    } on AuthException catch (error) {
      if (mounted) setState(() => _error = error.message);
    } catch (_) {
      if (mounted) {
        setState(() => _error = 'Unable to connect. Please try again.');
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Two-factor verification')),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(28),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Form(
                key: _form,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.security, size: 48),
                    const SizedBox(height: 24),
                    Text(
                      'Enter verification code',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Enter the 6-digit code from your authenticator app.',
                    ),
                    const SizedBox(height: 24),
                    OtpInput(
                      controller: _code,
                      enabled: !_busy,
                      onSubmitted: (_) => _submit(),
                    ),
                    const SizedBox(height: 20),
                    if (_error != null) ...[
                      Semantics(
                        liveRegion: true,
                        child: Text(
                          _error!,
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.error,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                    FilledButton(
                      onPressed: _busy ? null : _submit,
                      child: _busy
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Verify'),
                    ),
                    TextButton(
                      onPressed: _busy ? null : () => _submit(signOut: true),
                      child: const Text('Sign out'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
