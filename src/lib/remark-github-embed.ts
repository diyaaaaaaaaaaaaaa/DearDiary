import type { Root } from 'mdast'
import 'mdast-util-mdx-jsx'
import { visit } from 'unist-util-visit'
import { GITHUB_URL } from './github-url'

/**
 * Turns a GitHub URL pasted alone on its own line into <GithubEmbed url="..." />.
 * A URL inside a sentence, or a link with custom text, is left as a normal link.
 */
export function remarkGithubEmbed() {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index === undefined || node.children.length !== 1) return
      const link = node.children[0]
      if (link?.type !== 'link' || !GITHUB_URL.test(link.url)) return

      const label = link.children[0]
      const isBare = link.children.length === 1 && label?.type === 'text' && label.value === link.url
      if (!isBare) return

      parent.children[index] = {
        type: 'mdxJsxFlowElement',
        name: 'GithubEmbed',
        attributes: [{ type: 'mdxJsxAttribute', name: 'url', value: link.url }],
        children: [],
      }
    })
  }
}