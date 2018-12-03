'use strict';

exports.seed = async function(knex) {
	let parentId = await knex.raw(`SELECT module_id FROM modules WHERE name = ? AND type = 'server' AND parent_module_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['module_id'];

	let componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'component'`, [parentId, 'Session']);
	if(!componentId.rows.length) {
		await knex('modules').insert({
			'parent_module_id': parentId,
			'type': 'component',
			'deploy': 'default',
			'name': 'Session',
			'display_name': 'Session API',
			'description': 'The Plant.Works Web Application Session API - exposes login/logout and similar operations',
			'metadata': {
				'author': 'Plant.Works',
				'version': '3.0.1',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'component'`, [parentId, 'Masterdata']);
	if(!componentId.rows.length) {
		await knex('modules').insert({
			'parent_module_id': parentId,
			'type': 'component',
			'deploy': 'default',
			'name': 'Masterdata',
			'display_name': 'Master Data API',
			'description': 'The Plant.Works Web Application Masterdata API - exposes master data',
			'metadata': {
				'author': 'Plant.Works',
				'version': '3.0.1',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}
};
