import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X, SendHorizontal } from 'lucide-react';
import { demoUser } from '../data/user';
import { useApp } from '../store/AppStore';
import { TopBar, Avatar, SmartImage } from '../components/ui';

// Vorher-Nachher- & Produktmotive aus dem Original-CDN (für die Demo-Auswahl)
const imageChoices = [
  'https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Vorher_Nachher_1.jpg?width=900',
  'https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Vorher_Nachher_6.jpg?width=900',
  'https://cdn.shopify.com/s/files/1/0639/5812/2716/files/mascara_peptide.jpg?width=900',
  'https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Korean_Module_1.jpg?width=900',
  'https://cdn.shopify.com/s/files/1/0639/5812/2716/files/schweit_demo_masterclass.jpg?width=900',
  'https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_undereye_Pads_pink.png?width=900',
];

const types = [
  { id: 'ergebnis', label: 'Ergebnis', hint: 'Vorher · Nachher' },
  { id: 'frage', label: 'Frage', hint: 'Community fragen' },
  { id: 'tipp', label: 'Tipp', hint: 'Wissen teilen' },
] as const;

export default function CreatePost() {
  const navigate = useNavigate();
  const { addUserPost, updateUserPost, allPosts, toast } = useApp();
  const [params] = useSearchParams();
  const editId = params.get('edit');
  const editPost = editId ? allPosts.find((x) => x.id === editId) : undefined;
  const [type, setType] = useState<(typeof types)[number]['id']>(editPost?.type ?? 'ergebnis');
  const [title, setTitle] = useState(editPost?.title ?? '');
  const [text, setText] = useState(editPost?.text ?? '');
  const [image, setImage] = useState<string | null>(editPost?.images[0] ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const valid = text.trim().length >= 5;

  const publish = () => {
    if (!valid) return;
    if (editPost) {
      updateUserPost(editPost.id, { title: title.trim() || undefined, text: text.trim() });
      navigate('/community');
      return;
    }
    addUserPost({
      id: 'up' + Date.now(),
      authorId: 'm-lena',
      type,
      title: title.trim() || undefined,
      text: text.trim(),
      images: image ? [image] : [],
      ago: 'gerade eben',
      likes: 0,
      comments: [],
    });
    navigate('/community');
  };

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-28">
      <TopBar
        title={editPost ? "Beitrag bearbeiten" : "Neuer Beitrag"}
        back="/community"
        right={
          <button
            onClick={valid ? publish : () => toast('Schreib erst ein paar Wörter 🙂', 'info')}
            aria-label="Veröffentlichen"
            className={`tap flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-bold ${
              valid ? 'bg-royal-600 text-white shadow-card' : 'bg-mist-100 text-slate-400'
            }`}
          >
            <SendHorizontal className="h-4 w-4" aria-hidden /> Posten
          </button>
        }
      />

      <div className="px-4 pt-4">
        {/* Autor */}
        <div className="flex items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
          <Avatar name={demoUser.name} gradient={demoUser.gradient} size={42} />
          <div>
            <p className="text-[14px] font-bold text-deep-900">
              {demoUser.name} <span className="font-medium text-slate-400">(du)</span>
            </p>
            <p className="text-[11.5px] text-slate-400">{demoUser.studio} · {demoUser.city}</p>
          </div>
        </div>

        {/* Typ */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`tap rounded-2xl border p-3 text-center ${
                type === t.id
                  ? 'border-royal-600 bg-royal-50 shadow-card'
                  : 'border-mist-200 bg-white'
              }`}
            >
              <p className={`text-[13px] font-bold ${type === t.id ? 'text-royal-700' : 'text-deep-900'}`}>
                {t.label}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">{t.hint}</p>
            </button>
          ))}
        </div>

        {/* Titel */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          placeholder={type === 'frage' ? 'Deine Frage in einem Satz…' : 'Titel (optional)'}
          aria-label="Titel"
          className="mt-4 h-12 w-full rounded-2xl border border-mist-200 bg-white px-4 text-[14.5px] font-semibold text-deep-950 shadow-card outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-royal-400"
        />

        {/* Text */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={600}
          placeholder={
            type === 'ergebnis'
              ? 'Erzähl von der Behandlung: Technik, Einwirkzeiten, Produkte…'
              : type === 'frage'
                ? 'Was möchtest du wissen? Je konkreter, desto besser können andere helfen.'
                : 'Teile deinen besten Tipp mit der Community…'
          }
          aria-label="Beitragstext"
          className="mt-3 w-full resize-none rounded-2xl border border-mist-200 bg-white p-4 text-[14px] leading-relaxed text-deep-950 shadow-card outline-none placeholder:text-slate-400 focus:border-royal-400"
        />
        <p className="mt-1 text-right text-[11px] text-slate-400">Titel {title.length}/80 · Text {text.length}/600</p>

        {/* Bild */}
        <div className="mt-2 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-deep-900">Bild (optional)</p>
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="tap flex items-center gap-1.5 rounded-full bg-royal-50 px-3 py-1.5 text-[12px] font-bold text-royal-700"
            >
              <ImagePlus className="h-4 w-4" aria-hidden />
              {image ? 'Ändern' : 'Auswählen'}
            </button>
          </div>
          {image && (
            <div className="relative mt-3">
              <SmartImage src={image} alt="Gewähltes Bild" className="aspect-[4/3] w-full rounded-xl" />
              <button
                onClick={() => setImage(null)}
                aria-label="Bild entfernen"
                className="tap absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-deep-950/70 text-white backdrop-blur"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
          {pickerOpen && (
            <div className="anim-fade-up mt-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Demo-Motive (Originalbilder von glamloox.net)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {imageChoices.map((img) => (
                  <button
                    key={img}
                    onClick={() => {
                      setImage(img);
                      setPickerOpen(false);
                    }}
                    className={`tap overflow-hidden rounded-xl border-2 ${
                      image === img ? 'border-royal-600' : 'border-transparent'
                    }`}
                  >
                    <SmartImage src={img} alt="" className="aspect-square w-full" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Posten */}
      <div className="sticky bottom-0 z-30 border-t border-mist-200 bg-white/95 px-4 pb-3 pt-3 backdrop-blur-xl">
        <button
          onClick={valid ? publish : () => toast('Schreib erst ein paar Wörter 🙂', 'info')}
          className={`tap flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-[15.5px] font-bold shadow-float ${
            valid
              ? 'bg-gradient-to-r from-royal-600 to-royal-700 text-white'
              : 'bg-mist-100 text-slate-400'
          }`}
        >
          <SendHorizontal className="h-5 w-5" aria-hidden />
          ${editPost ? 'Änderungen speichern' : 'In der Community veröffentlichen'}
        </button>
      </div>
    </div>
  );
}
