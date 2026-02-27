import Link from 'next/link';
import Image from 'next/image';
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, LogOut, House } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white dark:bg-[#1a1c23] shadow-sm dark:border-b dark:border-[#374151] transition-colors">
      <nav className="flex justify-between items-center font-work-sans text-black dark:text-[#f3f4f6]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo_novafound.png" alt="logo" width={144} height={30} priority className="dark:invert dark:brightness-0 transition-all" />
        </Link>

        {/* Right Side Links */}
        <div className="flex items-center gap-5">
          {session?.user ? (
            <>
              <Link href="/">
                <span className="max-sm:hidden font-medium">Home</span>
                <House className="size-6 sm:hidden" />
              </Link>

              <Link href="/startup/create">
                <span className="max-sm:hidden font-medium">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="font-medium hover:underline">
                  <span className="max-sm:hidden">
                    Logout
                  </span>
                  <LogOut className="size-6 sm:hidden text-red-500" />
                </button>
              </form>

              <ThemeToggle />

              <Link href={`/user/${session.user.id}`}>
                <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button type="submit" className="font-medium hover:underline">
                Login
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
