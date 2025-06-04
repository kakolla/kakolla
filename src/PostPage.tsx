import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MarkdownIt from 'markdown-it'
import markdownItKatex from 'markdown-it-katex'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import fm from 'front-matter'
import { useNavigate } from 'react-router-dom';

// Hightlight.js for code snippets
// Markitdown for katex (latex)
const md = new MarkdownIt({
    html: true,
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
            } catch { }
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    },
}).use(markdownItKatex, {
    throwOnError: false,
    errorColor: '#cc0000',
})


function PostPage() {
    const navigate = useNavigate()
    const { slug } = useParams() // react router that gets page slug
    const [postHtml, setPostHtml] = useState<string>('')
    const [postTitle, setPostTitle] = useState<string>('')

    useEffect(() => {
        if (!slug) return

        const load = async () => {
            const res = await fetch(`/posts/${slug}.md`)
            const raw = await res.text()
            const { attributes, body } = fm(raw) as { attributes: any; body: string }
            setPostTitle(attributes.title || slug)
            setPostHtml(md.render(body))
        }

        load()
    }, [slug])

    return (
        <div>
            <div className="absolute inset-0 z-0 backdrop-blur-sm bg-black/70" />
            <div className="animate-fade">
                {/* container */}
                <div className="fixed top-20 left-1/2 h-[80vh] transform -translate-x-1/2
        max-w-3xl w-full p-8 rounded-lg overflow-y-auto text-white no-scrollbar">

                    {/* back button */}
                    <button style={{color: "#D2A8FF"}} onClick={() => navigate('/', { state: { cameFromPost: true } })}>back</button>

                    {/* title */}
                    <h1 className="text-xl font-semibold text-center mb-6">{postTitle}.md</h1>

                    {/* post html (converted from markdown) */}
                    <div className="katex-wrapper" dangerouslySetInnerHTML={{ __html: postHtml }} />
                </div>

            </div>
        </div>
    )
}

export default PostPage;
