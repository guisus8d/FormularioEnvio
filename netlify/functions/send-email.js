const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const params = new URLSearchParams(event.body);
    const data = Object.fromEntries(params);

    const { Numero, correo, Motivo = "Sin motivo" } = data;

    if (!Numero || !correo) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Campos requeridos faltantes" }),
      };
    }

    await resend.emails.send({
      from: "Jesús JM <onboarding@resend.dev>",
      to: ["jimenezmartinezjesus76@gmail.com"],
      subject: `Nuevo contacto: ${Motivo}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><b>Teléfono:</b> ${Numero}</p>
        <p><b>Email:</b> ${correo}</p>
        <p><b>Motivo:</b> ${Motivo}</p>
      `,
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
};
