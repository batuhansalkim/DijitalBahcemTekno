import axios from "axios";

const API_URL = "http://10.34.21.88:8000";

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
    const response = await axios.post(`${API_URL}/api/recommendations/weather`, {
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
    
    const response = await axios.post(`${API_URL}/api/recommendations/garden-description`, requestData);
    
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
    
    const response = await axios.post(`${API_URL}/api/recommendations/tree-description`, requestData);
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
    
    const response = await axios.post(`${API_URL}/api/recommendations/tree-story`, requestData);
    
    return response.data; // { hikaye: "..." } veya { agacHikayesi: "..." }
  } catch (err) {
    console.error("Tree Story API error:", err);
    throw err;
  }
}

