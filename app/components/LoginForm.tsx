"use client";

import { useState } from "react";
import { AuthResponse } from "../types/auth.interface";

const BASE_URL = "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ login?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateLogin = (value: string) =>
    /^[A-Za-z][A-Za-z0-9]{2,}$/.test(value);
  const validatePassword = (value: string) =>
    /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{6,}$/.test(
      value,
    );

  const handleBlur = (field: "login" | "password") => {
    const value = formData[field];
    const newErrors = { ...errors };

    if (field === "login") {
      if (!value) newErrors.login = "Login must be entered";
      else if (!validateLogin(value))
        newErrors.login =
          "Login must be at least 3 letters and start with a letter";
      else delete newErrors.login;
    } else if (field === "password") {
      if (!value) newErrors.password = "Password must be entered";
      else if (!validatePassword(value))
        newErrors.password =
          "Password must be ≥6 chars and contain a special symbol";
      else delete newErrors.password;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isFormValid = () =>
    validateLogin(formData.login) && validatePassword(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isFormValid()) {
      setFormError("Please fix the highlighted errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(response);

      const data: AuthResponse = await response.json();
      if (!response.ok) {
        setFormError("Incorrect login or password");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", data.data.access_token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        window.location.href = "/menu";
      }, 3000);
    } catch {
      setFormError("Network error. Please try again later.");
      setIsSubmitting(false);
    }
  };

  const isValid =
    validateLogin(formData.login) && validatePassword(formData.password);

  return (
    <main className="register signin">
      <h1 className="signin__title">Sign In</h1>
      <form className="register__form signin__form" onSubmit={handleSubmit}>
        {formError && <p className="form__error-msg">{formError}</p>}
        <div className="register__inputs signin__inputs">
          <div className="form__group">
            <label htmlFor="login" className="form__label">
              Login
            </label>
            <input
              name="login"
              type="text"
              id="login"
              className="form__input"
              placeholder="Login"
              value={formData.login}
              onChange={handleChange}
              onBlur={() => handleBlur("login")}
            />
            {errors.login && <p className="error invalid">{errors.login}</p>}
          </div>

          <div className="form__group">
            <label htmlFor="password" className="form__label">
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              className="form__input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
            />
            {errors.password && (
              <p className="error invalid">{errors.password}</p>
            )}
          </div>
          <div className="register__inputs register__button">
            <button
              className={`form__button ${isValid ? "activate-button" : ""}`}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Loading..." : success ? "Success!" : "Sign In"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
