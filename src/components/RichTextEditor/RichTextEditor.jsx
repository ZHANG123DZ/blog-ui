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
      setLocalImages,
      ...props
    },
    ref
  ) => {
    const imgHandler = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result;

          const editor = ref.current?.getEditor();
          const range = editor?.getSelection();

          if (editor && range) {
            editor.insertEmbed(range.index, "image", base64);
            editor.setSelection(range.index + 1);
            setLocalImages((prev) => [
              ...prev,
              { file, previewUrl: base64, insertedAt: Date.now() },
            ]);
          } else {
            console.warn(
              "⚠️ Không thể chèn ảnh: editor hoặc range không tồn tại"
            );
          }
        };
        reader.readAsDataURL(file);
      };
    };

    // const imgHandler = () => {
    //   const input = document.createElement("input");
    //   input.setAttribute("type", "file");
    //   input.setAttribute("accept", "image/*");
    //   input.click();

    //   input.onchange = async () => {
    //     const file = input.files?.[0];
    //     if (!file) return;

    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       const img = new Image();
    //       img.onload = () => {
    //         // --- Resize canvas ---
    //         const MAX_WIDTH = 800;
    //         const MAX_HEIGHT = 600;
    //         let width = img.width;
    //         let height = img.height;

    //         // Tính tỉ lệ resize
    //         if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    //           const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
    //           width = width * ratio;
    //           height = height * ratio;
    //         }

    //         // Tạo canvas
    //         const canvas = document.createElement("canvas");
    //         canvas.width = width;
    //         canvas.height = height;
    //         const ctx = canvas.getContext("2d");
    //         ctx.drawImage(img, 0, 0, width, height);

    //         // Chuyển ảnh trong canvas thành base64
    //         const base64 = canvas.toDataURL("image/png");

    //         // --- Chèn ảnh vào Quill ---
    //         const editor = ref.current?.getEditor();
    //         const range = editor?.getSelection();

    //         if (editor && range) {
    //           editor.insertEmbed(range.index, "image", base64);
    //           editor.setSelection(range.index + 1);
    //         } else {
    //           console.warn(
    //             "⚠️ Không thể chèn ảnh: editor hoặc range không tồn tại"
    //           );
    //         }
    //       };
    //       img.src = reader.result; // kích hoạt image.onload
    //     };

    //     reader.readAsDataURL(file); // kích hoạt reader.onload
    //   };
    // };

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
          handlers: {
            image: imgHandler,
          },
        },
        clipboard: {
          matchVisual: false,
        },
        ...customModules,
      }),
      []
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
  setLocalImages: PropTypes.func,
};

export default RichTextEditor;
