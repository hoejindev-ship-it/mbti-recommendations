"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MESSAGES: Record<string, string> = {
  sent: "친구 요청을 보냈어요.",
  accepted: "상대가 먼저 요청을 보냈어서 바로 친구가 됐어요!",
  already_friends: "이미 친구예요.",
  already_sent: "이미 요청을 보냈어요. 상대가 수락하길 기다려 주세요.",
  self: "내 이메일로는 요청할 수 없어요.",
  not_found: "가입된 계정을 찾지 못했어요. 이메일을 다시 확인해 주세요.",
  unauthorized: "로그인이 필요해요.",
};

export async function sendFriendRequest(
  _prev: { message: string; ok: boolean } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { message: "이메일을 입력해 주세요.", ok: false };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("send_friend_request", { target_email: email });
  if (error) return { message: "요청 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.", ok: false };

  revalidatePath("/friends");
  return { message: MESSAGES[data as string] ?? "처리했어요.", ok: data === "sent" || data === "accepted" };
}

export async function acceptFriend(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("friendships").update({ status: "accepted" }).eq("id", id);
  revalidatePath("/friends");
}

export async function removeFriendship(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("friendships").delete().eq("id", id);
  revalidatePath("/friends");
}
