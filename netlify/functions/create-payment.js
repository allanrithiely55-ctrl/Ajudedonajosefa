export async function handler(event) {
  try {
    const { amount } = JSON.parse(event.body);

    // Validação (mínimo e máximo)
    if (amount < 1 || amount > 10000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Valor fora do limite permitido" })
      };
    }

    // Chamada da API ElitePay
    const response = await fetch("https://api.elitepaybr.com/api/v1/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.ELITEPAY_CLIENT_ID,
        "x-client-secret": process.env.ELITEPAY_CLIENT_SECRET
      },
      body: JSON.stringify({
        amount: Number(amount),
        description: "Doação para Dona Josefa",
        payerName: "Apoiador",
        payerDocument: "00000000000"
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        payment_url: data.payment_url || data.qr_code_url
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno no pagamento" })
    };
  }
}
