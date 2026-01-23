-- =========================
-- AUTO-GENERATE VARIANT IMAGE URLs
-- =========================

UPDATE product_variants
SET image_url =
        '/images/' ||
        lower(
                regexp_replace(
                        replace(name, ' ', '_'),
                        '[^a-zA-Z0-9_]',
                        ''

                )
        ) || '.webp'
WHERE image_url IS NULL
   OR image_url = ''
   OR image_url NOT LIKE '/images/%';
