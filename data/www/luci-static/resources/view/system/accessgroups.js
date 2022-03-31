'use strict';
'require view';
'require dom';
'require fs';
'require ui';
'require uci';
'require form';
'require tools.widgets as widgets';

/* ******************************************************************************* */

return view.extend({

	handleSave: function(ev) {

		var tasks = [];

		document.getElementById('maincontent')
			.querySelectorAll('.cbi-map').forEach(function(map) {
				tasks.push(DOM.callClassMethod(map, 'save'));
			});

		return Promise.all(tasks).then(() => {
			ui.changes.apply();
		});;
		
	},
	
	render: function(data) {
		/* ui.addNotification(null, E('p', [
			_('The LuCI ACL management is in an experimental stage! It does not yet work reliably with all applications')
		]), 'warning'); */

		var m, s, o;

		m = new form.Map('rpcd', _('Groups'), _('The table at hand allows you to manage groups within the system passwd files.'));

		s = m.section(form.GridSection, 'group');
		s.anonymous = true;
		s.addremove = true;

		s.modaltitle = function(section_id) {
			return _('LuCI Groups') + ' » ' + (uci.get('rpcd', section_id, 'name') || _('New group'));
		};

		o = s.option(form.Value, 'name', _('Group name'));
		o.editable = false;
		o.optional = false;
		o.write = function(section_id, value) {
			var currentvalue=uci.get('rpcd', section_id, 'name');
			if (currentvalue && currentvalue.length) { return; }
			uci.set('rpcd', section_id, 'name', value);
		}
		
		o = s.option(form.Value, 'description', _('Description'));
		o.rmempty = false;
		o.editable = false;
		o.optional = true;

		return m.render();
	}
});
