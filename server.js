import express from "express";
import axios from "axios";
import FormData from "form-data";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ Moodal Backend Server is running!");
});

app.post("/generate-art", async (req, res) => {
  const { mood, subject, style } = req.body;

  if (!mood || !style || !subject) {
    return res
      .status(400)
      .json({ error: "Mood, style, and subject are required." });
  }

  const prompt = `A ${style} artwork of a ${subject} expressing the mood: ${mood}.`;

  const payload = {
    prompt,
    output_format: "jpeg",
  };

  try {
    const response = await axios.postForm(
      "https://api.stability.ai/v2beta/stable-image/generate/sd3",
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer sk-YCDqXBnmcM2i1F52nI8FKRTVtIOWPiL4M3s3tXsjiDAmn0bc`, //  API key
          Accept: "image/*"
        },
      },
    );

    if (response.status === 200) {
      const imageBuffer = Buffer.from(response.data);
      const imageBase64 = imageBuffer.toString("base64");
      const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
      res.json({ url: imageUrl });
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({
      error: "Failed to generate image from the API.",
      details: err.message,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
