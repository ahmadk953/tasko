import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return <SignIn signUpUrl='/sign-up' afterSignInUrl='/select-org' />;
}
