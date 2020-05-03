/**
 * Author class for graphql schema.
 */
import {
    Arg,
    Field,
    // FieldResolver,
    // Mutation,
    ID,
    Int,
    ObjectType,
    Query,
    Resolver
    // ResolverInterface,
    // Root
} from 'type-graphql';

@ObjectType({ description: 'Class representing author entity',})
export class Author {
    // Author id.
    @Field(_type => ID)
    id: string;

    // Author name.
    @Field(_type => String, { nullable: true, })
    name: string;

    // Author genre.
    @Field(_type => Int, { nullable: true, })
    age: number;
}

@Resolver(_of => Author)
export class AuthorResolver {
    private readonly items: Array<Author> = [{
        id: '1',
        name: 'Author 1',
        age: 32,
    },
    {
        id: '2',
        name: 'Author 2',
        age: 77,
    },
    {
        id: '3',
        name: 'Author 3',
        age: 55,
    }];

    @Query(_returns => Author, { nullable: true, })
    async author(@Arg('id', _type => ID) id: string): Promise<Author | undefined> {
        const foundAuthor = this.items.find(author => author.id === id);

        return Promise.resolve(foundAuthor);
    }
}