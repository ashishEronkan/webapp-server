'use strict';

exports.seed = async function(knex) {
	let parentId = await knex.raw(`SELECT module_id FROM modules WHERE name = ? AND module_type = 'server' AND parent_module_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['module_id'];

	let componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [parentId, 'WarehouseManager']);
	if(componentId.rows.length) return null;

	componentId = await knex('modules').insert({
		'parent_module_id': parentId,
		'module_type': 'feature',
		'deploy': 'custom',
		'name': 'WarehouseManager',
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
		'name': 'warehouse-manager-configuration-read'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-configuration-update',
		'implies_permissions': '["warehouse-manager-configuration-read"]'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-generate-advice-read'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-generate-advice-update',
		'implies_permissions': '["warehouse-manager-generate-advice-read"]'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-receiving-read'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-receiving-update',
		'implies_permissions': '["warehouse-manager-receiving-read"]'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-shipping-read'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-shipping-update',
		'implies_permissions': '["warehouse-manager-shipping-read"]'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-report-execute'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-administrator',
		'implies_permissions': '["warehouse-manager-configuration-update", "warehouse-manager-generate-advice-update", "warehouse-manager-receiving-update", "warehouse-manager-shipping-update", "warehouse-manager-report-execute"]'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'warehouse-manager-super-administrator',
		'implies_permissions': '["warehouse-manager-administrator"]'
	});
};
