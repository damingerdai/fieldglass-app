import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle
} from '@/components/ui/card';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-center">Set New Password</CardTitle>
        <CardDescription className="flex justify-center">
          Please enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
