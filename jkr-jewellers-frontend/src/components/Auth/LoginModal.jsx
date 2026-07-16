import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Auth.css";
import api from "../../services/api";

function LoginModal({ setIsLoggedIn }) {

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);

  // Popup State
  const [popup, setPopup] = useState({
    open: false,
    type: "success",
    message: ""
  });

  useEffect(() => {

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };

  }, []);

  const showPopup = (type, message) => {

    setPopup({
      open: true,
      type,
      message
    });

    setTimeout(() => {

      setPopup(prev => ({
        ...prev,
        open: false
      }));

    }, 3000);

  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);

      showPopup("success", "Login Successful");

      setTimeout(() => {
        setIsLoggedIn(true);
      }, 800);

    } catch (error) {

      const message =
        error.response?.data?.message || "Invalid Email or Password";

      showPopup("error", message);

    }

  };

  const handleRegister = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {

      showPopup("error", "Passwords do not match");

      return;

    }

    try {

      await api.post("/auth/register", {
        name,
        email,
        phone,
        password
      });

      showPopup(
        "success",
        "OTP sent to your email. Please verify."
      );

      setMode("otp");

    } catch (error) {

      const message =
        error.response?.data?.message || "Registration Failed";

      showPopup("error", message);

      console.error(error);

    }

  };

  const handleVerifyOtp = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post("/auth/verify-otp", {
        email,
        otp
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);

      showPopup("success", "Email Verified Successfully");

      setTimeout(() => {
        setIsLoggedIn(true);
      }, 800);

    } catch (error) {

      const message =
        error.response?.data?.message || "Invalid or expired OTP";

      showPopup("error", message);

      console.error(error);

    }

  };
    const handleResendOtp = async () => {

    setResending(true);

    try {

      await api.post(`/auth/resend-otp?email=${encodeURIComponent(email)}`);

      showPopup("success", "A new OTP has been sent.");

    } catch (error) {

      const message =
        error.response?.data?.message || "Unable to resend OTP";

      showPopup("error", message);

    } finally {

      setResending(false);

    }

  };

  return createPortal(

    <>
      {popup.open && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}

      <div className="modal-overlay">

        <div className="login-modal">

          <div className="left-panel">

            <h1>Welcome</h1>

            <p>
              Discover timeless jewellery crafted with elegance.
            </p>

          </div>

          <div className="right-panel">

            {mode === "otp" ? (

              <>

                <h2>Verify Your Email</h2>

                <p>
                  Enter the 6-digit code sent to {email}
                </p>

                <form onSubmit={handleVerifyOtp}>

                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />

                  <button type="submit">
                    Verify & Continue
                  </button>

                </form>

                <div className="switch-auth">

                  <p>

                    Didn't receive the code?

                    <span onClick={!resending ? handleResendOtp : undefined}>
                      {resending ? "Sending..." : "Resend OTP"}
                    </span>

                  </p>

                </div>

              </>

            ) : (

              <>

                <h2>
                  {mode === "register"
                    ? "Create Your Account"
                    : "Welcome to JKR Jewellers"}
                </h2>

                <p>
                  {mode === "register"
                    ? "Register to continue shopping"
                    : "Login to continue shopping"}
                </p>

                <form
                  onSubmit={mode === "register"
                    ? handleRegister
                    : handleLogin}
                >

                  {mode === "register" && (
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  )}

                  {mode === "register" && (
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  )}

                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {mode === "register" && (
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      required
                    />
                  )}

                  <button type="submit">
                    {mode === "register"
                      ? "Register"
                      : "Login"}
                  </button>

                </form>

                <div className="switch-auth">

                  {mode === "register" ? (

                    <p>

                      Already have an account?

                      <span onClick={() => setMode("login")}>
                        Login
                      </span>

                    </p>

                  ) : (

                    <p>

                      Don't have an account?

                      <span onClick={() => setMode("register")}>
                        Register
                      </span>

                    </p>

                  )}

                </div>

              </>

            )}

          </div>

        </div>

      </div>

    </>,

    document.body

  );

}

export default LoginModal;