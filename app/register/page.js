"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     const response = await fetch(`${process.env.API}/register`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name,
  //         email,
  //         password,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const data = await response.json();
  //       toast.error(data.err);
  //       setLoading(false);
  //       return;
  //     }

  //     const data = await response.json();
  //     toast.success(data.success);
  //     router.push("/login");
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //     toast.error("An error occurred. Please try again.");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password.length < 6) {
      toast.error("Mật khẩu dài ít nhất 6 ký tự.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch(`${process.env.API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.err);
        setLoading(false);
        return;
      }
  
      const data = await response.json();
      toast.success(data.success);
      router.push("/login");
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  
  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center vh-100">
          <div className="col-lg-5 bg-light p-5 shadow">
            <h2 className="mb-3">Đăng ký</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control mb-3"
                placeholder="Nhập họ tên của bạn"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-3"
                placeholder="Nhập email của bạn"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-3"
                placeholder="Nhập mật khẩu"
              />
              <button
                className="btn btn-primary btn-raised"
                disabled={loading || !name || !email || !password}
              >
                {loading ? "Hãy đợi.." : "Đăng ký"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
