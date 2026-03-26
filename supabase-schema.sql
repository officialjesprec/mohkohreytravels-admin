-- =====================================================
-- MOHKOHREY TRAVELS ADMIN - DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    type TEXT DEFAULT 'General',
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
    amount DECIMAL(12, 2),
    departure_city TEXT,
    destination_city TEXT,
    destination_country TEXT,
    passport_number TEXT,
    application_type TEXT,
    nin TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEADS TABLE (Contact/Monitoring Requests)
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT,
    source TEXT DEFAULT 'Website',
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'RESPONDED')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TOURS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    base_price DECIMAL(12, 2),
    location TEXT,
    duration TEXT,
    category TEXT,
    currency TEXT DEFAULT 'NGN',
    itinerary JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BLOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    content TEXT,
    excerpt TEXT,
    category TEXT DEFAULT 'Travel Guides',
    cover_image TEXT,
    is_published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STUDY ABROAD TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS study_abroad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    university TEXT,
    course TEXT,
    intake TEXT,
    status TEXT DEFAULT 'INQUIRING' CHECK (status IN ('INQUIRING', 'APPLIED', 'ENROLLED', 'REJECTED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VISA APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS visa_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    destination_country TEXT,
    visa_type TEXT DEFAULT 'Tourist Visa',
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'APPROVED', 'REJECTED')),
    passport_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PASSPORT APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS passport_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    request_type TEXT DEFAULT 'Fresh Application',
    capture_center TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED')),
    nin TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Enable for all tables
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_abroad ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE passport_applications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC ACCESS POLICIES
-- For admin dashboard - allows all operations
-- =====================================================

-- Bookings policies
CREATE POLICY "Enable read access for all users" ON bookings FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON bookings FOR DELETE USING (true);

-- Leads policies
CREATE POLICY "Enable read access for all users" ON leads FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON leads FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON leads FOR DELETE USING (true);

-- Tours policies
CREATE POLICY "Enable read access for all users" ON tours FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON tours FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON tours FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON tours FOR DELETE USING (true);

-- Blogs policies
CREATE POLICY "Enable read access for all users" ON blogs FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON blogs FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON blogs FOR DELETE USING (true);

-- Study abroad policies
CREATE POLICY "Enable read access for all users" ON study_abroad FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON study_abroad FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON study_abroad FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON study_abroad FOR DELETE USING (true);

-- Visa applications policies
CREATE POLICY "Enable read access for all users" ON visa_applications FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON visa_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON visa_applications FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON visa_applications FOR DELETE USING (true);

-- Passport applications policies
CREATE POLICY "Enable read access for all users" ON passport_applications FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON passport_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON passport_applications FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON passport_applications FOR DELETE USING (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tours_is_active ON tours(is_active);
CREATE INDEX IF NOT EXISTS idx_tours_is_featured ON tours(is_featured);
CREATE INDEX IF NOT EXISTS idx_tours_created_at ON tours(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_abroad_status ON study_abroad(status);
CREATE INDEX IF NOT EXISTS idx_visa_applications_status ON visa_applications(status);
CREATE INDEX IF NOT EXISTS idx_passport_applications_status ON passport_applications(status);

-- =====================================================
-- SAMPLE DATA (Optional - Comment out if not needed)
-- =====================================================

-- Sample Tours
INSERT INTO tours (title, slug, description, base_price, location, duration, is_active, is_featured, start_date, end_date) VALUES
('Bali Paradise Escape', 'bali-paradise-escape', 'Experience the magical island of Bali with our comprehensive tour package including beach resorts, temple visits, and cultural experiences.', 450000, 'Bali, Indonesia', '7 Days', true, true, '2025-06-01', '2025-06-07'),
('Swiss Alps Adventure', 'swiss-alps-adventure', 'Explore the breathtaking Swiss Alps with guided hiking tours, scenic train rides, and luxury mountain accommodations.', 850000, 'Switzerland', '10 Days', true, false, '2025-07-15', '2025-07-25'),
('Dubai Luxury Experience', 'dubai-luxury-experience', 'Discover Dubai with shopping, desert safaris, and world-class dining experiences.', 380000, 'Dubai, UAE', '5 Days', true, false, '2025-05-20', '2025-05-25'),
('Zanzibar Beach Getaway', 'zanzibar-beach-getaway', 'Relax on pristine beaches and explore the historic Stone Town of Zanzibar.', 320000, 'Zanzibar, Tanzania', '6 Days', true, true, '2025-08-10', '2025-08-16');

-- Sample Blogs
INSERT INTO blogs (title, slug, content, category, is_published, views) VALUES
('Top 10 Travel Destinations for 2025', 'top-10-travel-destinations-2025', 'Discover the most breathtaking travel destinations that should be on your bucket list for 2025. From hidden gems to popular hotspots, we have got you covered.', 'Travel Guides', true, 245),
('How to Prepare for Your First International Trip', 'prepare-first-international-trip', 'Planning your first international trip can be overwhelming. This comprehensive guide will help you navigate the process with confidence.', 'Tips & Tricks', true, 189),
('Exploring Nigerian Cuisine: A Culinary Journey', 'nigerian-cuisine-culinary-journey', 'Take a gastronomic adventure through Nigeria diverse and flavorful cuisine.', 'Food & Culture', true, 156),
('New Visa Processing Times Announced', 'new-visa-processing-times', 'Important updates regarding visa processing times for various countries. Stay informed with the latest requirements.', 'News & Updates', true, 312);

-- Sample Leads
INSERT INTO leads (full_name, email, phone, message, source, status) VALUES
('Adebayo Johnson', 'adebayo@email.com', '+2348012345678', 'I am interested in visa processing for Canada study visa.', 'Website', 'IN_PROGRESS'),
('Chioma Eze', 'chioma.eze@email.com', '+2348098765432', 'Looking for tour packages to Dubai for December.', 'Website', 'RESPONDED'),
('Oluwaseun Adeyemi', 'seun.adeyemi@email.com', '+2348055555555', 'Inquiry about study abroad options for UK universities.', 'Website', 'PENDING');

-- Sample Bookings
INSERT INTO bookings (full_name, email, phone, type, status, amount) VALUES
('Sarah Jenkins', 'sarah.j@email.com', '+2348011111111', 'Flight Bookings', 'CONFIRMED', 250598),
('Michael Chen', 'm.chen@email.com', '+2348022222222', 'Visa Processing', 'PENDING', 150000),
('Emma Watson', 'emma.w@email.com', '+2348033333333', 'Tour Package', 'CONFIRMED', 155599);

-- Sample Study Abroad
INSERT INTO study_abroad (full_name, email, university, course, intake, status) VALUES
('Ifeanyi Okafor', 'ifeanyi@email.com', 'University of Toronto', 'Computer Science', 'Fall 2025', 'APPLIED'),
('Bose Salau', 'bose.salau@email.com', 'Coventry University', 'MBA', 'Spring 2025', 'ENROLLED'),
('Kelechi Iheacho', 'kelechi@email.com', 'McMaster University', 'Engineering Management', 'Winter 2026', 'INQUIRING');

-- Sample Visa Applications
INSERT INTO visa_applications (full_name, email, destination_country, visa_type, status) VALUES
('Adebayo Olawale', 'adebayo.o@email.com', 'Canada', 'Study Visa', 'PROCESSING'),
('Chidi Eze', 'chidi.eze@email.com', 'United Kingdom', 'Tourist Visa', 'APPROVED'),
('Fatima Yusuf', 'fatima.y@email.com', 'USA', 'Work Visa', 'PENDING');

-- Sample Passport Applications
INSERT INTO passport_applications (full_name, email, request_type, capture_center, status) VALUES
('Damilola Adeniyi', 'damilola@email.com', 'Fresh Application', 'Ikoyi, Lagos', 'PROCESSING'),
('Mustapha Musa', 'mustapha.m@email.com', 'Renewal', 'Abuja HQ', 'COMPLETED'),
('Nneka Obi', 'nneka.o@email.com', 'Fresh Application', 'Enugu Center', 'PENDING');

-- =====================================================
-- DONE!
-- =====================================================
