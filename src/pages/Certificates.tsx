import { Link, useParams } from 'react-router-dom';
import { Award, CalendarDays, Fingerprint, Download, Share2, GraduationCap } from 'lucide-react';
import { certificates } from '../data/user';
import { courses } from '../data/courses';
import { useApp } from '../store/AppStore';
import { TopBar, EmptyState } from '../components/ui';

export default function Certificates() {
  const { courseId } = useParams();
  const { courseProgress, enrolled } = useApp();
  const shown = courseId ? certificates.filter((c) => c.courseId === courseId) : certificates;
  const active = courseId ?? shown[0]?.courseId;
  const cert = certificates.find((c) => c.courseId === active);
  const course = courses.find((c) => c.id === active);

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      <TopBar title="Meine Zertifikate" back={courseId ? `/academy/course/${courseId}` : '/profile'} />

      {certificates.length === 0 ? (
        <EmptyState
          icon={<Award className="h-7 w-7" aria-hidden />}
          title="Noch keine Zertifikate"
          text="Schließe einen Academy-Kurs ab, um dein erstes GLAMLOOX-Zertifikat zu erhalten."
          action={
            <Link
              to="/academy"
              className="tap inline-block rounded-full bg-deep-900 px-6 py-3 text-[14px] font-semibold text-white shadow-card"
            >
              Zur Academy
            </Link>
          }
        />
      ) : (
        <div className="px-4 pt-4">
          {/* Tabs wenn mehrere */}
          {certificates.length > 1 && (
            <div className="mb-3 flex gap-2">
              {certificates.map((c) => (
                <Link
                  key={c.id}
                  to={`/profile/certificates/${c.courseId}`}
                  className={`tap rounded-full px-3.5 py-1.5 text-[12.5px] font-bold ${
                    c.courseId === active
                      ? 'bg-deep-900 text-white'
                      : 'border border-mist-200 bg-white text-slate-500'
                  }`}
                >
                  {courses.find((x) => x.id === c.courseId)?.shortTitle}
                </Link>
              ))}
            </div>
          )}

          {/* Zertifikat */}
          {cert && course && (
            <>
              <div className="anim-pop relative overflow-hidden rounded-3xl border-[6px] border-white bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800 p-6 shadow-float">
                {/* Deko-Ecken */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-[10px] border-gold-400/25" aria-hidden />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full border-[12px] border-royal-500/20" aria-hidden />

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-royal-300">
                    <GraduationCap className="h-4 w-4" aria-hidden /> GLAMLOOX Academy
                  </span>
                  <Award className="h-7 w-7 text-gold-400" aria-hidden />
                </div>
                <p className="mt-6 text-[10.5px] font-semibold uppercase tracking-[0.25em] text-white/50">
                  Zertifikat
                </p>
                <h2 className="mt-1.5 text-[19px] font-extrabold leading-snug tracking-tight text-white">
                  {course.title}
                </h2>
                <p className="mt-3 text-[12.5px] leading-relaxed text-royal-100/75">
                  wird erfolgreich abgeschlossen von
                </p>
                <p className="mt-1 text-[17px] font-extrabold text-gold-400">Lena Meier</p>
                <p className="mt-1 text-[11.5px] text-royal-100/60">
                  Lash Lounge Lena · Köln
                </p>

                <div className="mt-6 flex items-end justify-between border-t border-white/15 pt-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] text-white/60">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                      ausgestellt am{' '}
                      {new Date(cert.issuedISO + 'T12:00').toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-white/60">
                      <Fingerprint className="h-3.5 w-3.5" aria-hidden />
                      {cert.certId}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold-400/50 text-[8px] font-bold leading-tight text-gold-400">
                      VERI<br />FIERT
                    </div>
                  </div>
                </div>
              </div>

              {/* Aktionen */}
              <div className="mt-4 flex gap-2.5">
                <button className="tap flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-deep-900 text-[12.5px] font-bold text-white shadow-card">
                  <Download className="h-4 w-4" aria-hidden /> Als PDF (Demo)
                </button>
                <button className="tap flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-mist-200 bg-white text-[12.5px] font-bold text-deep-900 shadow-card">
                  <Share2 className="h-4 w-4" aria-hidden /> Teilen
                </button>
              </div>

              <p className="mt-4 rounded-2xl bg-white p-3.5 text-[10.5px] leading-relaxed text-slate-400 shadow-card">
                Demo-Zertifikat des Prototyps – repräsentativ für die geplante
                Zertifikatsansicht der GLAMLOOX App.
              </p>
            </>
          )}
        </div>
      )}

      {/* Fortschritt weiterer Kurse */}
      {enrolled.filter((id) => !certificates.some((c) => c.courseId === id)).length > 0 && (
        <div className="mt-6 px-4">
          <p className="mb-2 text-[13px] font-bold text-deep-900">Noch in Arbeit</p>
          {enrolled
            .filter((id) => !certificates.some((c) => c.courseId === id))
            .map((id) => {
              const c = courses.find((x) => x.id === id)!;
              const p = courseProgress(id);
              return (
                <Link
                  key={id}
                  to={`/academy/course/${id}`}
                  className="tap mb-2 flex items-center justify-between rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-deep-900">{c.shortTitle}</p>
                    <p className="text-[11px] text-slate-400">{p.done}/{p.total} Lektionen · {p.pct}%</p>
                  </div>
                  <span className="shrink-0 text-[12px] font-bold text-royal-600">Weiter →</span>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}
