import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20"
      >
        <h2 className="text-3xl font-bold text-black text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-black text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-lg border border-[#998e8a] bg-white/20 text-black placeholder-black/70 focus:outline-none
               focus:ring-2 focus:ring-[#998e8a]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-black text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-lg border border-[#998e8a] bg-white/20 text-black placeholder-black/70 focus:outline-none
               focus:ring-2 focus:ring-[#998e8a]"
              placeholder="Enter your password"
            />
          </div>

          <Link to={"/uploadproduct"}>
            <button
              type="submit"
              className="w-full bg-[#998e8a]/70 text-white font-semibold py-3 rounded-lg hover:bg-[#998e8a] transition cursor-pointer"
            >
              Login
            </button>
          </Link>
        </form>

        <p className="text-center text-white/80 text-sm mt-6">
          Don’t have an account?{" "}
          <span className="underline cursor-pointer">Sign up</span>
        </p>
      </motion.div>
    </div>
  );
}
