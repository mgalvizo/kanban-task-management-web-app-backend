// Takes an object and serializes it to JSON
import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// Enforces to be a class type
interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Code placed here will run before the request is handled

    return next.handle().pipe(
      map((data: any) => {
        // Code placed here wull run before the response is sent out
        return plainToInstance(this.dto, data, {
          // Only exposed the properties marked with the @Expose decorator
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
