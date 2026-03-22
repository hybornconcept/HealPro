-- Migration: Add email indexes for role-based authentication performance
-- Created: 2025-11-30
-- Purpose: Optimize role checking queries for large databases

-- Add indexes on email columns for faster lookups
-- These indexes will dramatically improve login performance as the database grows

-- Index for patients table email lookups
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);

-- Index for hospitals table email lookups  
CREATE INDEX IF NOT EXISTS idx_hospitals_email ON hospitals(email);

-- Index for hmos table email lookups
CREATE INDEX IF NOT EXISTS idx_hmos_email ON hmos(email);

-- Add comments for documentation
COMMENT ON INDEX idx_patients_email IS 'Performance index for role-based authentication - login redirect';
COMMENT ON INDEX idx_hospitals_email IS 'Performance index for role-based authentication - login redirect';
COMMENT ON INDEX idx_hmos_email IS 'Performance index for role-based authentication - login redirect';
