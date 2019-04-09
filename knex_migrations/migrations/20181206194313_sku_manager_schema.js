
exports.up = async function(knex) {
	await knex.schema.raw("CREATE TYPE public.tenant_sku_type AS ENUM ('sku', 'product', 'part', 'component')");

	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_skus');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_skus', function(tenantSkuTbl) {
			tenantSkuTbl.uuid('tenant_id').notNullable().references('tenant_id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantSkuTbl.uuid('tenant_sku_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));

			tenantSkuTbl.text('code').notNullable();
			tenantSkuTbl.text('name').notNullable();
			tenantSkuTbl.uuid('attribute_set_id');

			tenantSkuTbl.specificType('sku_type', 'public.tenant_sku_type').notNullable().defaultTo('sku');
			tenantSkuTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantSkuTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantSkuTbl.primary(['tenant_id', 'tenant_sku_id']);
			tenantSkuTbl.unique(['tenant_sku_id']);
			tenantSkuTbl.unique(['tenant_id', 'code']);

			tenantSkuTbl.foreign(['tenant_id', 'attribute_set_id']).references(['tenant_id', 'attribute_set_id']).inTable('attribute_sets').onDelete('SET NULL').onUpdate('SET NULL');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_sku_relationships');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_sku_relationships', function(tenantSkuRelationshipTbl) {
			tenantSkuRelationshipTbl.uuid('tenant_id').notNullable();
			tenantSkuRelationshipTbl.uuid('tenant_sku_id').notNullable();
			tenantSkuRelationshipTbl.uuid('parent_tenant_sku_id').notNullable();
			tenantSkuRelationshipTbl.uuid('tenant_sku_relationship_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));

			tenantSkuRelationshipTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantSkuRelationshipTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantSkuRelationshipTbl.primary(['tenant_id', 'tenant_sku_id', 'parent_tenant_sku_id']);
			tenantSkuRelationshipTbl.unique(['tenant_sku_relationship_id']);

			tenantSkuRelationshipTbl.foreign(['tenant_id', 'tenant_sku_id']).references(['tenant_id', 'tenant_sku_id']).inTable('tenant_skus').onDelete('CASCADE').onUpdate('CASCADE');
			tenantSkuRelationshipTbl.foreign(['tenant_id', 'parent_tenant_sku_id']).references(['tenant_id', 'tenant_sku_id']).inTable('tenant_skus').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_sku_relationships CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_skus CASCADE;`);

	await knex.raw(`DROP TYPE IF EXISTS public.tenant_sku_type CASCADE;`);
};
