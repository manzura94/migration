"use client";

import React, { useState } from "react";
import { UserData } from "../types/auth.interface";

const BASE_URL = "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";

const cityToStreets: Record<string, string[]> = {
  newyork: ["5th Ave", "Broadway", "Wall Street"],
  london: ["Oxford St", "Baker St", "Regent St"],
  toronto: ["Queen St", "King St", "Bloor St"],
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<UserData>({
    login: "",
    password: "",
    confirmPassword: "",
    city: "",
    street: "",
    houseNumber: 0,
    paymentMethod: "",
  });

  const streets = formData.city ? cityToStreets[formData.city] || [] : [];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateLogin = (value: string) =>
    /^[A-Za-z][A-Za-z0-9]{2,}$/.test(value);
  const validatePassword = (value: string) =>
    /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{6,}$/.test(
      value,
    );
  const validateConfirmPassword = (pw: string, confirm: string) =>
    pw === confirm;
  const validateCity = (value: string) => value.trim() !== "";
  const validateStreet = (value: string) => value.trim() !== "";
  const validateHouse = (value: number) => Number(value) > 1;
  const validatePayment = (value: string) => value.trim() !== "";

  const handleBlur = (field: keyof UserData) => {
    const value = formData[field];
    const newErrors = { ...errors };

    switch (field) {
      case "login":
        if (!value) newErrors.login = "Login must be entered";
        else if (!validateLogin(value as string))
          newErrors.login = "Login must start with a letter and have ≥3 chars";
        else delete newErrors.login;
        break;
      case "password":
        if (!value) newErrors.password = "Password must be entered";
        else if (!validatePassword(value as string))
          newErrors.password =
            "Password must be ≥6 chars and contain a special symbol";
        else delete newErrors.password;
        break;
      case "confirmPassword":
        if (!value) newErrors.confirmPassword = "Please confirm your password";
        else if (!validateConfirmPassword(formData.password, value as string))
          newErrors.confirmPassword = "Passwords do not match";
        else delete newErrors.confirmPassword;
        break;
      case "city":
        if (!validateCity(value as string)) newErrors.city = "Select a city";
        else delete newErrors.city;
        break;
      case "street":
        if (!validateStreet(value as string))
          newErrors.street = "Select a street";
        else delete newErrors.street;
        break;
      case "houseNumber":
        if (!value) newErrors.houseNumber = "Enter a house number";
        else if (!validateHouse(value as number))
          newErrors.houseNumber = "House number must be greater than 1";
        else delete newErrors.houseNumber;
        break;
      case "paymentMethod":
        if (!validatePayment(value as string))
          newErrors.paymentMethod = "Select a payment method";
        else delete newErrors.paymentMethod;
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "houseNumber" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isFormValid = () =>
    validateLogin(formData.login) &&
    validatePassword(formData.password) &&
    validateConfirmPassword(formData.password, formData.confirmPassword) &&
    validateCity(formData.city) &&
    validateStreet(formData.street) &&
    validateHouse(formData.houseNumber) &&
    validatePayment(formData.paymentMethod);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    if (!isFormValid()) {
      setFormError("Please fix the highlighted errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(response);

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Registration failed. Try again.");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", data.data.access_token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch {
      setFormError("Network error. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register">
      <h1 className="register__title">Registration</h1>
      <form className="register__form form" onSubmit={handleSubmit}>
        {formError && (
          <p className="form__error-msg">
            {"Something went wrong, please try again"}
          </p>
        )}

        <div className="register__inputs">
          <div className="form__group">
            <label htmlFor="login" className="form__label">
              Login
            </label>

            <input
              id="login"
              name="login"
              type="text"
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
              id="password"
              name="password"
              type="password"
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

          <div className="form__group">
            <label htmlFor="confirm-password" className="form__label">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              className="form__input"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="error invalid">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
        <div className="register__inputs">
          <div className="form__group">
            <label htmlFor="city" className="form__label">
              City
            </label>

            <select
              id="city"
              name="city"
              className="form__input"
              value={formData.city}
              onChange={handleChange}
              onBlur={() => handleBlur("city")}
            >
              <option value="">Select City</option>
              {Object.keys(cityToStreets).map((city) => (
                <option key={city} value={city}>
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </option>
              ))}
            </select>
            {errors.city && <p className="error invalid">{errors.city}</p>}
          </div>

          <div className="form__group">
            <label htmlFor="street" className="form__label">
              Street
            </label>

            <select
              id="street"
              name="street"
              className="form__input"
              value={formData.street}
              onChange={handleChange}
              onBlur={() => handleBlur("street")}
            >
              <option value="">Select Street</option>
              {streets.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.street && <p className="error invalid">{errors.street}</p>}
          </div>

          <div className="form__group">
            <label htmlFor="house" className="form__label">
              House number
            </label>

            <input
              id="house"
              name="houseNumber"
              type="number"
              className="form__input"
              placeholder="House Number"
              value={formData.houseNumber}
              onChange={handleChange}
              onBlur={() => handleBlur("houseNumber")}
            />
            {errors.houseNumber && (
              <p className="error invalid">{errors.houseNumber}</p>
            )}
          </div>

          <div className="form__group">
            <label className="form__label">Pay by</label>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === "cash"}
                  onChange={handleChange}
                  onBlur={() => handleBlur("paymentMethod")}
                />{" "}
                Cash
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                  onBlur={() => handleBlur("paymentMethod")}
                />{" "}
                Card
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="error invalid">{errors.paymentMethod}</p>
            )}
          </div>
        </div>

        <div className="register__inputs register__button">
          <button
            type="submit"
            className={`form__button ${isFormValid() ? "activate-button" : ""}`}
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? "Loading..." : success ? "Success!" : "Register"}
          </button>
        </div>
      </form>
    </main>
  );
}
