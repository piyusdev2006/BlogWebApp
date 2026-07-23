import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'


export default function RTE({name, control, label, defaultValue = ""}) {
    return (
      <div className="w-full">
        {label && (
          <label className="inline-block mb-1.5 pl-0.5 text-body-sm text-ink-muted font-medium">
            {label}
          </label>
        )}
        <div className="rounded-md overflow-hidden border border-hairline">
          <Controller
            name={name || "content"}
            control={control}
            render={({ field: { onChange } }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                initialValue={defaultValue}
                init={{
                  // initiaze hote hi kya kya value ho, jaise ki plugins, toolbar, etc.
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                  content_style:
                    "body { font-family: Inter, -apple-system, system-ui, sans-serif; font-size: 16px; line-height: 1.6; background-color: #0f1011; color: #d0d6e0; padding: 16px; } a { color: #5e6ad2; } h1,h2,h3,h4 { color: #f7f8f8; } code { background: #141516; padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 13px; } blockquote { border-left: 3px solid #5e6ad2; padding-left: 12px; color: #8a8f98; }",
                  skin: "oxide-dark",
                  content_css: "dark",
                }}
                onEditorChange={onChange}
              />
            )}
          />
        </div>
      </div>
    );
}

 
