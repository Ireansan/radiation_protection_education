import React, { useRef, useState } from "react";

import styles from "../../styles/css/drop_file_input.module.css";

/**
 *
 * @link https://github.com/trananhtuat/react-drop-file-input/blob/main/src/components/drop-file-input/DropFileInput.jsx
 * @description
 */
function DropFileInput({ ...props }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [fileList, setFileList] = useState<File[]>([]);

    const onDragEnter = () => wrapperRef.current?.classList.add("dragover");
    const onDragLeave = () => wrapperRef.current?.classList.remove("dragover");
    const onDrop = () => wrapperRef.current?.classList.remove("dragover");

    const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files![0];
        if (newFile) {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList);
        }
    };

    const fileRemove = (file: File) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
    };

    const URL = "http://127.0.0.1:8000/images/";
    const fileSubmit = async () => {
        const formData = new FormData();
        // formData.append("upload_file", image);
        fileList.forEach((file) => {
            formData.append("arrayOfFilesName", file);
        });

        // FIXME: ???
        const requestOptions = {
            method: "POST",
            body: formData,
        };
        const response = await fetch(URL, requestOptions);
        const data = await response.json();
    };
    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        console.log(e);
        console.log(fileList);
        e.preventDefault();
        fileSubmit();
    };

    return (
        <div className={styles.box}>
            <h2 className={styles.header}>React drop files input</h2>
            <div className={styles.flex}>
                <form>
                    <div
                        ref={wrapperRef}
                        className={styles.drop_file_input}
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        <div className={styles.drop_fileinput__label}>
                            {/* <img src={uploadImg} alt="" /> */}
                            <p>Drag & Drop your files here</p>
                            <p>OR</p>
                            <p>Click</p>
                        </div>
                        <input type="file" value="" onChange={onFileDrop} />
                    </div>
                </form>
                <div className={styles.drop_file_preview}>
                    <div className={styles.drop_file_preview__area}>
                        <div className={styles.drop_file_preview__title}>
                            <p>Ready to upload</p>
                        </div>
                        <div className={styles.drop_file_preview__list}>
                            {fileList.map((item, index) => (
                                <div
                                    key={index}
                                    className={styles.drop_file_preview__item}
                                >
                                    {/* <img
                                        src={
                                            ImageConfig[item.type.split("/")[1]] ||
                                            ImageConfig["default"]
                                        }
                                        alt=""
                                        /> */}
                                    <div
                                        className={
                                            styles.drop_file_preview__item__info
                                        }
                                    >
                                        <p>{item.name}</p>
                                        <p>{item.size}B</p>
                                    </div>
                                    <span
                                        className={
                                            styles.drop_file_preview__item__del
                                        }
                                        onClick={() => fileRemove(item)}
                                    >
                                        x
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        className={styles.drop_file_preview__button}
                        // onSubmit={handleSubmit}
                        onClick={handleSubmit}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DropFileInput;
