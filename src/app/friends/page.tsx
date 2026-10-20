import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCharacter } from "@/lib/mbti/characters";
import Character from "@/components/Character";
import AddFriendForm from "./AddFriendForm";
import { acceptFriend, removeFriendship } from "./actions";

interface FriendRow {
  friendship_id: number;
  friend_id: string;
  nickname: string;
  mbti: string | null;
  status: "pending" | "accepted";
  i_am_requester: boolean;
}

export default async function FriendsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("mbti")
    .eq("user_id", user.id)
    .maybeSingle();
  const character = getCharacter(me?.mbti);

  const { data } = await supabase.rpc("list_friendships");
  const rows = (data ?? []) as FriendRow[];
  const incoming = rows.filter((r) => r.status === "pending" && !r.i_am_requester);
  const outgoing = rows.filter((r) => r.status === "pending" && r.i_am_requester);
  const friends = rows.filter((r) => r.status === "accepted");

  return (
    <main className="page" style={{ ["--accent" as string]: character.accent }}>
      <div className="brand">
        <div className="brand-badge">
          나의 <em>친구</em>
        </div>
        <p className="brand-sub">친구의 MBTI와 우리의 궁합 보기</p>
      </div>

      <div className="card">
        <h2>친구 추가</h2>
        <div className="haori" />
        <AddFriendForm />
        <p className="muted" style={{ marginTop: 12 }}>
          상대가 수락해야 서로의 MBTI가 보여요.
        </p>
      </div>

      {incoming.length > 0 && (
        <div className="card">
          <h2>받은 요청</h2>
          <div className="haori" />
          <div className="stack">
            {incoming.map((r) => (
              <div key={r.friendship_id} className="row" style={{ justifyContent: "space-between" }}>
                <strong>{r.nickname}</strong>
                <span className="row">
                  <form action={acceptFriend}>
                    <input type="hidden" name="id" value={r.friendship_id} />
                    <button type="submit" className="btn">
                      수락
                    </button>
                  </form>
                  <form action={removeFriendship}>
                    <input type="hidden" name="id" value={r.friendship_id} />
                    <button type="submit" className="btn btn-ghost">
                      거절
                    </button>
                  </form>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2>친구 목록 ({friends.length})</h2>
        <div className="haori" />
        {friends.length === 0 ? (
          <p>아직 친구가 없어요. 위에서 이메일로 요청을 보내 보세요.</p>
        ) : (
          <div className="stack">
            {friends.map((f) => {
              const c = getCharacter(f.mbti);
              return (
                <div key={f.friendship_id} className="friend">
                  <div style={{ ["--accent" as string]: c.accent }}>
                    <Character mbti={f.mbti} size={64} />
                  </div>
                  <div className="friend-info">
                    <strong>{f.nickname}</strong>
                    <div className="muted">
                      {f.mbti ? `${f.mbti} · ${c.name}` : "아직 검사하지 않았어요"}
                    </div>
                  </div>
                  <div className="row">
                    {f.mbti && me?.mbti && (
                      <Link href={`/friends/${f.friend_id}`} className="btn">
                        궁합 보기
                      </Link>
                    )}
                    <form action={removeFriendship}>
                      <input type="hidden" name="id" value={f.friendship_id} />
                      <button type="submit" className="btn btn-ghost">
                        삭제
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!me?.mbti && (
          <p style={{ marginTop: 12 }}>
            <Link href="/test">내 MBTI 검사를 먼저 해야 궁합을 볼 수 있어요 →</Link>
          </p>
        )}
      </div>

      {outgoing.length > 0 && (
        <div className="card">
          <h2>보낸 요청</h2>
          <div className="haori" />
          <div className="stack">
            {outgoing.map((r) => (
              <div key={r.friendship_id} className="row" style={{ justifyContent: "space-between" }}>
                <span>
                  <strong>{r.nickname}</strong> <span className="muted">수락 대기 중</span>
                </span>
                <form action={removeFriendship}>
                  <input type="hidden" name="id" value={r.friendship_id} />
                  <button type="submit" className="btn btn-ghost">
                    취소
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="center" style={{ marginTop: 24 }}>
        <Link href="/">← 홈으로</Link>
      </p>
    </main>
  );
}
