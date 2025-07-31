
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ResumeModal } from "./ResumeModal";

const MODAL_ID = "resume-tailor-react-modal";

type Job = { title: string; company: string };

export function openResumeTailorModal(job: Job) {
  let modalRoot = document.getElementById(MODAL_ID);
  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = MODAL_ID;
    modalRoot.style.position = "fixed";
    modalRoot.style.top = "0";
    modalRoot.style.left = "0";
    modalRoot.style.width = "100vw";
    modalRoot.style.height = "100vh";
    modalRoot.style.zIndex = "2147483647";
    modalRoot.style.background = "rgba(0,0,0,0.5)";
    document.body.appendChild(modalRoot);
  }

  function ModalContainer() {
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleAnalyze = async (_resumeText: string) => {
      setLoading(true);
      // Simulate AI analysis
      setTimeout(() => {
        setResult("Your resume has been tailored for this job! (AI output placeholder)");
        setLoading(false);
      }, 1500);
    };

    useEffect(() => {
      if (!open) {
        setTimeout(() => {
          const el = document.getElementById(MODAL_ID);
          if (el) el.remove();
        }, 200);
      }
    }, [open]);

    return (
      <ResumeModal
        open={open}
        onClose={() => setOpen(false)}
        job={job}
        onAnalyze={handleAnalyze}
        loading={loading}
        result={result}
      />
    );
  }

  createRoot(modalRoot).render(<ModalContainer />);
}

// Listen for messages from the extension to open the modal
declare global {
  interface Window {
    __RESUME_TAILOR_JOB__?: { title: string; company: string };
  }
}

chrome.runtime.onMessage.addListener((message: any) => {
  if (message.type === "OPEN_ANALYSIS_PANEL") {
    const job = window.__RESUME_TAILOR_JOB__ || { title: "Job Title", company: "Company" };
    openResumeTailorModal(job);
  }
});
