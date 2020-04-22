# HappyNanny
Cloud computing term project

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Install docker, *for more information visit https://docs.docker.com/get-docker/.*
* Register AWS, and have your own AWS account.
* Add IAM user to enables an access key ID and secret access key, then attach `AmazonSNSFullAccess` to your IAM user.
* Create file named `.env` in this root path, place this code and replace your credential
```
AWS_ACCESS_KEY_ID=<YOUR_AWS_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET_ACCESS_KEY>
```

### Installing

In this project, we already separate docker config for both development and production environment

To build and run predefined development

```
docker-compose -f docker-compose.yml -f development.yml up --build
```

From this, you will get the application runs on http://localhost/ via reverse proxy hosting
* to access to frontend: http://localhost/ or use directly access as http://localhost:9900
* to access to backend: http://localhost/api or use directly access as http://localhost:8080


## Deployment

You may have to pass all the Prerequisites in the Get Started section before you start the deployment

### Extends Prerequisites

* In aws console, create ECS cluster named `happynanny-cluster`
* Install aws-cli, *for more information visit https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html.*
* Create another IAM user for your aws-cli. For the simpliest way you can attach `AdministratorAccess` for aws-cli user.
* Configure your credential with `aws-cli` in your local machine, for more information visit https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html.

### Deploying

In AWS console, direct to `Identity and Access Management` to get your own AWS ID and place your ID in `deploy.sh` in the root directory (You also able to change the region as you prefer; In this example, we use Singapore region)
```
<PLACE_YOUR_ID_HERE>.dkr.ecr.ap-southeast-1.amazonaws.com
```

Deploy each service using deploy.sh:
```
./deploy.sh <service>
```

**Note that:** 
* The service name is defined by `docker-compose.yml`. If there is no change there, the services are `backend`, `frontend`, and `reverseproxy`.

* You may get an **error telling you that you can't update the service**. This may happen because you don't have the selected service in `happynanny-cluster` cluster yet. 
Before the error shown, we already push docker image to you ECR. So you can create `task definition` and `service` in your cluster. You can set the service name to `happynanny-service`, with this name you won't have to change service name in `deploy.sh`

* **If you use fargate to deploy**, deploying reverseproxy, you have to change `nginx.conf` in reverseproxy directory by changing the upstream URL of both frontend and backend that use docker service url to localhost.
```
    upstream backend {
        server localhost:9900;
    }

    upstream frontend-web {
        server localhost:8080;
    }
```
***Keep in mind:** Switching back to run in your local machine, you have to change it back to use docker service url.*


## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds


## Authors

* **Sirawit Tantiphuwanart** - [5930486521-ST](https://github.com/5930486521-ST/)


