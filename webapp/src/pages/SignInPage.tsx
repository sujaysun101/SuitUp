import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
      <SignIn path="/" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;
