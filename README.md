# REST Product-Service
```
Construye la imagen Docker:

```
docker build -t product-service-v1 .
```
Ejecuta el contenedor Docker:
```
docker run -d --name product-service -p 3000:3000 --env-file .env product-service
```

## Uso de la API

1. Test Health

URL: http://192.168.10.26:3000/api/health
Método: get
Body: JSON (raw)


docker build . -t 192.168.10.26:32000/product-service:latest
docker tag product-service 192.168.10.26:32000/product-service:
docker push 192.168.10.26:32000/product-service:latest

docker build . -t jpaezr/product-service-v1:latest
docker tag product-service-v1 jpaezr/product-service-v1
docker push jpaezr/product-service-v1:latest

docker build . -t acrlitethinking001.azurecr.io:latest
docker tag product-service-v1 acrlitethinking001.azurecr.io/product-service-v1
docker push acrlitethinking001.azurecr.io/product-service-v1:latest

http://192.168.10.26:32000/v2/_catalog




(Get-ECRLoginCommand).Password | docker login --username AWS --password-stdin 499275931604.dkr.ecr.us-east-2.amazonaws.com
docker build -t lts446401/product-service .
docker tag lts446401/product-service:latest 499275931604.dkr.ecr.us-east-2.amazonaws.com/lts446401/product-service:latest
docker push 499275931604.dkr.ecr.us-east-2.amazonaws.com/lts446401/product-service:latest