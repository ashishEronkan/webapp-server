
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_skus');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_skus', function(tenantSkuTbl) {
			tenantSkuTbl.uuid('tenant_id').notNullable().references('tenant_id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantSkuTbl.uuid('tenant_sku_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
			tenantSkuTbl.text('code').notNullable();
			tenantSkuTbl.text('name').notNullable();
			tenantSkuTbl.text('vendor');
			tenantSkuTbl.text('vendor_code');
			tenantSkuTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantSkuTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());


			tenantSkuTbl.primary(['tenant_id', 'tenant_sku_id']);
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_skus CASCADE;`);
};
