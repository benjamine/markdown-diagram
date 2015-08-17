Services
========

Web Client
---

- [Static Files CDN](#static-files-cdn)
- [Core Web Services](#core-web-services)
- *encrypts cards using* [Payment Gateway](#payment-gateway)
- [Analytics Service](#analytics-service)

Static Files CDN
---

Core Web Services
---

- [Core DB](#core-db)
- [Payment Gateway](#payment-gateway)
- [Email Service Provider](#email-service-provider)
- [Analytics Service](#analytics-service)
- [Logging Service](#logging-service)

Email Service Provider
---

Analytics Service
---

- [Core DB](#core-db)

Logging Service
---

- [Core DB](#core-db)

Core DB
---

Payment Gateway
---

``` js
   payments.post(cardInfo).then(function(result) {
     console.log('TOKEN: ', result.token);
   }).catch(function(err) {
     console.error(err.message);
   });
```
