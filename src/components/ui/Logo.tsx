import Image from "next/image";
import onDark from "../../../public/brand/logo-on-dark.png";
import onLight from "../../../public/brand/logo-on-light.png";
import { cn } from "./cn";

type Props = { surface?: "ink" | "paper"; className?: string; priority?: boolean };

export function Logo({ surface = "ink", className, priority }: Props) {
  return (
    <Image
      src={surface === "ink" ? onDark : onLight}
      alt="Candemsoft"
      priority={priority}
      sizes="180px"
      className={cn("h-7 w-auto md:h-8", className)}
    />
  );
}
