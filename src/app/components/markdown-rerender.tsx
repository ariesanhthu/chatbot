"use client"

import ReactMarkdown, { Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from "react-syntax-highlighter"
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("markdown-renderer prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Supports GitHub Flavored Markdown (tables, strikethrough, etc.)
        rehypePlugins={[rehypeRaw]} // Allows HTML in markdown
        components={{
          // Custom heading components
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-6 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-5 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-4 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-3 mb-2" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-sm font-bold mt-3 mb-1" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-xs font-bold mt-3 mb-1" {...props} />,

          // Custom paragraph
          p: ({ node, ...props }) => <p className="my-2" {...props} />,

          // Custom link
          a: ({ node, ...props }) => (
            <a
              className="text-purple-600 hover:text-purple-800 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // Custom lists
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
          li: ({ node, ...props }) => <li className="my-1" {...props} />,

          // Custom blockquote
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
          ),

          // Custom code blocks with syntax highlighting
          // @ts-ignore
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : ""

            return !inline ? (
              <div className="my-4 rounded-md overflow-hidden">
                <div className="bg-gray-800 text-gray-200 text-xs px-4 py-1 flex items-center">
                  <span>{language || "code"}</span>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={language || "text"}
                  PreTag="div"
                  className="rounded-b-md"
                  showLineNumbers
                  {...props as any}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            )
          },

          // Custom table components
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-300 dark:border-gray-700" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-300 dark:divide-gray-700" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-900" {...props} />,
          th: ({ node, ...props }) => (
            <th className="px-4 py-2 text-left text-sm font-medium border-r last:border-r-0" {...props} />
          ),
          td: ({ node, ...props }) => <td className="px-4 py-2 text-sm border-r last:border-r-0" {...props} />,

          // Custom think blocks
          // @ts-ignore
          think: ({ node, ...props }) => (
            <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-300 dark:border-purple-700 p-3 my-4 rounded-r-md">
              <div className="font-medium text-purple-800 dark:text-purple-300 mb-1">Thinking:</div>
              <div className="text-gray-700 dark:text-gray-300" {...props} />
            </div>
          ),

          // Custom hr
          hr: ({ node, ...props }) => <hr className="my-4 border-t border-gray-300 dark:border-gray-700" {...props} />,

          // Custom img
          img: ({ node, ...props }) => (
            <img className="max-w-full h-auto rounded-md my-4" {...props} alt={props.alt || "Image"} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// Custom component for <Thinking> blocks
export function ThinkBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-300 dark:border-purple-700 p-3 my-4 rounded-r-md">
      <div className="font-medium text-purple-800 dark:text-purple-300 mb-1">Thinking:</div>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  )
}
