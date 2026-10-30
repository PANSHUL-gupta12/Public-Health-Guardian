-- ============================================
-- Public Health Guardian — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient','doctor','admin','guest')),
  points INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  streak_last_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'Anonymous Guest'),
    COALESCE(NEW.email, 'guest_' || substr(NEW.id::text, 1, 8) || '@guardian.local'),
    'guest'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Quiz questions
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz scores
CREATE TABLE IF NOT EXISTS quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fake news fact checks
CREATE TABLE IF NOT EXISTS fact_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  claim TEXT NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('true','false','uncertain')),
  explanation TEXT,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rewards catalog
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Gift',
  active BOOLEAN DEFAULT true
);

-- Seed default rewards
INSERT INTO rewards (name, description, cost, icon) VALUES
  ('Free Annual Check-up', 'Complimentary health screening', 1500, 'Gift'),
  ('Pharmacy 10% Voucher', 'Discount at partner pharmacies', 800, 'Star'),
  ('Yoga Class Pass', 'One free yoga session', 600, 'Flame'),
  ('Nutrition Consult', 'Professional dietary advice session', 1200, 'Target')
ON CONFLICT DO NOTHING;

-- Redemptions
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Medical records (doctor/admin only)
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  patient_id TEXT UNIQUE NOT NULL,
  condition TEXT,
  last_visit DATE,
  status TEXT DEFAULT 'Stable',
  active_meds INTEGER DEFAULT 0,
  doctor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed sample medical records
INSERT INTO medical_records (patient_name, patient_age, patient_id, condition, last_visit, status, active_meds) VALUES
  ('Jordan Rivera', 34, 'PT-2841', 'Asthma — controlled', '2025-04-12', 'Stable', 2),
  ('Mei Tanaka', 58, 'PT-3017', 'Type 2 Diabetes', '2025-04-08', 'Monitoring', 3),
  ('Samuel Okafor', 42, 'PT-2298', 'Hypertension', '2025-03-29', 'Stable', 1),
  ('Priya Desai', 27, 'PT-3411', 'Migraine', '2025-04-19', 'Follow-up', 2)
ON CONFLICT (patient_id) DO NOTHING;

-- Audit log (admin only)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  points_delta INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow insert for authenticated" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Quizzes: anyone authenticated can read, admins can insert
CREATE POLICY "Anyone can read quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert quizzes" ON quizzes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Quiz scores: users manage their own
CREATE POLICY "Users read own scores" ON quiz_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own scores" ON quiz_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fact checks: users manage their own
CREATE POLICY "Users read own checks" ON fact_checks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own checks" ON fact_checks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rewards: anyone can read
CREATE POLICY "Anyone can read rewards" ON rewards FOR SELECT USING (true);

-- Redemptions: users manage their own
CREATE POLICY "Users read own redemptions" ON redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own redemptions" ON redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Medical records: doctors and admins only
CREATE POLICY "Doctors/admins read records" ON medical_records FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('doctor', 'admin')));
CREATE POLICY "Doctors can insert records" ON medical_records FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('doctor', 'admin')));

-- Audit logs: admins only
CREATE POLICY "Admins read audit logs" ON audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- Activity logs: users manage their own
CREATE POLICY "Users read own activity" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own activity" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
