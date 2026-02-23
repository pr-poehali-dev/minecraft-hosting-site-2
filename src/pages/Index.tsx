import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/ba521029-6ca4-49d4-a666-cf03ee9bfa63/files/448f55ca-b4e7-4cd2-a3e1-b1fa0e1b93c2.jpg";

const NAV = [
  { label: "Главная", id: "hero" },
  { label: "Тарифы", id: "plans" },
  { label: "Статус", id: "status" },
  { label: "Отзывы", id: "reviews" },
  { label: "Контакты", id: "contacts" },
];

const PLANS = [
  {
    name: "Крипер",
    emoji: "💚",
    price: "149",
    color: "green" as const,
    popular: false,
    ram: "2 GB", cpu: "2 vCPU", storage: "15 GB SSD", players: "до 20",
    features: ["DDoS защита", "Ежедневные бэкапы", "Панель управления", "Поддержка 24/7"],
  },
  {
    name: "Эндер",
    emoji: "💜",
    price: "349",
    color: "purple" as const,
    popular: true,
    ram: "6 GB", cpu: "4 vCPU", storage: "40 GB SSD", players: "до 80",
    features: ["DDoS защита Pro", "Бэкапы каждый час", "Панель управления", "Поддержка 24/7", "Моды и плагины", "Выделенный IP"],
  },
  {
    name: "Дракон",
    emoji: "🩵",
    price: "699",
    color: "cyan" as const,
    popular: false,
    ram: "16 GB", cpu: "8 vCPU", storage: "100 GB NVMe", players: "300+",
    features: ["DDoS защита Ultra", "Бэкапы каждые 30 мин", "Панель управления", "VIP поддержка 24/7", "Моды и плагины", "Выделенный IP", "CDN ускорение"],
  },
];

const FEATURES = [
  { icon: "Zap", title: "Нулевые лаги", desc: "NVMe SSD и мощные Xeon процессоры обеспечивают молниеносный отклик", color: "green" },
  { icon: "Shield", title: "DDoS защита", desc: "Фильтрация атак до 1 Tbps. Сервер остаётся онлайн при любых нападениях", color: "purple" },
  { icon: "Database", title: "Резервные копии", desc: "Автоматические бэкапы до каждых 30 минут. Восстановление в один клик", color: "cyan" },
  { icon: "Lock", title: "Безопасность", desc: "Изолированные контейнеры, шифрование данных по стандарту ISO 27001", color: "green" },
  { icon: "Cpu", title: "Мощные серверы", desc: "Оборудование последнего поколения. Гарантированный аптайм 99.99%", color: "purple" },
  { icon: "Headphones", title: "Поддержка 24/7", desc: "Живые специалисты круглосуточно. Среднее время ответа — 2 минуты", color: "cyan" },
];

const SERVERS = [
  { name: "EU-West-1 (Москва)", ping: "4 мс", load: 23 },
  { name: "EU-East-1 (Питер)", ping: "8 мс", load: 45 },
  { name: "US-Central", ping: "110 мс", load: 62 },
  { name: "AS-Tokyo", ping: "175 мс", load: 31 },
];

const PAYMENT_METHODS = [
  { id: "sbp", icon: "Smartphone", label: "СБП", sublabel: "Система быстрых платежей", desc: "Оплата через любой банк по номеру телефона. Без комиссии.", color: "#00c853", badge: "Без комиссии" },
  { id: "card", icon: "CreditCard", label: "Банковская карта", sublabel: "Visa / Mastercard / МИР", desc: "Оплата картой любого банка. Комиссия 0%.", color: "#a855f7", badge: null },
  { id: "crypto", icon: "Bitcoin", label: "Криптовалюта", sublabel: "USDT, BTC, ETH, TON", desc: "Оплата криптовалютой через CryptoBot.", color: "#f59e0b", badge: null },
  { id: "qiwi", icon: "Wallet", label: "ЮMoney / Кошелёк", sublabel: "ЮMoney, QIWI, WebMoney", desc: "Оплата через электронный кошелёк.", color: "#00f5ff", badge: null },
];

type Review = { name: string; avatar: string; server: string; rating: number; text: string };

const INITIAL_REVIEWS: Review[] = [
  { name: "Алексей К.", avatar: "⚔️", server: "120 игроков", rating: 5, text: "Работаем полгода — ни одного лага. Переехали с другого хостинга, разница огромная. Пинг у всех игроков упал ниже 10 мс." },
  { name: "Мария Г.", avatar: "🎮", server: "Семейный сервер", rating: 5, text: "Панель управления очень удобная, настроила всё за 5 минут. Техподдержка отвечает мгновенно, даже ночью!" },
  { name: "Дмитрий П.", avatar: "🏆", server: "Коммерческий сервер", rating: 5, text: "Была атака DDoS на 50 Gbps — сервер даже не дрогнул. Защита реально работает. Рекомендую всем серьёзным проектам." },
];

const AVATARS = ["⚔️", "🎮", "🏆", "🧱", "🛡️", "🎯", "🔥", "💎", "⭐", "🐉"];

const borderClass = (color: string) =>
  color === "green" ? "border-neon-green" : color === "purple" ? "border-neon-purple" : "border-neon-cyan";

const textClass = (color: string) =>
  color === "green" ? "neon-green" : color === "purple" ? "neon-purple" : "neon-cyan";

const bgAlpha = (color: string) =>
  color === "green" ? "rgba(0,255,106,0.08)" : color === "purple" ? "rgba(168,85,247,0.08)" : "rgba(0,245,255,0.08)";

type Plan = typeof PLANS[number];

export default function Index() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  // Payment modal
  const [buyPlan, setBuyPlan] = useState<Plan | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [payStep, setPayStep] = useState<"choose" | "confirm">("choose");

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", server: "", rating: 5, text: "", avatar: "🎮" });
  const [reviewSent, setReviewSent] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      for (const { id } of [...NAV].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (buyPlan) {
      document.body.style.overflow = "hidden";
      setSelectedPayment(null);
      setPayStep("choose");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [buyPlan]);

  const goto = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      name: reviewForm.name,
      server: reviewForm.server,
      rating: reviewForm.rating,
      text: reviewForm.text,
      avatar: reviewForm.avatar,
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewSent(true);
    setReviewForm({ name: "", server: "", rating: 5, text: "", avatar: "🎮" });
    setTimeout(() => {
      setReviewSent(false);
      setShowReviewForm(false);
    }, 2500);
  };

  const handlePay = () => {
    setPayStep("confirm");
  };

  return (
    <div className="min-h-screen text-white font-montserrat" style={{ backgroundColor: "var(--dark-bg)" }}>

      {/* ── PAYMENT MODAL ── */}
      {buyPlan && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setBuyPlan(null); }}
        >
          <div
            className="relative w-full max-w-md rounded-2xl p-6 animate-up"
            style={{ background: "#0d1220", border: "1px solid rgba(0,255,106,0.25)", boxShadow: "0 0 60px rgba(0,255,106,0.1)" }}
          >
            {/* close */}
            <button
              onClick={() => setBuyPlan(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <Icon name="X" size={20} />
            </button>

            {payStep === "choose" ? (
              <>
                <div className="mb-5">
                  <div className="text-xs text-gray-500 font-orbitron mb-1">ОПЛАТА ТАРИФА</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{buyPlan.emoji}</span>
                    <span className="font-orbitron font-black text-xl text-white">{buyPlan.name}</span>
                    <span className="ml-auto font-orbitron font-black text-2xl neon-green">{buyPlan.price}₽<span className="text-gray-400 text-sm font-normal">/мес</span></span>
                  </div>
                </div>

                <div className="text-sm text-gray-400 font-semibold mb-3">Выбери способ оплаты:</div>
                <div className="space-y-2 mb-5">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm.id)}
                      className="w-full text-left rounded-xl p-3.5 flex items-center gap-3 transition-all"
                      style={{
                        background: selectedPayment === pm.id ? `${pm.color}14` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedPayment === pm.id ? pm.color : "rgba(255,255,255,0.08)"}`,
                        boxShadow: selectedPayment === pm.id ? `0 0 16px ${pm.color}22` : "none",
                      }}
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${pm.color}18` }}>
                        <Icon name={pm.icon} size={18} style={{ color: pm.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{pm.label}</span>
                          {pm.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: `${pm.color}25`, color: pm.color }}>
                              {pm.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{pm.sublabel}</div>
                      </div>
                      {selectedPayment === pm.id && (
                        <Icon name="CheckCircle" size={18} style={{ color: pm.color }} />
                      )}
                    </button>
                  ))}
                </div>

                {selectedPayment && (
                  <div className="mb-4 p-3 rounded-xl text-sm text-gray-300"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.desc}
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={!selectedPayment}
                  className="w-full py-3.5 rounded-xl text-sm btn-green disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  Перейти к оплате →
                </button>
                <p className="text-center text-xs text-gray-600 mt-3">🔒 Безопасная оплата · Возврат в течение 24 ч</p>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🚀</div>
                <div className="font-orbitron font-black text-xl neon-green mb-2">Переходим к оплате!</div>
                <p className="text-gray-400 text-sm mb-4">
                  Менеджер свяжется с тобой в течение 5 минут<br />и вышлет ссылку для оплаты через{" "}
                  <span className="text-white font-semibold">
                    {PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.label}
                  </span>
                </p>
                <div className="p-3 rounded-xl text-sm text-gray-300 mb-5"
                  style={{ background: "rgba(0,255,106,0.06)", border: "1px solid rgba(0,255,106,0.2)" }}>
                  Тариф: <span className="font-bold text-white">{buyPlan.emoji} {buyPlan.name}</span> · {buyPlan.price}₽/мес
                </div>
                <a
                  href="https://t.me/crafthost_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-green w-full py-3.5 rounded-xl text-sm inline-block"
                  onClick={() => setBuyPlan(null)}
                >
                  ✈️ Написать в Telegram
                </a>
                <button onClick={() => setPayStep("choose")} className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  ← Изменить способ оплаты
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(7,11,20,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,255,106,0.12)" }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => goto("hero")} className="flex items-center gap-2">
            <span className="text-2xl">⛏️</span>
            <span className="font-orbitron font-black text-xl neon-green">CRAFT</span>
            <span className="font-orbitron font-black text-xl text-white">HOST</span>
          </button>
          <div className="hidden md:flex items-center gap-7">
            {NAV.map(({ label, id }) => (
              <button key={id} onClick={() => goto(id)}
                className={`text-sm font-semibold transition-all ${activeSection === id ? "neon-green" : "text-gray-400 hover:text-white"}`}>
                {label}
              </button>
            ))}
            <button onClick={() => goto("plans")} className="btn-green px-5 py-2 rounded-lg text-sm">Купить сервер</button>
          </div>
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-3" style={{ background: "rgba(7,11,20,0.98)", borderTop: "1px solid rgba(0,255,106,0.1)" }}>
            {NAV.map(({ label, id }) => (
              <button key={id} onClick={() => goto(id)} className="text-left text-gray-300 font-semibold hover:text-white py-1">{label}</button>
            ))}
            <button onClick={() => goto("plans")} className="btn-green px-5 py-3 rounded-lg text-sm mt-1">Купить сервер</button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center grid-bg pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(7,11,20,0.4) 0%, rgba(7,11,20,0.75) 60%, rgba(7,11,20,1) 100%)" }} />
        </div>
        <div className="absolute top-24 left-16 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "var(--neon-green)" }} />
        <div className="absolute bottom-24 right-16 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none" style={{ background: "var(--neon-purple)" }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-semibold"
            style={{ border: "1px solid rgba(0,255,106,0.35)", background: "rgba(0,255,106,0.08)", color: "var(--neon-green)" }}>
            <span className="w-2 h-2 rounded-full animate-status inline-block" style={{ background: "var(--neon-green)" }} />
            Все серверы онлайн · 99.99% аптайм
          </div>
          <h1 className="font-orbitron font-black leading-tight mb-6" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
            <span className="grad-green">MINECRAFT</span><br />
            <span className="text-white">ХОСТИНГ</span><br />
            <span className="grad-purple">НОВОГО УРОВНЯ</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Мощные серверы, нулевые лаги, DDoS защита до 1 Tbps.<br />
            Запусти свой Minecraft сервер за <span className="font-bold neon-green">3 минуты</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <button onClick={() => goto("plans")} className="btn-green px-9 py-4 rounded-xl text-base">🚀 Начать сейчас</button>
            <button onClick={() => goto("status")} className="btn-outline-purple px-9 py-4 rounded-xl text-base">Статус серверов</button>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[["1000+", "Серверов"], ["99.99%", "Аптайм"], ["24/7", "Поддержка"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="font-orbitron font-black text-2xl neon-green">{val}</div>
                <div className="text-gray-500 text-xs mt-1">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl mb-3"><span className="grad-green">ПОЧЕМУ МЫ?</span></h2>
            <p className="text-gray-400">Технологии, которые делают игру лучше</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${borderClass(f.color)}`}
                style={{ background: "var(--dark-card)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: bgAlpha(f.color) }}>
                  <Icon name={f.icon} size={24} className={textClass(f.color)} />
                </div>
                <h3 className={`font-orbitron font-bold text-lg mb-2 ${textClass(f.color)}`}>{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section id="plans" className="py-24 px-4" style={{ background: "linear-gradient(180deg, var(--dark-bg) 0%, #0a101c 50%, var(--dark-bg) 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl mb-3"><span className="grad-purple">ТАРИФЫ</span></h2>
            <p className="text-gray-400">Выбери подходящий план для своего сервера</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PLANS.map((plan) => (
              <div key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${borderClass(plan.color)}`}
                style={{ background: "var(--dark-card)" }}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold font-orbitron"
                    style={{ background: "var(--neon-purple)", color: "#fff" }}>🔥 ПОПУЛЯРНЫЙ</div>
                )}
                <div className={`font-orbitron font-black text-2xl mb-1 ${textClass(plan.color)}`}>{plan.emoji} {plan.name}</div>
                <div className="flex items-end gap-1 mb-6">
                  <span className="font-orbitron font-black text-4xl text-white">{plan.price}₽</span>
                  <span className="text-gray-400 mb-1">/мес</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {[["💾", "RAM", plan.ram], ["⚙️", "CPU", plan.cpu], ["💿", "Диск", plan.storage], ["👥", "Игроки", plan.players]].map(([emoji, lbl, val]) => (
                    <div key={lbl}>
                      <div className="text-gray-500 text-xs">{emoji} {lbl}</div>
                      <div className="text-white font-semibold text-sm">{val}</div>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                      <Icon name="Check" size={15} className={textClass(plan.color)} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setBuyPlan(plan)}
                  className={`w-full py-3 rounded-xl text-sm ${plan.popular ? "btn-green" : "btn-outline-purple"}`}
                >
                  💳 Приобрести
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATUS ── */}
      <section id="status" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl mb-3"><span className="neon-cyan">СТАТУС СЕРВЕРОВ</span></h2>
            <p className="text-gray-400">Мониторинг в реальном времени</p>
          </div>
          <div className="space-y-4">
            {SERVERS.map((s) => {
              const loadColor = s.load < 50 ? "var(--neon-green)" : s.load < 75 ? "#f59e0b" : "#ef4444";
              return (
                <div key={s.name} className="border-neon-green rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
                  style={{ background: "var(--dark-card)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full animate-status" style={{ background: "var(--neon-green)" }} />
                    <div>
                      <div className="font-orbitron font-bold text-white text-sm">{s.name}</div>
                      <div className="text-gray-400 text-xs">Пинг: <span className="neon-cyan">{s.ping}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-48">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Нагрузка</span>
                        <span style={{ color: loadColor }}>{s.load}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${s.load}%`, background: loadColor }} />
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold font-orbitron"
                      style={{ background: "rgba(0,255,106,0.12)", color: "var(--neon-green)", border: "1px solid rgba(0,255,106,0.3)" }}>
                      ONLINE
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" className="py-24 px-4" style={{ background: "linear-gradient(180deg, var(--dark-bg) 0%, #0a101c 50%, var(--dark-bg) 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl mb-3"><span className="grad-green">ОТЗЫВЫ</span></h2>
            <p className="text-gray-400 mb-6">Что говорят наши клиенты</p>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ border: "1px solid rgba(0,255,106,0.35)", background: "rgba(0,255,106,0.08)", color: "var(--neon-green)" }}
            >
              <Icon name={showReviewForm ? "ChevronUp" : "PenLine"} size={16} />
              {showReviewForm ? "Свернуть" : "Оставить отзыв"}
            </button>
          </div>

          {/* Review form */}
          {showReviewForm && (
            <div className="max-w-xl mx-auto mb-10 animate-up">
              <div className="rounded-2xl p-6" style={{ background: "var(--dark-card)", border: "1px solid rgba(0,255,106,0.2)" }}>
                {reviewSent ? (
                  <div className="text-center py-6">
                    <div className="text-5xl mb-3">🎉</div>
                    <div className="font-orbitron font-bold text-lg neon-green mb-1">Спасибо за отзыв!</div>
                    <p className="text-gray-400 text-sm">Твой отзыв уже на странице</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Имя / ник</label>
                        <input
                          required type="text" placeholder="Steve_2024"
                          value={reviewForm.name}
                          onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg text-white text-sm placeholder-gray-600 outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Тип сервера</label>
                        <input
                          type="text" placeholder="PvP / Выживание..."
                          value={reviewForm.server}
                          onChange={(e) => setReviewForm({ ...reviewForm, server: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg text-white text-sm placeholder-gray-600 outline-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Аватар</label>
                      <div className="flex flex-wrap gap-2">
                        {AVATARS.map((av) => (
                          <button
                            type="button" key={av}
                            onClick={() => setReviewForm({ ...reviewForm, avatar: av })}
                            className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all"
                            style={{
                              background: reviewForm.avatar === av ? "rgba(0,255,106,0.15)" : "rgba(255,255,255,0.05)",
                              border: `1px solid ${reviewForm.avatar === av ? "var(--neon-green)" : "rgba(255,255,255,0.1)"}`,
                            }}
                          >{av}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Оценка</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button type="button" key={s} onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                            className="text-2xl transition-transform hover:scale-110">
                            <span style={{ color: s <= reviewForm.rating ? "#f59e0b" : "#374151" }}>★</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Отзыв</label>
                      <textarea
                        required rows={3} placeholder="Расскажи о своём опыте..."
                        value={reviewForm.text}
                        onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg text-white text-sm placeholder-gray-600 outline-none resize-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                    </div>

                    <button type="submit" className="btn-green w-full py-3 rounded-xl text-sm">
                      Опубликовать отзыв
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Reviews grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="border-neon-purple rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "var(--dark-card)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: "rgba(168,85,247,0.12)" }}>{r.avatar}</div>
                  <div>
                    <div className="font-bold text-white">{r.name}</div>
                    <div className="text-gray-500 text-xs">{r.server}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} style={{ color: idx < r.rating ? "#f59e0b" : "#374151" }}>★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section id="contacts" className="py-24 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl mb-3"><span className="grad-purple">КОНТАКТЫ</span></h2>
            <p className="text-gray-400">Ответим в течение 15 минут</p>
          </div>
          <div className="border-neon-green rounded-2xl p-8" style={{ background: "var(--dark-card)" }}>
            {sent ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">🎮</div>
                <div className="font-orbitron font-bold text-2xl neon-green mb-2">Отправлено!</div>
                <p className="text-gray-400">Свяжемся с тобой в течение 15 минут</p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                {[
                  { key: "name", label: "Имя", placeholder: "Твоё имя или ник", type: "text" },
                  { key: "email", label: "Email", placeholder: "email@example.com", type: "email" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
                    <input type={type} required placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--neon-green)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Сообщение</label>
                  <textarea required rows={4} placeholder="Расскажи о своём проекте..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all resize-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--neon-green)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
                </div>
                <button type="submit" className="btn-green w-full py-4 rounded-xl text-base">🚀 Отправить заявку</button>
              </form>
            )}
            <div className="mt-6 pt-5 flex flex-col sm:flex-row gap-3 justify-center text-sm text-gray-500"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="flex items-center gap-2"><Icon name="Mail" size={14} /> support@crafthost.ru</span>
              <span className="flex items-center gap-2">✈️ @crafthost_support</span>
              <span className="flex items-center gap-2"><Icon name="Clock" size={14} /> Ответ за 15 мин</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 text-center text-gray-600 text-sm" style={{ borderTop: "1px solid rgba(0,255,106,0.08)" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>⛏️</span>
          <span className="font-orbitron font-black neon-green">CRAFT</span>
          <span className="font-orbitron font-black text-white">HOST</span>
        </div>
        <p>© 2026 CraftHost · Лучший хостинг для Minecraft серверов</p>
      </footer>
    </div>
  );
}
