'use strict';

exports.seed = async function(knex) {
	let parentId = await knex.raw(`SELECT module_id FROM modules WHERE name = ? AND module_type = 'server' AND parent_module_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['module_id'];

	let componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [parentId, 'Profile']);
	if(!componentId.rows.length) {
		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'Profile',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [parentId, 'Dashboard']);
	if(!componentId.rows.length) {
		let dashboardFeatureId = await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'Dashboard',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		})
		.returning('module_id');

		dashboardFeatureId = dashboardFeatureId[0];
		await knex.raw(`UPDATE tenants_users SET default_application = ? WHERE user_id = (SELECT user_id FROM users WHERE email = 'root@plant.works')`, [dashboardFeatureId]);
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [parentId, 'Settings']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'Settings',
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
			'name': 'settings-access'
		});
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [parentId, 'ServerAdministration']);
	if(!componentId.rows.length) {
		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'feature',
			'deploy': 'admin',
			'name': 'ServerAdministration',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [parentId, 'TenantAdministration']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'TenantAdministration',
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
			'name': 'tenant-administration-read'
		});

		await knex('feature_permissions').insert({
			'module_id': componentId,
			'name': 'tenant-administration-update',
			'implies_permissions': '["tenant-administration-read"]'
		});

		await knex('feature_permissions').insert({
			'module_id': componentId,
			'name': 'tenant-administration-all',
			'implies_permissions': '["tenant-administration-update"]'
		});
	}
	else {
		componentId = componentId.rows.shift()['module_id'];
	}

	const tenantAdminFeatureId = componentId;

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [tenantAdminFeatureId, 'FeatureManager']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': tenantAdminFeatureId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'FeatureManager',
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
			'name': 'feature-manager-read',
			'implies_permissions': '["tenant-administration-read"]'
		});

		await knex('feature_permissions').insert({
			'module_id': componentId,
			'name': 'feature-manager-update',
			'implies_permissions': '["feature-manager-read"]'
		});

		await knex('feature_permissions').insert({
			'module_id': componentId,
			'name': 'feature-manager-all',
			'implies_permissions': '["feature-manager-update"]'
		});
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [tenantAdminFeatureId, 'GroupManager']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': tenantAdminFeatureId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'GroupManager',
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
			'name': 'group-manager-read',
			'implies_permissions': '["tenant-administration-read"]'
		});

		await knex('feature_permissions').insert({
			'module_id': componentId,
			'name': 'group-manager-update',
			'implies_permissions': '["group-manager-read"]'
		});

		await knex('feature_permissions').insert({
			'module_id': componentId,
			'name': 'group-manager-all',
			'implies_permissions': '["group-manager-update"]'
		});
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'feature'`, [tenantAdminFeatureId, 'UserManager']);
	if(!componentId.rows.length) {
		componentId = await knex('modules').insert({
			'parent_module_id': tenantAdminFeatureId,
			'module_type': 'feature',
			'deploy': 'default',
			'name': 'UserManager',
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
			'name': 'user-manager-read',
			'implies_permissions': '["tenant-administration-read"]'
		});

		await knex('feature_permissions').insert({
			'module_id': componentId,
			'name': 'user-manager-update',
			'implies_permissions': '["user-manager-read"]'
		});

		await knex('feature_permissions').insert({
			'module_id': componentId,
			'name': 'user-manager-all',
			'implies_permissions': '["user-manager-update"]'
		});
	}
};
