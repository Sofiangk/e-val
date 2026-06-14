import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

/**
 * Validates incoming payloads against a Zod schema from @e-val/shared.
 * The same schemas drive client-side form validation, so a request that
 * passes in the browser passes here too.
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || '_';
        (errors[key] ??= []).push(issue.message);
      }
      throw new BadRequestException({ message: 'Validation failed', errors });
    }
    return result.data;
  }
}
