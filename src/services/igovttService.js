export async function createAppointmentDeepLink({ serviceId, branchId }) {
  const response = await fetch(`${process.env.IGOVTT_API_BASE_URL}/deeplink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // Adjust these header names if your existing API expects different names
      "devKey": process.env.IGOVTT_DEV_KEY,
      "token": process.env.IGOVTT_TOKEN
    },
    body: JSON.stringify({
      attributes: {
        serviceId,
        branchId
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`iGovTT API failed: ${response.status} ${errorText}`);
  }

  return response.json();
}