import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  PlayCircle,
  FileText,
  ListChecks,
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  Users,
  Star,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { courses, totalLessons } from '../data/courses';
import { useApp, eur } from '../store/AppStore';
import { TopBar, SmartImage, ProgressBar } from '../components/ui';

const lessonIcon = { video: PlayCircle, pdf: FileText, quiz: ListChecks };

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId);
  const { progress, enrolled, enrollCourse, courseProgress } = useApp();

  if (!course) {
    return (
      <div>
        <TopBar title="Kurs" back="/academy" />
        <p className="mt-10 text-center text-slate-500">Kurs nicht gefunden.</p>
      </div>
    );
  }

  const prog = courseProgress(course.id);
  const isEnrolled = enrolled.includes(course.id);
  const nextLesson =
    course.modules.flatMap((m) => m.lessons).find((l) => !progress[l.id]) ??
    course.modules[0].lessons[0];

  return (
    <div className="anim-fade-in min-h-full bg-mist-50">
      {/* Hero-Bild */}
      <div className="relative">
        <SmartImage src={course.image} alt={course.title} className="aspect-[16/9] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-950/85 via-deep-950/25 to-deep-950/10" />
        <button
          onClick={() => navigate('/academy')}
          aria-label="Zurück"
          className="tap absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur"
        >
          <ChevronLeft className="h-5 w-5 text-deep-900" aria-hidden />
        </button>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="flex w-fit items-center gap-1 rounded-full bg-royal-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden /> {course.format}
          </span>
          <h1 className="mt-2 text-[21px] font-extrabold leading-tight tracking-tight text-white">
            {course.title}
          </h1>
        </div>
      </div>

      <div className="px-4 pb-6 pt-4">
        {/* Fakten */}
        <div className="flex items-center gap-4 text-[12px] font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-royal-600" aria-hidden /> {course.hours} Stunden
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-royal-600" aria-hidden />
            {course.students.toLocaleString('de-DE')} Lernende
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden /> {course.level}
          </span>
        </div>

        {/* Beschreibung */}
        <p className="mt-3.5 text-[13.5px] leading-relaxed text-slate-600">{course.description}</p>

        {/* Highlights */}
        <div className="mt-4 rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
          <p className="flex items-center gap-2 text-[13px] font-bold text-deep-900">
            <Sparkles className="h-4 w-4 text-royal-600" aria-hidden /> Das lernst du
          </p>
          <ul className="mt-2.5 space-y-2">
            {course.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-[13px] text-slate-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Fortschritt (wenn eingeschrieben) */}
        {isEnrolled && (
          <div className="mt-4 rounded-2xl border border-royal-100 bg-royal-50/60 p-4">
            <div className="flex items-center justify-between text-[13px] font-bold text-deep-900">
              <span>Dein Fortschritt</span>
              <span className="text-royal-700">{prog.pct}%</span>
            </div>
            <ProgressBar pct={prog.pct} className="mt-2" />
            <p className="mt-1.5 text-[11.5px] text-slate-500">
              {prog.done} von {prog.total} Lektionen abgeschlossen
            </p>
            {prog.pct === 100 && (
              <Link
                to="/profile/certificates"
                className="tap mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-[13.5px] font-bold text-white shadow-card"
              >
                🏆 Zertifikat ansehen
              </Link>
            )}
          </div>
        )}

        {/* Module & Lektionen */}
        <h2 className="mt-6 text-[17px] font-bold tracking-tight text-deep-900">
          Kursinhalte <span className="font-medium text-slate-400">· {totalLessons(course)} Lektionen</span>
        </h2>
        <div className="mt-3 space-y-3">
          {course.modules.map((m, mi) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-mist-200 bg-mist-50 px-4 py-2.5">
                <p className="text-[13.5px] font-bold text-deep-900">
                  <span className="mr-2 text-royal-600">Modul {mi + 1}</span>
                  {m.title}
                </p>
                <span className="text-[11px] font-semibold text-slate-400">
                  {m.lessons.filter((l) => progress[l.id]).length}/{m.lessons.length}
                </span>
              </div>
              <div>
                {m.lessons.map((l) => {
                  const done = !!progress[l.id];
                  const locked = !isEnrolled && !(mi === 0 && l === course.modules[0].lessons[0]);
                  const Icon = lessonIcon[l.type];
                  return locked ? (
                    <div
                      key={l.id}
                      className="flex cursor-not-allowed items-center gap-3 px-4 py-3 opacity-50"
                    >
                      <Lock className="h-[18px] w-[18px] shrink-0 text-slate-400" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold text-slate-500">{l.title}</p>
                        <p className="text-[11px] text-slate-400">{l.duration}</p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={l.id}
                      to={`/academy/course/${course.id}/lesson/${l.id}`}
                      className="tap flex items-center gap-3 border-b border-mist-100 px-4 py-3 last:border-0"
                    >
                      {done ? (
                        <CheckCircle2 className="h-[19px] w-[19px] shrink-0 text-royal-600" aria-hidden />
                      ) : (
                        <Circle className="h-[19px] w-[19px] shrink-0 text-mist-200" aria-hidden strokeWidth={2.5} />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-[13.5px] font-semibold ${
                            done ? 'text-slate-400 line-through decoration-slate-300' : 'text-deep-900'
                          }`}
                        >
                          {l.title}
                        </p>
                        <p className="text-[11px] text-slate-400">{l.duration}</p>
                      </div>
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 ${done ? 'text-slate-300' : 'text-royal-500'}`}
                        aria-hidden
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Demo-Hinweis */}
        <p className="mt-5 rounded-2xl bg-white px-4 py-3 text-[10.5px] leading-relaxed text-slate-400 shadow-card">
          Kursname, Preis & Format entsprechen dem realen Angebot von glamloox.net.
          Module, Lektionen & Beschreibungen sind Demo-Inhalte für diesen Prototyp.
        </p>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 z-30 border-t border-mist-200 bg-white/95 px-4 pb-3 pt-3 backdrop-blur-xl">
        {isEnrolled ? (
          <Link
            to={`/academy/course/${course.id}/lesson/${nextLesson.id}`}
            className="tap flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-royal-600 to-royal-700 text-[15.5px] font-bold text-white shadow-float"
          >
            <PlayCircle className="h-5 w-5" aria-hidden />
            {prog.done > 0 ? 'Weiterlernen' : 'Kurs starten'}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        ) : (
          <button
            onClick={() => {
              enrollCourse(course.id);
            }}
            className="tap flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-royal-600 to-royal-700 text-[15.5px] font-bold text-white shadow-float"
          >
            Jetzt einschreiben · {eur(course.price)}
          </button>
        )}
        <p className="mt-1.5 text-center text-[10.5px] text-slate-400">
          Simulierte Einschreibung · keine echte Zahlungsanbindung
        </p>
      </div>
    </div>
  );
}
