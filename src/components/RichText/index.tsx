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

const TEXT_FORMAT = {
  bold: 1,
  italic: 1 << 1,
  strikethrough: 1 << 2,
  underline: 1 << 3,
  code: 1 << 4,
  subscript: 1 << 5,
  superscript: 1 << 6,
}

// Extract plain text from Lexical children
function extractText(children: any[]): string {
  return (children || []).map((c: any) => c.text || extractText(c.children || [])).join('')
}

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

    const format = (node as any).format || 0
    let text: React.ReactNode = (node as any).text

    if (format & TEXT_FORMAT.bold) {
      text = <strong style={{ color: '#ffffff', fontWeight: 700 }}>{text}</strong>
    }
    if (format & TEXT_FORMAT.italic) {
      text = <em>{text}</em>
    }
    if (format & TEXT_FORMAT.strikethrough) {
      text = <span style={{ textDecoration: 'line-through' }}>{text}</span>
    }
    if (format & TEXT_FORMAT.underline) {
      text = <span style={{ textDecoration: 'underline' }}>{text}</span>
    }
    if (format & TEXT_FORMAT.code) {
      text = <code>{text}</code>
    }
    if (format & TEXT_FORMAT.subscript) {
      text = <sub>{text}</sub>
    }
    if (format & TEXT_FORMAT.superscript) {
      text = <sup>{text}</sup>
    }

    return text
  },

  // ── PARAGRAPH — detect convention markers for visual blocks ──────────────
  paragraph: ({ node, nodesToJSX }) => {
    const rawText = extractText((node as any).children || [])

    // FIELD WARNING: orange left-border callout
    if (rawText.startsWith('FIELD WARNING:')) {
      const body = rawText.replace('FIELD WARNING:', '').trim()
      return (
        <div style={{
          borderLeft: '3px solid #FF5C00',
          background: 'rgba(255,92,0,0.08)',
          borderRadius: '0 6px 6px 0',
          padding: '1.25rem 1.5rem',
          margin: '2rem 0',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: '#FF5C00',
            marginBottom: '10px',
          }}>
            ⚠ Field Warning
          </div>
          <p style={{ color: '#c8c4bc', margin: 0, lineHeight: 1.7, fontSize: '15px' }}>{body}</p>
        </div>
      )
    }

    // STAT: paragraph whose entire text is a number/stat (e.g. "$140K", "191", "62M")
    if (/^[\$€£]?[\d,.]+[KkMmBbTt%]?$/.test(rawText.trim())) {
      return (
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '52px',
          fontWeight: 900,
          color: '#1D9E75',
          lineHeight: 1,
          letterSpacing: '-2px',
          margin: '0 0 4px 0',
        }}>
          {rawText}
        </div>
      )
    }

    return (
      <p style={{ color: '#c8c4bc', lineHeight: 1.8, marginBottom: '1.25rem' }}>
        {nodesToJSX({ nodes: (node as any).children })}
      </p>
    )
  },

  // ── QUOTE — pull quote (teal) or stat callout card (wraps stat + label) ──
  quote: ({ node, nodesToJSX }) => {
    const children = (node as any).children || []
    const firstText = extractText([children[0]]).trim()

    // Stat callout: first child is a number → render as stat card
    if (/^[\$€£]?[\d,.]+[KkMmBbTt%]?$/.test(firstText)) {
      return (
        <div style={{
          background: '#2c2c2a',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '8px',
          padding: '28px 32px',
          margin: '2rem 0',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '20px',
        }}>
          <div style={{
            width: '3px',
            minHeight: '60px',
            background: '#1D9E75',
            borderRadius: '2px',
            flexShrink: 0,
          }} />
          <div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '48px',
              fontWeight: 900,
              color: '#1D9E75',
              lineHeight: 1,
              letterSpacing: '-2px',
            }}>
              {firstText}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#8f8d86',
              marginTop: '8px',
              lineHeight: 1.5,
            }}>
              {nodesToJSX({ nodes: children.slice(1) })}
            </div>
          </div>
        </div>
      )
    }

    // Default pull quote
    return (
      <blockquote style={{
        borderLeft: '4px solid #1D9E75',
        background: 'rgba(29,158,117,0.10)',
        padding: '1.25rem 1.5rem',
        fontStyle: 'italic',
        color: '#e8e4dc',
        margin: '2rem 0',
        borderRadius: '0 8px 8px 0',
        fontSize: '18px',
        lineHeight: 1.65,
      }}>
        {nodesToJSX({ nodes: children })}
      </blockquote>
    )
  },

  // ── HORIZONTAL RULE ──────────────────────────────────────────────────────
  horizontalrule: (
    <hr style={{
      width: '100%',
      border: 0,
      borderTop: '1px solid #3a3a38',
      margin: '2.5rem 0',
    }} />
  ),

  // ── HEADINGS ─────────────────────────────────────────────────────────────
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag
    const children = nodesToJSX({ nodes: node.children })

    if (Tag === 'h2') {
      return (
        <h2 style={{
          color: '#ffffff',
          fontSize: '1.5rem',
          fontWeight: 700,
          marginTop: '2.5rem',
          marginBottom: '1rem',
          letterSpacing: '-0.01em',
        }}>
          {children}
        </h2>
      )
    }
    if (Tag === 'h3') {
      return (
        <h3 style={{
          color: '#1D9E75',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          marginTop: '2rem',
          marginBottom: '0.75rem',
        }}>
          {children}
        </h3>
      )
    }
    const NodeTag = Tag as keyof React.JSX.IntrinsicElements
    return <NodeTag>{children}</NodeTag>
  },

  // ── LISTS — styled checklist with teal tick boxes ─────────────────────────
  list: ({ node, nodesToJSX }) => {
    const tag = (node as any).tag as 'ol' | 'ul'
    if (tag === 'ul') {
      return (
        <div style={{
          background: '#2c2c2a',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '20px 24px',
          margin: '2rem 0',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: '#1D9E75',
            marginBottom: '14px',
          }}>
            Operator Checklist
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {nodesToJSX({ nodes: node.children })}
          </ul>
        </div>
      )
    }
    return (
      <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
        {nodesToJSX({ nodes: node.children })}
      </ol>
    )
  },

  listitem: ({ node, nodesToJSX }) => {
    const isUl = (node as any).listType === 'bullet' || !(node as any).value
    if (isUl) {
      return (
        <li style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '10px 0',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          fontSize: '15px',
          color: '#c8c4bc',
          lineHeight: 1.6,
          listStyle: 'none',
        }}>
          <span style={{
            width: '20px',
            height: '20px',
            border: '1.5px solid #1D9E75',
            borderRadius: '4px',
            flexShrink: 0,
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2,6 5,9 10,3" />
            </svg>
          </span>
          <span>{nodesToJSX({ nodes: node.children })}</span>
        </li>
      )
    }
    return (
      <li style={{ display: 'list-item', marginBottom: '0.25rem' }}>
        {nodesToJSX({ nodes: node.children })}
      </li>
    )
  },

  // ── TABLES ───────────────────────────────────────────────────────────────
  table: ({ node, nodesToJSX }) => (
    <div style={{ overflowX: 'auto', width: '100%', marginBottom: '1.5rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
        <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
      </table>
    </div>
  ),
  tablerow: ({ node, nodesToJSX }) => <tr>{nodesToJSX({ nodes: node.children })}</tr>,
  tablecell: ({ node, nodesToJSX }) => {
    const isHeader = node.headerState === 1 || node.headerState === 3
    const Tag = isHeader ? 'th' : 'td'
    return <Tag>{nodesToJSX({ nodes: node.children })}</Tag>
  },

  // ── PAYLOAD BLOCKS ───────────────────────────────────────────────────────
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <div className="my-6 rounded-lg overflow-hidden" style={{ background: '#2c2c2a' }}>
        <MediaBlock
          className="w-full"
          imgClassName="m-0 block w-full h-auto"
          pictureClassName="block w-full"
          size="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem] px-4 pb-4"
          enableGutter={false}
          disableInnerContainer={true}
        />
      </div>
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
