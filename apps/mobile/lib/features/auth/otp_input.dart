import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Six visual slots backed by one editable field for paste and autofill.
class OtpInput extends StatefulWidget {
  const OtpInput({
    super.key,
    required this.controller,
    this.enabled = true,
    this.onSubmitted,
  });

  final TextEditingController controller;
  final bool enabled;
  final ValueChanged<String>? onSubmitted;

  @override
  State<OtpInput> createState() => _OtpInputState();
}

class _OtpInputState extends State<OtpInput> {
  final _focus = FocusNode();

  @override
  void dispose() {
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return ListenableBuilder(
      listenable: Listenable.merge([widget.controller, _focus]),
      builder: (context, _) {
        final code = widget.controller.text;
        final selection = widget.controller.selection;
        final active = selection.isValid
            ? selection.extentOffset.clamp(0, 5)
            : code.length.clamp(0, 5);
        return Stack(
          children: [
            Semantics(
              label: 'Verification code, 6 digits',
              child: TextFormField(
                controller: widget.controller,
                focusNode: _focus,
                enabled: widget.enabled,
                autofocus: true,
                keyboardType: TextInputType.number,
                textInputAction: TextInputAction.done,
                autofillHints: const [AutofillHints.oneTimeCode],
                autocorrect: false,
                enableSuggestions: false,
                showCursor: false,
                style: const TextStyle(color: Colors.transparent, fontSize: 24),
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(6),
                ],
                decoration: const InputDecoration(
                  filled: false,
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  disabledBorder: InputBorder.none,
                  errorBorder: InputBorder.none,
                  focusedErrorBorder: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(vertical: 18),
                  errorMaxLines: 2,
                ),
                validator: (value) => RegExp(r'^\d{6}$').hasMatch(value ?? '')
                    ? null
                    : 'Enter a 6-digit code.',
                onFieldSubmitted: widget.onSubmitted,
              ),
            ),
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              child: ExcludeSemantics(
                child: Row(
                  children: List.generate(6, (index) {
                    final focused =
                        widget.enabled && _focus.hasFocus && active == index;
                    return Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(right: index == 5 ? 0 : 8),
                        child: GestureDetector(
                          onTap: widget.enabled
                              ? () {
                                  _focus.requestFocus();
                                  widget.controller.selection =
                                      TextSelection.collapsed(
                                        offset: index.clamp(0, code.length),
                                      );
                                }
                              : null,
                          child: Container(
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: widget.enabled
                                  ? colors.surface
                                  : colors.surfaceContainerHighest,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: focused
                                    ? colors.primary
                                    : colors.outlineVariant,
                                width: focused ? 2 : 1,
                              ),
                            ),
                            child: Text(
                              index < code.length ? code[index] : '',
                              style: Theme.of(context).textTheme.headlineSmall,
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
