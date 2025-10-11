import { h } from 'hastscript';
import type { ShikiTransformer } from 'shiki';

type Options = {
  toggleDelay?: number;
};

export const codeBlockTransformer = (options: Options = {}): ShikiTransformer => {
  const toggleDelay = options.toggleDelay ?? 1000;

  return {
    name: 'code-block',
    pre(hast) {
      const copyButton = h(
        'button',
        {
          type: 'button',
          class: `rounded-sm hover:text-white/90 cursor-pointer
                  transition flex items-center gap-1`,
          onclick: `
            const btn = this;
            const code = btn.nextElementSibling;
            if (!code) return;

            const [spanDefault, spanCopied] = btn.querySelectorAll('span.copy-span');

            navigator.clipboard.writeText(code.innerText).then(() => {
              spanDefault.style.display = 'none';
              spanCopied.style.display = 'flex';

              setTimeout(() => {
                spanDefault.style.display = 'flex';
                spanCopied.style.display = 'none';
              }, ${toggleDelay});
            });
          `,
        },
        [
          // Default icon + text
          h('span', { class: 'copy-span flex items-center gap-1' }, [
            h(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                fill: 'none',
                viewBox: '0 0 24 24',
                'stroke-width': 1.5,
                stroke: 'currentColor',
                class: 'w-3 h-3',
              },
              [
                h('path', {
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  d: 'M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184',
                }),
              ]
            ),
            'Copy code',
          ]),

          // Copied icon + text (initially hidden)
          h('span', { class: 'copy-span flex items-center gap-1', style: 'display:none;' }, [
            h(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                fill: 'none',
                viewBox: '0 0 24 24',
                'stroke-width': 1.5,
                stroke: 'currentColor',
                class: 'w-3 h-3',
              },
              [
                h('path', {
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  d: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
                }),
              ]
            ),
            'Copied!',
          ]),
        ]
      );

      const metaBar = h(
        'div',
        {
          class: `absolute top-0 w-full py-1 px-3 text-[11px]
            text-white/70 flex items-center justify-between`,
        },
        [h('div', [this.options.lang]), copyButton]
      );

      return h(
        'div',
        {
          class: 'relative code-block',
        },
        [metaBar, hast]
      );
    },
  };
};
