import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

/**
 * @link https://github.com/trananhtuat/react-drop-file-input/blob/main/src/App.js
 */

// import "./App.css";

import DropFileInput from "../../components/fileConvert/DropFileInput";

function App() {
    const onFileChange = (files: File[]) => {
        console.log(files);
    };

    return (
        <div className="box">
            <h2 className="header">React drop files input</h2>
            <DropFileInput
                onFileChange={(files: File[]) => onFileChange(files)}
            />
        </div>
    );
}

export default App;
