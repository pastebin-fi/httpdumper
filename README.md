# HTTPDumper
Easily inspect incoming HTTP and HTTPS requests.

# Installation

```sh
npm install
npm start
```

# Configuring

## Docker

```sh
docker run -dp 8888:8080 --name=httpdumper pastin/httpdumper
```
## Behind reverse proxy

Trust proxies for example:

Standalone
```sh
export TRUST_PROXIES="loopback, 172.17.0.1"
```

Docker
```
docker run -dp 8888:8080 -e TRUST_PROXIES="loopback" --name=httpdumper pastin/httpdumper
```

Nginx configuration:

```nginx
server 
        server_name http.pastebin.fi;

        location / {
                proxy_set_header   X-Forwarded-For $remote_addr;
                proxy_set_header   Host $http_host;
                proxy_pass http://127.0.0.1:8080;
        }

}

```


