interface BannerProps {
  top?: number;
  background?: string;
  children: any;
}

export default function Banner({
  top = 0,
  background = "var(--primaryColor)",
  children,
}: BannerProps) {
  return (
    <div
      className="sticky p2 middle center row"
      style={{ top: top, background: background }}
    >
      {children}
    </div>
  );
}
