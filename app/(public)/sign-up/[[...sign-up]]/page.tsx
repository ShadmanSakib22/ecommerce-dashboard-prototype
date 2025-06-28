import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen py-[5rem] background-image">
      <SignUp
        appearance={{
          elements: {
            card: "bg-background-2! text-foreground!",
            headerTitle: "text-primary! uppercase!",
            socialButtons: "bg-background!",
            formFieldLabel: "text-primary!",
            input: "bg-none! bg-base-100! text-base-content!",
            formButtonPrimary:
              "bg-primary! text-primary-foreground! shadow-none!",
            footer: "bg-none! bg-secondary!",
            footerActionLink: "text-primary!",
          },
        }}
      />
    </div>
  );
}
