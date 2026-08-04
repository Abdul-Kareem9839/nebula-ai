import cloudinary from "../../config/cloudinary.js";
import { Resume } from "./resume.model.js";
import { aiService } from "../../services/ai/ai.service.js";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export async function uploadResume({ userId, file }) {
  let uploaded = null;
  let extractedText = "";
  let analysis = {
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    strengths: [],
    weaknesses: [],
    summary: "Resume analysis unavailable.",
  };

  try {
    uploaded = await uploadToCloudinary(file);
  } catch (error) {
    console.warn(
      "Cloudinary upload failed, continuing with local fallback.",
      error.message,
    );
  }

  try {
    extractedText = await extractText(file);
  } catch (error) {
    console.warn(
      "Resume text extraction failed, continuing with empty text.",
      error.message,
    );
  }

  try {
    const aiAnalysis = await aiService.analyzeResume({
      resumeUrl: uploaded?.secure_url || "",
      text: extractedText,
    });

    if (aiAnalysis && typeof aiAnalysis === "object") {
      analysis = aiAnalysis;
    }
  } catch (error) {
    console.warn(
      "Resume analysis failed, using fallback analysis.",
      error.message,
    );
  }

  const resume = await Resume.findOneAndUpdate(
    { userId },
    {
      userId,
      url: uploaded?.secure_url || "",
      publicId: uploaded?.public_id || "",
      analysis,
      uploadedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
    },
  );

  return resume;
}

export async function getResume(userId) {
  return Resume.findOne({ userId });
}

export async function deleteResume(userId) {
  const resume = await Resume.findOne({ userId });

  if (!resume) return;

  await cloudinary.uploader.destroy(resume.publicId);

  await Resume.deleteOne({ userId });
}

async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "nebula/resumes",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result);
      },
    );

    stream.end(file.buffer);
  });
}

async function extractText(file) {
  const buffer = file.buffer;

  if (file.mimetype === "application/pdf") {
    const parsed = await pdfParse(buffer);
    return parsed.text || "";
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value || "";
  }

  return "";
}
