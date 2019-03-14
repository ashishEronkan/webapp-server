
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
			AttributePropertiesTbl.text('internal_tag').notNullable();
			AttributePropertiesTbl.text('units');
			AttributePropertiesTbl.integer('persist_period').notNullable().defaultTo(0);

			AttributePropertiesTbl.text('evaluation_expression');
			AttributePropertiesTbl.text('description');

			AttributePropertiesTbl.specificType('source', 'public.attribute_source_type').notNullable().defaultTo('static');
			AttributePropertiesTbl.specificType('datatype', 'public.attribute_value_type').notNullable().defaultTo('string');
			AttributePropertiesTbl.specificType('timestamp_format', 'public.timestamp_type');

			AttributePropertiesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributePropertiesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributePropertiesTbl.primary(['tenant_id', 'attribute_set_id', 'attribute_set_property_id']);
			AttributePropertiesTbl.unique(['attribute_set_property_id']);

			AttributePropertiesTbl.foreign(['tenant_id', 'attribute_set_id']).references(['tenant_id', 'attribute_set_id']).inTable('attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_attribute_set_id_name ON public.attribute_set_properties
			USING btree
			(
				attribute_set_id ASC,
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

	exists = await knex.schema.withSchema('public').hasTable('attribute_set_functions');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('attribute_set_functions', function(AttributeFunctionsTbl) {
			AttributeFunctionsTbl.uuid('tenant_id').notNullable();
			AttributeFunctionsTbl.uuid('attribute_set_id').notNullable();
			AttributeFunctionsTbl.uuid('attribute_set_function_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));

			AttributeFunctionsTbl.text('name').notNullable();
			AttributeFunctionsTbl.text('description');
			AttributeFunctionsTbl.text('code');

			AttributeFunctionsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributeFunctionsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributeFunctionsTbl.primary(['tenant_id', 'attribute_set_id', 'attribute_set_function_id']);
			AttributeFunctionsTbl.unique(['attribute_set_function_id']);

			AttributeFunctionsTbl.foreign(['tenant_id', 'attribute_set_id']).references(['tenant_id', 'attribute_set_id']).inTable('attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_attribute_set_id_function_name ON public.attribute_set_functions
			USING btree
			(
				attribute_set_id ASC,
				name ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('attribute_set_function_observed_properties');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('attribute_set_function_observed_properties', function(AttributeFunctionObservedPropertiesTbl) {
			AttributeFunctionObservedPropertiesTbl.uuid('tenant_id').notNullable();
			AttributeFunctionObservedPropertiesTbl.uuid('attribute_set_id').notNullable();
			AttributeFunctionObservedPropertiesTbl.uuid('attribute_set_function_id').notNullable();
			AttributeFunctionObservedPropertiesTbl.uuid('attribute_set_property_id').notNullable();
			AttributeFunctionObservedPropertiesTbl.uuid('attribute_set_function_observed_property_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));;

			AttributeFunctionObservedPropertiesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributeFunctionObservedPropertiesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributeFunctionObservedPropertiesTbl.primary(['tenant_id', 'attribute_set_id', 'attribute_set_function_id', 'attribute_set_property_id']);
			AttributeFunctionObservedPropertiesTbl.unique(['attribute_set_function_observed_property_id']);
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.attribute_set_function_observed_properties
			ADD CONSTRAINT fk_attribute_set_fn_observed_prop_attribute_set_fn
			FOREIGN KEY (
				tenant_id,
				attribute_set_id,
				attribute_set_function_id
			)
			REFERENCES attribute_set_functions (
				tenant_id,
				attribute_set_id,
				attribute_set_function_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.attribute_set_function_observed_properties
			ADD CONSTRAINT fk_attribute_set_fn_observed_prop_attribute_set_prop
			FOREIGN KEY (
				tenant_id,
				attribute_set_id,
				attribute_set_property_id
			)
			REFERENCES attribute_set_properties (
				tenant_id,
				attribute_set_id,
				attribute_set_property_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.attribute_set_function_observed_properties CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.attribute_set_functions CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.attribute_set_properties CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.attribute_sets CASCADE;`);
};
