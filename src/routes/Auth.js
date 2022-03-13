import React, {useState} from "react";
import {authService} from "fBase";
import {createUserWithEmailAndPassword,GithubAuthProvider,GoogleAuthProvider,signInWithEmailAndPassword,signInWithPopup,} from "@firebase/auth";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount,setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
      const {
        target: { name, value },
      } = event;
      if (name === "email") {
        setEmail(value);
      } else if (name === "password") {
        setPassword(value);
      }
    };
    const onSubmit = async (event) => {
      event.preventDefault();
      try {
        let data;
        if(newAccount) {
            const data = await createUserWithEmailAndPassword(authService, email, password);
            } else {
            const data = await signInWithEmailAndPassword(authService, email, password);
            }
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    const onSocialClick = async (event) => {
        const {
        target: { name },
        } = event;
        let provider;
        try {
        if (name === "google") {
        provider = new GoogleAuthProvider();
        const result = await signInWithPopup(authService, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        } else if (name === "github") {
        provider = new GithubAuthProvider();
        const result = await signInWithPopup(authService, provider);
        const credential = GithubAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        }
        } catch (error) {
        console.log(error);
        }
        };
    return (
      <div>
        <form onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
          />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error}
        </form>
        <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
        <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
        </div>
      </div>
    );
  };

export default Auth