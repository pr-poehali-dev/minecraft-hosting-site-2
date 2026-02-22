import { useState } from "react";

type Mode = "register" | "login";

interface Props {
  onAuth: () => void;
}

const USERS_KEY = "crafthost_users";
const SESSION_KEY = "crafthost_session";

function getUsers(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
}

export default function AuthPage({ onAuth }: Props) {
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    color: "#fff",
    width: "100%",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--neon-green)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Заполни все поля");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      return;
    }

    const users = getUsers();

    if (mode === "register") {
      if (users[email]) {
        setError("Аккаунт с таким email уже существует");
        return;
      }
      users[email] = password;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(SESSION_KEY, email);
      onAuth();
    } else {
      if (!users[email] || users[email] !== password) {
        setError("Неверный email или пароль");
        return;
      }
      localStorage.setItem(SESSION_KEY, email);
      onAuth();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 grid-bg"
      style={{ backgroundColor: "var(--dark-bg)" }}
    >
      {/* glow blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "var(--neon-green)" }} />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none" style={{ background: "var(--neon-purple)" }} />

      <div className="relative w-full max-w-sm animate-up">
        {/* logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⛏️</div>
          <div className="flex items-center justify-center gap-1">
            <span className="font-orbitron font-black text-2xl neon-green">CRAFT</span>
            <span className="font-orbitron font-black text-2xl text-white">HOST</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Minecraft хостинг нового уровня</p>
        </div>

        {/* card */}
        <div
          className="rounded-2xl p-7"
          style={{
            background: "var(--dark-card)",
            border: "1px solid rgba(0,255,106,0.2)",
            boxShadow: "0 0 50px rgba(0,255,106,0.07)",
          }}
        >
          {/* tabs */}
          <div className="flex mb-6 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.04)" }}>
            {(["register", "login"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  mode === m
                    ? { background: "var(--neon-green)", color: "#000", fontFamily: "Orbitron, sans-serif" }
                    : { color: "#6b7280" }
                }
              >
                {m === "register" ? "Регистрация" : "Войти"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Пароль</label>
              <input
                type="password"
                required
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {error && (
              <div
                className="text-sm px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}

            <button type="submit" className="btn-green w-full py-3.5 rounded-xl text-sm mt-2">
              {mode === "register" ? "🚀 Зарегистрироваться" : "🔓 Войти в аккаунт"}
            </button>
          </form>

          <div
            className="mt-5 pt-4 text-center text-xs text-gray-600"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {mode === "register" ? (
              <>
                Уже есть аккаунт?{" "}
                <button onClick={() => switchMode("login")} className="neon-green font-semibold hover:underline">
                  Войти
                </button>
              </>
            ) : (
              <>
                Нет аккаунта?{" "}
                <button onClick={() => switchMode("register")} className="neon-green font-semibold hover:underline">
                  Зарегистрироваться
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-5">
          🔒 Данные хранятся локально на вашем устройстве
        </p>
      </div>
    </div>
  );
}
