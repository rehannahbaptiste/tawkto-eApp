export async function getServices() {
  const response = await fetch(`${process.env.IGOVTT_API_BASE_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.IGOVTT_DEV_KEY,
      token: process.env.IGOVTT_TOKEN,
      Authorization:
        "Basic " +
        Buffer.from(`token:${process.env.IGOVTT_TOKEN}`).toString("base64")
    },
    body: JSON.stringify({
      attributes: {
        serviceId: "41",
        branchId: "9",
        branchName: "Port of Spain",
        selected_date: "2025-09-29"
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`iGovTT services API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  const quickReplies = data.responses?.find(
    (item) => item.type === "quickReplies"
  );

  const services = quickReplies?.buttons?.map((button) => ({
    id: button.value,
    name: button.title
  })) || [];

  return {
    question: quickReplies?.title || "Which service do you want?",
    services
  };
}