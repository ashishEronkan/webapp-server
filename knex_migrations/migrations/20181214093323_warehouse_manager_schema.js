
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_warehouses');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_warehouses', function(tenantWarehouseTbl) {
			tenantWarehouseTbl.uuid('tenant_id').notNullable().references('tenant_id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantWarehouseTbl.uuid('tenant_warehouse_id').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));

			tenantWarehouseTbl.text('name').notNullable();

			tenantWarehouseTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantWarehouseTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantWarehouseTbl.primary(['tenant_id', 'tenant_warehouse_id']);
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_warehouses CASCADE;`);
};
