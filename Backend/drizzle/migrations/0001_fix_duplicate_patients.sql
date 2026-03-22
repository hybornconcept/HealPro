-- Migration: Fix duplicate patient emails and add unique constraint
-- Date: 2025-11-30

-- Step 1: Merge data from patient ID 3 into patient ID 4 (the one with user_id)
UPDATE patients 
SET 
  blood_group = 'B+',
  genotype = 'AS',
  height = 82,
  weight = 87,
  allergies = 'Enim consequat Qui',
  conditions = 'Nam sit consectetur',
  primary_care_physician = 'Quo ullam hic assume',
  identification_type = 'Voters Card',
  identification_number = '757',
  date_of_birth = '2005-09-22',
  gender = 'Female',
  address = 'Voluptas ad laborum',
  updated_at = NOW()
WHERE id = 4;

-- Step 2: Delete the duplicate patient record (ID 3)
DELETE FROM patients WHERE id = 3;

-- Step 3: Add unique constraint to email column to prevent future duplicates
ALTER TABLE patients ADD CONSTRAINT patients_email_unique UNIQUE (email);
