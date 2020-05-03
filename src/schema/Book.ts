/**
 * Book class for graphql schema.
 */
import {
    Arg,
    Field,
    // FieldResolver,
    // Mutation,
    ID,
    ObjectType,
    Query,
    Resolver
    // ResolverInterface,
    // Root
} from 'type-graphql';

@ObjectType({ description: 'Class representing book entity',})
export class Book {
    // Book id.
    @Field(_type => ID)
    id: string;

    // Book name.
    @Field(_type => String, { nullable: true, })
    name: string;

    // Book genre.
    @Field(_type => String, { nullable: true, })
    genre: string;
}

@Resolver(_of => Book)
export class BookResolver {
    private readonly items: Array<Book> = [{
        id: '1',
        name: 'Book 1',
        genre: 'Novel',
    },
    {
        id: '2',
        name: 'Book 2',
        genre: 'Romance',
    },
    {
        id: '3',
        name: 'Book 3',
        genre: 'Science Fiction',
    }];

    @Query(_returns => Book, { nullable: true, })
    async book(@Arg('id', _type => ID) id: string): Promise<Book | undefined> {
        const foundBook = this.items.find(book => book.id === id);

        return Promise.resolve(foundBook);
    }
}