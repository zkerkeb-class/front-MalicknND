import { SignUp } from "@clerk/nextjs";

export default function Page() {
  // CENTRER LE COMPONENT
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp />
    </div>
  );
}
