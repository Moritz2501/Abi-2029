import { PropsWithChildren } from "react";

type FormFieldProps = PropsWithChildren<{
  label: string;
  htmlFor: string;
}>;

export function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={htmlFor}>
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}
