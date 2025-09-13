import axios from "axios";

const API_URL_FARMER = "http://10.34.21.88:8000";
const API_URL_USER = "http://10.34.21.88:8001";
// AI Suggestion tipi
export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'maintenance' | 'harvest' | 'health' | 'weather' | 'general';
  actionText: string;
  icon: string;
}
export async function fetchWeatherRecommendations(ciftci: any, bahce: any) {
  try {
    const response = await axios.post(`${API_URL_FARMER}/api/recommendations/weather`, {
      ciftci: {
        id: ciftci.id,
        ad: ciftci.ad,
        email: ciftci.email,
        konum: ciftci.konum,
      },
      bahce: {
        id: bahce.id,
        ad: bahce.ad,
        bitkiTipi: bahce.bitkiTipi,
        konum: bahce.konum,
        kurulusYili: bahce.kurulusYili,
        agacKapasitesi: bahce.agacKapasitesi,
        ortalamaYillikVerim: bahce.ortalamaYillikVerim
      }
    });
    return response.data; // { havaDurumu: {...}, oneriler: [...] }
  } catch (err) {
    console.error("Weather API error:", err);
    throw err;
  }
}
export async function fetchGardenDescription(formData: any) {
  try {
    
    const requestData = {
      konum: formData.location,
      kurulusYili: parseInt(formData.establishmentYear),
      agacKapasitesi: parseInt(formData.maxTreeCapacity),
      ortalamaYillikVerim: formData.averageYield ,
      bitkiTipi: `${formData.name} ${formData.treeTypes?.[0]}`
    };
    
    const response = await axios.post(`${API_URL_FARMER}/api/recommendations/garden-description`, requestData);
    
    return response.data; // { bahceAciklamasi: "..." }
  } catch (err) {
    console.error("Garden API error:", err);
    throw err;
  }
}

export async function fetchTreeDescription(formData: any) {
  try {
    
    const requestData = {
      ad: formData.name || "",
      tur: formData.type || "",
      yas: parseInt(formData.age) || 0,
      saglikDurumu: formData.health || "",
      tahminiHasat: formData.expectedHarvest || "",
      yillikKira: formData.rentalPrice || ""
    };
    
    const response = await axios.post(`${API_URL_FARMER}/api/recommendations/tree-description`, requestData);
    return response.data; // { aciklama: "..." } veya { agacAciklamasi: "..." }
  } catch (err) {
    console.error("Tree Description API error:", err);
    throw err;
  }
}

export async function fetchTreeStory(formData: any) {
  try {
    
    const requestData = {
      ad: formData.name || "",
      tur: formData.type || "",
      yas: parseInt(formData.age) || 0,
      saglikDurumu: formData.health || "",
      tahminiHasat: formData.expectedHarvest || "",
      yillikKira: formData.rentalPrice || ""
    };
    
    const response = await axios.post(`${API_URL_FARMER}/api/recommendations/tree-story`, requestData);
    
    return response.data; // { hikaye: "..." } veya { agacHikayesi: "..." }
  } catch (err) {
    console.error("Tree Story API error:", err);
    throw err;
  }
}

export const getRecommendations = async (customerId: string, algo = "hybrid", k = 10) => {
  try {
    const response = await fetch(
      `${API_URL_USER}/recommendations/${customerId}?algo=${algo}&k=${k}`
    );
    if (!response.ok) {
      throw new Error("API isteği başarısız");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Öneri API hatası:", error);
    return null;
  }
};

// 🔹 Anomali uyarıları (JSON)
export async function getAnomalyAlerts(customerId: string) {
  try {
    const res = await axios.get(`${API_URL_USER}/api/anomaly-alerts/${customerId}`);
    return res.data; // { customer_id, alerts: [...], yields: [...] }
  } catch (err) {
    console.error("Anomaly Alerts API error:", err);
    throw err;
  }
}

export async function getAnomalyGraph(customerId: string): Promise<string> {
  try {
    const res = await axios.get(
      `${API_URL_USER}/api/anomaly-alerts/${customerId}/graph`,
      { responseType: "arraybuffer" } // 🔑 Burada arraybuffer olacak
    );

    // Binary → Base64 dönüştür
    const bytes = new Uint8Array(res.data);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    const base64 = global.btoa(binary); // RN ve tarayıcıda var
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.error("Anomaly Graph API error:", err);
    throw err;
  }
}

