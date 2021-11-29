# Debiam repository

### Export / import private key

Export:

```sh
gpg --export-secret-keys zdm@softvisio.net > private.key
```

Import:

```sh
gpg --import private.key
```

### Sign

```sh
gpg --clearsign --yes -u zdm@softvisio.net -o InRelease Release
```

### Import public key

```sh
curl -fsSL https://raw.githubusercontent.com/softvisio/deb/main/dists/key.gpg | gpg --dearmor -o /usr/share/keyrings/softvisio-archive-keyring.gpg
```

### Import keyring

```sh
curl -fsSLo /usr/share/keyrings/softvisio-archive-keyring.gpg https://raw.githubusercontent.com/softvisio/deb/main/dists/keyring.gpg
```

### Install repository

```sh
cat << EOF > /etc/apt/sources.list.d/softvisio.list
# deb [trusted=yes] https://raw.githubusercontent.com/softvisio/deb/main/ $(. /etc/os-release && echo $VERSION_CODENAME) main
deb [signed-by=/usr/share/keyrings/softvisio-archive-keyring.gpg] https://raw.githubusercontent.com/softvisio/deb/main/ $(. /etc/os-release && echo $VERSION_CODENAME) main
EOF
```
