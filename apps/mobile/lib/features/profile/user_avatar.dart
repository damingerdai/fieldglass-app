import 'dart:convert';

import 'package:crypto/crypto.dart';
import 'package:flutter/material.dart';

class UserAvatar extends StatelessWidget {
  const UserAvatar({
    super.key,
    required this.email,
    this.avatarUrl,
    this.radius = 20,
  });

  final String email;
  final String? avatarUrl;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final normalizedEmail = email.trim().toLowerCase();
    final hash = md5.convert(utf8.encode(normalizedEmail));
    final gravatar = 'https://www.gravatar.com/avatar/$hash?s=200&d=identicon';
    final custom = avatarUrl?.trim();
    final fallback = Center(
      child: Text(
        normalizedEmail.isEmpty ? '?' : normalizedEmail[0].toUpperCase(),
      ),
    );

    Widget gravatarImage() => Image.network(
      gravatar,
      fit: BoxFit.cover,
      errorBuilder: (_, _, _) => fallback,
    );

    return Semantics(
      label: 'User avatar',
      image: true,
      child: ExcludeSemantics(
        child: CircleAvatar(
          radius: radius,
          child: ClipOval(
            child: SizedBox.square(
              dimension: radius * 2,
              child: custom != null && custom.isNotEmpty
                  ? Image.network(
                      custom,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => gravatarImage(),
                    )
                  : gravatarImage(),
            ),
          ),
        ),
      ),
    );
  }
}
