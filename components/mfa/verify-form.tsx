'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { mfaVerifyAction, type VerifyResult } from './actions';

const initialState: VerifyResult = {};

export function MFAVerifyForm() {
  const router = useRouter();
  const supabase = createClient();

  const [code, setCode] = useState('');
  const [state, formAction, pending] = useActionState(
    mfaVerifyAction,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
      router.replace('/dashboard');
      router.refresh();
    } else if (state.errors) {
      toast.error(state.errors);
    }
  }, [state, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="grid gap-4">
      {state.errors && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.errors}
        </div>
      )}
      <form action={formAction} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="code">Authenticator code</Label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.trim())}
            disabled={pending}
            className="text-center text-lg tracking-[0.5em]"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={pending || code.length < 6}
        >
          {pending ? (
            <>
              <Loader2Icon className="animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </Button>
      </form>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </div>
  );
}
