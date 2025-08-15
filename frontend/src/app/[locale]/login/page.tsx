// src/app/[locale]/login/page.tsx

"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // 1. Логін
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) throw new Error("Невірний email або пароль");
  
      const { access_token } = await res.json();
      localStorage.setItem("access_token", access_token);
  
      // 2. Отримання профілю
      const meRes = await fetch("http://localhost:3000/users/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      if (!meRes.ok) {
        const errData = await meRes.text();
        console.error("Помилка бекенду:", meRes.status, errData);
        throw new Error("Не вдалося отримати користувача");
      }
  
      const user = await meRes.json();
      console.log("User:", user);
  
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Увійти</h1>
        <p className={styles.description}>Будь ласка, введіть дані для входу.</p>

        <form className={styles.form} onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Увійти</button>
        </form>
      </main>
    </div>
  );
}
