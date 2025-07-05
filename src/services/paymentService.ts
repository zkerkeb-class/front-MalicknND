interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceId: string;
  description: string;
}

interface UserCredits {
  userId: string;
  credits: number;
  canGenerate: boolean;
}

interface PaymentSession {
  sessionId: string;
  url: string;
}

class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ||
      "http://localhost:9001/api";
  }

  // Récupérer les crédits d'un utilisateur
  async getUserCredits(userId: string): Promise<UserCredits> {
    const response = await fetch(`${this.baseUrl}/credits/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMsg = "Failed to fetch user credits";
      try {
        const errorData = await response.json();
        if (errorData?.error) errorMsg += `: ${errorData.error}`;
        if (errorData?.details) errorMsg += ` (${errorData.details})`;
      } catch (e) {
        // ignore, fallback to default error
        console.log(e);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.data;
  }

  // Utiliser des crédits pour générer une image
  async useCredits(
    userId: string,
    amount: number = 1
  ): Promise<{
    creditsUsed: number;
    remainingCredits: number;
    canGenerate: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/credits/use`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        amount,
      }),
    });

    if (!response.ok) {
      if (response.status === 402) {
        throw new Error("Insufficient credits");
      }
      let errorMsg = "Failed to use credits";
      try {
        const errorData = await response.json();
        if (errorData?.error) errorMsg += `: ${errorData.error}`;
        if (errorData?.details) errorMsg += ` (${errorData.details})`;
      } catch (e) {
        console.log(e);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.data;
  }

  // Créer une session de paiement
  async createPaymentSession(
    userId: string,
    creditPackage: string
  ): Promise<PaymentSession> {
    const response = await fetch(`${this.baseUrl}/payment/create-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        creditPackage,
      }),
    });

    if (!response.ok) {
      let errorMsg = "Failed to create payment session";
      try {
        const errorData = await response.json();
        if (errorData?.error) errorMsg += `: ${errorData.error}`;
        if (errorData?.details) errorMsg += ` (${errorData.details})`;
      } catch (e) {
        console.error("Error creating payment session:", e);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.data;
  }

  // Récupérer les packages de crédits disponibles
  async getCreditPackages(): Promise<CreditPackage[]> {
    const response = await fetch(`${this.baseUrl}/packages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMsg = "Failed to fetch credit packages";
      try {
        const errorData = await response.json();
        if (errorData?.error) errorMsg += `: ${errorData.error}`;
        if (errorData?.details) errorMsg += ` (${errorData.details})`;
      } catch (e) {
        console.log(e);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.data;
  }

  // Vérifier si un utilisateur peut générer une image
  async canGenerateImage(userId: string): Promise<boolean> {
    try {
      const userCredits = await this.getUserCredits(userId);
      return userCredits.canGenerate;
    } catch (error) {
      console.error("Error checking if user can generate image:", error);
      return false;
    }
  }

  // Rediriger vers la page de paiement
  redirectToPayment(userId: string, creditPackage: string): void {
    this.createPaymentSession(userId, creditPackage)
      .then((session) => {
        window.location.href = session.url;
      })
      .catch((error) => {
        console.error("Error creating payment session:", error);
        window.location.href = "/pricing?error=payment_failed";
      });
  }
}

export const paymentService = new PaymentService();
