'use strict';

exports.seed = async function(knex) {
	let parentId = await knex.raw(`SELECT module_id FROM modules WHERE name = ? AND module_type = 'server' AND parent_module_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['module_id'];

	let componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [parentId, 'SkuManager']);
	if(componentId.rows.length) return null;

	componentId = await knex('modules').insert({
		'parent_module_id': parentId,
		'module_type': 'feature',
		'deploy': 'custom',
		'name': 'SkuManager',
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
		'name': 'sku-manager-attribute-set-read'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-attribute-set-update',
		'implies_permissions': '["sku-manager-attribute-set-read"]'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-configuration-read'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-configuration-update',
		'implies_permissions': '["sku-manager-configuration-read"]'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-upload'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-report-execute'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-all',
		'implies_permissions': '["sku-manager-attribute-set-update", "sku-manager-configuration-update", "sku-manager-upload", "sku-manager-report-execute"]'
	});

	const SKUFeatureId = componentId;

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [SKUFeatureId, 'AttributeSets']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': SKUFeatureId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'AttributeSets',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [SKUFeatureId, 'Configuration']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': SKUFeatureId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'Configuration',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [SKUFeatureId, 'Upload']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': SKUFeatureId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'Upload',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [SKUFeatureId, 'Reports']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': SKUFeatureId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'Reports',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}
};
