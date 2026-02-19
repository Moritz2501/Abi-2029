import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  title?: string;
  className?: string;
}>;

export function Card({ title, className, children }: CardProps) {
  return (
    <section className={`rounded-2xl border border-black/10 bg-white p-5 shadow-sm ${className ?? ""}`}>
      {title ? <h2 className="mb-4 text-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}
