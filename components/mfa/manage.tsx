'use client';

import { useCallback, useEffect, useState } from 'react';
import { type Factor } from '@supabase/supabase-js';
import { Loader2Icon, ShieldCheck, ShieldPlus } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { EnrollMFA } from './enroll-form';

export function MFAManagement() {
  const supabase = createClient();

  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [disablingId, setDisablingId] = useState<string | null>(null);

  const loadFactors = useCallback(async () => {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (!error) {
      setFactors(data.totp);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadFactors();
  }, [loadFactors]);

  const handleEnrolled = () => {
    setEnrolling(false);
    loadFactors();
  };

  const handleDisable = async (factorId: string) => {
    setDisablingId(factorId);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) {
        throw error;
      }
      toast.success('Two-factor authentication disabled');
      loadFactors();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to disable two-factor auth';
      toast.error(message);
    } finally {
      setDisablingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account using an authenticator
          app (TOTP).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Checking security settings...
          </div>
        ) : enrolling ? (
          <EnrollMFA
            onEnrolled={handleEnrolled}
            onCancelled={() => setEnrolling(false)}
          />
        ) : factors.length === 0 ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              You haven&apos;t set up two-factor authentication yet. Enable it
              to protect your account.
            </p>
            <div>
              <Button onClick={() => setEnrolling(true)}>
                <ShieldPlus className="mr-2 size-4" />
                Enable two-factor authentication
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Authenticator app (TOTP)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added on{' '}
                    {new Date(factors[0].created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700"
                >
                  Active
                </Badge>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={disablingId === factors[0].id}
                      />
                    }
                  >
                    Disable
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Disable two-factor authentication?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Your account will no longer require a verification code
                        when signing in. You can re-enable it at any time.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => handleDisable(factors[0].id)}
                        disabled={disablingId === factors[0].id}
                      >
                        {disablingId === factors[0].id ? (
                          <>
                            <Loader2Icon className="animate-spin" />
                            Disabling...
                          </>
                        ) : (
                          'Disable'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
