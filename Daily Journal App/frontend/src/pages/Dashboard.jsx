import { useEffect, useState } from "react";
import { getEntries, createEntry } from "../api/api";
import Navbar from "../components/Navbar";
import { analyzeMood } from "../utils/sentimentAnalysis";
import JournalEditor from "../components/JournalEditor";
import VoiceInput from "../components/VoiceInput";

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState(""); // State for journal entry content

  // Fetch entries when the component mounts
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await getEntries(token);
        setEntries(data);
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      }
    };
    fetchEntries();
  }, []);

  // Handle saving a new entry
  const handleSave = async () => {
    if (!content.trim()) {
      alert("Entry content cannot be empty!");
      return;
    }

    try {
      const mood = analyzeMood(content); // Analyze mood from content
      const token = localStorage.getItem("token");

      // Create a new entry
      await createEntry({ content, mood }, token);

      // Clear the content after saving
      setContent("");

      // Refresh the entries list
      const { data } = await getEntries(token);
      setEntries(data);
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold">Your Journal Entries</h2>

        {/* Display existing entries */}
        {entries.map((entry) => (
          <div key={entry._id} className="p-4 border rounded my-4">
            <h3 className="text-xl font-bold">{entry.title}</h3>
            <p>{entry.content}</p>
            <span className="text-sm text-gray-500">Mood: {entry.mood}</span>
          </div>
        ))}

        {/* Journal Editor and Voice Input */}
        <div className="mt-8">
          <JournalEditor content={content} setContent={setContent} />
          <VoiceInput setContent={setContent} />
          <button
            onClick={handleSave}
            disabled={!content.trim()} // Disable button if content is empty
            className="bg-blue-500 text-white p-2 mt-4 disabled:bg-gray-400"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;