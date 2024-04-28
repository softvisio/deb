# Apt repository

### Install repository

```sh
/bin/bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/apt/main/setup.sh) install
```

### Remove repository

```sh
/bin/bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/apt/main/setup.sh) remove
```

### Manually install GPG key

Install public key

```sh
curl -fsSL https://raw.githubusercontent.com/softvisio/apt/main/dists/key.gpg | gpg --dearmor -o /usr/share/keyrings/softvisio-archive-keyring.gpg
```

or install keyring

```sh
curl -fsSLo /usr/share/keyrings/softvisio-archive-keyring.gpg https://raw.githubusercontent.com/softvisio/apt/main/dists/keyring.gpg
```

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
