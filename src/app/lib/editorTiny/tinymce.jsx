import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch } from "react-redux";
import customeStyle from './customeStyle';
import { uploadImageNews } from '../../../redux/upload/actions';

const EditorTiny = React.memo((props) => {
    const [value, setValue] = useState(props.data || '');
    const editorRef = useRef(null);
    const dispatch = useDispatch();

    const getdata = (content) => {
        props.getData(content);
    };

    const handleUploadImage = async (blobInfo) => {
        let imageUpload = blobInfo.blob();
        let formData = new FormData();
        formData.append("file", imageUpload);
        let url = await dispatch(uploadImageNews(formData));
        return url;
    };

    // Chỉ update khi props.data thay đổi thực sự
    useEffect(() => {
        if (props.data !== value) {
            setValue(props.data || '');
        }
    }, [props.data]);

    return (
        <>
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                }}
                value={value}  // Dùng value thay vì initialValue
                onEditorChange={(content) => {
                    setValue(content);
                    getdata(content);
                }}
                init={{
                    height: 500,
                    className: 'editor-class',
                    plugins: 'save preview paste searchreplace autolink directionality visualblocks visualchars fullscreen template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern media help code image link font',
                    object_resizing: 'table, img, iframe, video, figure',
                    autosave_interval: '30s',
                    images_upload_url: 'postAcceptor.php',
                    image_advtab: true,
                    verify_html: true,
                    image_caption: true,
                    entity_encoding: "raw",
                    menubar: 'file edit view insert format tools table help font',
                    toolbar: "blocks | fontfamily | bold italic numlist bullist alignleft aligncenter alignright link pagebreak anchor save print codesample preview fullscreen | strikethrough hr fontsize lineheight forecolor backcolor outdent indent removeformat charmap emoticons undo redo help",
                    toolbar_mode: 'wrap',
                    font_size_formats: '8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 36px 48px 72px',
                    extended_valid_elements: 'img[style|class|src|alt|title|width|loading=lazy]',
                    imagetools_cors_hosts: ['picsum.photos'],
                    noneditable_noneditable_class: 'mceNonEditable',
                    table_border_styles: [{ title: 'White', value: 'FFFFFF' }],
                    content_style: customeStyle,
                    contextmenu: 'link image imagetools table font',
                    templates: [
                        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
                        { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
                        { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
                    ],
                    images_upload_handler: handleUploadImage,
                }}
                scriptLoading={{ async: true }}
            />
        </>
    );
});

export default EditorTiny;
