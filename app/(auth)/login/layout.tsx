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
        <CardTitle className="flex justify-center">
          Login to your account
        </CardTitle>
        <CardDescription className="flex justify-center">
          Enter your email below to login to your accoun
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
