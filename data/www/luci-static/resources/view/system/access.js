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

	render: function(data) {

		var m, sc, s, o;

		m = new form.Map('access', _('Synchronisation'), _('User and group settings taken from within LuCI are automatically synchronised to the system passwd files. The upper section allows you to configure whether changes within system passwd files are synchronised back to the uci, which hashes are generated from user passwords. The lower section permits to configure further locations for storing copies of (selected) credentials.'));

		sc = m.section(form.NamedSection, 'access', _('Settings'));
		sc.anonymous = false;
		sc.addremove = false;

		o = sc.option(form.Value, 'hashmethod', _('Hash method for passwd'), _('New hashes are set upon updating the respective password.'));
		o.editable = true;
		o.rmempty = false;
		o.value('CRYPT', 'Insecure CRYPT');
		o.value('MD5', 'MD5');
		o.value('SHA256', 'SHA256');
		o.value('SHA512', 'SHA512');
		o.default = 'MD5';

		o = sc.option(form.Value, 'shell', _('Default shell'));
		o.optional = true;
		o.datatype = 'file';
		o.modalonly = true;
		o.default = '/bin/ash';

		o = sc.option(form.Flag, 'smb', _('Synchronise uci to smbpasswd'), _('Maintains system smbpasswd and accordingly generates (insecure) hashes'));
		o.editable = true;
		o.rmempty = false;
		o.default = 0;

		o = sc.option(form.Flag, 'ht', _('Synchronise uci to htpasswd'), _('Maintains system htpasswd and accordingly generates hashes.'));
		o.editable = true;
		o.rmempty = false;
		o.default = 0;

		o = sc.option(form.Value, 'hthashmethod', _('Hash method for htpasswd'));
		o.editable = true;
		o.rmempty = false;
		o.value('APR1', 'Apache MD5 (APR1)');
		o.value('SHA256', 'SHA256');
		o.value('SHA512', 'SHA512');
		o.default = 'APR1';
		o.depends({'ht': '1'});

		o = sc.option(form.Flag, 'external', _('Synchronise external databases'), _('Monitors system passwd for changes and exports credentials by reference to the respective entry in the section below.'));
		o.editable = true;
		o.rmempty = false;
		o.default = 0;
		
		o = sc.option(form.Flag, 'verbose', _('Verbose'), _('Verbose synchronisation to system log'));
		o.editable = true;
		o.rmempty = false;
		o.default = 0;



		s = m.section(form.GridSection, 'sync', _('Locations'), _('Hashes are generated on password change. Only valid users and groups are exported. Linux passwd format exports passwd, shadow and group files to export path. Smbpasswd and htpasswd formats namingly write to export path as file. If a group filter is defined, only group members are exported.'));
		s.anonymous = true;
		s.addremove = true;		

			s.modaltitle = function(section_id) {
				return _('LuCI ACL Synchronisation') + ' » ' + (uci.get('rpcd', section_id, 'name') || _('New profile'));
			};
			 
			o = s.option(form.Value, 'name', _('Label'));
			o.editable = false;
			o.datatype = 'string';

			o = s.option(form.Value, 'mode', _('Format'), _(''));
			o.editable = false;
			o.datatype = 'string';
			o.value('passwd', 'Linux passwd');
			o.value('smbpasswd', 'Samba passwd');
			o.value('htpasswd', 'Hypertext passwd');
			o.value('htpasswdgrp', 'Hypertext passwd with groups');
			o.default = 'passwd';

			o = s.option(form.Value, 'path', _('Export Path'));
			o.editable = false;
			o.datatype = 'path';

			o = s.option(form.Value, 'group', _('Filter Group'));
			o.editable = false;
			o.optional = true;
			o.datatype = 'uciname';

			o = s.option(form.Value, 'home', _('Override Homes'));
			o.optional = true;
			o.datatype = 'path';
			o.modalonly = true;
			o.depends({'mode': 'passwd'});

			o = s.option(form.Value, 'shell', _('Override Shells'));
			o.optional = true;
			o.datatype = 'file';
			o.modalonly = true;
			o.depends({'mode': 'passwd'});

			o = s.option(form.Value, 'postexec', _('Post Update Command'));
			o.optional = true;
			o.datatype = 'string';
			o.modalonly = true;
		
		return m.render();
	}
});
