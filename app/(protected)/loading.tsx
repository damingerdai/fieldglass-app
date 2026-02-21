import { AppSpinner } from '@/components/app-sinner';

export default function Loading() {
  return (
    <div className="w-full flex pt-4 justify-center">
      <AppSpinner />
    </div>
  );
}
