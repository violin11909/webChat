import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../../features/auth";
import { useAuth } from "../../contexts/AuthContext";

const inputClassName =
  "border-[1.5px] border-gray-300 shadow-sm rounded-md px-2 w-full h-[40px] [color-scheme:light]";
const labelClassName = "text-[14px] font-[500] mt-4 mb-1";
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayError, setDisplayError] = useState("");
  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!username || !password) {
      setDisplayError("Please fill out the form");
      return;
    }
    const data = { username: trimmedUsername, password: trimmedPassword };
    try {
      const response = await loginService(data);
      if (response?.success) {
        await login(response.token);
        navigate("/chat");
      } else {
        setDisplayError("Incorrect username or password.");
      }
    } catch (error) {
      setDisplayError("Incorrect username or password.");
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 flex justify-center items-center">
      <div className="flex flex-col p-8 w-[420px] h-[480px] bg-white text-black rounded-lg shadow-lg">
        <div className="font-[600] text-[24px]">Login to your account</div>
        {/* Username */}
        <div className={labelClassName}>Username</div>
        <input type={"text"} value={username} className={inputClassName} onChange={(e) => setUsername(e.target.value)} />
        {/* Password */}
        <div className={labelClassName}>Password</div>
        <input type={"password"} value={password} className={inputClassName} onChange={(e) => setPassword(e.target.value)} />
        <div className=" text-red-700 font-[700] text-[16px] h-[22px] mt-2">{displayError}</div>
        <div
          className={`flex items-center justify-center rounded-md px-2 w-full h-[48px] bg-orange-400 hover:bg-orange-500 hover- mt-4 text-white font-[500] shadow-sm`}
          onClick={handleLogin}
        >
          Login
        </div>
        <div className="flex flex-col items-center mt-auto">
          <div className="text-gray-600 font-[500]">Don't have an account?</div>
          <div className="text-orange-600 font-[600] select-none hover:text-orange-700" onClick={() => navigate("/register")}>Sign up</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
