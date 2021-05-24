#!/bin/bash
docker run -it --rm  --name certbot -v $(pwd)/etc/ssl/etc:/etc/letsencrypt -v $(pwd)/etc/ssl/var:/var/lib/letsencrypt certbot/certbot renew 
#        --manual-public-ip-logging-ok \
#        --eff-email \
#        --agree-tos \
#        -m admin@kuuwang.com \
#        -d api.kuuwang.com \
#        --manual \
#        --preferred-challenges dns \
#        --server https://acme-v02.api.letsencrypt.org/directory
