import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import UploadQuestions from "../components/Admin/UploadQuestions";
import AdminAddQuestions from "../components/Admin/ManualQuestionForm";
import CategoryManager from "../components/Admin/CategoryManager";
import { FolderKanban, FileUp, FilePlus, XCircle } from "lucide-react";

Modal.setAppElement("#root");

const AdminDashboard = () => {
  const [modalType, setModalType] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Prevent navigating back to login after login
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const handleManualSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const token = user?.token;
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/quiz/manual-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (response.ok) {
        setSubmissionSuccess(true);
      }
    } catch (error) {
      console.error("Manual submission failed", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">🛠️ Admin Dashboard</h1>

      {/* Grid for Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div
          onClick={() => openModal("manage")}
          className="bg-white hover:bg-gray-50 cursor-pointer rounded-xl p-6 shadow border text-center transition"
        >
          <FolderKanban className="w-10 h-10 mx-auto text-blue-600 mb-2" />
          <h2 className="text-lg font-semibold text-gray-700">Manage Categories</h2>
          <p className="text-gray-500 text-sm">View or delete quiz categories.</p>
        </div>
        <div
          onClick={() => openModal("upload")}
          className="bg-white hover:bg-gray-50 cursor-pointer rounded-xl p-6 shadow border text-center transition"
        >
          <FileUp className="w-10 h-10 mx-auto text-green-600 mb-2" />
          <h2 className="text-lg font-semibold text-gray-700">Upload Questions</h2>
          <p className="text-gray-500 text-sm">Bulk upload questions via CSV file.</p>
        </div>
        <div
          onClick={() => openModal("add")}
          className="bg-white hover:bg-gray-50 cursor-pointer rounded-xl p-6 shadow border text-center transition"
        >
          <FilePlus className="w-10 h-10 mx-auto text-purple-600 mb-2" />
          <h2 className="text-lg font-semibold text-gray-700">Add Questions Manually</h2>
          <p className="text-gray-500 text-sm">Add questions one-by-one with details.</p>
        </div>
      </div>

      {/* Large Responsive Modal */}
      <Modal
        isOpen={modalType !== null}
        onRequestClose={closeModal}
        contentLabel="Admin Modal"
        className="w-full max-w-5xl h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-6 relative mx-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {modalType === "manage" && <CategoryManager />}
        {modalType === "upload" && <UploadQuestions />}
        {modalType === "add" && (
          <AdminAddQuestions
            onSubmit={handleManualSubmit}
            submissionSuccess={submissionSuccess}
            setSubmissionSuccess={setSubmissionSuccess}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
