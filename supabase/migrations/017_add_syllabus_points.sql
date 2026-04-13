-- Migration 017: Add syllabus_points column to topics table
-- syllabus_points stores the IB assessable statements for each topic and is used
-- to ground AI question generation strictly within the published specification.

ALTER TABLE topics
  ADD COLUMN IF NOT EXISTS syllabus_points TEXT[] DEFAULT '{}';

COMMENT ON COLUMN topics.syllabus_points IS
  'IB assessable statements for this topic, used to constrain AI question generation to the published specification.';
