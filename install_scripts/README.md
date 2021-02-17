# How to deploy mAtches

Before running the script, update nginx configuration (if applicable) by adding the below to the server configurations:

```
location /mAtches {
  proxy_pass http://127.0.01:5001;
}
```

Install jmespath with `pip install jmespath`

Run the script:

`ansible-playbook playbook.yml`

