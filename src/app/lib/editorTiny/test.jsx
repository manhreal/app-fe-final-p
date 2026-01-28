import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch } from "react-redux";
import customeStyle from './customeStyle';
import { uploadImageNews } from '../../../redux/upload/actions';

const EditorTiny = React.memo((props) => {
    const [value, setValue] = useState(props.data);
    const editorRef = useRef(null);
    const dispatch = useDispatch();

    const getdata = (editorRef) => {
        if (editorRef.current) {
            props.getData(editorRef.current.getContent());
        }
    };

    const handleUploadImage = async (blobInfo, success, failure) => {
        try {
            const imageUpload = blobInfo.blob();
            const formData = new FormData();
            formData.append("file", imageUpload);

            console.log("Starting image upload...");
            const url = await dispatch(uploadImageNews(formData));
            console.log("Upload response URL:", url);

            if (!url || typeof url !== 'string' || !url.startsWith('http')) {
                console.error("Upload failed: Invalid URL returned:", url);
                failure("Upload ảnh thất bại! URL không hợp lệ.");
                return;
            }

            console.log("Upload successful, calling success with URL:", url);
            success(url);
        } catch (error) {
            console.error("Upload image error:", error);
            failure("Lỗi khi upload ảnh: " + (error.message || error));
        }
    };

    useEffect(() => {
        setValue(props.data);
    }, [props.data]);

    return (
        <>
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                    getdata(editorRef);
                }}
                initialValue={value}
                init={{
                    height: 500,
                    plugins: 'save preview paste searchreplace autolink directionality visualblocks visualchars ' +
                        ' fullscreen template codesample table charmap hr pagebreak nonbreaking anchor toc ' +
                        'insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern media ' +
                        'help code image link',

                    object_resizing: 'table, img, iframe, video, figure',
                    autosave_interval: '30s',
                    images_upload_url: 'postAcceptor.php',
                    image_advtab: true,
                    verify_html: true,
                    image_caption: true,
                    entity_encoding: "raw",

                    menubar: 'file edit view insert format tools table help',
                    toolbar: "blocks | bold italic numlist bullist alignleft aligncenter alignright link pagebreak anchor save print codesample preview fullscreen | strikethrough hr fontsize lineheight forecolor backcolor outdent indent removeformat charmap emoticons undo redo help",
                    toolbar_mode: 'wrap',

                    font_size_formats: '8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 36px 48px 72px',
                    extended_valid_elements: 'img[style|class|src|alt|title|width|loading=lazy]',
                    imagetools_cors_hosts: ['picsum.photos'],
                    noneditable_noneditable_class: 'mceNonEditable',
                    table_border_styles: [{ title: 'White', value: 'FFFFFF' }],
                    content_style: customeStyle,
                    contextmenu: 'link image imagetools table',

                    templates: [
                        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
                        { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
                        { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
                    ],

                    setup: function (editor) {
                        editor.on('Change', (e) => getdata(editorRef));
                    },

                    images_upload_handler: handleUploadImage,
                }}
                scriptLoading={{ async: true }}
            />
        </>
    );
});

export default EditorTiny;