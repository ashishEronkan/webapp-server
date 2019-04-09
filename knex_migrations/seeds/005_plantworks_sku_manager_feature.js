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
		'name': 'sku-manager-attribute-set-read',
		'display_name': 'SKU Manager Attribute Set Read',
		'description': 'The Read-only Permission for the SKU Manager Attribute Sets'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-attribute-set-update',
		'implies_permissions': '["sku-manager-attribute-set-read"]',
		'display_name': 'SKU Manager Attribute Set Update',
		'description': 'Update Permission for the SKU Manager Attribute Sets'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-configuration-read',
		'display_name': 'SKU Manager Configuration Read',
		'description': 'The Read-only Permission for the SKU Manager Configuration Module'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-configuration-update',
		'implies_permissions': '["sku-manager-configuration-read"]',
		'display_name': 'SKU Manager Configuration Update',
		'description': 'Update Permission for the SKU Manager Configuration Module'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-upload',
		'display_name': 'SKU Manager Data Upload',
		'description': 'Upload Permission for the SKU Manager'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-report-execute',
		'display_name': 'SKU Manager Reports',
		'description': 'Reports Permission for the SKU Manager Module'
	});

	await knex('feature_permissions').insert({
		'module_id': componentId,
		'name': 'sku-manager-all',
		'implies_permissions': '["sku-manager-attribute-set-update", "sku-manager-configuration-update", "sku-manager-upload", "sku-manager-report-execute"]',
		'display_name': 'SKU Manager All',
		'description': 'All Permissions for the SKU Manager Module'
	});

	const SKUFeatureId = componentId;

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [SKUFeatureId, 'AttributeSets']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': SKUFeatureId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'AttributeSets',
			'display_name': 'Attribute Sets',
			'description': 'The Plant.Works Web Application SKU Manager Attribute Sets - manages the SKU\'s attribute sets',
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
			'display_name': 'Configuration',
			'description': 'The Plant.Works Web Application SKU Manager Configuration - manages the SKU\'s configuration',
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
			'display_name': 'Upload',
			'description': 'The Plant.Works Web Application SKU Manager Upload - manages the SKU\'s data uploads',
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
			'display_name': 'Reports',
			'description': 'The Plant.Works Web Application SKU Manager Reports - manages the SKU\'s reports',
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
