import QueryBuilder from "./index";

const qb = new QueryBuilder()

qb
    .fullText().contains('test')
    .inParents('123')
    .fullText().contains('tes')
    .name().isEqualTo('something')
    .trashed().true()
    .starred().true()
    .sharedWithMe().true()
    .inReaders('a@b.com')
    .mimeType().isEqualTo(QueryBuilder.MimeType.GoogleDocs)
    // .not().name().contains('test')
    .inWriters('a@b.com')
    .createdTime().isEqualTo('2023-01-01')
    .visibility().isEqualTo(QueryBuilder.Visibility.AnyoneCanFind)
    // .not().mimeType().isEqualTo('hkhkhkj')
    .shortcut().isEqualTo('12344')

const query = qb.build();

console.log({ query });