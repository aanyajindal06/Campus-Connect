-- ============================================================================
-- CAMPUSCONNECT: SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY SETUP
-- ============================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_category AS ENUM ('Technical', 'Cultural', 'Sports', 'Workshop');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE (Linked 1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    roll_number TEXT DEFAULT 'N/A',
    department TEXT DEFAULT 'General',
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category event_category NOT NULL DEFAULT 'Technical',
    description TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    venue TEXT NOT NULL,
    organizer TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    registered_count INTEGER NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
    banner_url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_roll TEXT DEFAULT 'N/A',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_event_user_registration UNIQUE (event_id, user_id),
    CONSTRAINT unique_event_email_registration UNIQUE (event_id, student_email)
);

-- 5. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_event_user_bookmark UNIQUE (event_id, user_id)
);

-- 6. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_event_id ON public.bookmarks(event_id);

-- 7. TRIGGER: AUTOMATED REGISTRATION COUNT & CAPACITY CHECK
CREATE OR REPLACE FUNCTION public.sync_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (SELECT registered_count >= capacity FROM public.events WHERE id = NEW.event_id) THEN
            RAISE EXCEPTION 'This event has already reached its maximum capacity.';
        END IF;

        UPDATE public.events
        SET registered_count = registered_count + 1,
            updated_at = timezone('utc'::text, now())
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.events
        SET registered_count = GREATEST(0, registered_count - 1),
            updated_at = timezone('utc'::text, now())
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_event_registration_count ON public.registrations;
CREATE TRIGGER trg_sync_event_registration_count
AFTER INSERT OR DELETE ON public.registrations
FOR EACH ROW EXECUTE FUNCTION public.sync_event_registration_count();

-- 8. TRIGGER: AUTOMATED PROFILE CREATION ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, roll_number, department, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'roll_number', 'N/A'),
        COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
        'student'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Admin Check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile details" ON public.profiles;
CREATE POLICY "Users can update their own profile details"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Events Policies
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone"
ON public.events FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Only admins can insert events" ON public.events;
CREATE POLICY "Only admins can insert events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update events" ON public.events;
CREATE POLICY "Only admins can update events"
ON public.events FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete events" ON public.events;
CREATE POLICY "Only admins can delete events"
ON public.events FOR DELETE
TO authenticated
USING (public.is_admin());

-- Registrations Policies
DROP POLICY IF EXISTS "View registrations policy" ON public.registrations;
CREATE POLICY "View registrations policy"
ON public.registrations FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Students can insert their own registration" ON public.registrations;
CREATE POLICY "Students can insert their own registration"
ON public.registrations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Delete registration policy" ON public.registrations;
CREATE POLICY "Delete registration policy"
ON public.registrations FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Bookmarks Policies
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks"
ON public.bookmarks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert own bookmarks"
ON public.bookmarks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete own bookmarks"
ON public.bookmarks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
