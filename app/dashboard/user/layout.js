import Link from "next/link";
import UserNav from "@/components/nav/UserNav";

export default function UserDashboard({children}) {
  return (
    <>
    <UserNav />
    {children}
    </>
  );
}