import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { Separator } from "@/components/ui/separator"

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="p-4">
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur px-6 py-4">
            <div className="max-w-7xl mx-auto">
                <AppBreadcrumb items={[{ label: "Leave Entitlements" }]} />
            </div>
        </header>
        <main className="p-6 max-w-7xl mx-auto">
            {children}
        </main>
    </div>
}   