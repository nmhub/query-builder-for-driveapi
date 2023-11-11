class TermQuery {
  protected readonly queries: string[];
  protected readonly lastTerm: string;

  constructor(query: QueryBuilder) {
    this.queries = query.queries;
    this.lastTerm = query.lastTerm;
  }

  protected addTermQuery(operator: string, value: string): QueryBuilder {
    const query = value ? `${this.lastTerm} ${operator} '${value.replace('\'', '\\\'')}'` : operator;
    this.queries.push(query);
    return new QueryBuilder(this);
  }
}

// Similar query classes for MimeTypeQuery, ModifiedTimeQuery, CreatedTimeQuery, etc.

class VisibilityQuery extends TermQuery {
  isEqualTo(value: QueryBuilder.Visibility): QueryBuilder {
    return this.addTermQuery('visibility =', value);
  }

  isNotEqualTo(value: QueryBuilder.Visibility): QueryBuilder {
    return this.addTermQuery('visibility =', value);
  }
}

// Query classes for each term
class NameQuery extends TermQuery {
  isEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('name =', value);
  }

  isNotEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('name !=', value);
  }

  contains(value: string): QueryBuilder {
    return this.addTermQuery('name contains', value);
  }
}

class FullTextQuery extends TermQuery {
  contains(value: string): QueryBuilder {
    return this.addTermQuery('fullText contains', value);
  }
}

// Define other term-specific query classes here...

class TrashedQuery extends TermQuery {
  true(): QueryBuilder {
    return this.addTermQuery('trashed = true', '');
  }

  false(): QueryBuilder {
    return this.addTermQuery('trashed = false', '');
  }
}

class StarredQuery extends TermQuery {
  true(): QueryBuilder {
    return this.addTermQuery('starred = true', '');
  }

  false(): QueryBuilder {
    return this.addTermQuery('trashed =true', '');
  }
}

class MimeTypeQuery extends TermQuery {
  /**
     * @see https://developers.google.com/drive/api/guides/mime-types
     * @param value Mimetype e.g. application/vnd.google-apps.folder
     * @returns
     */
  isEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('mimeType =', value);
  }

  /**
     * @param value Mimetype e.g. application/vnd.google-apps.folder
     * @see https://developers.google.com/drive/api/guides/mime-types
     * @returns
     */
  isNotEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('mimeType !=', value);
  }

  /**
     * @see https://developers.google.com/drive/api/guides/mime-types
     * @param value Mimetype
     * @returns
     */
  contains(value: string): QueryBuilder {
    return this.addTermQuery('mimeType contains', value);
  }
}

class ModifiedTimeQuery extends TermQuery {
  isEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('=', value);
  }

  isNotEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('!=', value);
  }

  isLessThan(value: string): QueryBuilder {
    return this.addTermQuery('<', value);
  }

  isLessThanOrEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('<=', value);
  }

  isGreaterThanOrEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('>=', value);
  }

  isGreaterThan(value: string): QueryBuilder {
    return this.addTermQuery('>', value);
  }
}

class CreatedTimeQuery extends TermQuery {
  isEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('createdTime =', value);
  }

  isNotEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('createdTime !=', value);
  }

  isLessThan(value: string): QueryBuilder {
    return this.addTermQuery('createdTime <', value);
  }

  isLessThanOrEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('createdTime <=', value);
  }

  isGreaterThanOrEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('createdTime >=', value);
  }

  isGreaterThan(value: string): QueryBuilder {
    return this.addTermQuery('createdTime >', value);
  }
}

class SharedWithMeQuery extends TermQuery {
  true(): QueryBuilder {
    return this.addTermQuery('sharedWithMe =true', '');
  }

  false(): QueryBuilder {
    return this.addTermQuery('sharedWithMe =true', '');
  }
}

class PropertiesQuery extends TermQuery {
  contains(property: string): QueryBuilder {
    return this.addTermQuery('properties has', property);
  }
}

class AppPropertiesQuery extends TermQuery {
  contains(property: string): QueryBuilder {
    return this.addTermQuery('appProperties has', property);
  }
}

class ShortcutQuery extends TermQuery {
  /**
     * @see https://developers.google.com/drive/api/guides/mime-types
     * @param value Mimetype e.g. application/vnd.google-apps.folder
     * @returns
     */
  isEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('shortcutDetails.targetId =', value);
  }

  /**
     * @param value Mimetype e.g. application/vnd.google-apps.folder
     * @see https://developers.google.com/drive/api/guides/mime-types
     * @returns
     */
  isNotEqualTo(value: string): QueryBuilder {
    return this.addTermQuery('shortcutDetails.targetId !=', value);
  }
}

class QueryBuilder {
  readonly queries: string[] = [];
  readonly lastTerm: string;
  readonly negateNextTerm: boolean;

  constructor(query?: QueryBuilder) {
    this.queries = query ? query.queries : [];
    this.lastTerm = query ? query?.lastTerm : '';
    this.negateNextTerm = query ? query.negateNextTerm : false;
  }

  inParents(folderId: string): QueryBuilder {
    this.queries.push(`'${folderId}' in parents`);
    return new QueryBuilder(this);
  }

  name(): NameQuery {
    return new NameQuery(this);
  }

  fullText(): FullTextQuery {
    return new FullTextQuery(this);
  }

  mimeType(): MimeTypeQuery {
    return new MimeTypeQuery(this);
  }

  modifiedTime(): ModifiedTimeQuery {
    return new ModifiedTimeQuery(this);
  }

  createdTime(): CreatedTimeQuery {
    return new CreatedTimeQuery(this);
  }

  trashed(): TrashedQuery {
    return new TrashedQuery(this);
  }

  starred(): StarredQuery {
    return new StarredQuery(this);
  }

  inOwners(userEmail: string): QueryBuilder {
    this.queries.push(`'${userEmail}' in owners`);
    return new QueryBuilder(this);
  }

  inWriters(userEmail: string): QueryBuilder {
    this.queries.push(`'${userEmail}' in writers`);
    return new QueryBuilder(this);
  }

  inReaders(userEmail: string): QueryBuilder {
    this.queries.push(`'${userEmail}' in readers`);
    return new QueryBuilder(this);
  }

  sharedWithMe(): SharedWithMeQuery {
    return new SharedWithMeQuery(this);
  }

  properties(): PropertiesQuery {
    return new PropertiesQuery(this);
  }

  appProperties(): AppPropertiesQuery {
    return new AppPropertiesQuery(this);
  }

  visibility(): VisibilityQuery {
    return new VisibilityQuery(this);
  }

  shortcut(): ShortcutQuery {
    return new ShortcutQuery(this);
  }

  build(): string {
    return this.queries.join(' and ');
  }
}

namespace QueryBuilder {
  export enum MimeType {
    Audio = 'application/vnd.google-apps.audio',
    GoogleDocs = 'application/vnd.google-apps.document',
    ThirdPartyShortcut = 'application/vnd.google-apps.drive-sdk',
    GoogleDrawings = 'application/vnd.google-apps.drawing',
    GoogleDriveFolder = 'application/vnd.google-apps.folder',
  }

  export enum Visibility {
    AnyoneCanFind = 'anyoneCanFind',
    AnyoneWithLink = 'anyoneWithLink',
    DomainCanFind = 'domainCanFind',
    DomainWithLink = 'domainWithLink',
    Limited = 'limited',
  }
}

function qbTest() {
  const qb = new QueryBuilder();

  qb
    .fullText().contains('test')
    .inParents('123')
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
    .shortcut().isEqualTo('12344');

  const query = qb.build();

  console.log({ query });
}
