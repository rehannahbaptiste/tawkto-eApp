export async function createAppointmentDeepLink({ serviceId, branchId }) {
  const response = await fetch(`${process.env.IGOVTT_API_BASE_URL}/deeplink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      devKey: process.env.IGOVTT_DEV_KEY,
      token: process.env.IGOVTT_TOKEN
    },
    body: JSON.stringify({
      attributes: {
        serviceId,
        branchId
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`iGovTT API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const message = data?.responses?.find((item) => item.type === "text")?.message;

  const urlMatch = message?.match(/https?:\/\/\S+/);
  const appointmentUrl = urlMatch ? urlMatch[0] : null;

  return {
    message,
    appointmentUrl
  };
}