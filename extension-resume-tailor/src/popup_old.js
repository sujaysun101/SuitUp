"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
// ...removed chrome reference and declaration...
var react_1 = require("react");
var button_1 = require("../../extension/src/components/ui/button");
var card_1 = require("../../extension/src/components/ui/card");
var tabs_1 = require("../../extension/src/components/ui/tabs");
var badge_1 = require("../../extension/src/components/ui/badge");
var switch_1 = require("../../extension/src/components/ui/switch");
var tooltip_1 = require("../../extension/src/components/ui/tooltip");
var PopupApp = function () {
    var _a = (0, react_1.useState)(null), currentJob = _a[0], setCurrentJob = _a[1];
    var _b = (0, react_1.useState)([]), savedResumes = _b[0], setSavedResumes = _b[1];
    var _c = (0, react_1.useState)('current'), activeTab = _c[0], setActiveTab = _c[1];
    var _d = (0, react_1.useState)(true), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(true), isDarkMode = _e[0], setIsDarkMode = _e[1];
    var _f = (0, react_1.useState)(0), analysisProgress = _f[0], setAnalysisProgress = _f[1];
    (0, react_1.useEffect)(function () {
        loadData();
    }, []);
    var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, localData, jobEntries, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    // Get current tab URL to check if we're on a job site
                    return [4 /*yield*/, chrome.tabs.query({ active: true, currentWindow: true })];
                case 1:
                    // Get current tab URL to check if we're on a job site
                    _a.sent();
                    return [4 /*yield*/, chrome.storage.sync.get(['savedResumes'])];
                case 2:
                    result = _a.sent();
                    setSavedResumes(result.savedResumes || []);
                    return [4 /*yield*/, chrome.storage.local.get()];
                case 3:
                    localData = _a.sent();
                    jobEntries = Object.entries(localData)
                        .filter(function (_a) {
                        var key = _a[0];
                        return key.startsWith('job_');
                    })
                        .map(function (_a) {
                        var value = _a[1];
                        return value;
                    })
                        .sort(function (a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
                    if (jobEntries.length > 0) {
                        setCurrentJob(jobEntries[0]);
                    }
                    setIsLoading(false);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error loading data:', error_1);
                    setIsLoading(false);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleAnalyzeResume = function () {
        // Send message to content script to open analysis panel
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'OPEN_ANALYSIS_PANEL' });
        });
        window.close();
    };
    var handleOpenSettings = function () {
        chrome.runtime.openOptionsPage();
    };
    var formatDate = function (timestamp) {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "w-96 h-64 flex items-center justify-center ".concat(isDarkMode ? 'bg-slate-900' : 'bg-gray-50'), children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2" }), (0, jsx_runtime_1.jsx)("p", { className: "".concat(isDarkMode ? 'text-slate-300' : 'text-gray-600'), children: "Loading..." })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(tooltip_1.TooltipProvider, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "w-96 ".concat(isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900', " transition-colors duration-200"), children: [(0, jsx_runtime_1.jsx)("div", { className: "".concat(isDarkMode
                            ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600', " text-white p-4"), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-lg font-bold flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-cyan-400", children: "\u26A1" }), "Resume Tailor"] }), (0, jsx_runtime_1.jsx)("p", { className: "".concat(isDarkMode ? 'text-slate-300' : 'text-blue-100', " text-sm"), children: "AI-Powered Job Assistant" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-slate-300", children: "\uD83C\uDF19" }), (0, jsx_runtime_1.jsx)(switch_1.Switch, { checked: isDarkMode, onCheckedChange: setIsDarkMode, className: "data-[state=checked]:bg-cyan-600" })] }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { children: (0, jsx_runtime_1.jsx)("p", { children: "Toggle dark mode" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "".concat(isDarkMode ? 'bg-slate-600/50' : 'bg-white/10', " rounded-full w-10 h-10 flex items-center justify-center"), children: (0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: "\uD83C\uDFAF" }) })] })] }) }), (0, jsx_runtime_1.jsx)(tabs_1.Tabs, { value: activeTab, onValueChange: function (val) { return setActiveTab(val); }, className: "w-full", children: (0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "w-full grid grid-cols-2 ".concat(isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100'), children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "current", className: "".concat(isDarkMode ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' : ''), children: "Current Job" }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsTrigger, { value: "history", className: "".concat(isDarkMode ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400' : '', " flex items-center gap-2"), children: ["History", (0, jsx_runtime_1.jsx)(badge_1.Badge, { variant: isDarkMode ? "secondary" : "outline", className: "".concat(isDarkMode ? 'bg-slate-600 text-slate-200' : ''), children: savedResumes.length })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "current", children: currentJob ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(card_1.Card, { className: "mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-900 mb-2", children: "Job Detected" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-700", children: "Title:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-900", children: currentJob.title })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-700", children: "Company:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-900", children: currentJob.company })] }), currentJob.location && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-700", children: "Location:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-900", children: currentJob.location })] }))] })] }) }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: handleAnalyzeResume, className: "w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200", children: [(0, jsx_runtime_1.jsx)("span", { children: "\uD83E\uDD16" }), (0, jsx_runtime_1.jsx)("span", { children: "Analyze & Tailor Resume" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2 mt-2", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "secondary", children: "View Job Details" }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "secondary", onClick: handleOpenSettings, children: "Settings" })] })] })) : ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-4", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No Job Detected" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-sm mb-4", children: "Navigate to a job posting on LinkedIn, Indeed, or other supported sites to get started." }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: loadData, className: "bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors", children: "Refresh" })] })) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "history", children: savedResumes.length > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-900 mb-3", children: "Tailored Resumes" }), savedResumes.slice(0, 5).map(function (resume) { return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "hover:bg-gray-100 transition-colors cursor-pointer", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start mb-2 p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 text-sm", children: resume.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-xs", children: resume.company })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-500 text-xs", children: formatDate(resume.timestamp) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2 p-3 pt-0", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", className: "bg-blue-600 text-white hover:bg-blue-700", children: "View" }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", className: "bg-green-600 text-white hover:bg-green-700", children: "Download" })] })] }, resume.id)); }), savedResumes.length > 5 && ((0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "link", className: "w-full text-blue-600 text-sm font-medium py-2 hover:text-blue-700 transition-colors", children: ["View All (", savedResumes.length, ")"] }))] })) : ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-4", children: "\uD83D\uDCCB" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No Saved Resumes" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-sm", children: "Start tailoring resumes to build your history." })] })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "border-t bg-gray-50 p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "Resume Tailor v1.0.0" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { className: "hover:text-gray-700 transition-colors", children: "Help" }), (0, jsx_runtime_1.jsx)("button", { className: "hover:text-gray-700 transition-colors", children: "Feedback" })] })] }) })] }), "); }; // Initialize the popup const container = document.getElementById('popup-root'); if (container) ", , "const root = createRoot(container); root.render(", (0, jsx_runtime_1.jsx)(PopupApp, {}), "); }"] }));
};
