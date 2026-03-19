import mathaLogo from "@/assets/matha-logo.png";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <img
      alt="Matha Chickens Logo"
      className={className}
      src={mathaLogo}
    />
  );
}
