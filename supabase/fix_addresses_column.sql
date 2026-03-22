-- Add addresses JSONB column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb;

-- Optional: If you have existing data in the 'address' column, you can migrate it to the first item in 'addresses'
-- UPDATE public.profiles 
-- SET addresses = jsonb_build_array(address) 
-- WHERE address IS NOT NULL AND (addresses IS NULL OR jsonb_array_length(addresses) = 0);
