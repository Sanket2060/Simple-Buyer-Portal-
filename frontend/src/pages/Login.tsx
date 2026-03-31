import { useState } from "react";
import { Link } from "react-router";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-white text-2xl font-semibold">BuyerPortal</h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-zinc-400 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm text-zinc-400">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pr-10 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error slot — hidden by default */}
          <div className="hidden items-center gap-2 text-red-400 text-sm bg-red-950 border border-red-900 px-3 py-2.5 rounded-lg">
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Invalid email or password.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-medium text-sm py-2.5 rounded-lg transition-colors mt-2"
          >
            Sign in
          </button>
        </form>

        {/* Register link */}
        <p className="text-zinc-600 text-sm mt-6 text-center">
          No account?{" "}
          <Link
            to="/register"
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
