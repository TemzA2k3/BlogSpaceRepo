import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Pipe для преобразования JSON-строки в массив
 * Используется для полей, которые приходят из FormData
 */
@Injectable()
export class ParseJsonArrayPipe implements PipeTransform {
  constructor(private readonly optional: boolean = false) {}

  transform(value: any) {
    if (!value) {
      if (this.optional) return undefined;
      throw new BadRequestException('Value is required');
    }

    if (Array.isArray(value)) return value;

    try {
      const parsed = JSON.parse(value);

      if (!Array.isArray(parsed)) {
        throw new BadRequestException('Value must be an array');
      }

      return parsed;
    } catch (err) {
      throw new BadRequestException('Invalid JSON array format');
    }
  }
}
