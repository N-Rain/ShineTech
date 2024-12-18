"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  // to find user in db and send resetcode via email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // to reset password (enter emailed resetcode and new password)
  const [resetCode, setResetCode] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${process.env.API}/password/forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
        setLoading(false);
      } else {
        setResetCode(" "); // Set reset code to trigger the resetCode form with white space
        toast.success(data.message);
        setLoading(false); // Clear loading state after successful reset
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${process.env.API}/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          resetCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
        setLoading(false);
        return;
      } else {
        toast.success(data.message);
        setLoading(false); // Clear loading state after successful reset
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  if (resetCode) {
    return (
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center vh-100">
          <div className="col-lg-5 bg-light p-5 shadow">
            <h2 className="mb-3">Đặt lại mật khẩu</h2>

            <form onSubmit={handleReset}>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.trim())}
                className="form-control mb-3"
                placeholder="Nhập mã OTP để đặt lại mật khẩu"
              />
              <button
                className="btn btn-primary btn-raised"
                disabled={loading || !resetCode}
              >
                {loading ? "Hãy đợi.." : "Đặt lại"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center vh-100">
          <div className="col-lg-5 bg-light p-5 shadow">
            <h2 className="mb-3">Quên mật khẩu</h2>

            <form onSubmit={handleSubmit}>
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
                placeholder="Nhập mật khẩu mới"
              />
              <button
                className="btn btn-primary btn-raised"
                disabled={loading || !email || !password}
              >
                {loading ? "Hãy đợi.." : "Xác nhận"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
