import * as runtime from 'react/jsx-runtime'
import { GithubEmbed } from './github-embed'

/** Elements available inside every MDX file. Add shared components here. */
const components = {
  GithubEmbed,
  // Images are copied and re-pathed by Velite; lazy-load them.
  // eslint-disable-next-line @next/next/no-img-element
  img: (props: React.ComponentProps<'img'>) => <img loading="lazy" decoding="async" alt="" {...props} />,
  a: ({ href = '', ...props }: React.ComponentProps<'a'>) => {
    const external = /^https?:\/\//.test(href)
    return <a href={href} {...(external && { target: '_blank', rel: 'noreferrer' })} {...props} />
  },
}

/**
 * Renders MDX that Velite compiled to a function body (the `body` field).
 * Runs on the server, so async components like <GithubEmbed> work.
 */
export function MDXContent({ code }: { code: string }) {
  const Component = new Function(code)({ ...runtime }).default as React.ComponentType<{
    components?: typeof components
  }>
  return <Component components={components} />
}