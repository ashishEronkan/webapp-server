
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('attribute_sets', function(AttributeSetsTbl) {
			AttributeSetsTbl.uuid('tenant_id').notNullable().references('tenant_id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			AttributeSetsTbl.uuid('attribute_set_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));

			AttributeSetsTbl.uuid('tenant_feature_id').notNullable().references('tenant_feature_id').inTable('tenants_features').onDelete('CASCADE').onUpdate('CASCADE');
			AttributeSetsTbl.text('name').notNullable();
			AttributeSetsTbl.text('description');

			AttributeSetsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributeSetsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributeSetsTbl.primary(['tenant_id', 'attribute_set_id']);
			AttributeSetsTbl.unique(['attribute_set_id']);
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('attribute_set_properties');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('attribute_set_properties', function(AttributePropertiesTbl) {
			AttributePropertiesTbl.uuid('tenant_id').notNullable();
			AttributePropertiesTbl.uuid('attribute_set_id').notNullable();
			AttributePropertiesTbl.uuid('attribute_set_property_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));

			AttributePropertiesTbl.text('name').notNullable();
			AttributePropertiesTbl.text('description');
			AttributePropertiesTbl.text('units');

			AttributePropertiesTbl.text('internal_tag').notNullable();
			AttributePropertiesTbl.text('evaluation_expression');

			AttributePropertiesTbl.specificType('source', 'public.attribute_source_type').notNullable().defaultTo('static');
			AttributePropertiesTbl.specificType('datatype', 'public.attribute_value_type').notNullable().defaultTo('string');

			AttributePropertiesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributePropertiesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributePropertiesTbl.primary(['tenant_id', 'attribute_set_id', 'attribute_set_property_id']);
			AttributePropertiesTbl.unique(['attribute_set_property_id']);

			AttributePropertiesTbl.foreign(['tenant_id', 'attribute_set_id']).references(['tenant_id', 'attribute_set_id']).inTable('attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_attribute_set_properties_id_name ON public.attribute_set_properties
			USING btree
			(
				attribute_set_property_id ASC,
				name ASC
			)`
		);

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_attribute_set_id_internal_tag ON public.attribute_set_properties
			USING btree
			(
				attribute_set_id ASC,
				internal_tag ASC
			)`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.attribute_set_properties CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.attribute_sets CASCADE;`);
};
