# luci-app-access
The application at hand adds a new menu called "Access" allowing to manage users and groups in the context of both system as well as external passwd, smbpasswd and htpasswd databases. The name-giving "Users" menu was derived from the official luci-app-acl and now integrates with the "Groups" menu. Besides the configuration of password hashing algorithms, the "Synchronisation" menu allows to specify the locations of external credential databases so that the applications using them do not require an internal management frontend.

## Initial Synchronisation
In the absence of state files, the system's passwd is first merged to the uci rpcd and then vice-versa.

## Recurrent Synchronisation
Changes to both uci rpcd as well as system passwd files are monitored in order to perform according merges. By means of state files, deletions are propagated from uci to system.

## Manual Synchronisation
Merges can be triggered by calling

```accessio export``` or ```accessio export verbose```

as well as

```accessio import``` or ```accessio import verbose```

whereby messages can be read using ```logread```.

## Status
Please note: This application has been subjected to non-exhaustive internal tests and is therefore **not** cleared for productive use.

In avoidance of getting too invasive, there is no locking mechanism to prevent updates of either uci rpcd or system during merges. This does not affect situations where only one administrator is active at a time and possible inconsistencies _should_ be resolved during the next merge.

## Manual Updates
```opkg install https://github.com/resmh/luci-app-cryptmanage/releases/download/latest/luci-app-access.ipk```

## Automatic Updates
Add repository, add repository key, update package lists and install:

```
echo 'src luci_app_access https://github.com/resmh/luci-app-access/releases/download/latest' >> /etc/opkg/customfeeds.conf; \
wget -O /tmp/luci_app_access https://github.com/resmh/luci-app-access/releases/download/latest/luci_app_access.signify.pub; \
opkg-key add /tmp/luci_app_access; \
rm /tmp/luci_app_access; \
opkg update; \
opkg install luci-app-access
```


## UCI Fields
```
access
	access
		hashmethod
		shell
		smb
		ht
		hthashmethod
		external
		verbose

	sync
		name
		mode
		path
		group
		home
		shell
		postexec
	
rpcd
	login
		username
		userid
		enabled
		interactive
		passwdhash
		smbpasswdhash
		htpasswdhash
		groups

	group
		name
		id
```

## Local SMB Server Example
- _Within the "Synchronisation" menu, enable uci to smbpasswd synchronisation once. Reset the respective user passwords to generate the required hashes._
- Within the "Synchronisation" menu, select "Add"
- Choose a label
- Select format "Samba"
- Specify "/etc/samba/smbpasswd" as export path
- Optionally restrict users to members of an existing group
- Specify "/etc/init.d/samba4 restart" as post update command

## Local Radicale Docker Example
- _Within the "Synchronisation" menu, enable uci to htpasswd synchronisation once. Reset the respective user passwords to generate the required hashes._
- Within the "Synchronisation" menu, select "Add"
- Choose a label
- Select format "Htpasswd"
- Specify the export path of your docker shared folder
- Optionally restrict users to members of an existing group
- Specify "docker restart radicale" (adjust name) as post update command
