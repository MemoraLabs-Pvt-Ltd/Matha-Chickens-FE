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
    <div className="flex min-h-screen flex-col w-full">
      <header className="bg-background border-b border-border flex h-24 items-center justify-center pb-px pt-4 w-full">
        <div className="h-16 relative rounded-lg shrink-0 w-[70px]">
          <Logo className="absolute border-0 border-transparent border-solid inset-0 max-w-none object-cover pointer-events-none rounded-lg size-full" />
        </div>
      </header>

      <section className="flex flex-col items-center justify-center px-4 py-12">
        <h1 className="font-bold leading-none text-5xl text-center uppercase whitespace-nowrap text-primary">
          Matha<span className="text-admin">Chickens</span>
        </h1>
        <p className="font-normal leading-7 text-xl text-center mt-8 text-foreground">
          Chicken Farm Ordering & Store Management System
        </p>
        <p className="font-normal leading-7 text-lg text-center mt-2 text-muted-foreground">
          Fresh. Hygienic. Daily Cut.
        </p>
      </section>

      <section className="flex gap-6 items-center justify-center px-4 py-12 w-full">
        <Card className="w-[325px] h-[298px] flex flex-col">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="bg-admin-accent flex items-center justify-center rounded-full size-16 mb-4">
              <FaUserCog className="text-admin size-8" />
            </div>
            <CardTitle className="text-base text-center text-primary">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-base text-center text-muted-foreground">
              Central farm management
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-center px-6 mt-auto">
            <p className="font-normal leading-5 text-sm text-center text-foreground">
              Manage categories, items, stores, suppliers, taxes, and orders
            </p>
            <Link className="w-full" to="/admin/login">
              <Button className="w-full bg-admin hover:bg-admin text-white">
                Admin Login
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-[325px] h-[298px] flex flex-col">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="bg-store-accent flex items-center justify-center rounded-full size-16 mb-4">
              <FaStore className="text-store size-8" />
            </div>
            <CardTitle className="text-base text-center text-primary">
              Store Portal
            </CardTitle>
            <CardDescription className="text-base text-center text-muted-foreground">
              Store operations
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 items-center px-6 mt-auto">
            <p className="font-normal leading-5 text-sm text-center text-foreground">
              Manual billing, item availability, and online order management
            </p>
            <Button className="w-full bg-store hover:bg-store text-white">
              Store Login
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="bg-background border-t border-border flex items-center justify-center mt-auto py-6 w-full">
        <p className="font-normal leading-5 text-sm text-foreground text-center">
          © 2026 Matha Chickens. Quality chicken delivered from our shop to your
          kitchen.
        </p>
      </footer>
    </div>
  );
}
