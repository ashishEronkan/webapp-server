'use strict';

exports.seed = async function(knex) {
	let parentId = await knex.raw(`SELECT module_id FROM modules WHERE name = ? AND type = 'server' AND parent_module_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['module_id'];

	let componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'WarehouseManager']);
	if(componentId.rows.length) return null;

	componentId = await knex('modules').insert({
		'parent_module_id': parentId,
		'type': 'feature',
		'deploy': 'custom',
		'name': 'WarehouseManager',
		'display_name': 'SKU Manager',
		'description': 'The Plant.Works Web Application Warehouse Manager - manages the tenant\'s warehouses',
		'metadata': {
			'author': 'Plant.Works',
			'version': '3.0.1',
			'website': 'https://plant.works',
			'demo': 'https://plant.works',
			'documentation': 'https://plant.works'
		}
	})
	.returning('module_id');

	componentId = componentId[0];

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-read',
		'display_name': 'Warehouse Manager Read',
		'description': 'The Read-only Permission for the Warehouse Manager Module'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-update',
		'implies_permissions': '["warehouse-manager-read"]',
		'display_name': 'Warehouse Manager Update',
		'description': 'Update Permission for the Warehouse Manager Module'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-all',
		'implies_permissions': '["warehouse-manager-update"]',
		'display_name': 'Warehouse Manager All',
		'description': 'All Permissions for the Warehouse Manager Module'
	});
};
