# Install instructions

## Requirements:

- `nodejs` with `version > 18.0.0` (you can use nvm to manage your version: https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)
- The `pnpm` package manager (https://pnpm.io/installation). Used as an alternative de `npm`, `yarn`,...
- A `gpg/pgp` utility (https://www.gnupg.org/download/). Used to generate keys for `sops`
- A `sops` installation (), in order to encrypt/decrypt config files with secrets in the repository.

- `sops` install: Generally speacking, the bin utility only need to be in `path` to function. The bin are available here: https://github.com/getsops/sops/releases.
  - linux: https://gitlab.com/mmorg/ismene/-/blob/develop/_docs/carnets_dev/git-sops.md
  - mac: https://blog.gitguardian.com/a-comprehensive-guide-to-sops/
  - windows: @TODO: find a link
- Create your `GPG key` & share it for decrypting the config files
  - Create your key : https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/#create-a-gpg-key
  - List you keys and export the good one:

```
gpg --list-secret-keys
# identify the good _fingerprint_ (line under "sec")
gpg --export -a _fingerprint_ > mykey.asc.txt
```

- Share your public key as an `asc.txt` in this folder `_docs/pubKeys`

## Clone and install the repositories.

- There are 3 required repositories for this project:

  - the `ismene` one that contains the generic librairies to process and transform RDF data
  - the `jobsong` one that contains the specific application for one client
  -the `DS-MindMatcher` one that contains the design system of our institution

- The `jobsong` project depend on the `ismene` and `DS-MindMatcher`  throw pnpm `link:` package protocole. So this 3 projects shoud be installed side by side in a same folder (example `mmorg`) :

```
cd your/dev/folder
mkdir mmorg-jobsong
git clone git@gitlab.com:mmorg/ismene.git
git clone git@gitlab.com:mmorg/jobsong.git
git clone git@gitlab.com:mmorg/ds_mindmatcher.git

cd ismene
pnpm install

cd ../jobsong
pnpm install

cd ../ds_mindmatcher
pnpm install

```


## Decrypt the config file

- After your key added to the sops file, you can decrypt the config file for `ismene`
- There is a script to help decrypt the file in the good place:

```
cd jobsong/_ops
node devSetup.js
```

# Start development environment

- Actual branches to be on:

  - in `ismene`: branch `devonline` 
  - in `ds_mindmatcher`: branch `dev`
  - in `jobsong`: branch `profile-api-and-ui`

- In order to live develop in the 3 repositories, the `pure js lib` do not need anything, but `typescript libs` need to be live compiled in `ismene`
- On a 1st terminal tab, run

```
cd ismene
pnpm dev:dependency
```

- On a 3rd terminal tab, run :

```
cd ds_mindmatcher
pnpm run build
```


```
cd jobsong
pnpm dev:profile
```
- On a 2nd terminal tab, run :


- By any chance, you will have 3 local services that start:
  - Graphql: http://localhost:5020/
  - Admin-ui: http://localhost:3000
  - profile : loc

# Publish on dev instance

- There is a local nodejs script that wrap up all the steps for compiling & publishing all the services into an aggregated App (or server).
- This script is experimental and should be tested on different OS. The principles of this script are described here: https://gitlab.com/mmorg/jobsong/-/blob/9-create-the-app-aggregation-of-the-services/_ops/README.md

- During the course of this script there is 2 specific steps:
  - 1/ The publish `ismene` dependency one: it check if the ismene's dependencies should be published. For now the dependency's publishing is not scripted, so if you answer `yes` to this step you will see recommanded commands for publishing the deps. If you answer `no`, the deploy script continue
  - 2/ end2end local tests: there is 2 steps like that in the process : a) to test integrated services with the local nodejs, b) to test integrated services in Docker. Theses e2e steps are `stoppable processes` that can be ended with `ctrl+c`. After this stop, the deploy process continue.
