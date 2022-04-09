import { ObjectType } from '@nestjs/graphql';
import { ListProductsPaginationDto } from '../dto/response/list-products-pagination.dto';

@ObjectType()
export class ListProductsPagination extends ListProductsPaginationDto {}
