import { useState } from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !username || !password) {
      setError("Please fill all required fields");
      setSuccess("");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, address, username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess(data.message);
      setError("");
      setFullName("");
      setPhone("");
      setAddress("");
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <section className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-2 text-center text-3xl font-bold text-primary">
          Create Account
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Register to book hospital appointments
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border px-4 py-2 outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border px-4 py-2 outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Address (Optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border px-4 py-2 outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border px-4 py-2 outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-4 py-2 outline-none focus:border-primary"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-2 font-medium text-white hover:bg-secondary hover:text-primary transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
