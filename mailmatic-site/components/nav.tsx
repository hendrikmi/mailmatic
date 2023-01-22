import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import logo from "../public/mailmatic-logo.png";
import { auth } from "../utils/firebaseApp";

const Nav: React.FC = () => {
  const [user, isLoadingUser] = useAuthState(auth);

  return (
    <>
      <nav className="flex justify-between items-center py-4">
        {user && (
          <>
            <Link href={"/"}>
              <Image className="" src={logo} alt="" width={18} height={18} />
            </Link>
            <ul>
              <div>
                <span className="text-slate-400 p-2">{user.email}</span>
                <button
                  className="bg-slate-700 hover:bg-slate-800 p-2 rounded-md text-sm text-white"
                  onClick={() => auth.signOut()}
                >
                  Logout
                </button>
              </div>
            </ul>
          </>
        )}
      </nav>
    </>
  );
};
export default Nav;
