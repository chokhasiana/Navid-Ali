import React from 'react';
import { X, ShieldCheck, Scale } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'impressum' | 'datenschutz';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={type === 'impressum' ? 'Impressum' : 'Datenschutzerklärung'}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto text-stone-900"
    >
      <div className="w-full max-w-2xl bg-[#faf9f6] border border-[#e5e3dc] shadow-2xl rounded-sm p-6 sm:p-10 my-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e0] mb-6">
          <div className="flex items-center gap-2">
            {type === 'impressum' ? (
              <Scale className="w-4 h-4 text-stone-700" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-stone-700" />
            )}
            <h2 className="font-serif text-2xl font-light text-stone-900">
              {type === 'impressum' ? 'Impressum (Rechtliche Angaben)' : 'Datenschutzerklärung (EU-DSGVO)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="p-1 text-stone-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'impressum' ? (
          <div className="space-y-6 text-xs text-stone-700 leading-relaxed font-light">
            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                Angaben gemäß § 5 TMG
              </h3>
              <p>Studio Navid Ali Bhatti</p>
              <p>Freischaffender Künstler &amp; Fotograf</p>
              <p>Köpenicker Str. 124</p>
              <p>10179 Berlin, Deutschland</p>
            </div>

            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                Kontakt
              </h3>
              <p>E-Mail: studio@navidalibhatti.art</p>
              <p>Telefon: +49 (0) 30 8920 4410</p>
              <p>Internet: www.navidalibhatti.art</p>
            </div>

            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                Umsatzsteuer-Identifikationsnummer
              </h3>
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
              <p className="font-mono text-stone-900 font-medium">DE 319 824 091</p>
            </div>

            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h3>
              <p>Navid Ali Bhatti</p>
              <p>Köpenicker Str. 124, 10179 Berlin</p>
            </div>

            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                Streitschlichtung
              </h3>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr.
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                Urheberrecht
              </h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten (Fotografien, digitale Kunstwerke, Texte) unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung bedürfen der schriftlichen Zustimmung des Urhebers Navid Ali Bhatti.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-xs text-stone-700 leading-relaxed font-light">
            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                1. Datenschutz auf einen Blick
              </h3>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein zentrales Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.
              </p>
            </div>

            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                2. Verantwortliche Stelle
              </h3>
              <p>Verantwortlicher für die Datenverarbeitung auf dieser Website:</p>
              <p className="text-stone-900 font-medium mt-1">Navid Ali Bhatti Studio</p>
              <p>Köpenicker Str. 124, 10179 Berlin</p>
              <p>E-Mail: privacy@navidalibhatti.art</p>
            </div>

            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                3. Datenerfassung bei Kontaktanfragen und Bestellreservierungen
              </h3>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen oder ein Kunstwerk reservieren, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert (Art. 6 Abs. 1 lit. b DSGVO). Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </div>

            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                4. Keine Cookies oder Werbetracker von Drittanbietern
              </h3>
              <p>
                Diese Website verzichtet vollständig auf zustimmungspflichtige Marketing-Cookies, Werbe-Pixel oder Profiling-Tracker. Es werden lediglich technisch notwendige Session-Daten zur Funktionsweise des Warenkorbs lokal in Ihrem Browser gespeichert.
              </p>
            </div>

            <div>
              <h3 className="font-mono uppercase tracking-wider text-stone-900 text-[11px] mb-1 font-semibold">
                5. Ihre Rechte als betroffene Person
              </h3>
              <p>
                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-[#e7e5e0] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs uppercase tracking-wider bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors rounded-sm cursor-pointer shadow-sm"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
