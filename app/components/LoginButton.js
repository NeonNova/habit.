import { signIn, signOut, useSession } from "next-auth/react";
import { FaGoogle, FaSignOutAlt } from 'react-icons/fa';

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors duration-200"
      >
        <FaSignOutAlt className="mr-2" />
        Sign Out
      </button>
    );
  }
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
    >
      <FaGoogle className="mr-2" />
      Log In or Sign Up
    </button>
  );
}
