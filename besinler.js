/* NUTRIO — MERKEZİ BESİN KÜTÜPHANESİ (DEFAULT SEED VERİSİ)
   ============================================================
   Bu dosya Nutrio'nun herkese açık varsayılan besin kütüphanesidir.
   SADECE besin verisi içerir; burada uygulama kodu (UI, migration vb.) bulunmaz.

   NASIL DÜZENLENİR?
   - Ürün eklemek:  ilgili kategori bloğunun altına yeni bir { ... } satırı ekle.
     Yeni eklediğin ürüne benzersiz bir "id" ver (mevcut id'lerle çakışmasın;
     kullanıcı besinleri Date.now() ile büyük id alır — çakışmayı önlemek için
     100000 üstü gibi bir id kullanabilirsin).
   - Ürün silmek:   ilgili satırı sil.
   - Düzenlemek:    ad / marka / kategori / birim / ref / cal / pro / yag / karb
                    alanlarını doğrudan satır üzerinde güncelle.
   - Ürün taşımak:  satırı kes, doğru kategori bloğunun altına yapıştır.
   - Kategori anahtarları (SABİT — değiştirme):
       et, balik, sut, tahil, sebze_meyve, yag, yemek, tatli, icecek, diger

   ÖNEMLİ — KULLANICI VERİSİ AYRIMI:
   Bu dosyadaki veriler "default seed"dir. Kullanıcı uygulama içinde bir besini
   düzenlediğinde bu değişiklik kendi cihazına (localStorage) yazılır. Bu dosyada
   sonradan yaptığın değişiklikler KULLANICININ özelleştirmesini EZMEZ.
   Yeni eklediğin satırlar mevcut kullanıcılara NUTRIO_SEED_VERSION sayesinde
   bir kez, güvenli şekilde sunulur (duplicate oluşmaz).

   SEED_VERSION: Bu dosyada besin EKLEDİĞİNDE veya seed verisini değiştirdiğinde
   NUTRIO_SEED_VERSION değerini 1 artır.
*/

const NUTRIO_SEED_VERSION = 3;

const NUTRIO_BESINLER = [
    // ET & TAVUK
        { id: 49, ad: "Dana Antrikot", marka: "", kategori: "et", birim: "g", ref: 100, cal: 216, pro: 19, yag: 15, karb: 0 },
        { id: 51, ad: "Dana Biftek", marka: "", kategori: "et", birim: "g", ref: 100, cal: 210, pro: 20, yag: 14, karb: 0 },
        { id: 48, ad: "Dana Bonfile", marka: "", kategori: "et", birim: "g", ref: 100, cal: 190, pro: 21, yag: 11, karb: 0 },
        { id: 47, ad: "Dana Kıyma", marka: "", kategori: "et", birim: "g", ref: 100, cal: 215, pro: 18.5, yag: 15, karb: 0 },
        { id: 50, ad: "Dana Kuşbaşı", marka: "", kategori: "et", birim: "g", ref: 100, cal: 200, pro: 20, yag: 13, karb: 0 },
        { id: 46, ad: "Hindi But", marka: "", kategori: "et", birim: "g", ref: 100, cal: 140, pro: 19, yag: 7, karb: 0 },
        { id: 58, ad: "Hindi Füme", marka: "", kategori: "et", birim: "g", ref: 100, cal: 104, pro: 17, yag: 3, karb: 1 },
        { id: 45, ad: "Hindi Göğüsü", marka: "", kategori: "et", birim: "g", ref: 100, cal: 104, pro: 22, yag: 1, karb: 0 },
        { id: 4, ad: "Kırmızı Et", marka: "", kategori: "et", birim: "g", ref: 100, cal: 250, pro: 26, yag: 15, karb: 0 },
        { id: 55, ad: "Köfte", marka: "", kategori: "et", birim: "adet", ref: 1, cal: 55, pro: 4, yag: 3.5, karb: 1.5 },
        { id: 54, ad: "Kuzu Kıyma", marka: "", kategori: "et", birim: "g", ref: 100, cal: 240, pro: 18, yag: 18, karb: 0 },
        { id: 53, ad: "Kuzu Kuşbaşı", marka: "", kategori: "et", birim: "g", ref: 100, cal: 225, pro: 19, yag: 16, karb: 0 },
        { id: 52, ad: "Kuzu Pirzola", marka: "", kategori: "et", birim: "g", ref: 100, cal: 235, pro: 20, yag: 17, karb: 0 },
        { id: 57, ad: "Pastırma", marka: "", kategori: "et", birim: "g", ref: 100, cal: 380, pro: 20, yag: 32, karb: 1 },
        { id: 56, ad: "Sucuk", marka: "", kategori: "et", birim: "g", ref: 100, cal: 460, pro: 18, yag: 40, karb: 2 },
        { id: 1, ad: "Tavuk", marka: "", kategori: "et", birim: "g", ref: 100, cal: 122, pro: 16, yag: 6, karb: 0 },
        { id: 43, ad: "Tavuk But", marka: "", kategori: "et", birim: "g", ref: 100, cal: 184, pro: 18.5, yag: 11, karb: 0 },
        { id: 3, ad: "Tavuk Ciğeri", marka: "", kategori: "et", birim: "g", ref: 100, cal: 122, pro: 16, yag: 6, karb: 0 },
        { id: 59, ad: "Tavuk Füme", marka: "", kategori: "et", birim: "g", ref: 100, cal: 115, pro: 17, yag: 4.5, karb: 1.5 },
        { id: 2, ad: "Tavuk Göğüsü", marka: "", kategori: "et", birim: "g", ref: 100, cal: 102, pro: 23, yag: 0.7, karb: 0 },
        { id: 44, ad: "Tavuk Kanat", marka: "", kategori: "et", birim: "g", ref: 100, cal: 203, pro: 22, yag: 12, karb: 0 },

    // BALIK & DENİZ ÜRÜNLERİ
        { id: 74, ad: "Ahtapot", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 82, pro: 15, yag: 1, karb: 2 },
        { id: 67, ad: "Alabalık", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 140, pro: 19, yag: 6.5, karb: 0 },
        { id: 63, ad: "Çipura", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 110, pro: 19.5, yag: 3, karb: 0 },
        { id: 65, ad: "Hamsi", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 130, pro: 18, yag: 5.5, karb: 0 },
        { id: 75, ad: "İstavrit", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 145, pro: 19, yag: 7.5, karb: 0 },
        { id: 72, ad: "Kalamar", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 92, pro: 16, yag: 1.5, karb: 2 },
        { id: 71, ad: "Karides", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 99, pro: 21, yag: 1, karb: 0 },
        { id: 62, ad: "Levrek", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 105, pro: 20, yag: 2.5, karb: 0 },
        { id: 70, ad: "Lüfer", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 150, pro: 19, yag: 8, karb: 0 },
        { id: 68, ad: "Mezgit", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 90, pro: 18, yag: 1.5, karb: 0 },
        { id: 73, ad: "Midye", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 86, pro: 12, yag: 2.5, karb: 4 },
        { id: 69, ad: "Palamut", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 145, pro: 19, yag: 7, karb: 0 },
        { id: 66, ad: "Sardalya", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 160, pro: 19, yag: 9, karb: 0 },
        { id: 60, ad: "Somon", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 208, pro: 20, yag: 13, karb: 0 },
        { id: 61, ad: "Ton Balığı", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 132, pro: 28, yag: 1, karb: 0 },
        { id: 64, ad: "Uskumru", marka: "", kategori: "balik", birim: "g", ref: 100, cal: 158, pro: 18, yag: 9, karb: 0 },

    // SÜT & YUMURTA
        { id: 85, ad: "Ayran", marka: "", kategori: "sut", birim: "ml", ref: 100, cal: 37, pro: 1.9, yag: 0.9, karb: 5 },
        { id: 78, ad: "Beyaz Peynir", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 264, pro: 17, yag: 21, karb: 2 },
        { id: 81, ad: "Cheddar", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 402, pro: 25, yag: 33, karb: 1.3 },
        { id: 79, ad: "Kaşar Peyniri", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 330, pro: 25, yag: 25, karb: 2 },
        { id: 84, ad: "Kefir", marka: "", kategori: "sut", birim: "ml", ref: 100, cal: 55, pro: 3.2, yag: 1, karb: 4.5 },
        { id: 77, ad: "Lor Peyniri", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 98, pro: 12, yag: 4, karb: 3 },
        { id: 8, ad: "Mozarella Peynir", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 247, pro: 18, yag: 19, karb: 1 },
        { id: 42, ad: "Mozzarella", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 300, pro: 22, yag: 22, karb: 2.2 },
        { id: 82, ad: "Ricotta", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 138, pro: 11, yag: 8, karb: 3 },
        { id: 21, ad: "Ricotta Peynir", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 127, pro: 7.7, yag: 9, karb: 3.9 },
        { id: 9, ad: "Skyr Yoğurt", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 64, pro: 11, yag: 0.2, karb: 4 },
        { id: 24, ad: "Süt Yağlı", marka: "", kategori: "sut", birim: "ml", ref: 100, cal: 61, pro: 3.3, yag: 3.3, karb: 4.7 },
        { id: 22, ad: "Süt Yağsız", marka: "", kategori: "sut", birim: "ml", ref: 100, cal: 34, pro: 3.4, yag: 0, karb: 5.1 },
        { id: 23, ad: "Süt Yarım Yağlı", marka: "", kategori: "sut", birim: "ml", ref: 100, cal: 47, pro: 3.3, yag: 1.6, karb: 4.8 },
        { id: 83, ad: "Süzme Yoğurt", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 59, pro: 10, yag: 0.5, karb: 3.5 },
        { id: 7, ad: "Toz Peynir", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 383, pro: 34, yag: 27, karb: 1 },
        { id: 80, ad: "Tulum Peyniri", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 314, pro: 24, yag: 23, karb: 2 },
        { id: 86, ad: "Yoğunlaştırılmış Süt", marka: "", kategori: "sut", birim: "ml", ref: 100, cal: 135, pro: 6.8, yag: 3.5, karb: 18 },
        { id: 25, ad: "Yoğurt", marka: "", kategori: "sut", birim: "g", ref: 100, cal: 67, pro: 3.6, yag: 3.7, karb: 4.7 },
        { id: 6, ad: "Yumurta", marka: "", kategori: "sut", birim: "adet", ref: 1, cal: 72, pro: 6.28, yag: 4.75, karb: 0.2 },
        { id: 76, ad: "Yumurta Beyazı", marka: "", kategori: "sut", birim: "adet", ref: 1, cal: 17, pro: 3.6, yag: 0.1, karb: 0.2 },

    // TAHIL & BAKLİYAT
        { id: 103, ad: "Barbunya", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 333, pro: 23, yag: 0.8, karb: 60 },
        { id: 11, ad: "Basmati Pirinç", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 358, pro: 5.16, yag: 1.1, karb: 78 },
        { id: 105, ad: "Bezelye", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 81, pro: 5.4, yag: 0.4, karb: 14 },
        { id: 104, ad: "Börülce", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 340, pro: 23, yag: 1.5, karb: 60 },
        { id: 91, ad: "Bulgur", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 342, pro: 12, yag: 1.3, karb: 76 },
        { id: 99, ad: "Çavdar Ekmeği", marka: "", kategori: "tahil", birim: "dilim", ref: 1, cal: 83, pro: 3, yag: 0.5, karb: 16 },
        { id: 13, ad: "Ekmek", marka: "", kategori: "tahil", birim: "dilim", ref: 1, cal: 125, pro: 2.6, yag: 0.5, karb: 25 },
        { id: 90, ad: "Erişte", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 355, pro: 11, yag: 1.5, karb: 70 },
        { id: 87, ad: "Esmer Pirinç", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 362, pro: 7.5, yag: 2.7, karb: 76 },
        { id: 17, ad: "Fasülye", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 326, pro: 13.8, yag: 1.6, karb: 46 },
        { id: 92, ad: "Karabuğday", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 343, pro: 13, yag: 3.4, karb: 72 },
        { id: 100, ad: "Kepekli Ekmek", marka: "", kategori: "tahil", birim: "dilim", ref: 1, cal: 75, pro: 3.5, yag: 1, karb: 14 },
        { id: 102, ad: "Kırmızı Mercimek", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 352, pro: 25, yag: 1, karb: 60 },
        { id: 93, ad: "Kinoa", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 368, pro: 14, yag: 6, karb: 57 },
        { id: 10, ad: "Lungo Pirinç", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 354, pro: 4.02, yag: 0.4, karb: 80 },
        { id: 12, ad: "Makarna", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 352, pro: 7.2, yag: 1.3, karb: 72 },
        { id: 96, ad: "Mısır", marka: "", kategori: "tahil", birim: "adet", ref: 1, cal: 90, pro: 3, yag: 1.5, karb: 19 },
        { id: 97, ad: "Mısır Unu", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 365, pro: 7, yag: 1.5, karb: 79 },
        { id: 16, ad: "Nohut", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 355, pro: 12, yag: 6.1, karb: 48 },
        { id: 98, ad: "Tam Buğday Ekmeği", marka: "", kategori: "tahil", birim: "dilim", ref: 1, cal: 82, pro: 4, yag: 1, karb: 15 },
        { id: 89, ad: "Tam Buğday Makarnası", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 340, pro: 13, yag: 1.5, karb: 68 },
        { id: 95, ad: "Tam Buğday Unu", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 340, pro: 13, yag: 2.5, karb: 72 },
        { id: 101, ad: "Tortilla", marka: "", kategori: "tahil", birim: "adet", ref: 1, cal: 146, pro: 4, yag: 3.5, karb: 24 },
        { id: 14, ad: "Un", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 339, pro: 6, yag: 0.8, karb: 72 },
        { id: 88, ad: "Yasemin Pirinci", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 356, pro: 6.8, yag: 0.6, karb: 79 },
        { id: 18, ad: "Yeşil Mercimek", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 352, pro: 24, yag: 1, karb: 60 },
        { id: 15, ad: "Yulaf", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 375, pro: 8.4, yag: 7, karb: 59 },
        { id: 94, ad: "Yulaf Ezmesi", marka: "", kategori: "tahil", birim: "g", ref: 100, cal: 379, pro: 13, yag: 6.5, karb: 67 },

    // SEBZE & MEYVE
        { id: 138, ad: "Ahududu", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 52, pro: 1.2, yag: 0.7, karb: 12 },
        { id: 131, ad: "Ananas", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 50, pro: 0.5, yag: 0.1, karb: 13 },
        { id: 31, ad: "Armut", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 57, pro: 0.4, yag: 0.1, karb: 15.2 },
        { id: 136, ad: "Avokado", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 160, pro: 2, yag: 15, karb: 8.5 },
        { id: 117, ad: "Biber", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 26, pro: 1, yag: 0.3, karb: 6 },
        { id: 139, ad: "Böğürtlen", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 43, pro: 1.4, yag: 0.5, karb: 10 },
        { id: 109, ad: "Brokoli", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 34, pro: 2.8, yag: 0.4, karb: 6.6 },
        { id: 124, ad: "Brüksel Lahanası", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 43, pro: 3.4, yag: 0.3, karb: 9 },
        { id: 33, ad: "Çilek", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 32, pro: 0.7, yag: 0.3, karb: 7.7 },
        { id: 106, ad: "Domates", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 18, pro: 0.9, yag: 0.2, karb: 3.9 },
        { id: 30, ad: "Elma", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 52, pro: 0.3, yag: 0.2, karb: 13.8 },
        { id: 134, ad: "Greyfurt", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 42, pro: 0.8, yag: 0.1, karb: 10.7 },
        { id: 108, ad: "Havuç", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 41, pro: 0.9, yag: 0.2, karb: 9.6 },
        { id: 111, ad: "Ispanak", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 23, pro: 2.9, yag: 0.4, karb: 3.6 },
        { id: 115, ad: "Kabak", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 17, pro: 1.2, yag: 0.3, karb: 3.1 },
        { id: 118, ad: "Kapya Biber", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 31, pro: 1, yag: 0.3, karb: 6.9 },
        { id: 110, ad: "Karnabahar", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 25, pro: 1.9, yag: 0.3, karb: 5 },
        { id: 34, ad: "Karpuz", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 30, pro: 0.6, yag: 0.2, karb: 7.6 },
        { id: 35, ad: "Kavun", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 34, pro: 0.8, yag: 0.2, karb: 8.2 },
        { id: 36, ad: "Kiraz", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 50, pro: 1, yag: 0.3, karb: 12.2 },
        { id: 37, ad: "Kivi", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 61, pro: 1.1, yag: 0.5, karb: 14.7 },
        { id: 125, ad: "Kuşkonmaz", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 20, pro: 2.2, yag: 0.1, karb: 3.9 },
        { id: 123, ad: "Lahana", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 25, pro: 1.3, yag: 0.1, karb: 5.8 },
        { id: 135, ad: "Limon", marka: "", kategori: "sebze_meyve", birim: "adet", ref: 1, cal: 17, pro: 0.6, yag: 0.2, karb: 5.4 },
        { id: 38, ad: "Mandalina", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 53, pro: 0.8, yag: 0.3, karb: 13.3 },
        { id: 132, ad: "Mango", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 60, pro: 0.8, yag: 0.4, karb: 15 },
        { id: 122, ad: "Mantar", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 22, pro: 3.1, yag: 0.3, karb: 3.3 },
        { id: 112, ad: "Marul", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 15, pro: 1.4, yag: 0.2, karb: 2.9 },
        { id: 114, ad: "Maydanoz", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 36, pro: 3, yag: 0.8, karb: 6.3 },
        { id: 29, ad: "Meyve", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 15, pro: 0, yag: 0, karb: 15 },
        { id: 32, ad: "Muz", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 89, pro: 1.1, yag: 0.3, karb: 22.8 },
        { id: 133, ad: "Nar", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 83, pro: 1.7, yag: 1.2, karb: 18 },
        { id: 127, ad: "Pancar", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 43, pro: 1.6, yag: 0.2, karb: 10 },
        { id: 129, ad: "Patates", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 77, pro: 2, yag: 0.1, karb: 17 },
        { id: 116, ad: "Patlıcan", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 25, pro: 1, yag: 0.2, karb: 5.9 },
        { id: 126, ad: "Pırasa", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 61, pro: 1.5, yag: 0.3, karb: 14 },
        { id: 39, ad: "Portakal", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 47, pro: 0.9, yag: 0.1, karb: 11.8 },
        { id: 113, ad: "Roka", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 25, pro: 2.6, yag: 0.7, karb: 3.7 },
        { id: 107, ad: "Salatalık", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 15, pro: 0.7, yag: 0.1, karb: 3.6 },
        { id: 121, ad: "Sarımsak", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 149, pro: 6.4, yag: 0.5, karb: 33 },
        { id: 28, ad: "Sebze", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 28, pro: 1.5, yag: 0.2, karb: 5 },
        { id: 119, ad: "Sivri Biber", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 27, pro: 1.1, yag: 0.3, karb: 6.5 },
        { id: 120, ad: "Soğan", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 40, pro: 1.1, yag: 0.1, karb: 9.3 },
        { id: 128, ad: "Şalgam", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 28, pro: 0.9, yag: 0.1, karb: 6.4 },
        { id: 40, ad: "Şeftali", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 39, pro: 0.9, yag: 0.3, karb: 9.5 },
        { id: 130, ad: "Tatlı Patates", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 86, pro: 1.6, yag: 0.1, karb: 20 },
        { id: 41, ad: "Üzüm", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 69, pro: 0.7, yag: 0.2, karb: 18.1 },
        { id: 137, ad: "Yaban Mersini", marka: "", kategori: "sebze_meyve", birim: "g", ref: 100, cal: 57, pro: 0.7, yag: 0.3, karb: 14 },

    // KURUYEMİŞ & YAĞ
        { id: 143, ad: "Antep Fıstığı", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 560, pro: 20, yag: 45, karb: 28 },
        { id: 156, ad: "Avokado Yağı", marka: "", kategori: "yag", birim: "ml", ref: 100, cal: 884, pro: 0, yag: 100, karb: 0 },
        { id: 147, ad: "Ay Çekirdeği", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 584, pro: 21, yag: 51, karb: 20 },
        { id: 155, ad: "Ayçiçek Yağı", marka: "", kategori: "yag", birim: "ml", ref: 100, cal: 884, pro: 0, yag: 100, karb: 0 },
        { id: 140, ad: "Badem", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 579, pro: 21, yag: 50, karb: 22 },
        { id: 153, ad: "Badem Ezmesi", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 614, pro: 21, yag: 55, karb: 22 },
        { id: 141, ad: "Ceviz", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 654, pro: 15, yag: 65, karb: 14 },
        { id: 148, ad: "Chia Tohumu", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 486, pro: 17, yag: 31, karb: 42 },
        { id: 142, ad: "Fındık", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 628, pro: 15, yag: 61, karb: 17 },
        { id: 152, ad: "Fıstık Ezmesi", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 588, pro: 25, yag: 50, karb: 20 },
        { id: 154, ad: "Hindistan Cevizi Yağı", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 892, pro: 0, yag: 99, karb: 0 },
        { id: 146, ad: "Kabak Çekirdeği", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 559, pro: 30, yag: 49, karb: 11 },
        { id: 144, ad: "Kaju", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 553, pro: 18, yag: 44, karb: 30 },
        { id: 149, ad: "Keten Tohumu", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 534, pro: 18, yag: 42, karb: 29 },
        { id: 150, ad: "Susam", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 573, pro: 18, yag: 50, karb: 23 },
        { id: 151, ad: "Tahin", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 595, pro: 17, yag: 54, karb: 21 },
        { id: 20, ad: "Tereyağı", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 717, pro: 0.8, yag: 81, karb: 0.1 },
        { id: 145, ad: "Yer Fıstığı", marka: "", kategori: "yag", birim: "g", ref: 100, cal: 567, pro: 26, yag: 49, karb: 16 },
        { id: 19, ad: "Zeytinyağı", marka: "", kategori: "yag", birim: "ml", ref: 100, cal: 900, pro: 0, yag: 100, karb: 0 },

    // YEMEK & ÇORBA
        { id: 161, ad: "Domates Çorbası", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 140, pro: 3, yag: 5, karb: 20 },
        { id: 171, ad: "Et Sote", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 380, pro: 28, yag: 22, karb: 12 },
        { id: 165, ad: "Etli Kuru Fasulye", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 320, pro: 16, yag: 10, karb: 40 },
        { id: 158, ad: "Ezogelin Çorbası", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 210, pro: 8, yag: 7, karb: 26 },
        { id: 26, ad: "Fish Fingers", marka: "", kategori: "yemek", birim: "g", ref: 100, cal: 179, pro: 12, yag: 7.9, karb: 15 },
        { id: 173, ad: "İmam Bayıldı", marka: "", kategori: "yemek", birim: "adet", ref: 1, cal: 240, pro: 4, yag: 16, karb: 18 },
        { id: 163, ad: "İşkembe Çorbası", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 220, pro: 14, yag: 11, karb: 10 },
        { id: 172, ad: "Karnıyarık", marka: "", kategori: "yemek", birim: "adet", ref: 1, cal: 280, pro: 12, yag: 14, karb: 24 },
        { id: 174, ad: "Mantı", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 420, pro: 16, yag: 12, karb: 58 },
        { id: 168, ad: "Menemen", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 260, pro: 12, yag: 18, karb: 10 },
        { id: 157, ad: "Mercimek Çorbası", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 190, pro: 9, yag: 5, karb: 25 },
        { id: 166, ad: "Nohut Yemeği", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 330, pro: 14, yag: 10, karb: 42 },
        { id: 169, ad: "Omlet", marka: "", kategori: "yemek", birim: "adet", ref: 1, cal: 210, pro: 13, yag: 16, karb: 2 },
        { id: 176, ad: "Peynirli Makarna", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 420, pro: 15, yag: 16, karb: 52 },
        { id: 175, ad: "Pişmiş Makarna", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 280, pro: 9, yag: 4, karb: 48 },
        { id: 162, ad: "Sebze Çorbası", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 120, pro: 4, yag: 4, karb: 15 },
        { id: 167, ad: "Sebze Yemeği", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 180, pro: 5, yag: 8, karb: 20 },
        { id: 159, ad: "Tarhana Çorbası", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 180, pro: 5, yag: 6, karb: 26 },
        { id: 160, ad: "Tavuk Çorbası", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 160, pro: 12, yag: 6, karb: 12 },
        { id: 170, ad: "Tavuk Sote", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 300, pro: 28, yag: 14, karb: 10 },
        { id: 164, ad: "Tavuklu Pilav", marka: "", kategori: "yemek", birim: "porsiyon", ref: 1, cal: 390, pro: 15, yag: 10, karb: 58 },

    // TATLI & ATIŞTIRMALIK
        { id: 187, ad: "Baklava", marka: "", kategori: "tatli", birim: "dilim", ref: 1, cal: 130, pro: 2, yag: 8, karb: 14 },
        { id: 179, ad: "Beyaz Çikolata", marka: "", kategori: "tatli", birim: "g", ref: 100, cal: 539, pro: 5.9, yag: 32, karb: 59 },
        { id: 192, ad: "Bisküvi", marka: "", kategori: "tatli", birim: "adet", ref: 1, cal: 48, pro: 0.7, yag: 2, karb: 7 },
        { id: 177, ad: "Bitter Çikolata", marka: "", kategori: "tatli", birim: "g", ref: 100, cal: 598, pro: 7.8, yag: 43, karb: 46 },
        { id: 185, ad: "Cheesecake", marka: "", kategori: "tatli", birim: "dilim", ref: 1, cal: 320, pro: 5.5, yag: 22, karb: 26 },
        { id: 184, ad: "Dondurma", marka: "", kategori: "tatli", birim: "porsiyon", ref: 1, cal: 210, pro: 3.5, yag: 11, karb: 24 },
        { id: 180, ad: "Granola", marka: "", kategori: "tatli", birim: "g", ref: 100, cal: 471, pro: 10, yag: 20, karb: 64 },
        { id: 193, ad: "Kraker", marka: "", kategori: "tatli", birim: "adet", ref: 1, cal: 35, pro: 0.7, yag: 1.5, karb: 5 },
        { id: 191, ad: "Kurabiye", marka: "", kategori: "tatli", birim: "adet", ref: 1, cal: 78, pro: 1, yag: 4, karb: 10 },
        { id: 189, ad: "Künefe", marka: "", kategori: "tatli", birim: "porsiyon", ref: 1, cal: 380, pro: 6, yag: 20, karb: 44 },
        { id: 190, ad: "Lokum", marka: "", kategori: "tatli", birim: "adet", ref: 1, cal: 32, pro: 0, yag: 0, karb: 8 },
        { id: 194, ad: "Patlamış Mısır", marka: "", kategori: "tatli", birim: "g", ref: 100, cal: 387, pro: 12, yag: 4.5, karb: 78 },
        { id: 182, ad: "Pirinç Patlağı", marka: "", kategori: "tatli", birim: "g", ref: 100, cal: 387, pro: 8, yag: 3, karb: 81 },
        { id: 181, ad: "Protein Bar", marka: "", kategori: "tatli", birim: "adet", ref: 1, cal: 200, pro: 20, yag: 6, karb: 18 },
        { id: 27, ad: "Puding", marka: "", kategori: "tatli", birim: "porsiyon", ref: 1, cal: 137, pro: 3, yag: 5, karb: 20 },
        { id: 188, ad: "Revani", marka: "", kategori: "tatli", birim: "dilim", ref: 1, cal: 240, pro: 3, yag: 10, karb: 36 },
        { id: 186, ad: "Sütlaç", marka: "", kategori: "tatli", birim: "porsiyon", ref: 1, cal: 230, pro: 5, yag: 6, karb: 38 },
        { id: 178, ad: "Sütlü Çikolata", marka: "", kategori: "tatli", birim: "g", ref: 100, cal: 535, pro: 7.6, yag: 30, karb: 59 },
        { id: 183, ad: "Yulaf Bar", marka: "", kategori: "tatli", birim: "adet", ref: 1, cal: 180, pro: 4, yag: 6, karb: 28 },

    // İÇECEKLER
        { id: 198, ad: "Americano", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 10, pro: 0.5, yag: 0, karb: 1.7 },
        { id: 203, ad: "Bitki Çayı", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 2, pro: 0, yag: 0, karb: 0 },
        { id: 200, ad: "Cappuccino", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 110, pro: 6, yag: 5.5, karb: 9 },
        { id: 201, ad: "Çay", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 2, pro: 0, yag: 0, karb: 0.5 },
        { id: 207, ad: "Elma Suyu", marka: "", kategori: "icecek", birim: "ml", ref: 100, cal: 46, pro: 0.1, yag: 0.1, karb: 11 },
        { id: 214, ad: "Enerji İçeceği", marka: "", kategori: "icecek", birim: "ml", ref: 100, cal: 45, pro: 0.4, yag: 0, karb: 11 },
        { id: 197, ad: "Espresso", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 9, pro: 0.5, yag: 0.2, karb: 1.7 },
        { id: 196, ad: "Filtre Kahve", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 5, pro: 0.3, yag: 0, karb: 0 },
        { id: 211, ad: "Gazoz", marka: "", kategori: "icecek", birim: "ml", ref: 100, cal: 38, pro: 0, yag: 0, karb: 9.5 },
        { id: 204, ad: "Kakao", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 80, pro: 3, yag: 2, karb: 14 },
        { id: 209, ad: "Kola", marka: "", kategori: "icecek", birim: "ml", ref: 100, cal: 42, pro: 0, yag: 0, karb: 10.6 },
        { id: 199, ad: "Latte", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 135, pro: 8, yag: 6, karb: 11 },
        { id: 212, ad: "Maden Suyu", marka: "", kategori: "icecek", birim: "ml", ref: 100, cal: 0, pro: 0, yag: 0, karb: 0 },
        { id: 208, ad: "Nar Suyu", marka: "", kategori: "icecek", birim: "ml", ref: 100, cal: 54, pro: 0.4, yag: 0.3, karb: 13 },
        { id: 206, ad: "Portakal Suyu", marka: "", kategori: "icecek", birim: "ml", ref: 100, cal: 45, pro: 0.7, yag: 0.2, karb: 10 },
        { id: 215, ad: "Protein Shake", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 160, pro: 25, yag: 3, karb: 5 },
        { id: 205, ad: "Sıcak Çikolata", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 190, pro: 5, yag: 6, karb: 28 },
        { id: 213, ad: "Soda", marka: "", kategori: "icecek", birim: "ml", ref: 100, cal: 0, pro: 0, yag: 0, karb: 0 },
        { id: 210, ad: "Şekersiz Kola", marka: "", kategori: "icecek", birim: "ml", ref: 100, cal: 0.3, pro: 0, yag: 0, karb: 0.1 },
        { id: 195, ad: "Türk Kahvesi", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 15, pro: 0.2, yag: 0, karb: 3 },
        { id: 202, ad: "Yeşil Çay", marka: "", kategori: "icecek", birim: "adet", ref: 1, cal: 2, pro: 0, yag: 0, karb: 0 },

    // DİĞER
        { id: 223, ad: "Acı Sos", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 30, pro: 1, yag: 0.5, karb: 5 },
        { id: 216, ad: "Bal", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 304, pro: 0.3, yag: 0, karb: 82 },
        { id: 225, ad: "Balsamik Sirke", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 88, pro: 0.5, yag: 0, karb: 17 },
        { id: 222, ad: "Barbekü Sos", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 172, pro: 0.8, yag: 0.6, karb: 41 },
        { id: 226, ad: "Elma Sirkesi", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 21, pro: 0, yag: 0, karb: 0.9 },
        { id: 221, ad: "Hardal", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 66, pro: 4, yag: 3.3, karb: 6 },
        { id: 229, ad: "Hindistan Cevizi Sütü", marka: "", kategori: "diger", birim: "ml", ref: 100, cal: 197, pro: 2, yag: 21, karb: 3 },
        { id: 219, ad: "Ketçap", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 101, pro: 1.2, yag: 0.1, karb: 25 },
        { id: 220, ad: "Mayonez", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 680, pro: 1, yag: 75, karb: 2 },
        { id: 218, ad: "Pekmez", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 293, pro: 1, yag: 0.2, karb: 74 },
        { id: 5, ad: "Protein Tozu", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 391, pro: 73, yag: 5.5, karb: 12 },
        { id: 217, ad: "Reçel", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 278, pro: 0.4, yag: 0, karb: 69 },
        { id: 224, ad: "Soya Sosu", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 53, pro: 8, yag: 0.6, karb: 5 },
        { id: 228, ad: "Şeker", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 387, pro: 0, yag: 0, karb: 100 },
        { id: 227, ad: "Tuz", marka: "", kategori: "diger", birim: "g", ref: 100, cal: 0, pro: 0, yag: 0, karb: 0 },

];

// Node ortamında test için dışa aktarım (tarayıcıda etkisiz):
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NUTRIO_BESINLER, NUTRIO_SEED_VERSION };
}
