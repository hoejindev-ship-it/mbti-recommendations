-- 축별 비율(%): 앞 글자(E/S/T/J) 쪽 비율. 예: {"EI": 62, "SN": 40, "TF": 55, "JP": 71}
alter table public.profiles add column scores jsonb;
