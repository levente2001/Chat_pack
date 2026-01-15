import React, { useEffect, useRef, useState } from "react";

function loadGlsWidgetScript() {
  const ID = "gls-dpm-script";
  if (document.getElementById(ID)) return;

  const s = document.createElement("script");
  s.id = ID;
  s.type = "module";
  s.src = "https://map.gls-hungary.com/widget/gls-dpm.js";
  document.body.appendChild(s);
}

export default function GlsParcelShopPicker({ onSelect, selected }) {
  const elRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadGlsWidgetScript();

    // Várjuk meg amíg a custom element regisztrálódik
    const t = setInterval(() => {
      if (customElements.get("gls-dpm")) {
        setReady(true);
        clearInterval(t);
      }
    }, 100);

    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const handler = (e) => {
      const dp = e.detail; // GLS widget detail objektum
      const address = dp?.contact
        ? `${dp.contact.postalCode} ${dp.contact.city}, ${dp.contact.address}`
        : "";

      onSelect?.({
        id: dp?.id || "",
        name: dp?.name || "",
        address,
        raw: dp,
      });
    };

    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, [onSelect]);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="font-medium text-slate-800">GLS CsomagPont kiválasztása</div>
        <div className="text-xs text-slate-500">
          Kattints egy pontra a térképen vagy válaszd a listából – kiválasztáskor automatikusan kitöltjük.
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        {/* A widgetnek kell fix magasság */}
        <div style={{ height: 520 }}>
          {ready ? (
            <gls-dpm
              ref={elRef}
              country="hu"
              language="hu"
              id="gls-map"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              GLS térkép betöltése…
            </div>
          )}
        </div>
      </div>

      {selected?.id ? (
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-sm font-semibold text-slate-800">Kiválasztott csomagpont</div>
          <div className="text-sm text-slate-700">{selected.name}</div>
          <div className="text-xs text-slate-500">{selected.address}</div>
          <div className="text-xs text-slate-500">ID: {selected.id}</div>
        </div>
      ) : (
        <div className="text-sm text-rose-600">Még nincs csomagpont kiválasztva.</div>
      )}
    </div>
  );
}
