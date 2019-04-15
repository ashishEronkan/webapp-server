'use strict';

exports.seed = async function(knex) {
	let bhairaviTmplId = null;

	// Step 1: See if the seed file has already run. If yes, simply return
	let parentId = await knex.raw(`SELECT module_id FROM modules WHERE name = ? AND module_type = 'server' AND parent_module_id IS NULL`, ['PlantWorksWebappServer']);
	if(parentId.rows.length) {
		parentId = parentId.rows[0]['module_id'];
	}
	else {
		// Step 2: Insert the data for the "server" into the modules table
		parentId = await knex('modules').insert({
			'name': 'PlantWorksWebappServer',
			'module_type': 'server',
			'deploy': 'default',
			'configuration': {
				'title': 'Plant.Works Web Application'
			},
			'configuration_schema': {
				'type': 'object',
				'properties': {
					'title': {
						'type': 'string'
					}
				}
			},
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		})
		.returning('module_id');

		parentId = parentId[0];

		// Step 3: Insert the data for all the standard services that ship with the codebase into the modules table
		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'ApiService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'AuditService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'AuthService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'AwsService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'CacheService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'CassandraService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		let configSrvcId = await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'ConfigurationService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		})
		.returning('module_id');

		configSrvcId = configSrvcId[0];

		await knex('modules').insert({
			'parent_module_id': configSrvcId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'DatabaseConfigurationService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': configSrvcId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'FileConfigurationService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'DatabaseService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'LocalizationService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'LoggerService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'MailerService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'PubsubService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'ShardingService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'WebserverService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'service',
			'deploy': 'admin',
			'name': 'WebsocketService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});

		bhairaviTmplId = await knex('modules').insert({
			'parent_module_id': parentId,
			'module_type': 'template',
			'deploy': 'default',
			'name': 'BhairaviTemplate',
			'configuration': {
				'title': 'Plant.Works Bhairavi Template'
			},
			'configuration_schema': {
				'type': 'object',
				'properties': {
					'title': {
						'type': 'string'
					}
				}
			},
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.4.3',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works',
				'jsFramework': 'ember',
				'jsFrameworkVersion': '>= 3.3.2'
			}
		})
		.returning('module_id');

		bhairaviTmplId = bhairaviTmplId[0];

		// Step 4: Insert the data for the standard permissions that this "server" defines
		await knex('feature_permissions').insert({
			'module_id': parentId,
			'name': 'public'
		});

		await knex('feature_permissions').insert({
			'module_id': parentId,
			'name': 'registered',
			'implies_permissions': '["public"]'
		});

		await knex('feature_permissions').insert({
			'module_id': parentId,
			'name': 'administrator',
			'implies_permissions': '["registered"]'
		});

		await knex('feature_permissions').insert({
			'module_id': parentId,
			'name': 'super-administrator',
			'implies_permissions': '["administrator"]'
		});
	}

	// Step 5: Insert the data (basics + template) for the only pre-defined tenant
	let tenantId = await knex.raw('SELECT tenant_id FROM tenants WHERE sub_domain =\'www\'');
	if(!tenantId.rows.length) {
		tenantId = await knex('tenants').insert({
			'name': 'Plant.Works',
			'sub_domain': 'www'
		})
		.returning('tenant_id');

		tenantId = tenantId[0];
	}
	else {
		tenantId = tenantId.rows[0]['tenant_id'];
	}

	let templateId = await knex.raw(`SELECT tenant_server_template_id FROM tenant_server_templates WHERE tenant_id = ? AND module_id = ?`, [tenantId, parentId]);
	if(!templateId.rows.length) {
		await knex('tenant_server_templates').insert({
			'tenant_id': tenantId,
			'module_id': parentId,
			'base_template_id': bhairaviTmplId,
			'name': 'default',
			'relative_path_to_index': 'index.ejs',
			'configuration': {
				'title': 'Plant.Works WebApp'
			},
			'configuration_schema': {
				'type': 'object',
				'properties': {
					'title': {
						'type': 'string'
					}
				}
			},
			'default': true
		});
	}

	// Step 6: Insert the data for the root user
	let userId = await knex.raw('SELECT user_id FROM users WHERE email = \'root@plant.works\'');
	if(!userId.rows.length) {
		userId = await  knex('users').insert({
			'email': 'root@plant.works',
			'password': '$pbkdf2-sha512$i=25000$TcpuHsGqh+o3S+KNIXREjw$MjHMSkGA5WHnRWG0UbUP/CPxfADCN+o+8momCsXOzRSigcty3/R3CPftGy7l9EcLoF1BYpo8Q7/PlnfRC24PkA',
			'first_name': 'Root',
			'last_name': 'PlantWorks',
			'nickname': 'root',
			'profile_image': 'f8a9da32-26c5-495a-be9a-42f2eb8e4ed1',
			'profile_image_metadata': '{"zoom": "1", "points": ["2", "0", "336", "334"]}'
		})
		.returning('user_id');

		userId = userId[0];
	}
	else {
		userId = userId.rows[0]['user_id'];
	}

	let userContactId = await knex.raw('SELECT user_contact_id FROM user_contacts WHERE user_id = ? AND contact_type = ? AND contact = ?', [userId, 'mobile', '01234567890']);
	if(!userContactId.rows.length) {
		await knex('user_contacts').insert({
			'user_id': userId,
			'contact': '01234567890',
			'contact_type': 'mobile',
			'verified': true
		});
	}

	// Step 6: Insert the data for the tenant's pre-defined groups - Super Admin, Admin, Registered, and Public
	let superAdminGroupId = await knex.raw(`SELECT tenant_group_id FROM tenant_groups WHERE tenant_id = '${tenantId}' AND parent_tenant_group_id IS NULL;`);
	if(!superAdminGroupId.rows.length) {
		superAdminGroupId = await knex('tenant_groups').insert({
			'tenant_id': tenantId,
			'name': 'super-administrators',
			'display_name': 'Super Administrators',
			'description': 'The Super Administrator Group for the root tenant',
			'default_for_new_user': false
		})
		.returning('tenant_group_id');

		superAdminGroupId = superAdminGroupId[0];
	}
	else {
		superAdminGroupId = superAdminGroupId.rows[0]['tenant_group_id'];
		await knex('tenant_groups').where('tenant_group_id', '=', superAdminGroupId).update({
			'name': 'super-administrators',
			'display_name': 'Super Administrators',
			'description': 'The Super Administrator Group for the root tenant',
			'default_for_new_user': false
		});
	}

	let adminGroupId = await knex.raw(`SELECT tenant_group_id FROM tenant_groups WHERE tenant_id = '${tenantId}' AND parent_tenant_group_id = '${superAdminGroupId}'`);
	if(!adminGroupId.rows.length) {
		adminGroupId = await knex('tenant_groups').insert({
			'tenant_id': tenantId,
			'parent_tenant_group_id': superAdminGroupId,
			'name': 'administrators',
			'display_name': 'Administrators',
			'description': 'The Administrator Group for the root tenant',
			'default_for_new_user': false
		})
		.returning('tenant_group_id');

		adminGroupId = adminGroupId[0];
	}
	else {
		adminGroupId = adminGroupId.rows[0]['tenant_group_id'];
		await knex('tenant_groups').where('tenant_group_id', '=', adminGroupId).update({
			'name': 'administrators',
			'display_name': 'Administrators',
			'description': 'The Administrator Group for the root tenant',
			'default_for_new_user': false
		});
	}

	let registeredGroupId = await knex.raw(`SELECT tenant_group_id FROM tenant_groups WHERE tenant_id = '${tenantId}' AND parent_tenant_group_id = '${adminGroupId}';`);
	if(!registeredGroupId.rows.length) {
		registeredGroupId = await knex('tenant_groups').insert({
			'tenant_id': tenantId,
			'parent_tenant_group_id': adminGroupId,
			'name': 'registered-users',
			'display_name': 'Registered Users',
			'description': 'The Registered User Group for the root tenant',
			'default_for_new_user': true
		})
		.returning('tenant_group_id');

		registeredGroupId = registeredGroupId[0];
	}
	else {
		registeredGroupId = registeredGroupId.rows[0]['tenant_group_id'];
		await knex('tenant_groups').where('tenant_group_id', '=', registeredGroupId).update({
			'name': 'registered-users',
			'display_name': 'Registered Users',
			'description': 'The Registered User Group for the root tenant',
			'default_for_new_user': true
		});
	}

	let publicGroupId = await knex.raw(`SELECT tenant_group_id FROM tenant_groups WHERE tenant_id = '${tenantId}' AND parent_tenant_group_id = '${registeredGroupId}';`);
	if(!publicGroupId.rows.length) {
		publicGroupId = await knex('tenant_groups').insert({
			'tenant_id': tenantId,
			'parent_tenant_group_id': registeredGroupId,
			'name': 'public',
			'display_name': 'Public',
			'description': 'The public, non-logged-in, Users'
		})
		.returning('tenant_group_id');

		publicGroupId = publicGroupId[0];
	}
	else {
		publicGroupId = publicGroupId.rows[0]['tenant_group_id'];
		await knex('tenant_groups').where('tenant_group_id', '=', publicGroupId).update({
			'name': 'public',
			'display_name': 'Public',
			'description': 'The public, non-logged-in, Users',
			'default_for_new_user': false
		});
	}

	// Step 7: Assign appropriate permissions for the standard groups
	await knex.raw(`INSERT INTO tenant_group_permissions (tenant_id, tenant_group_id, feature_id, feature_permission_id) SELECT '${tenantId}', '${adminGroupId}', module_id, feature_permission_id FROM feature_permissions WHERE name IN ('administrator', 'registered', 'public') ON CONFLICT DO NOTHING;`);
	await knex.raw(`INSERT INTO tenant_group_permissions (tenant_id, tenant_group_id, feature_id, feature_permission_id) SELECT '${tenantId}', '${registeredGroupId}', module_id, feature_permission_id FROM feature_permissions WHERE name IN ('registered', 'public') ON CONFLICT DO NOTHING;`);
	await knex.raw(`INSERT INTO tenant_group_permissions (tenant_id, tenant_group_id, feature_id, feature_permission_id) SELECT '${tenantId}', '${publicGroupId}', module_id, feature_permission_id FROM feature_permissions WHERE name IN ('public') ON CONFLICT DO NOTHING;`);

	// Step 8: Add the root user to the tenant's super-admin group
	await knex.raw(`INSERT INTO tenants_users (tenant_id, user_id, access_status, designation) VALUES('${tenantId}', '${userId}', 'authorized', 'Super Administrator') ON CONFLICT DO NOTHING;`);
	await knex.raw(`INSERT INTO tenants_users_groups (tenant_id, user_id, tenant_group_id) SELECT '${tenantId}', '${userId}', tenant_group_id FROM tenant_groups WHERE tenant_id = '${tenantId}' AND parent_tenant_group_id IS NULL ON CONFLICT DO NOTHING;`);

	// Step 9: Create a User representing all the non-logged-in visitors to the portal, assign the user to the default tenant,
	// add the public user to the public group
	let publicUserId = await knex.raw(`SELECT user_id FROM users WHERE email = 'public@plant.works'`);
	if(!publicUserId.rows.length) {
		publicUserId = await knex('users').insert({
			'user_id': 'ffffffff-ffff-4fff-ffff-ffffffffffff',
			'email': 'public@plant.works',
			'password': '',
			'first_name': 'Public',
			'last_name': 'Visitor',
			'nickname': 'public'
		})
		.returning('user_id');

		publicUserId = publicUserId[0];
	}
	else {
		publicUserId = publicUserId.rows[0]['user_id'];
	}

	await knex.raw(`INSERT INTO tenants_users (tenant_id, user_id, access_status, designation) VALUES('${tenantId}', '${publicUserId}', 'authorized', 'Visitor') ON CONFLICT DO NOTHING;`);

	await knex.raw(`DELETE FROM tenants_users_groups WHERE tenant_id = '${tenantId}' AND user_id = '${publicUserId}';`);
	await knex.raw(`INSERT INTO tenants_users_groups (tenant_id, user_id, tenant_group_id) SELECT '${tenantId}', '${publicUserId}', tenant_group_id FROM tenant_groups WHERE tenant_id = '${tenantId}' AND name = 'public' ON CONFLICT DO NOTHING;`);

	return null;
};
