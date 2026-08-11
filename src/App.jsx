import React, { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Video,
  Calendar,
  Send,
  Sparkles,
  Linkedin,
  Sigma,
  Target,
} from "lucide-react";

/* Same visual identity as the training landing page: black background, green accents */
const COLORS = {
  bg: "#0A0D16",
  surface: "#10141F",
  surface2: "#161B2A",
  surface3: "#1C2233",
  border: "#232A3D",
  borderLight: "#2E3650",
  text: "#F1F3F9",
  muted: "#8B93AC",
  mutedDark: "#5B637E",
  blue: "#15803D",
  violet: "#22C55E",
  cyan: "#4ADE80",
  green: "#3DDC97",
};

const GRADIENT = `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.violet} 100%)`;
const GRADIENT_TEXT = `linear-gradient(135deg, #4ADE80 0%, #86EFAC 100%)`;

const fontDisplay = { fontFamily: "'Sora', sans-serif" };
const fontBody = { fontFamily: "'Inter', sans-serif" };
const fontMono = { fontFamily: "'JetBrains Mono', monospace" };

function CellTag({ children }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-md mb-4"
      style={{
        ...fontMono,
        fontSize: "12px",
        letterSpacing: "0.06em",
        color: COLORS.cyan,
        background: "rgba(74,222,128,0.08)",
        border: "1px solid rgba(74,222,128,0.25)",
      }}
    >
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick, full, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${
        full ? "w-full" : ""
      }`}
      style={{
        ...fontBody,
        background: GRADIENT,
        color: "#0A0D16",
        boxShadow: "0 10px 30px -8px rgba(34,197,94,0.55)",
        border: "none",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </button>
  );
}

const inputStyle = {
  ...fontBody,
  width: "100%",
  background: "#161B2A",
  border: "1px solid #232A3D",
  borderRadius: "10px",
  padding: "10px 14px",
  color: "#F1F3F9",
  fontSize: "14px",
  outline: "none",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span style={{ color: "#8B93AC", ...fontBody }} className="text-xs font-medium mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function App() {
  const [photoError, setPhotoError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [missingFields, setMissingFields] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", ville: "", telephone: "", email: "", secteur: "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSfsC9z2shOgE6jGL-oWy-RIHVxSC3gpjouaHWNJ4Rp6Pf_Xuw/formResponse";

  const GOOGLE_FORM_ENTRIES = {
    prenom: "entry.1194009365",
    nom: "entry.460558579",
    ville: "entry.1698816380",
    telephone: "entry.395004359",
    secteur: "entry.1408560006",
    email: "entry.561935382",
  };

  const submitToGoogleForms = (values) => {
    return new Promise((resolve) => {
      const IFRAME_ID = "hidden-google-form-target";
      let iframe = document.getElementById(IFRAME_ID);
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = IFRAME_ID;
        iframe.name = IFRAME_ID;
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      }

      const formEl = document.createElement("form");
      formEl.action = GOOGLE_FORM_ACTION_URL;
      formEl.method = "POST";
      formEl.target = IFRAME_ID;

      Object.entries(GOOGLE_FORM_ENTRIES).forEach(([field, entryId]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = entryId;
        input.value = values[field] || "";
        formEl.appendChild(input);
      });

      document.body.appendChild(formEl);
      formEl.submit();

      setTimeout(() => {
        if (formEl.parentNode) document.body.removeChild(formEl);
        resolve();
      }, 800);
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!form.nom || !form.prenom ||
