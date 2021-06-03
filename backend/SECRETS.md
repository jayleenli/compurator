# Handling sensitive information

If you need to handle sensitive information (login credentials, secret keys, etc.) in your code,
**DO NOT embed that information into the code itself**.


## Encoding secrets with AWS Systems Manager and Serverless Framework

1. Login to the AWS web console

2. Navigate to the "Systems Manager" service

3. Click on "Parameter Store" in the sidebar

4. Click the "Create parameter" button

You will be presented with a screen which will ask you for details about the secret you want to store.

For the name, provide a descriptive name representing what kind of secret you are storing. It's also a good idea to prefix the
parameter name with the name of the project the parameter is associated with (e.g. `compare-database-password`).

Keep the tier set to "Standard" and make sure the type of the parameter is "String".

For the value, paste the value of the secret you want to store.

### Accessing the secret from within your code

In order to access the secret, you must configure your function to expose the parameter you created as an environment
variable.

```yaml
function:
  myFunction:
    handler: myFunction.handler
    environment:
      <ENVIRONMENT VARIABLE NAME>: ${ssm:<PARAMETER NAME>}
```

For example:

```yaml
function:
  myFunction:
    handler: myFunction.handler
    environment:
      COMPARE_DATABASE_PASSWORD: ${ssm:compare-database-password}
```

Instead of defining the environment variable on a single lambda, you may also make it available to all lambdas:

```yaml
provider:
  name: aws
  runtime: python3.7
  environment:
    COMPARE_DATABASE_PASSWORD: ${ssm:compare-database-password}
```    

You can then access the parameter like you would with any environment variable in Python.

```python
import os

os.environ["COMPARE_DATABASE_PASSWORD"]
```


