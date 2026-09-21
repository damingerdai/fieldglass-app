import './auth-global.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout relative isolate flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="auth-ball-position auth-ball-position-one">
          <div className="auth-ball auth-ball-one" />
        </div>
        <div className="auth-ball-position auth-ball-position-two">
          <div className="auth-ball auth-ball-two" />
        </div>
      </div>
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}
