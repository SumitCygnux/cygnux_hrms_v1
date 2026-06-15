-- Generic Get All
CREATE
OR REPLACE FUNCTION sp_get_data(p_table_name TEXT) RETURNS JSON LANGUAGE plpgsql AS $ $ DECLARE result JSON;

BEGIN EXECUTE format(
    'SELECT json_agg(t)
         FROM (
             SELECT *
             FROM %I
             WHERE is_deleted = false
         ) t',
    p_table_name
) INTO result;

RETURN COALESCE(result, '[]' :: json);

END;

$ $;

-- Generic Get By Id
CREATE
OR REPLACE FUNCTION sp_get_by_id(p_table_name TEXT, p_id UUID) RETURNS JSON LANGUAGE plpgsql AS $ $ DECLARE result JSON;

BEGIN EXECUTE format(
    'SELECT row_to_json(t)
         FROM (
            SELECT *
            FROM %I
            WHERE id = $1
            AND is_deleted = false
         ) t',
    p_table_name
) INTO result USING p_id;

RETURN result;

END;

$ $;

-- Generic Soft Delete
CREATE
OR REPLACE FUNCTION sp_delete_data(p_table_name TEXT, p_id UUID) RETURNS VOID LANGUAGE plpgsql AS $ $ BEGIN EXECUTE format(
    'UPDATE %I
         SET is_deleted = true
         WHERE id = $1',
    p_table_name
) USING p_id;

END;

$ $;

-- inster data
CREATE
OR REPLACE FUNCTION sp_insert_data(p_table_name TEXT, p_data JSONB) RETURNS UUID LANGUAGE plpgsql AS $ $ DECLARE v_id UUID;

BEGIN EXECUTE format(
    'INSERT INTO %I
         SELECT *
         FROM jsonb_populate_record(
             NULL::%I,
             $1
         )
         RETURNING id',
    p_table_name,
    p_table_name
) INTO v_id USING p_data;

RETURN v_id;

END;

$ $;

-- update data
CREATE
OR REPLACE FUNCTION sp_update_data(
    p_table_name TEXT,
    p_id UUID,
    p_data JSONB
) RETURNS VOID LANGUAGE plpgsql AS $ $ DECLARE key TEXT;

value TEXT;

query TEXT := '';

BEGIN FOR key,
value IN
SELECT
    *
FROM
    jsonb_each_text(p_data) LOOP query := query || format(
        '%I = %L,',
        key,
        value
    );

END LOOP;

query := left(query, length(query) - 1);

EXECUTE format(
    'UPDATE %I
         SET %s
         WHERE id = %L',
    p_table_name,
    query,
    p_id
);

END;

$ $;