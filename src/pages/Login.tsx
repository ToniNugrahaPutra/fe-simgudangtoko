import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useRoleRedirect } from "../hooks/useRoleRedirect";

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useRoleRedirect();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white w-full">
      <div className="flex justify-center h-screen w-full">
        {/* === LEFT SIDE: LOGIN FORM === */}
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-3/8">
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-10">
                <div className="flex items-center">
                  <img
                    className="w-auto h-7 sm:h-8"
                    src="/assets/images/logos/logo.svg"
                    alt="logo"
                  />
                  <p className="pl-2 font-semibold text-2xl">SimGudangToko</p>
                </div>
              </div>
              <p className="mt-3 text-font font-semibold text-2xl">
                Welcome back!
              </p>
              <p className="mt-1 text-font font-normal text-sm">
                Keep up the spirit of living the day.
              </p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-font"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border 
                    border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 
                    focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="text-sm text-font"
                    >
                      Password
                    </label>
                  </div>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border 
                    border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 
                    focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  <a
                      href="#"
                      className="text-sm flex justify-end mt-2 text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline"
                    >
                      Forgot password?
                    </a>
                </div>

                {error && (
                  <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    className="cursor-pointer w-full rounded-full px-4 py-3 tracking-wide text-white border transition-colors duration-300 transform bg-primary hover:bg-white hover:border-primary hover:text-primary"
                  >
                    Sign in
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>

        {/* === RIGHT SIDE: IMAGE === */}
        <div className="m-5 ml-0 rounded-xl hidden lg:flex lg:w-5/8 bg-[#B9CDEB] items-center justify-center">
          <img
            src="\assets\images\backgrounds\login.svg"
            alt="Background Illustration"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
