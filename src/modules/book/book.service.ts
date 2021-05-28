import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { status } from '../../shared/entity-status.num';
import { UserRepository } from '../user/user.repository';
import { BookRepository } from './book.repository';
import { ReadBookDto } from './dtos';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async get(bookId: number): Promise<ReadBookDto> {
    if (!bookId) {
      throw new BadRequestException('userId must be sent');
    }

    const book = await this._userRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!book) {
      throw new NotFoundException('book does not exist');
    }

    return plainToClass(ReadBookDto, book);
  }
}
