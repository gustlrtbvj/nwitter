import React, {useState} from "react";
import {authService} from "fBase";
import {createUserWithEmailAndPassword,GithubAuthProvider,GoogleAuthProvider,signInWithEmailAndPassword,signInWithPopup,} from "@firebase/auth";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
 
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
        await authService.signInWithPopup(provider);
        }
        };
    return (
      <div className="authContainer">
      <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="3x" style={{ marginBottom: 30 }}/>
        <AuthForm />
        <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
        </div>
      </div>
    );
  };

export default Auth