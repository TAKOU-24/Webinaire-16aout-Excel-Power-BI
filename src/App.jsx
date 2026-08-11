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
} from "lucide-react";

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

  const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf2bTQKQpACfrbJtdeTXP_X-mNFDFGDpGMaV_VjizH6mPV_0Q/formResponse";

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
    if (!form.nom || !form.prenom || !form.email || !form.ville || !form.telephone || !form.secteur) {
      setMissingFields(true);
      return;
    }
    setMissingFields(false);
    setSubmitting(true);
    setSubmitError(false);
    try {
      await submitToGoogleForms(form);
      const redirectParams = new URLSearchParams({ prenom: form.prenom, email: form.email });
      window.location.href = `/merci?${redirectParams.toString()}`;
    } catch (err) {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const acquis = [
    "Consolider plusieurs dossiers dans un seul modèle propre et fiable",
    "Analyser l'évolution d'un indicateur clé dans le temps (CA/charges, ou effectifs/turnover)",
    "Construire un classement qui guide l'action (meilleurs commerciaux, ou services à fort turnover à traiter en priorité)",
    "Automatiser une analyse comparative N vs N-1 et budget vs réalisé — sur le CA/charges ou sur la masse salariale/effectifs",
    "Repartir avec une méthode réutilisable sur vos propres fichiers, finance comme RH",
  ];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", ...fontBody }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: rgba(34,197,94,0.35); }
        input::placeholder { color: #5B637E; }
        html { scroll-behavior: smooth; }
      `}</style>

      <section className="max-w-3xl mx-auto px-6 pt-16 md:pt-24 pb-10 text-center">
        <CellTag>ÉVÉNEMENT GRATUIT — EN DIRECT</CellTag>
        <h1 style={{ ...fontDisplay, color: COLORS.text }} className="text-4xl md:text-5xl font-bold leading-[1.15] mb-6">
          Résolvons ensemble un{" "}
          <span style={{ background: GRADIENT_TEXT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            vrai cas Excel &amp; Power BI
          </span>{" "}
          en 45 minutes
        </h1>
        <p style={{ color: COLORS.muted }} className="text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Un webinaire gratuit et concret : à partir de plusieurs fichiers rangés dans divers dossiers,
          on consolide, on analyse une évolution clé (chiffre d'affaires, charges, ou effectifs/turnover)
          et on en sort un vrai dashboard.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="flex items-center gap-2 text-sm px-4 py-2 rounded-full" style={{ color: COLORS.text, background: COLORS.surface2, border: `1px solid ${COLORS.border}` }}>
            <Calendar size={15} color={COLORS.cyan} /> 16 août 2026
          </span>
          <span className="flex items-center gap-2 text-sm px-4 py-2 rounded-full" style={{ color: COLORS.text, background: COLORS.surface2, border: `1px solid ${COLORS.border}` }}>
            <Clock size={15} color={COLORS.cyan} /> 20h00 — 45 min
          </span>
          <span className="flex items-center gap-2 text-sm px-4 py-2 rounded-full" style={{ color: COLORS.text, background: COLORS.surface2, border: `1px solid ${COLORS.border}` }}>
            <Video size={15} color={COLORS.cyan} /> En ligne, via Google Meet
          </span>
        </div>

        <PrimaryButton onClick={() => document.getElementById("inscription")?.scrollIntoView({ behavior: "smooth" })}>
          Réserver ma place gratuite <ArrowRight size={16} />
        </PrimaryButton>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <Sparkles size={18} color={COLORS.cyan} style={{ flexShrink: 0 }} />
          <p style={{ color: COLORS.muted, margin: 0, fontSize: "14px" }}>
            100% gratuit, places limitées pour garder un vrai échange en direct.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <CellTag>LE CAS DU JOUR</CellTag>
        <h2 style={{ ...fontDisplay, color: COLORS.text }} className="text-2xl md:text-3xl font-semibold mb-8">
          Un cas réel, résolu du début à la fin
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          {[
            { step: "01", title: "Consolidation multi-années", desc: "On part de plusieurs dossiers et on les assemble dans un seul modèle propre et exploitable." },
            { step: "02", title: "Évolution d'un indicateur clé", desc: "On construit le dashboard qui suit l'évolution du CA et des charges, ou des effectifs et du turnover." },
            { step: "03", title: "Un classement qui devient un outil de décision", desc: "En quelques clics : le top 10 de vos meilleurs commerciaux pour prioriser vos actions commerciales, ou les services où le turnover s'envole pour agir avant que ça coûte cher en recrutement." },
            { step: "04", title: "Analyses comparatives automatisées", desc: "On automatise le N vs N-1 et le budget vs réalisé, avec les écarts calculés en direct, sur le CA et les charges, ou sur la masse salariale et les effectifs." },
          ].map((s) => (
            <div key={s.step} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "20px", display: "flex", gap: "16px" }}>
              <span style={{ ...fontMono, color: COLORS.cyan, fontSize: "13px", flexShrink: 0, marginTop: "4px" }}>{s.step}</span>
              <div>
                <div style={{ ...fontDisplay, color: COLORS.text, fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>{s.title}</div>
                <p style={{ color: COLORS.muted, margin: 0, fontSize: "14px", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <CellTag>AU PROGRAMME</CellTag>
        <h2 style={{ ...fontDisplay, color: COLORS.text }} className="text-2xl md:text-3xl font-semibold mb-8">
          Ce que vous saurez faire en sortant du live
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          {acquis.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: "12px" }}>
              <CheckCircle2 size={18} color={COLORS.green} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span style={{ color: COLORS.text, fontSize: "14px", lineHeight: 1.6 }}>{a}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div style={{ background: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.surface2} 100%)`, border: `1px solid ${COLORS.borderLight}`, borderRadius: "24px", padding: "32px", display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {photoError ? (
            <div style={{ ...fontDisplay, width: "64px", height: "64px", borderRadius: "16px", background: GRADIENT, color: "#0A0D16", fontSize: "18px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              DT
            </div>
          ) : (
            <img src="/formateur.jpg" alt="Dimitri Takou" onError={() => setPhotoError(true)} style={{ width: "64px", height: "64px", borderRadius: "16px", objectFit: "cover", flexShrink: 0, border: `1px solid ${COLORS.borderLight}` }} />
          )}
          <div>
            <div style={{ ...fontDisplay, color: COLORS.text, fontWeight: 600, marginBottom: "8px" }}>Dimitri Takou</div>
            <p style={{ color: COLORS.muted, fontSize: "14px", lineHeight: 1.6, marginBottom: "12px", margin: 0 }}>
              Responsable Administratif &amp; Financier avec 7 ans d'expérience professionnelle en France chez AXA, Mazars et Valophis. Je conçois des tableaux de bord décisionnels sous Excel BI / Power BI pour accompagner la prise de décision.
            </p>
            <a href="https://www.linkedin.com/in/dimitri-takou-091111197" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "6px 12px", borderRadius: "20px", color: COLORS.cyan, background: "rgba(74,222,128,0.08)", border: `1px solid rgba(74,222,128,0.25)`, textDecoration: "none" }}>
              <Linkedin size={13} /> Voir mon profil LinkedIn
            </a>
          </div>
        </div>
      </section>

      <section id="inscription" className="max-w-2xl mx-auto px-6 py-12">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <CellTag>RÉSERVATION</CellTag>
          <h2 style={{ ...fontDisplay, color: COLORS.text }} className="text-2xl md:text-3xl font-semibold">
            Réservez votre place
          </h2>
          <p style={{ color: COLORS.muted, fontSize: "14px", marginTop: "12px", margin: 0 }}>
            Le lien de connexion Google Meet vous sera envoyé par e-mail avant l'événement.
          </p>
          <p style={{ ...fontMono, color: COLORS.green, fontSize: "12px", marginTop: "8px", margin: 0 }}>
            ▶ Replay disponible si vous ne pouvez pas être présent en direct
          </p>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "32px", display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <Field label="Prénom *">
              <input value={form.prenom} onChange={update("prenom")} placeholder="Jean" style={inputStyle} />
            </Field>
            <Field label="Nom *">
              <input value={form.nom} onChange={update("nom")} placeholder="Dupont" style={inputStyle} />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <Field label="Ville *">
              <input value={form.ville} onChange={update("ville")} placeholder="Paris" style={inputStyle} />
            </Field>
            <Field label="Téléphone *">
              <input value={form.telephone} onChange={update("telephone")} placeholder="06 12 34 56 78" style={inputStyle} />
            </Field>
          </div>
          <Field label="Adresse e-mail *">
            <input value={form.email} onChange={update("email")} placeholder="jean.dupont@email.com" type="email" style={inputStyle} />
          </Field>
          <Field label="Secteur d'activité / Fonction *">
            <select value={form.secteur} onChange={update("secteur")} style={inputStyle}>
              <option value="">Sélectionner…</option>
              <option value="Comptabilité">Comptabilité</option>
              <option value="Contrôle de gestion / Finance">Contrôle de gestion / Finance</option>
              <option value="Ressources Humaines">Ressources Humaines</option>
              <option value="Logistique">Logistique</option>
              <option value="Audit">Audit</option>
              <option value="Étudiant / Alternant">Étudiant / Alternant</option>
              <option value="En recherche d'emploi">En recherche d'emploi</option>
              <option value="Autre">Autre</option>
            </select>
          </Field>

          <PrimaryButton onClick={handleSubmit} full disabled={submitting}>
            {submitting ? "Envoi en cours…" : <>Réserver ma place gratuite <Send size={16} /></>}
          </PrimaryButton>
          {missingFields && (
            <p style={{ color: "#F87171", fontSize: "12px", textAlign: "center", margin: 0 }}>
              Merci de remplir tous les champs avant de valider votre inscription.
            </p>
          )}
          {submitError && (
            <p style={{ color: "#F87171", fontSize: "12px", textAlign: "center", margin: 0 }}>
              Une erreur est survenue, réessayez ou écrivez-moi directement par e-mail.
            </p>
          )}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <CellTag>QUESTIONS FRÉQUENTES</CellTag>
        <h2 style={{ ...fontDisplay, color: COLORS.text }} className="text-2xl md:text-3xl font-semibold mb-8">
          Avant de vous inscrire
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          {[
            { q: "Faut-il un niveau particulier sur Excel ?", a: "Non, le webinaire est conçu pour être suivi par des profils débutants à intermédiaires en contrôle de gestion, comptabilité, RH, logistique ou finance." },
            { q: "Dois-je installer un logiciel ?", a: "Non, la session se déroule via un lien Google Meet classique — cliquez et vous êtes connecté, sans compte Google ni installation." },
            { q: "Que se passe-t-il si je ne suis pas disponible le 16 août à 20h ?", a: "Inscrivez-vous quand même : le replay vous sera envoyé automatiquement par e-mail après l'événement." },
            { q: "Mes données seront-elles utilisées ailleurs ?", a: "Non, vous recevrez uniquement les e-mails liés à ce webinaire (confirmation, rappel, replay, offre de suite)." },
          ].map((f, i) => (
            <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "20px" }}>
              <div style={{ ...fontDisplay, color: COLORS.text, fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>{f.q}</div>
              <p style={{ color: COLORS.muted, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: "40px 20px 40px", textAlign: "center" }} className="max-w-3xl mx-auto px-6">
        <span style={{ color: COLORS.mutedDark, fontSize: "14px" }}>© 2026 — Webinaire gratuit Excel &amp; Power BI</span>
      </footer>
    </div>
  );
}
