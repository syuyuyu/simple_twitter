import React, { useEffect, useState } from "react";
import { AuthButton, AuthContainer, AuthLinkText, LogoStyle, TitleH3 } from "../components/common/authstyled";
import AuthInput from "../components/AuthInput";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";


const RegistPage = () => {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setcheCkPassword] = useState("");
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const handleClick = async () => {
    if (account.length === 0) {
      return;
    }
    if (name.length === 0) {
      return;
    }
    if (email.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }
    if (checkPassword.length === 0) {
      return;
    }

    const success = await register({
      account,
      name,
      email,
      password,
      checkPassword,
    });

    if (success) {
      
      Swal.fire({
        title: "註冊成功",
        icon: "success",
        showCloseButton: false,
        timer: 1000,
        position: "top",
      });
      return;
    }
    Swal.fire({
      title: "註冊失敗",
      icon: "error",
      showCloseButton: false,
      timer: 1000,
      position: "top",
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user/main");
    }
  }, [navigate, isAuthenticated]);

  return (
    <AuthContainer>
      <LogoStyle>
        <div className='logo-icon'></div>
      </LogoStyle>
      <TitleH3>建立你的帳號</TitleH3>
      <AuthInput
        label='帳號'
        placeholder='請輸入帳號'
        value={account}
        onChange={(accountInputValue) => setAccount(accountInputValue)}
      />
      <AuthInput
        label='名稱'
        placeholder='請輸入使用者名稱'
        value={name}
        onChange={(nameInputValue) => setName(nameInputValue)}
      />
      <AuthInput
        label='Email'
        placeholder='請輸入Email'
        typr='email'
        value={email}
        onChange={(emailInputValue) => setEmail(emailInputValue)}
      />
      <AuthInput
        type='password'
        label='密碼'
        placeholder='請設定密碼'
        value={password}
        onChange={(passwordInputValue) => setPassword(passwordInputValue)}
      />
      <AuthInput
        type='password'
        label='密碼確認'
        placeholder='請再次輸入密碼'
        value={checkPassword}
        onChange={(checkPasswordInputValue) => setcheCkPassword(checkPasswordInputValue)}
      />
      <AuthButton onClick={handleClick}>註冊</AuthButton>
      <Link to='/'>
        <AuthLinkText>取消</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default RegistPage;
