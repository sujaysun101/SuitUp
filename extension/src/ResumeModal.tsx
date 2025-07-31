import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./components/ui/dialog.tsx";
import { Button } from "./components/ui/button.tsx";
import { Input } from "./components/ui/input.tsx";
import { Textarea } from "./components/ui/textarea.tsx";

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  job: { title: string; company: string } | null;
  onAnalyze: (resume: string) => void;
  loading: boolean;
  result: string | null;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ open, onClose, job, onAnalyze, loading, result }) => {
  const [resumeText, setResumeText] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => setResumeText(ev.target?.result as string || "");
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Resume Tailor AI</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <div className="mb-2 text-sm text-gray-600">Job Detected:</div>
          <div className="font-medium text-gray-900">{job?.title || "N/A"}</div>
          <div className="text-gray-700">{job?.company || "N/A"}</div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Upload your resume:</label>
          <Input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFile} />
          {fileName && <div className="text-xs text-gray-500 mt-1">{fileName}</div>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Or paste your resume text:</label>
          <Textarea value={resumeText} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResumeText(e.target.value)} placeholder="Paste your resume content here..." rows={6} />
        </div>
        <DialogFooter>
          <Button onClick={() => onAnalyze(resumeText)} disabled={loading || !resumeText} className="w-full">
            {loading ? "Analyzing..." : "Analyze & Tailor Resume"}
          </Button>
        </DialogFooter>
        {result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
            {result}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
