# Apt repository

### Install repository

```shell
/bin/bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/apt/main/setup.sh) install
```

### Remove repository

```shell
/bin/bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/apt/main/setup.sh) remove
```

### Manually install GPG key

Importl public key

```shell
curl -fsSL https://raw.githubusercontent.com/softvisio/apt/main/dists/public-key.gpg | gpg --dearmor -o /usr/share/keyrings/softvisio-archive-keyring.gpg
```

### Export / import private key

Export:

```shell
gpg --export-secret-keys apt@softvisio.net > private.key
```

Export public key:

```shell
gpg --armor --export apt@softvisio.net --output public-key.gpg
```

Import:

```shell
gpg --import private.key
```

### Sign

```shell
gpg --clearsign --yes -u apt@softvisio.net -o InRelease Release
```
