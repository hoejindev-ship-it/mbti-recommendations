"use client";

import { useActionState } from "react";
import { sendFriendRequest } from "./actions";

export default function AddFriendForm() {
  const [state, action, pending] = useActionState(sendFriendRequest, null);

  return (
    <form action={action} className="stack">
      <input name="email" type="email" placeholder="친구의 가입 이메일" required />
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "보내는 중..." : "친구 요청 보내기"}
      </button>
      {state && (
        <p role={state.ok ? "status" : "alert"} style={state.ok ? { color: "var(--accent)", fontWeight: 700 } : undefined}>
          {state.message}
        </p>
      )}
    </form>
  );
}
