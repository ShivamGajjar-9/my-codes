import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const JournalEditor = ({ content, setContent }) => {
  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      className="bg-white dark:bg-gray-800 dark:text-white p-2"
    />
  );
};

export default JournalEditor;
