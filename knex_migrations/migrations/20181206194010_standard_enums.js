exports.up = async function(knex) {
	await knex.schema.raw("CREATE TYPE public.attribute_source_type AS ENUM ('static', 'source', 'computed', 'functional')");
	await knex.schema.raw("CREATE TYPE public.attribute_value_type AS ENUM ('boolean', 'date', 'json', 'number', 'string')");
	await knex.schema.raw("CREATE TYPE public.timestamp_type AS ENUM ('not_a_timestamp', 'unix_epoch', 'unix_epoch_with_milliseconds', 'ISO8601', 'RFC2822', 'custom')");
};

exports.down = async function(knex) {
	await knex.raw(`DROP TYPE IF EXISTS public.timestamp_type CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.attribute_value_type CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.attribute_source_type CASCADE;`);
};
