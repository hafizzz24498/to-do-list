import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  avatarUrl: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
