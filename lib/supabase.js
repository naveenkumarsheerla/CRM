import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://njwtshjzkzqenqgniglz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qd3RzaGp6a3pxZW5xZ25pZ2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NzI3MDAsImV4cCI6MjA4ODM0ODcwMH0.rpIaKscYMqS3FetQvkzZtZgBQhI6r8lRDPNOnWNABpk";

export const supabase = createClient(supabaseUrl, supabaseKey);