import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ResponseLikeDto {
  @Expose()
  @IsString()
  idUser: string;

  @Expose()
  @IsString()
  idProduct: string;
}
