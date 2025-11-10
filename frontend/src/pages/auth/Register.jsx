import { useState } from "react";
import { register } from "../../features/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const inputClassName =
  "border-[1.5px] border-gray-300 shadow-sm rounded-md px-2 w-full h-[40px] bg-gray-100 [color-scheme:light]";
const labelClassName = "text-[14px] font-[500] mt-4 mb-1";
function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [displayError, setDisplayError] = useState("");
  const [isFormComplete, setIsFromComplete] = useState(true);

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!name || !username || !password) {
      setIsFormComplete(false);
      return;
    }
    const data = {
      name: trimmedName,
      username: trimmedUsername,
      password: trimmedPassword,
    };

    try {
      const response = await register(data);
      if (response?.success === true) {
        setIsRegisterSuccess(true);
        setIsFormComplete(true);
        await login(response.token);
        navigate("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  };

return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 flex justify-center items-center">
      <div className="flex flex-col p-8 w-[420px] h-[520px] bg-white text-black rounded-lg shadow-lg">
        <div className="font-[600] text-[24px]">Create an account</div>
        {/* Name */}
        <div className={labelClassName}>Name</div>
        <input type={"text"} value={name} className={inputClassName} onChange={(e) => setName(e.target.value)} />
        {/* Username */}
        <div className={labelClassName}>Username</div>
        <input type={"text"} value={username} className={inputClassName} onChange={(e) => setUsername(e.target.value)} />
        {/* Password */}
        <div className={labelClassName}>Password</div>
        <input type={"password"} value={password} className={inputClassName} onChange={(e) => setPassword(e.target.value)} />
        <div className="text-[12px] mt-1 text-gray-700">Password must be at least 6 characters.</div>
        {isFormComplete ? (
          <div className="mt-2 h-[24px]"></div>
        ) : (
          <>
            <div className=" text-red-700 font-[700] text-[16px] mt-2">Please fill out the form</div>
          </>
        )}
        <div
          className={`flex items-center justify-center rounded-md px-2 w-full h-[48px] bg-orange-400 hover:bg-orange-500 hover- mt-4 text-white font-[500] shadow-sm`}
          onClick={handleRegister}
        >
          Sign up
        </div>
        <div className="flex flex-col items-center mt-auto">
          <div className="text-gray-600 font-[500]">Already have an account?</div>
          <div className="text-orange-600 font-[600] select-none hover:text-orange-700" onClick={() => navigate("/login")}>Log in</div>
        </div>
      </div>
    </div>
  );
}

export default Register;
