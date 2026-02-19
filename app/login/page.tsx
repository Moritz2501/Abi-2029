import { LoginForm } from "@/app/login/login-form";

type LoginPageProps = {
  searchParams?: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params?.next || "/";

  return (
    <div className="mx-auto max-w-md">
      <LoginForm nextPath={nextPath} />
    </div>
  );
}
