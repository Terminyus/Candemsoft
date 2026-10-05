import type { MDXComponents } from "mdx/types";

// Typographic defaults for blog posts. Posts render on the paper surface.
export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h2: (props) => <h2 className="mt-16 mb-4 text-h3 scroll-mt-24" {...props} />,
    h3: (props) => <h3 className="mt-10 mb-3 font-display text-xl font-extrabold" {...props} />,
    p: (props) => <p className="my-5" {...props} />,
    ul: (props) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-ember" {...props} />,
    ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:font-mono marker:text-ember" {...props} />,
    a: (props) => <a className="underline decoration-ember underline-offset-4 hover:text-ember" {...props} />,
    strong: (props) => <strong className="font-semibold" {...props} />,
    blockquote: (props) => <blockquote className="my-8 border-l-2 border-signal pl-6 text-lead" {...props} />,
    code: (props) => <code className="rounded-sm bg-paper-200 px-1.5 py-0.5 font-mono text-[0.88em]" {...props} />,
    pre: (props) => (
      <pre
        tabIndex={0}
        data-surface="ink"
        className="my-8 overflow-x-auto rounded-md border border-ink-800 p-5 font-mono text-sm leading-relaxed [&>code]:bg-transparent [&>code]:p-0"
        {...props}
      />
    ),
    ...components,
  };
}
