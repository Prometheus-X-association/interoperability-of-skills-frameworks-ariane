# How to manage Secrets in Git. 

# Developer perspective

## install : 
* download: https://github.com/mozilla/sops/releases to `~/.local/bin`
```
cd ~/.local/bin/
chmod u+x sops-v3.7.3.linux.amd64
ln -s ./sops-v3.7.3.linux.amd64 sops
```

* add this line at the end of you `~/.bashrc` 
```
# sops edit with vscode
export EDITOR="code --wait"
# sops end
```
* reload with `source ~/.bashrc`

### configure a PGP key 
https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/#generating-a-gpg-key

## Add a new crypted secret in the repository 

* create the file with `sops filename.json` (.json or other supported filetype)
* edit content in editor

# Maintainer perspective 
## import other's key

Dave is the new developper
Alice is the maintainer

Dave: 
* export his key and git commit it to `jobsong/_docs/pubKeys`
```
gpg --list-secret-keys
# identify the good "_fingerprint_" (line under "sec") and replace it in this command:
gpg --export -a _fingerprint_ > mykey.asc
git add _docs/pubKeys/mykey.asc
```

* Dave send the key file (`mykey.asc`) to Alice
* on Alice computer:
```
gpg --import mykey.asc
# add the Dave's fingerprint into `.sops.yaml`
sops updatekeys dev_a.encrypted.env
```




# Link / Documentation : 
* comparisons: https://opensource.com/article/19/2/secrets-management-tools-git
* done by mozilla: https://github.com/mozilla/sops
* sops in CI : https://dev.to/stack-labs/manage-your-secrets-in-git-with-sops-gitlab-ci-2jnd
* sops tutorial: https://dev.to/stack-labs/manage-your-secrets-in-git-with-sops-g0a
* vscode plugin: https://marketplace.visualstudio.com/items?itemName=signageos.signageos-vscode-sops&ref=blog.gitguardian.com
* create a GPG key: https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/#create-a-gpg-key
