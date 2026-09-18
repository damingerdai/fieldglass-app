import { redirect } from 'next/navigation';

import { MFAVerifyForm } from '@/components/mfa';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = await createClient();

  const { data: aal, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || !aal) {
    redirect('/login');
  }

  // MFA not required or already verified: nothing to verify here.
  if (aal.nextLevel === 'aal1' || aal.currentLevel === 'aal2') {
    redirect('/dashboard');
  }

  return <MFAVerifyForm />;
}
