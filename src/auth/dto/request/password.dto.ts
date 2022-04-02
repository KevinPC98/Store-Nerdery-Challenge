import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ChangePasswordDto {
  @Expose()
  readonly newPassword: string;
}
