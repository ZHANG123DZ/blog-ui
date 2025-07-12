import { forwardRef, useMemo } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./RichTextEditor.module.scss";

const RichTextEditor = forwardRef(
    (
        {
            value = "",
            onChange,
            placeholder = "Start writing...",
            className = "",
            error = "",
            readOnly = false,
            theme = "snow",
            modules: customModules = {},
            formats: customFormats = [],
            ...props
        },
        ref
    ) => {
        // Default toolbar configuration
        const modules = useMemo(
            () => ({
                toolbar: {
                    container: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }, { background: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        ["blockquote", "code-block"],
                        ["link", "image", "video"],
                        [{ align: [] }],
                        ["clean"],
                    ],
                },
                clipboard: {
                    matchVisual: false,
                },
                ...customModules,
            }),
            [customModules]
        );

        // Default formats
        const formats = useMemo(() => {
            const defaultFormats = [
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "color",
                "background",
                "list",
                "indent",
                "blockquote",
                "code-block",
                "link",
                "image",
                "video",
                "align",
            ];
            return customFormats.length > 0 ? customFormats : defaultFormats;
        }, [customFormats]);

        const editorClasses = `${styles.editor} ${className} ${
            error ? styles.error : ""
        }`.trim();

        return (
            <div className={styles.container}>
                <ReactQuill
                    ref={ref}
                    theme={theme}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    modules={modules}
                    formats={formats}
                    className={editorClasses}
                    {...props}
                />
                {error && <div className={styles.errorText}>{error}</div>}
            </div>
        );
    }
);

RichTextEditor.displayName = "RichTextEditor";

RichTextEditor.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    error: PropTypes.string,
    readOnly: PropTypes.bool,
    theme: PropTypes.oneOf(["snow", "bubble"]),
    modules: PropTypes.object,
    formats: PropTypes.array,
};

export default RichTextEditor;
