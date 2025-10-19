import { Injectable } from '@angular/core';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import { createHighlighterCore, HighlighterCore, HighlighterGeneric } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { codeBlockTransformer } from './transformers';

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  private highlighterPromise: Promise<HighlighterCore>;

  constructor() {
    this.highlighterPromise = this.initHighlighter();
  }

  initHighlighter(): Promise<HighlighterCore> {
    return createHighlighterCore({
      themes: [import('@shikijs/themes/github-dark-dimmed')],
      langs: [
        import('@shikijs/langs/javascript'),
        import('@shikijs/langs/typescript'),
        import('@shikijs/langs/python'),
        import('@shikijs/langs/cpp'),
        import('@shikijs/langs/c'),
        import('@shikijs/langs/bash'),
        import('@shikijs/langs/go'),
        import('@shikijs/langs/html'),
        import('@shikijs/langs/css'),
        import('@shikijs/langs/docker'),
        import('@shikijs/langs/java'),
        import('@shikijs/langs/lua'),
        import('@shikijs/langs/markdown'),
        import('@shikijs/langs/sql'),
        import('@shikijs/langs/ruby'),
        import('@shikijs/langs/rust'),
        import('@shikijs/langs/php'),
        import('@shikijs/langs/jsx'),
        import('@shikijs/langs/json'),
        import('@shikijs/langs/elixir'),
      ],
      engine: createOnigurumaEngine(() => import('shiki/wasm')),
    });
  }
  async parse(content: string): Promise<string> {
    // shiki lib does not consider ts strict typing nature
    const highlighter = (await this.highlighterPromise) as unknown as HighlighterGeneric<any, any>;

    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeShikiFromHighlighter, highlighter, {
        theme: 'github-dark-dimmed',
        transformers: [codeBlockTransformer()],
      })
      .use(rehypeStringify)
      .processSync(content);

    return String(file);
  }
}
