import { Link } from 'react-router-dom';
import { GraduationCap, PlayCircle, Award, ArrowRight, Clock } from 'lucide-react';
import { courses, allLessonIds } from '../data/courses';
import { useApp } from '../store/AppStore';
import { TopBar, SmartImage, ProgressBar, EmptyState } from '../components/ui';

export default function MyCourses() {
  const { enrolled, courseProgress, certificates, progress } = useApp();
  const myCourses = courses.filter((c) => enrolled.includes(c.id));

  return (
    <div className="anim-fade-in min-h-full bg-mist-50 pb-6">
      <TopBar title="Meine Kurse" back="/academy" />

      {myCourses.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-7 w-7" aria-hidden />}
          title="Noch keine Kurse"
          text="Schreib dich in einen Kurs der GLAMLOOX Academy ein – dein Fortschritt erscheint dann hier."
          action={
            <Link
              to="/academy"
              className="tap inline-block rounded-full bg-deep-900 px-6 py-3 text-[14px] font-semibold text-white shadow-card"
            >
              Academy entdecken
            </Link>
          }
        />
      ) : (
        <div className="space-y-3 px-4 pt-3">
          {myCourses.map((c) => {
            const prog = courseProgress(c.id);
            const completed = prog.pct === 100;
            const cert = certificates.find((x) => x.courseId === c.id);
            const nextLessonId = allLessonIds(c).find((id) => !progress[id]);
            return (
              <div key={c.id} className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
                <div className="flex gap-3 p-3">
                  <Link to={`/academy/course/${c.id}`} className="tap relative shrink-0">
                    <SmartImage src={c.image} alt={c.title} className="h-[72px] w-[108px] rounded-xl" />
                    <span className="absolute inset-0 m-auto flex h-8 w-8 items-center justify-center rounded-full bg-deep-950/60 backdrop-blur">
                      <PlayCircle className="h-5 w-5 text-white" aria-hidden />
                    </span>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/academy/course/${c.id}`} className="tap">
                      <p className="line-clamp-1 text-[14px] font-bold text-deep-900">{c.title}</p>
                    </Link>
                    <p className="mt-0.5 text-[11.5px] text-slate-400">
                      {completed ? 'Abgeschlossen 🎉' : `${prog.done} von ${prog.total} Lektionen`}
                    </p>
                    <ProgressBar pct={prog.pct} className="mt-2" />
                    {nextLessonId && !completed && (
                      <Link
                        to={`/academy/course/${c.id}/lesson/${nextLessonId}`}
                        className="tap mt-2 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-deep-900 text-[12px] font-bold text-white shadow-card"
                      >
                        Weiterlernen <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    )}
                    {completed && cert && (
                      <Link
                        to="/profile/certificates"
                        className="tap mt-2 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-[12px] font-bold text-white shadow-card"
                      >
                        <Award className="h-3.5 w-3.5" aria-hidden /> Zertifikat ansehen
                      </Link>
                    )}
                  </div>
                </div>
                {completed && (
                  <div className="flex items-center justify-between border-t border-mist-200 bg-gradient-to-r from-amber-50 to-white px-4 py-2.5">
                    <span className="flex items-center gap-2 text-[12px] font-bold text-deep-900">
                      <Award className="h-4 w-4 text-gold-500" aria-hidden />
                      {cert ? 'Zertifikat verfügbar' : 'Zertifikat wird erstellt'}
                    </span>
                    {cert && (
                      <Link
                        to="/profile/certificates"
                        className="tap flex items-center gap-1 text-[12px] font-bold text-royal-700"
                      >
                        Ansehen <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Lernzeit-Statistik */}
          <div className="rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
            <p className="flex items-center gap-2 text-[13px] font-bold text-deep-900">
              <Clock className="h-4 w-4 text-royal-600" aria-hidden /> Deine Lernzeit
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                ['Lektionen', myCourses.reduce((n, c) => n + courseProgress(c.id).done, 0).toString()],
                ['Kurse', myCourses.length.toString()],
                ['Zertifikate', certificates.length.toString()],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-mist-50 py-3">
                  <p className="text-[22px] font-extrabold text-deep-950">{value}</p>
                  <p className="text-[11px] font-semibold text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Entdecke mehr */}
          <Link
            to="/academy"
            className="tap flex items-center justify-between rounded-2xl border border-dashed border-royal-300 bg-royal-50/50 p-4"
          >
            <span className="text-[13.5px] font-bold text-royal-700">
              + Neuen Kurs entdecken
            </span>
            <ArrowRight className="h-4 w-4 text-royal-600" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
