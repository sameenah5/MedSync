import axios from "axios";

export async function POST(req) {

  try {

    const { message, weight, height, age } = await req.json();

    let bmi = null;
    let bmiCategory = "";

    if (weight && height) {

      const h = height / 100;

      bmi = (weight / (h * h)).toFixed(1);

      if (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi < 25) bmiCategory = "Normal weight";
      else if (bmi < 30) bmiCategory = "Overweight";
      else bmiCategory = "Obese";

    }

    const prompt = `
You are a professional medical AI assistant.

User Symptoms:
${message}

User Information:
Age: ${age || "Not provided"}
Weight: ${weight || "Not provided"} kg
Height: ${height || "Not provided"} cm
BMI: ${bmi || "Not available"} ${bmiCategory}

IMPORTANT RESPONSE FORMAT RULES:

Use **clean markdown formatting**.

Each section must follow this format exactly:

**Possible Causes:**
- Cause 1
- Cause 2
- Cause 3

**Recommended Tests:**
- Test 1
- Test 2

**Diet Advice:**
- Advice 1
- Advice 2

**Prevention Tips:**
- Tip 1
- Tip 2

**When To See A Doctor:**
- Warning symptom 1
- Warning symptom 2

**BMI Insight:**
Explain briefly what the user's BMI means for their health (if BMI available).

**Follow-Up Questions:**
1. Question one?
2. Question two?

Keep explanations short, professional and medically accurate.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = response.data.choices[0].message.content;

    const lower = message.toLowerCase();

    let doctor = "General Physician";
    let emergency = false;

    if (lower.includes("chest pain")) {
      doctor = "Cardiologist";
      emergency = true;
    }

    if (lower.includes("breathing") || lower.includes("shortness")) {
      doctor = "Pulmonologist";
      emergency = true;
    }

    if (lower.includes("skin")) doctor = "Dermatologist";
    if (lower.includes("stomach") || lower.includes("vomit")) doctor = "Gastroenterologist";
    if (lower.includes("anxiety")) doctor = "Psychiatrist";
    if (lower.includes("joint") || lower.includes("bone")) doctor = "Orthopedic";

    return Response.json({
      message: aiText,
      doctor,
      emergency
    });

  } catch (error) {

    console.log("AI ERROR:", error.response?.data || error);

    return Response.json({
      message: "⚠️ Unable to generate medical response. Please try again.",
      doctor: null,
      emergency: false
    });

  }

}