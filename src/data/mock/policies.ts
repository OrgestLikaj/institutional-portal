import type { Localized } from "@/i18n/config";

/** DEMO POLICY PAGES — placeholder legal text, to be reviewed by the institution's legal unit. */
export const policyPages: Record<"privacy" | "accessibility", Localized<string>> = {
  privacy: {
    sq: `<h2>Përgjegjësi për përpunimin</h2>
<p>Institucioni është kontrolluesi i të dhënave personale të përpunuara nëpërmjet kësaj faqeje, në përputhje me legjislacionin shqiptar për mbrojtjen e të dhënave personale.</p>
<h2>Të dhënat që mbledhim</h2>
<ul><li>Të dhënat që ju dërgoni vullnetarisht nëpërmjet formularit të kontaktit (emri, emaili, subjekti, mesazhi).</li><li>Të dhëna teknike të nevojshme për funksionimin e sigurt të faqes.</li></ul>
<h2>Qëllimi dhe baza ligjore</h2>
<p>Të dhënat përdoren vetëm për trajtimin e kërkesës suaj dhe ruhen për periudhën e përcaktuar nga legjislacioni për arkivat.</p>
<h2>Cookies</h2>
<p>Faqja përdor vetëm një cookie funksionale për të kujtuar gjuhën e zgjedhur. Nuk përdoren cookies për gjurmim ose reklamim.</p>
<h2>Të drejtat tuaja</h2>
<p>Keni të drejtë të kërkoni akses, korrigjim ose fshirje të të dhënave tuaja, si dhe të paraqisni ankesë pranë autoritetit përgjegjës për mbrojtjen e të dhënave.</p>
<p><em>Tekst demonstrues — do të zëvendësohet me politikën zyrtare.</em></p>`,
    en: `<h2>Data controller</h2>
<p>The institution is the controller of personal data processed through this website, in accordance with Albanian personal data protection legislation.</p>
<h2>Data we collect</h2>
<ul><li>Data you voluntarily submit through the contact form (name, email, subject, message).</li><li>Technical data required for the secure operation of the website.</li></ul>
<h2>Purpose and legal basis</h2>
<p>Data is used solely to handle your request and is retained for the period set by archiving legislation.</p>
<h2>Cookies</h2>
<p>The website uses only one functional cookie to remember your chosen language. No tracking or advertising cookies are used.</p>
<h2>Your rights</h2>
<p>You have the right to request access to, correction or erasure of your data, and to lodge a complaint with the competent data protection authority.</p>
<p><em>Demonstration text — to be replaced with the official policy.</em></p>`,
  },
  accessibility: {
    sq: `<h2>Angazhimi ynë</h2>
<p>Institucioni synon që kjo faqe të jetë e aksesueshme për të gjithë, përfshirë personat me aftësi të kufizuara, në përputhje me standardin WCAG 2.2, niveli AA.</p>
<h2>Masat e marra</h2>
<ul><li>Navigim i plotë me tastierë dhe lidhje "Kalo te përmbajtja".</li><li>Kontrast ngjyrash në përputhje me nivelin AA.</li><li>Struktura semantike e titujve dhe etiketa për lexuesit e ekranit.</li><li>Respektim i preferencës për lëvizje të reduktuara.</li><li>Formularë me etiketa, mesazhe gabimi të qarta dhe përmbledhje gabimesh.</li></ul>
<h2>Kufizime të njohura</h2>
<p>Disa dokumente të vjetra PDF mund të mos jenë plotësisht të aksesueshme. Ato do të zëvendësohen gradualisht.</p>
<h2>Na kontaktoni</h2>
<p>Nëse hasni pengesa aksesueshmërie, ju lutemi na shkruani nëpërmjet faqes së kontaktit.</p>`,
    en: `<h2>Our commitment</h2>
<p>The institution aims for this website to be accessible to everyone, including persons with disabilities, in line with WCAG 2.2, level AA.</p>
<h2>Measures taken</h2>
<ul><li>Full keyboard navigation and a "Skip to content" link.</li><li>Colour contrast meeting level AA.</li><li>Semantic heading structure and labels for screen readers.</li><li>Respect for the reduced-motion preference.</li><li>Forms with labels, clear error messages and an error summary.</li></ul>
<h2>Known limitations</h2>
<p>Some older PDF documents may not be fully accessible. They will be replaced progressively.</p>
<h2>Contact us</h2>
<p>If you encounter accessibility barriers, please write to us through the contact page.</p>`,
  },
};
