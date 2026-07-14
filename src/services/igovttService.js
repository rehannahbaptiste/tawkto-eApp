export async function getServices() {
  const response = await fetch(`${process.env.IGOVTT_API_BASE_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": process.env.IGOVTT_DEV_KEY,
      "token": process.env.IGOVTT_TOKEN,
      "Authorization":
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

  const services =
    quickReplies?.buttons?.map((button) => ({
      id: button.value,
      name: button.title
    })) || [];

  return {
    question: quickReplies?.title || "Which service do you want?",
    services
  };
}

export async function createAppointmentDeepLink({ serviceId, branchId }) {
  const response = await fetch(`${process.env.IGOVTT_API_BASE_URL}/deeplink`, {
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
        serviceId,
        branchId
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`iGovTT deeplink API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  const message = data.responses?.find((item) => item.type === "text")?.message;
  const urlMatch = message?.match(/https?:\/\/\S+/);
  const appointmentUrl = urlMatch ? urlMatch[0] : null;

  return {
    message,
    appointmentUrl
  };
}

export async function getBranches({ serviceId }) {
  const response = await fetch(
    `${process.env.IGOVTT_API_BASE_URL}/branches`,
    {
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
          serviceId
        }
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `iGovTT branches API error ${response.status}: ${errorBody}`
    );
  }

  const data = await response.json();

  const messageResponse = data.responses?.find(
    (item) => item.type === "text"
  );

  const cardsResponse = data.responses?.find(
    (item) => item.type === "cards"
  );

  const branches =
    cardsResponse?.elements?.map((element) => {
      const selectButton = element.buttons?.find(
        (button) => button.type === "postback"
      );

      return {
        id: String(selectButton?.value ?? ""),
        name: element.title,
        address: element.subtitle?.replace(/^Address:\s*/i, "") || null
      };
    }).filter((branch) => branch.id && branch.name) ?? [];

  return {
    question:
      messageResponse?.message ||
      "Please select the branch where you would like to book your appointment.",
    serviceId: String(serviceId),
    branches
  };
}

export async function getAvailableDates({ serviceId, branchId }) {
  const response = await fetch(
    `${process.env.IGOVTT_API_BASE_URL}/availableDates`,
    {
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
          serviceId,
          branchId
        }
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `iGovTT available dates API error ${response.status}: ${errorBody}`
    );
  }

  const data = await response.json();

  const quickReplies = data.responses?.find(
    (item) => item.type === "quickReplies"
  );

  const dates =
    quickReplies?.buttons
      ?.map((button) => ({
        label: button.title,
        value: String(button.value)
      }))
      .filter((date) => date.label && date.value) ?? [];

  return {
    question: quickReplies?.title || "Here are the next available dates:",
    serviceId: String(serviceId),
    branchId: String(branchId),
    dates
  };
}

export async function getAvailableTimeSlots({
  serviceId,
  branchId,
  selectedDate
}) {
  const response = await fetch(
    `${process.env.IGOVTT_API_BASE_URL}/timeslots`,
    {
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
          serviceId,
          branchId,
          selected_date: selectedDate
        }
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `iGovTT time slots API error ${response.status}: ${errorBody}`
    );
  }

  const data = await response.json();

  const textResponse = data.responses?.find(
    (item) => item.type === "text"
  );

  const message = textResponse?.message || "";

  const slotCountMatch = message.match(/(\d+)\s+slots?\s+available/i);
  const dateMatch = message.match(
    /slots?\s+available:\s*([^\n]+)/i
  );
  const hoursMatch = message.match(
    /Appt Opening Hours:\s*([^\n]+)/i
  );

  const availableSlotCount = slotCountMatch
    ? Number(slotCountMatch[1])
    : null;

  const dateLabel = dateMatch
    ? dateMatch[1].trim()
    : null;

  const timeRange = hoursMatch
    ? hoursMatch[1].trim()
    : null;

  return {
    message:
      message ||
      "Time-slot availability could not be determined.",
    serviceId: String(serviceId),
    branchId: String(branchId),
    selectedDate: String(selectedDate),
    availableSlotCount,
    dateLabel,
    timeRange,
    hasAvailability:
      availableSlotCount !== null
        ? availableSlotCount > 0
        : null
  };
}