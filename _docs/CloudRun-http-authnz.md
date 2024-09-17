
# private Runner, private service 2 service: 

* https://cloud.google.com/run/docs/triggering/https-request

# public deploy or assign: 

* https://cloud.google.com/run/docs/authenticating/public

Command to make public a deployed service: 
```
gcloud run services add-iam-policy-binding [SERVICE_NAME] --member="allUsers" --role="roles/run.invoker"
```
ex: `gcloud run services add-iam-policy-binding interfaceadmin --member="allUsers" --role="roles/run.invoker"`

