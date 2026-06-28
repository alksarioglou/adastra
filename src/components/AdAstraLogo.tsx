import Image from "next/image";

export const AD_ASTRA_LOGO_SRC = "/ad-astra-logo.png";

export function AdAstraLogo({
  showWordmark = false,
  wordmarkClassName = "font-display text-lg uppercase tracking-[0.14em] text-ink",
  variant = "light",
}: {
  showWordmark?: boolean;
  wordmarkClassName?: string;
  variant?: "light" | "dark";
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src={AD_ASTRA_LOGO_SRC}
        alt="Ad Astra"
        width={40}
        height={40}
        className={
          variant === "dark"
            ? "h-10 w-10 shrink-0 object-contain [filter:brightness(0)_invert(1)_brightness(0.82)]"
            : "h-10 w-10 shrink-0 object-contain [filter:invert(1)_brightness(0.76)_contrast(1.08)] mix-blend-multiply"
        }
        priority
      />
      {showWordmark ? (
        <span className={wordmarkClassName}>Ad Astra</span>
      ) : null}
    </span>
  );
}