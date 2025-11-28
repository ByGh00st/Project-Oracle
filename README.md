# Project Oracle 👁️


**Yapay Zeka Destekli Yeni Nesil Gözetim ve Güvenlik Analiz Sistemi**

Project Oracle, güvenlik kamerası akışlarını gerçek zamanlı olarak analiz eden, potansiyel tehditleri belirleyen ve operatöre anlık durumsal farkındalık sağlayan, React ve Google Gemini API tabanlı gelişmiş bir web uygulamasıdır.

![Status](https://img.shields.io/badge/Status-Active-success)
![Tech](https://img.shields.io/badge/AI-Gemini_2.5_Flash-blue)
![Style](https://img.shields.io/badge/UI-Cyberpunk-purple)
<img src="https://img.shields.io/badge/System-By_Ghost-black?style=for-the-badge" alt="Architected by ByGhost" />


## 🚀 Proje Hakkında

Bu uygulama, geleneksel güvenlik izleme panellerini yapay zeka ile birleştirir. Sistem, video akışından alınan kareleri **Google Gemini 2.5 Flash** modeline gönderir. Model, **YOLOv8 (You Only Look Once)** bilgisayarlı görü mimarisini simüle ederek nesneleri (insan, araç, silah, çanta vb.) algılar ve ortamın güvenlik tehdit seviyesini analiz eder.

Arayüz, güvenlik personeline fütüristik, dikkat dağıtmayan ve veri odaklı bir deneyim sunmak için "Sci-Fi/Cyberpunk" estetiğiyle tasarlanmıştır.

## ✨ Temel Özellikler

*   **Gerçek Zamanlı Nesne Tanıma:** Video akışı üzerinden insanları, araçları ve şüpheli nesneleri tanımlar (COCO veri seti sınıfları baz alınarak).
*   **Tehdit Analizi:** Görüntüdeki bağlama göre (örn. "bıçak taşıyan bir kişi" veya "terk edilmiş çanta") otomatik tehdit seviyesi belirler (DÜŞÜK, ORTA, YÜKSEK, KRİTİK).
*   **YOLOv8 Simülasyonu:** Gemini 2.5 Flash modeline özel sistem talimatları verilerek, bounding box (sınırlayıcı kutu) koordinatları ve güven skorları ile yapılandırılmış JSON çıktısı üretilir.
*   **Olay Günlüğü:** Yüksek tehdit içeren durumlar veya önemli tespitler otomatik olarak zaman damgasıyla kaydedilir.
*   **İstatistiksel Grafikler:** Zaman içindeki nesne yoğunluğunu gösteren canlı grafikler.
*   **Kamera Yönetimi:** Cihazın arka kamerasını (varsa) veya web kamerasını otomatik algılar ve hataları yönetir.

## 🛠️ Teknolojiler

*   **Frontend:** React 19, TypeScript
*   **Stil:** Tailwind CSS (Özel animasyonlar ve cam morfizmi efektleri ile)
*   **AI Motoru:** Google Gemini 2.5 Flash (`@google/genai` SDK)
*   **İkonlar:** Lucide React
*   **Grafikler:** Recharts

## ⚙️ Kurulum ve Çalıştırma

Proje, tarayıcı tabanlı bir ortamda çalışmak üzere tasarlanmıştır.

1.  **Gereksinimler:**
    *   Node.js yüklü bir ortam.
    *   Geçerli bir Google Gemini API Anahtarı (`API_KEY`).

2.  **API Anahtarı:**
    *   Uygulama `process.env.API_KEY` üzerinden anahtarı okur. `.env` dosyanızda veya çalışma ortamınızda bu değişkenin tanımlı olduğundan emin olun.

3.  **Başlatma:**
    Uygulama tarayıcıda açıldığında, kamera izni isteyecektir. İzin verildikten sonra "BAŞLAT" butonuna basarak analiz döngüsünü aktifleştirebilirsiniz.

## 🧠 Nasıl Çalışır?

1.  **Görüntü Yakalama:** `VideoFeed` bileşeni, `<video>` elementinden her 3 saniyede bir (veya belirlenen aralıkta) bir kare yakalar ve bunu Base64 formatına dönüştürür.
2.  **AI İşleme:** Yakalanan kare, `geminiService.ts` aracılığıyla Google'ın sunucularına gönderilir.
3.  **Prompt Mühendisliği:** Modele, bir YOLOv8 motoru gibi davranması, nesneleri tespit etmesi ve koordinat (bounding box) döndürmesi için özel bir "System Instruction" verilir.
4.  **Veri Görselleştirme:** Dönen JSON verisi ayrıştırılır; tespit edilen nesneler, tehdit seviyesi ve özet bilgi arayüzde (HUD) operatöre sunulur.

## ⚠️ Yasal Uyarı

Bu proje bir kavram kanıtı (Proof of Concept) ve eğitim amaçlı geliştirilmiştir. Gerçek bir güvenlik sistemi olarak kullanılması durumunda, kişisel verilerin korunması (KVKK/GDPR) ve kamera izleme yasalarına uyumluluk kullanıcının sorumluluğundadır.

---
*Developed Byghost *
<a href="https://byghost.tr" target="_blank" rel="noopener" style="text-decoration: none;">
<img src="https://img.shields.io/badge/Official_Site-byghost.tr-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="byghost.tr Official Website" />
</a>
<p style="color: #666; font-size: 12px; margin-top: 10px;">

