"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("ABC");
  const [email, setEmail] = useState("abc@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      //   console.log(name, email, password);
      const response = await fetch(`${process.env.API}/register`, {
        mode: "no-cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
        setLoading(false);
      } else {
        toast.success(data.message);
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center vh-100">
          <div className="col-lg-5 shadow bg-light p-5">
            <h2 className="mb-4 text-center">Register</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control mb-4"
                placeholder="Enter your name"
              />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-4"
                placeholder="Enter your email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-4"
                placeholder="Enter your password"
              />
              <button
                className="btn btn-primary btn-raised"
                disabled={loading || !email || !name || !password}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
