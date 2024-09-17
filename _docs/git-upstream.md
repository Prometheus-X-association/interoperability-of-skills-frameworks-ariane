# Update PTX remote 
* branch `main` is GitLab (`Project-A`), branch `upmain` is GitHub (`Project-B`)
* terminal in `Project-A` 
```
git pull main 
# do sync 
git checkout upmain
git merge main 
git push 
# return on main
git checkout main 
```

# First time set-up :

* `Project-A` is the source GitLab repository with the code
* `Project-B` is the GitHub repository that will be synced with code from `Project-A`

* if `Project-B` is empty, create a test file on the main branch. Create a default-branch named `upmain`. 

* On `Project-A`: 
```
# add the `Project-B` remote as an `upstream`. Example:
git remote add upstream git@github.com:Prometheus-X-association/interoperability-of-skills-frameworks-ariane.git

# fetch the upstream locally & create the local branch `upmain`. This branch will upstream to `Project-B` repository
git fetch upstream
git switch -c upmain upstream/upmain

# do the first-time synch from `Project-A` to `Project-B`: 
## The first merge require option `--allow-unrelated-histories` 
git checkout upmain
git merge main --allow-unrelated-histories
git push
# return on `Project-A` main branch
git checkout main 
```

## Update `Project-A` repo with changes from `Project-B` 
