/** Staff portal: admin vs store login cards at `/portal`. */
import { FaUserCog, FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

export default function LoginLanding() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="flex h-20 w-full shrink-0 items-center justify-center border-b border-border bg-background px-4 pt-3 pb-px sm:h-24 sm:pt-4">
        <div className="relative h-14 w-[60px] shrink-0 rounded-lg sm:h-16 sm:w-[70px]">
          <Logo className="pointer-events-none absolute inset-0 size-full max-w-none rounded-lg border-0 border-transparent object-cover" />
        </div>
      </header>

      <section className="flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <h1 className="text-center text-3xl font-bold uppercase leading-tight text-primary sm:text-4xl md:text-5xl">
          Matha<span className="text-admin">Chickens</span>
        </h1>
        <p className="mt-6 max-w-xl text-center text-base leading-7 text-foreground sm:text-lg md:text-xl">
          Chicken Farm Ordering & Store Management System
        </p>
        <p className="mt-2 max-w-md text-center text-sm leading-7 text-muted-foreground sm:text-base md:text-lg">
          Fresh. Hygienic. Daily Cut.
        </p>
      </section>

      <section className="flex w-full flex-col items-stretch justify-center gap-6 px-4 pb-10 sm:flex-row sm:flex-wrap sm:items-start sm:justify-center sm:gap-8 sm:pb-12 md:gap-10">
        <Card className="flex min-h-[280px] w-full max-w-[325px] flex-col self-center sm:min-h-[298px] sm:self-start">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-admin-accent sm:size-16">
              <FaUserCog className="size-7 text-admin sm:size-8" />
            </div>
            <CardTitle className="text-center text-base text-primary">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-center text-base text-muted-foreground">
              Central farm management
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto flex flex-col items-center gap-4 px-5 sm:px-6">
            <p className="text-center text-sm font-normal leading-5 text-foreground">
              Manage categories, items, stores, suppliers, taxes, and orders
            </p>
            <Link className="w-full" to="/admin/login">
              <Button className="w-full bg-admin text-white hover:bg-admin/90">
                Admin Login
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex min-h-[280px] w-full max-w-[325px] flex-col self-center sm:min-h-[298px] sm:self-start">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-store-accent sm:size-16">
              <FaStore className="size-7 text-store sm:size-8" />
            </div>
            <CardTitle className="text-center text-base text-primary">
              Store Portal
            </CardTitle>
            <CardDescription className="text-center text-base text-muted-foreground">
              Store operations
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto flex flex-col items-center gap-4 px-5 sm:px-6">
            <p className="text-center text-sm font-normal leading-5 text-foreground">
              Manual billing, item availability, and online order management
            </p>
            <Link className="w-full" to="/store/login">
              <Button className="w-full bg-store text-white hover:bg-store/90">
                Store Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-auto flex w-full items-center justify-center border-t border-border bg-background px-4 py-6">
        <p className="max-w-md text-center text-xs font-normal leading-5 text-foreground sm:max-w-none sm:text-sm">
          © 2026 Matha Chickens. Quality chicken delivered from our shop to your
          kitchen.
        </p>
      </footer>
    </div>
  );
}
