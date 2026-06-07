import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle
} from '@/components/ui/card';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Card className="relative overflow-hidden border-muted/70 bg-card/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-[2px] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <CardHeader className="space-y-2 pb-6 text-center">
        <div className="mx-auto flex w-fit items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium tracking-wide text-primary">
          Fieldglass App
        </div>

        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground/90">
            Welcome to fieldgass app
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80 max-w-[290px] mx-auto">
            Please create account to join us
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">{children}</CardContent>
    </Card>
  );
}
