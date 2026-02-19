type AlertProps = {
  type: "success" | "error";
  message: string;
};

export function Alert({ type, message }: AlertProps) {
  if (!message) {
    return null;
  }

  const classes =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800";

  return <p className={`rounded-md border px-3 py-2 text-sm ${classes}`}>{message}</p>;
}
