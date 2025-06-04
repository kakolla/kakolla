import { useEffect, useState } from 'react'
import MarkdownIt from 'markdown-it'
import markdownItKatex from 'markdown-it-katex'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'  // or another theme
import './index.css';
import 'katex/dist/katex.min.css'
import fm from 'front-matter'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'



// Markdownit config 
// Hightlight.js for code snippets
// Markitdown for katex (latex)
const md = new MarkdownIt({
    html: true,
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
            } catch (__) { }
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    },
}).use(markdownItKatex, {
    throwOnError: false,
    errorColor: '#cc0000'
});


interface Props {
    pageState: string
}

function Notes({ pageState }: Props) {

    // Posts list 
    const postsList = [
        "post1.md",
        "post2.md"
    ]

    // Hooks to manage post
    const [selectedPost, setSelectedPost] = useState<string | null>(null)
    const [postHtml, setPostHtml] = useState<string>('')
    const [postTitle, setPostTitle] = useState<string>('')

    // for determining if we came from a post, so we don't reanimate blur bg
    const location = useLocation(); 
    const cameFromPost = location.state?.cameFromPost === true


    useEffect(() => {
        if (!selectedPost) return

        const load = async () => {
            const res = await fetch(`/posts/${selectedPost}`)
            const raw = await res.text()
            const { attributes, body } = fm(raw) as { attributes: any; body: string }
            setPostTitle(attributes.title || selectedPost)
            setPostHtml(md.render(body))
        }

        load()
    }, [selectedPost])

    if (pageState !== 'notes') return null

    return (
        <>

            <div>
                {/* display blur background */}
                {cameFromPost && (
                    <div className="absolute inset-0 z-2 backdrop-blur-sm bg-black/70" />
                )}
                {!cameFromPost && (
                    <div className="animate-fade absolute inset-0 z-2 backdrop-blur-sm bg-black/70" />
                )}

                {/* container */}
                <div className="fixed top-20 left-1/2 h-[80vh] transform -translate-x-1/2
        max-w-3xl w-full p-8 rounded-lg overflow-y-auto animate-fade no-scrollbar text-white">


                    {/*  title */}
                    <h1 className="text-xl font-semibold text-center mb-6">
                        a place for my notes and experiments
                    </h1>


                    {/* list of links to posts */}
                    <ul className="mb-6 space-y-2">
                        {postsList.map((file, idx) => (


                            <li key={idx}>
                                {/* format link nicely */}
                                <Link to={`/${file.replace('.md', '')}`} className="underline text-blue-300 hover:text-blue-200">
                                    {file.replace('.md', '').replaceAll('-', ' ')}
                                </Link>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </>
    )
}

export default Notes
