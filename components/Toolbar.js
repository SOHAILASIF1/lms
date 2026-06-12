'use client'

export default function Toolbar({ editor }) {
  if (!editor) return null

  const active = (format) => editor.isActive(format)
  const action = (name, args) => () => editor.chain().focus()[name](args).run()

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm mb-4">
      <button type="button" className={`toolbar-button ${active('bold') ? 'active' : ''}`} onClick={action('toggleBold')}>
        B
      </button>
      <button type="button" className={`toolbar-button ${active('italic') ? 'active' : ''}`} onClick={action('toggleItalic')}>
        I
      </button>
      <button type="button" className={`toolbar-button ${active('underline') ? 'active' : ''}`} onClick={action('toggleUnderline')}>
        U
      </button>
      <button type="button" className={`toolbar-button ${active('heading', { level: 1 }) ? 'active' : ''}`} onClick={action('toggleHeading', { level: 1 })}>
        H1
      </button>
      <button type="button" className={`toolbar-button ${active('heading', { level: 2 }) ? 'active' : ''}`} onClick={action('toggleHeading', { level: 2 })}>
        H2
      </button>
      <button type="button" className={`toolbar-button ${active('heading', { level: 3 }) ? 'active' : ''}`} onClick={action('toggleHeading', { level: 3 })}>
        H3
      </button>
      <button type="button" className={`toolbar-button ${active('bulletList') ? 'active' : ''}`} onClick={action('toggleBulletList')}>
        • List
      </button>
      <button type="button" className={`toolbar-button ${active('orderedList') ? 'active' : ''}`} onClick={action('toggleOrderedList')}>
        1. List
      </button>
      <button type="button" className={`toolbar-button ${active('blockquote') ? 'active' : ''}`} onClick={action('toggleBlockquote')}>
        ❝
      </button>
      <button type="button" className={`toolbar-button ${active('codeBlock') ? 'active' : ''}`} onClick={action('toggleCodeBlock')}>
        {'</>'}
      </button>
      <button type="button" className="toolbar-button" onClick={action('undo')}>
        ↺
      </button>
      <button type="button" className="toolbar-button" onClick={action('redo')}>
        ↻
      </button>
    </div>
  )
}
