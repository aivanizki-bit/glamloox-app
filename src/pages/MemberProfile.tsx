import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, CalendarDays, UserPlus, UserCheck } from 'lucide-react';
import { memberById, posts as seedPosts } from '../data/community';
import { demoUser } from '../data/user';
import { useApp } from '../store/AppStore';
import { TopBar, Avatar, SmartImage } from '../components/ui';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import { PostCard } from './Community';

export default function MemberProfile() {
  const { memberId } = useParams();
  const [gridView, setGridView] = useState(false);
  const member = memberById(memberId ?? '');
  const isMe = member.id === 'm-lena';
  const { allPosts, follows, toggleFollow, toast } = useApp();
  const memberPosts = (isMe ? allPosts : seedPosts).filter((p) => p.authorId === member.id);
  const following = follows.includes(member.id);

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      <TopBar title={isMe ? `${demoUser.name} (du)` : member.name} back="/community" />

      {/* Kopf */}
      <div className="bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800 px-4 pb-14 pt-2">
        <div className="flex items-center gap-4">
          <Avatar name={isMe ? demoUser.name : member.name} gradient={isMe ? demoUser.gradient : member.gradient} size={72} ring />
          <div className="min-w-0">
            <h2 className="truncate text-[20px] font-extrabold tracking-tight text-white">
              {isMe ? demoUser.name : member.name}
            </h2>
            <p className="truncate text-[12.5px] text-royal-100/80">
              {isMe ? demoUser.role : member.role}
              {member.academy && <span className="ml-1.5 rounded-full bg-gold-400/25 px-1.5 py-0.5 text-[9.5px] font-bold text-gold-400">✦ ACADEMY</span>}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11.5px] text-royal-100/60">
              <MapPin className="h-3 w-3" aria-hidden /> {isMe ? demoUser.city : member.city} ·
              <CalendarDays className="ml-0.5 h-3 w-3" aria-hidden /> seit{' '}
              {isMe ? demoUser.since : member.joined}
            </p>
          </div>
        </div>
      </div>

      {/* Stats-Karte */}
      <div className="-mt-10 px-4">
        <div className="flex items-center justify-around rounded-2xl border border-mist-200 bg-white px-2 py-3.5 shadow-float">
          {[
            ['Follower', (member.followers + (following ? 1 : 0)).toString()],
            ['Beiträge', ((isMe ? memberPosts.length : member.postsCount)).toString()],
            ['erhaltene ❤️', (memberPosts.reduce((n, p) => n + p.likes, 0) || 312).toString()],
          ].map(([label, value]) => (
            <div key={label} className="text-center">
              <p className="text-[17px] font-extrabold text-deep-950">{value}</p>
              <p className="text-[10.5px] font-semibold text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bio & Skills */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
          <p className="text-[13.5px] leading-relaxed text-slate-600">
            {isMe ? demoUser.bio : member.bio}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(isMe ? ['Korean Lash Lift', 'Brow Lifting', 'Booster-Beratung'] : member.skills).map((s) => (
              <span
                key={s}
                className="rounded-full bg-royal-50 px-2.5 py-1 text-[11px] font-bold text-royal-700"
              >
                {s}
              </span>
            ))}
          </div>
          {isMe ? (
            <Link
              to="/profile"
              className="tap mt-4 flex h-10 items-center justify-center rounded-xl bg-deep-900 text-[13px] font-bold text-white shadow-card"
            >
              Zum eigenen Profil wechseln
            </Link>
          ) : (
            <button
              onClick={() => {
                toggleFollow(member.id);
                toast(following ? 'Du folgst nicht mehr: ' + member.name : 'Du folgst jetzt: ' + member.name, 'heart');
              }}
              className={`tap mt-4 flex h-10 items-center justify-center gap-2 rounded-xl text-[13px] font-bold shadow-card ${following ? 'border border-royal-200 bg-royal-50 text-royal-700' : 'bg-royal-600 text-white'}`}
            >
              {following ? <UserCheck className="h-4 w-4" aria-hidden /> : <UserPlus className="h-4 w-4" aria-hidden />}
              {following ? 'Folgt \u2713' : 'Folgen'}
            </button>
          )}
        </div>
      </div>

      {/* R34: Beiträge mit Ansicht-Toggle */}
      <div className="flex items-center justify-between px-4 pb-2 pt-6">
        <h3 className="text-[16px] font-bold tracking-tight text-deep-900">
          Beiträge · {memberPosts.length}
        </h3>
        <button
          onClick={() => setGridView((v) => !v)}
          aria-label={gridView ? 'Listen-Ansicht' : 'Grid-Ansicht'}
          className="tap flex h-8 w-8 items-center justify-center rounded-lg border border-mist-200 bg-white text-deep-900 shadow-card"
        >
          {gridView ? <ListIcon className="h-4 w-4" aria-hidden /> : <LayoutGrid className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      {memberPosts.length === 0 ? (
        <p className="px-8 text-center text-[13px] text-slate-400">
          Noch keine Beiträge – aber das ändert sich sicher bald. 💙
        </p>
      ) : gridView ? (
        <div className="grid grid-cols-3 gap-1.5 px-4">
          {memberPosts.filter((p) => p.images.length > 0).map((p) => (
            <Link key={p.id} to={`/community/post/${p.id}`} className="tap overflow-hidden rounded-xl">
              <SmartImage src={p.images[0]} alt={p.title ?? ''} className="aspect-square w-full" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3.5 px-4">
          {memberPosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
