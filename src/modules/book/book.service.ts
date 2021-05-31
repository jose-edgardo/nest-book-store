import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { RoleType } from '../../shared/roletype.enum';
import { status } from '../../shared/entity-status.num';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';

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

    const book: Book = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!book) {
      throw new NotFoundException('book does not exist');
    }

    return plainToClass(ReadBookDto, book);
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.find({
      where: { status: status.ACTIVE },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('id rust be sent');
    }

    const books: Book[] = await this._bookRepository
      .createQueryBuilder('books')
      .leftJoinAndSelect('books.authors', 'users')
      .where('books.status = :status', { status: status.ACTIVE })
      .andWhere('users.id = :id ', { id: authorId })
      .getMany();

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExists = await this._userRepository.findOne(authorId, {
        where: { status: status.ACTIVE },
      });

      if (!authorExists) {
        throw new NotFoundException(
          `There's not an author with this Id: ${authors}`,
        );
      }

      const isAuthor = authorExists.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UnauthorizedException(
          `This user ${authorId} is not an author`,
        );
      }

      authors.push(authorExists);
    }

    const saveBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });

    return plainToClass(ReadBookDto, saveBook);
  }

  async createByAuthor(
    book: Partial<CreateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const author = await this._userRepository.findOne(authorId, {
      where: {
        status: status.ACTIVE,
      },
    });

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.ADMINISTRATOR,
    );

    if (!isAuthor) {
      throw new UnauthorizedException(`This user ${authorId} is not an author`);
    }

    const savedBook = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });

    return plainToClass(ReadBookDto, savedBook);
  }

  async update(
    bookId: number,
    book: Partial<UpdateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: {
        status: status.ACTIVE,
      },
    });

    if (!bookExists) {
      throw new NotFoundException('This book does not exists');
    }

    const isOwnBook = bookExists.authors.some(
      (author: User) => author.id === authorId,
    );

    if (!isOwnBook) {
      throw new UnauthorizedException(`This user isn't the book's author`);
    }

    const updateBook = await this._bookRepository.update(bookId, book);

    return plainToClass(ReadBookDto, updateBook);
  }

  async delete(bookId: number): Promise<void> {
    const bookExists = this._bookRepository.findOne(bookId, {
      where: {
        status: status.ACTIVE,
      },
    });

    if (!bookExists) {
      throw new NotFoundException('This book does not exists');
    }

    await this._bookRepository.update(bookId, { status: status.INACTIVE });
  }
}
