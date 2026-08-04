import test from "node:test";
import assert from "node:assert/strict";

import cloudinary from "../../config/cloudinary.js";
import { Resume } from "./resume.model.js";
import { aiService } from "../../services/ai/ai.service.js";
import * as resumeService from "./resume.service.js";

test("uploadResume falls back when Cloudinary upload and analysis fail", async () => {
  const originalUploadStream = cloudinary.uploader.upload_stream;
  const originalFindOneAndUpdate = Resume.findOneAndUpdate;
  const originalAnalyzeResume = aiService.analyzeResume;

  cloudinary.uploader.upload_stream = (_options, callback) => {
    callback(new Error("Cloudinary upload failed"), null);
    return {
      end() {},
    };
  };

  Resume.findOneAndUpdate = async () => ({
    _id: "resume-1",
    url: "",
    publicId: "",
    analysis: {
      skills: [],
      projects: [],
      experience: [],
      education: [],
      certifications: [],
      strengths: [],
      weaknesses: [],
      summary: "Resume analysis unavailable.",
    },
  });

  aiService.analyzeResume = async () => {
    throw new Error("AI analysis failed");
  };

  try {
    const result = await resumeService.uploadResume({
      userId: "user-1",
      file: {
        buffer: Buffer.from("this is not a valid pdf"),
        mimetype: "application/pdf",
      },
    });

    assert.equal(result.url, "");
    assert.equal(result.publicId, "");
    assert.equal(result.analysis.summary, "Resume analysis unavailable.");
  } finally {
    cloudinary.uploader.upload_stream = originalUploadStream;
    Resume.findOneAndUpdate = originalFindOneAndUpdate;
    aiService.analyzeResume = originalAnalyzeResume;
  }
});
