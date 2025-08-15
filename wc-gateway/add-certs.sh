#!/bin/sh

openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr -subj "/C=RU/ST=Moscow/L=Moscow/O=MyApp/CN=localhost"
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

