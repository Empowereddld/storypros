UPDATE public.children
SET name = 'Ava',
    age = 5,
    current_level = 1,
    updated_at = now()
WHERE id = (
  SELECT id
  FROM public.children
  WHERE profile_id = 'd5641b04-7ed2-440d-aa34-fa746c94c752'
    AND name = 'Camesha'
  LIMIT 1
);