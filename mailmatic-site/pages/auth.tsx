import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { initFirebase } from "../utils/firebaseApp";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import Layout from "../components/layout";

export default function Login() {
  initFirebase();
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, isLoadingUser] = useAuthState(auth);
  const route = useRouter();

  //   Sign in with Google
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  //   Redirect to home if user is already logged in
  useEffect(() => {
    if (user) {
      route.push("/");
    }
  }, [user]);

  return (
    <Layout>
      <div className="mb-6 text-slate-400">
        <p className="min-w-md">Users can submit longer notes.</p>
      </div>
      <div className="flex flex-col gap-4">
        <button
          className="button-slate flex align-middle gap-2 "
          onClick={GoogleLogin}
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </Layout>
  );
}
