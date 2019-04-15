'use strict';

exports.seed = async function(knex) {
	let parentId = await knex.raw(`SELECT module_id FROM modules WHERE name = ? AND module_type = 'server' AND parent_module_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['module_id'];

	let componentId = await knex.raw(`SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ? AND module_type = 'middleware'`, [parentId, 'Session']);
	if(componentId.rows.length)
		return null;

	await knex('modules').insert({
		'parent_module_id': parentId,
		'module_type': 'middleware',
		'deploy': 'default',
		'name': 'Session',
		'metadata': {
			'author': 'Plant.Works',
			'version': '2.4.3',
			'website': 'https://plant.works',
			'demo': 'https://plant.works',
			'documentation': 'https://plant.works'
		}
	});
};
