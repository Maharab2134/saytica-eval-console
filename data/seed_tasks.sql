-- Schema + seed for tasks table
create table if not exists public.tasks (
  id text primary key,
  title text not null,
  project_id text,
  project_name text,
  client_id text,
  assigned_to text,
  status text not null
);

-- Seed data (from data/tasks.json)
insert into public.tasks (id, title, project_id, project_name, client_id, assigned_to, status) values
('t1', 'Bengali sentiment batch #4', 'p1', 'Project Atlas', 'c1', 'u_annotator', 'done'),
('t2', 'Urdu transcription QA', 'p1', 'Project Atlas', 'c1', 'u_annotator', 'in_progress'),
('t3', 'Hindi prompt ranking', 'p1', 'Project Atlas', 'c1', 'u_annotator', 'pending'),
('t4', 'Tamil audio labeling', 'p1', 'Project Atlas', 'c1', 'u_annotator', 'done'),
('t5', 'Sylheti dialect tagging', 'p1', 'Project Atlas', 'c1', 'u_annotator', 'done'),
('t6', 'Pashto safety review', 'p1', 'Project Atlas', 'c1', 'u_annotator', 'in_progress'),
('t7', 'Khmer gold-set check', 'p1', 'Project Atlas', 'c1', 'u_other', 'pending'),
('t8', 'Amharic transcription', 'p1', 'Project Atlas', 'c1', 'u_other', 'done'),
('t9', 'Burmese intent labeling', 'p2', 'Project Beta', 'c2', 'u_annotator', 'pending'),
('t10', 'Tigrinya prompt review', 'p2', 'Project Beta', 'c2', 'u_annotator', 'done'),
('t11', 'Nepali RLHF ranking', 'p2', 'Project Beta', 'c2', 'u_other', 'in_progress'),
('t12', 'Marathi audio QA', 'p2', 'Project Beta', 'c2', 'u_annotator', 'done'),
('t13', 'Punjabi diarization', 'p2', 'Project Beta', 'c2', NULL, ''),
('t14', 'Telugu OCR validation', 'p2', 'Project Beta', 'c2', NULL, 'pending')
on conflict (id) do update set
  title = excluded.title,
  project_id = excluded.project_id,
  project_name = excluded.project_name,
  client_id = excluded.client_id,
  assigned_to = excluded.assigned_to,
  status = excluded.status;
