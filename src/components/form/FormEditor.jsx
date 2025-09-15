import { Editor } from "@tinymce/tinymce-react";
import { useContext, useEffect } from "preact/hooks";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./Form";

/**
 * FormEditor component props.
 * @typedef {Object} FormEditorProps
 * @property {string} title - Label/title of the editor.
 * @property {string} name - Name/path of the editor field in the form.
 * @property {boolean} [useDarkMode=false] - Enable dark mode styling.
 * @property {boolean} [showIndice=false] - Show info button about index insertion.
 * @property {number} [max_height=400] - Max height of the editor in pixels.
 * @property {(content: string) => void} [onBlur] - Callback fired on blur with content.
 * @property {boolean} [required=false] - Whether the field is required.
 */

/**
 * FormEditor component renders a rich text editor with form integration.
 *
 * @param {FormEditorProps} props
 * @returns {JSX.Element}
 */
function FormEditor({
    name,
    title,
    useDarkMode = false,
    showIndice = false,
    max_height = 400,
    onBlur,
    required = false,
}) {
    const formContext = useContext(FormControlContext);
    const errors = formContext?.formState?.errors || {};
    const setValue = formContext?.setValue;
    const watch = formContext?.watch;

    const err = anidarPropiedades(errors, name.split("."));

    // Remove TinyMCE watermark by hiding promotion element
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(".tox-promotion");
            if (element && !element.classList.contains("hidden")) {
                element.classList.add("hidden");
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    return (
        <div class="w-full mb-2 space-y-2">
            <label
                class="block text-sm font-medium text-foreground"
                htmlFor={name}
            >
                {title}
                {required ? <span className="text-primary">*</span> : null}
                {showIndice ? (
                    <button
                        type="button"
                        className="bg-black w-[20px] h-[20px] rounded-full text-white font-bold relative group"
                    >
                        ?
                        <div className="absolute z-[9] top-0 text-xs bg-black bg-opacity-80 p-2 rounded-lg min-w-[150px] hidden group-hover:block">
                            Para agregar Indice:. <br /> ---INDICE---
                        </div>
                    </button>
                ) : null}
            </label>
            <div class="flex items-center gap-2 w-full mt-1">
                <div
                    class={`w-full relative ${
                        Object.keys(err).length
                            ? "border border-red-600"
                            : "border border-gray-200 dark:border-gray-600"
                    } rounded-2xl overflow-hidden `}
                >
                    <Editor
                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                        onEditorChange={(content) => {
                            setValue?.(name, content);
                        }}
                        onBlur={(_, editor) => {
                            if (onBlur) {
                                onBlur(editor.getContent());
                            }
                        }}
                        value={watch?.(name) || ""}
                        init={{
                            plugins:
                                "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
                            editimage_cors_hosts: ["picsum.photos"],
                            menubar:
                                "file edit view insert format tools table help",
                            toolbar:
                                "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
                            autosave_ask_before_unload: true,
                            autosave_interval: "30s",
                            autosave_prefix: "{path}{query}-{id}-",
                            autosave_restore_when_empty: false,
                            autosave_retention: "2m",
                            image_advtab: true,
                            branding: false,
                            max_height,
                            link_list: [
                                {
                                    title: "My page 1",
                                    value: "https://www.tiny.cloud",
                                },
                                {
                                    title: "My page 2",
                                    value: "http://www.moxiecode.com",
                                },
                            ],
                            image_list: [
                                {
                                    title: "My page 1",
                                    value: "https://www.tiny.cloud",
                                },
                                {
                                    title: "My page 2",
                                    value: "http://www.moxiecode.com",
                                },
                            ],
                            image_class_list: [
                                { title: "None", value: "" },
                                { title: "Some class", value: "class-name" },
                            ],
                            importcss_append: true,
                            height: max_height,
                            image_caption: true,
                            quickbars_selection_toolbar:
                                "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
                            noneditable_class: "mceNonEditable",
                            toolbar_mode: "sliding",
                            contextmenu: "link image table",
                            skin: useDarkMode ? "oxide-dark" : "oxide",
                            content_css: useDarkMode ? "dark" : "default",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                        }}
                    />
                </div>
            </div>

            {Object.keys(err).length ? (
                <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                    <span className="w-1 h-1 bg-destructive rounded-full" />
                    {err?.message}
                </p>
            ) : (
                <span class="h-5 w-full block" />
            )}

            <style jsx>{`
                .tox-tinymce-aux {
                    z-index: 99999999 !important;
                }
            `}</style>
        </div>
    );
}

export default FormEditor;
