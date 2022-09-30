使用时，需要先在 `map_origin.conf` 中添加域名白名单。然后在域名的server配置中include对应的配置


添加白名单
```
map $http_origin $cors_origin {
  default "";
  ~^https?://(.*\.)?domain1\.com(:\d+)?$ $http_origin;
  ~^https?://(.*\.)?domain2\.com(:\d+)?$ $http_origin;
}
```

然后在需要cors的域名配置中include该配置
```
location / {
  # 修改成真实的路径
  include /etc/nginx/cors/header.conf;
  # ...
}
```