import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const VISUAL_RE = /^\[VISUAL:\s*(\/[^\s\]]+)\s*—\s*(.+)\]$/

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  text: (props) => {
    const { node } = props
    const match = (node as any).text?.match(VISUAL_RE)
    if (match) {
      const [, path, caption] = match
      return (
        <figure className="my-8 text-center w-full">
          <img
            src={path}
            alt={caption}
            className="mx-auto max-w-full rounded-lg border border-[#1D9E75]/30"
          />
          <figcaption className="mt-2 text-sm text-[#a0a09a] text-center block w-full">{caption}</figcaption>
        </figure>
      )
    }
    if (typeof (defaultConverters as any).text === 'function') {
      return (defaultConverters as any).text(props)
    }
    return null
  },
  table: ({ node, nodesToJSX }) => (
    <div style={{ overflowX: 'auto', width: '100%', marginBottom: '1.5rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
        <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
      </table>
    </div>
  ),
  tablerow: ({ node, nodesToJSX }) => (
    <tr>{nodesToJSX({ nodes: node.children })}</tr>
  ),
  tablecell: ({ node, nodesToJSX }) => {
    const isHeader = node.headerState === 1 || node.headerState === 3
    const Tag = isHeader ? 'th' : 'td'
    return <Tag>{nodesToJSX({ nodes: node.children })}</Tag>
  },
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
