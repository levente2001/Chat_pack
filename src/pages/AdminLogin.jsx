import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
      nav("/admin");
    } catch (e2) {
      setErr("Hibás email vagy jelszó.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Admin belépés</h1>

        <label className="text-sm font-medium text-slate-600">Email</label>
        <input className="mt-1 w-full border rounded-xl p-3" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="text-sm font-medium text-slate-600 mt-4 block">Jelszó</label>
        <input className="mt-1 w-full border rounded-xl p-3" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />

        {err && <div className="text-sm text-red-600 mt-3">{err}</div>}

        <button disabled={loading} className="mt-5 w-full rounded-xl bg-slate-900 text-white py-3 font-semibold cursor-pointer">
          {loading ? "Beléptetés..." : "Belépés"}
        </button>
      </form>
    </div>
  );
}
