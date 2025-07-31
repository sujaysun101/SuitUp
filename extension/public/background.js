// Background service worker for Resume Tailor Chrome Extension
/// <reference types="chrome" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// Listen for extension installation
chrome.runtime.onInstalled.addListener(function (details) {
    console.log('Resume Tailor extension installed:', details);
    // Set default settings
    chrome.storage.sync.set({
        isEnabled: true,
        aiProvider: 'openai',
        autoDetectJobs: true,
        savedResumes: []
    });
});
// Listen for tab updates to detect job posting pages
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        // Check if we're on a supported job site
        var jobSites = [
            'linkedin.com/jobs',
            'indeed.com',
            'jobs.google.com',
            'glassdoor.com'
        ];
        var isJobSite = jobSites.some(function (site) { return tab.url.includes(site); });
        if (isJobSite) {
            // Inject content script if not already present
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }).catch(function (err) {
                // Script might already be injected
                console.log('Content script injection skipped:', err.message);
            });
        }
    }
});
// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case 'JOB_DETECTED':
            if (sender.tab) {
                handleJobDetection(message.data, sender.tab);
            }
            break;
        case 'ANALYZE_RESUME':
            handleResumeAnalysis(message.data);
            break;
        case 'SAVE_TAILORED_RESUME':
            handleSaveTailoredResume(message.data);
            break;
        case 'GET_STORAGE_DATA':
            chrome.storage.sync.get(message.keys, function (result) {
                sendResponse(result);
            });
            return true; // Keep message channel open for async response
        default:
            console.log('Unknown message type:', message.type);
    }
});
function handleJobDetection(jobData, tab) {
    return __awaiter(this, void 0, void 0, function () {
        var storageKey;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Job detected:', jobData);
                    storageKey = "job_".concat(Date.now());
                    return [4 /*yield*/, chrome.storage.local.set((_a = {},
                            _a[storageKey] = __assign(__assign({}, jobData), { url: tab === null || tab === void 0 ? void 0 : tab.url, timestamp: Date.now() }),
                            _a))];
                case 1:
                    _b.sent();
                    // Show notification badge
                    chrome.action.setBadgeText({
                        text: '!',
                        tabId: tab === null || tab === void 0 ? void 0 : tab.id
                    });
                    chrome.action.setBadgeBackgroundColor({
                        color: '#4CAF50'
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function handleResumeAnalysis(data) {
    return __awaiter(this, void 0, void 0, function () {
        var analysisResult;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Analyzing resume:', data);
                    analysisResult = {
                        matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
                        missingKeywords: ['collaboration', 'data visualization', 'agile'],
                        suggestions: [
                            {
                                original: 'Developed internal dashboards using React',
                                improved: 'Built data visualization dashboards using React, collaborating with cross-functional teams to enhance internal reporting'
                            }
                        ]
                    };
                    // Store analysis result
                    return [4 /*yield*/, chrome.storage.local.set((_a = {},
                            _a["analysis_".concat(Date.now())] = analysisResult,
                            _a))];
                case 1:
                    // Store analysis result
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function handleSaveTailoredResume(resumeData) {
    return __awaiter(this, void 0, void 0, function () {
        var result, savedResumes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Saving tailored resume:', resumeData);
                    return [4 /*yield*/, chrome.storage.sync.get(['savedResumes'])];
                case 1:
                    result = _a.sent();
                    savedResumes = result.savedResumes || [];
                    // Add new tailored resume
                    savedResumes.push(__assign(__assign({}, resumeData), { id: Date.now(), timestamp: Date.now() }));
                    // Save back to storage
                    return [4 /*yield*/, chrome.storage.sync.set({ savedResumes: savedResumes })];
                case 2:
                    // Save back to storage
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
