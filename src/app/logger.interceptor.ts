import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("Solicitud en camino: "+ req.url)
  return next(req);
};
