import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { ListProductsPaginationDto } from '../dto/response/list-products-pagination.dto';
import { Product } from './product.model';

@ObjectType()
export class ListProductsPagination extends ListProductsPaginationDto {}
