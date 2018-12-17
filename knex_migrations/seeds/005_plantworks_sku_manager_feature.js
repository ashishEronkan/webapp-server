'use strict';

exports.seed = async function(knex) {
	let parentId = await knex.raw(`SELECT module_id FROM modules WHERE name = ? AND type = 'server' AND parent_module_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['module_id'];

	let componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'SkuManager']);
	if(componentId.rows.length) return null;

	componentId = await knex('modules').insert({
		'parent_module_id': parentId,
		'type': 'feature',
		'deploy': 'custom',
		'name': 'SkuManager',
		'display_name': 'SKU Manager',
		'description': 'The Plant.Works Web Application SKU Manager - manages the tenant\'s SKUs',
		'metadata': {
			'author': 'Plant.Works',
			'version': '2.4.3',
			'website': 'https://plant.works',
			'demo': 'https://plant.works',
			'documentation': 'https://plant.works'
		}
	})
	.returning('module_id');

	componentId = componentId[0];

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-read',
		'display_name': 'SKU Manager Read',
		'description': 'The Read-only Permission for the SKU Manager Module'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-update',
		'implies_permissions': '["sku-manager-read"]',
		'display_name': 'SKU Manager Update',
		'description': 'Update Permission for the SKU Manager Module'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-all',
		'implies_permissions': '["sku-manager-update"]',
		'display_name': 'SKU Manager All',
		'description': 'All Permissions for the SKU Manager Module'
	});
};
