
        // SEED KÜTÜPHANESİ — besinler.js'den gelir (merkezi/default besin verisi).
        // Bu dosya SADECE veri içerir; sürümü NUTRIO_SEED_VERSION ile takip edilir.
        const tohumVeriler = NUTRIO_BESINLER;
        const SEED_VERSION = NUTRIO_SEED_VERSION;

        // ══════════ FAZ 12: BİRİM SİSTEMİ (imperial/metrik) ══════════
        // Depolama HER ZAMAN metrik (kg/cm/ml). Imperial SADECE giriş/gösterim
        // sınırında devreye girer: input'a doldururken/ekrandan okurken çevrilir.
        const LB_KG = 2.20462;
        const INC_CM = 2.54;
        const FL_OZ_ML = 29.5735;

        function birimImperialMi() {
            try { return localStorage.getItem('df_birim_sistemi') === 'imperial'; } catch (e) { return false; }
        }

        function kgGoster(kg) {
            return birimImperialMi() ? (kg * LB_KG).toFixed(1) + ' lb' : kg.toFixed(1) + ' kg';
        }

        // Input'a doldurmak için BİRİMSİZ sayı (imperial'de lb, metrikte kg)
        function kgSayiGoster(kg) {
            return birimImperialMi() ? +(kg * LB_KG).toFixed(1) : kg;
        }

        // Input'tan okunan sayıyı HER ZAMAN kg'a çevirir (depolama metriği bozulmasın)
        function kgParseGirdi(deger) {
            return birimImperialMi() ? deger / LB_KG : deger;
        }

        function cmGoster(cm) {
            return birimImperialMi() ? (cm / INC_CM).toFixed(1) + ' inç' : cm.toFixed(1) + ' cm';
        }

        function cmSayiGoster(cm) {
            return birimImperialMi() ? +(cm / INC_CM).toFixed(1) : cm;
        }

        function cmParseGirdi(deger) {
            return birimImperialMi() ? deger * INC_CM : deger;
        }

        // SADECE gösterim metni: mlGoster(250) → metrikte "250 ml", imperial'de "8.5 fl oz"
        function mlGoster(ml) {
            return birimImperialMi() ? (ml / FL_OZ_ML).toFixed(1) + ' fl oz' : ml + ' ml';
        }

        // Ayarlar'daki Birim Sistemi sekmesi (Metrik | Imperial). Seçim değişince
        // açık ekranlardaki gösterimler tazelenir ki kullanıcı anında fark etsin.
        function birimSistemiSec(sistem) {
            localStorage.setItem('df_birim_sistemi', sistem === 'imperial' ? 'imperial' : 'metrik');
            birimSistemiSekmeleriniGuncelle();
            bildirGoster(sistem === 'imperial' ? '📐 Imperial birimler açıldı' : '📐 Metrik birimler açıldı');
            const aktifEkran = document.querySelector('.ekran:not(.gizli)');
            const ekranId = aktifEkran ? aktifEkran.id : '';
            if (ekranId === 'ana-ekran') arayuzGuncelle();
            else if (ekranId === 'kilo-ekrani') kiloEkraniGuncelle();
            else if (ekranId === 'ayarlar-ekrani') birimSistemiSekmeleriniGuncelle();
        }

        function birimSistemiSekmeleriniGuncelle() {
            const imperial = birimImperialMi();
            const mBtn = document.getElementById('birim-sekme-metrik');
            const iBtn = document.getElementById('birim-sekme-imperial');
            if (mBtn) mBtn.classList.toggle('aktif', !imperial);
            if (iBtn) iBtn.classList.toggle('aktif', imperial);
        }

        // Form input'larının etiketlerini (Kilo (kg)/(lb) gibi) aktif birime göre günceller.
        // id'leri eşleşen label'lar olduğu için pr-kilo/kilo-yeni input'larının önceki
        // elementi (previousElementSibling) üzerinden güvenli güncelleme yapılır.
        function birimEtiketleriGuncelle() {
            const imperial = birimImperialMi();
            const kgEtiket = imperial ? 'Kilo (lb)' : 'Kilo (kg)';
            const cmEtiket = imperial ? '(inç)' : '(cm)';
            const prKilo = document.getElementById('pr-kilo');
            if (prKilo && prKilo.previousElementSibling) prKilo.previousElementSibling.innerText = kgEtiket;
            const prBoy = document.getElementById('pr-boy');
            if (prBoy && prBoy.previousElementSibling) prBoy.previousElementSibling.innerText = 'Boy ' + cmEtiket;
            const kiloYeni = document.getElementById('kilo-yeni');
            if (kiloYeni && kiloYeni.previousElementSibling) kiloYeni.previousElementSibling.innerText = 'Bugünkü Kilonu Gir (' + (imperial ? 'lb' : 'kg') + ')';
            const hedefInput = document.getElementById('kilo-hedef-input');
            if (hedefInput && hedefInput.previousElementSibling) hedefInput.previousElementSibling.innerText = 'Hedef Kilo (' + (imperial ? 'lb' : 'kg') + ') — isteğe bağlı';
            ['bel', 'boyun', 'gogus', 'kol', 'kalca', 'bacak'].forEach(k => {
                const inp = document.getElementById('oc-' + k);
                if (inp) {
                    const etiketSpan = inp.parentNode.querySelector('.oc-etiket');
                    if (etiketSpan) etiketSpan.innerText = olcumEtiketleri[k] + ' ' + cmEtiket;
                }
            });
        }

        // TARİH SİSTEMİ
        const bugununTarihi = new Date().toLocaleDateString('tr-TR');
        const gunAdlari = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];

        // MERKEZİ KATEGORİ TANIMI — kütüphane, tüketim ve form ekranı bu tek tanımı kullanır.
        // 'tum' ve 'favori' gerçek besin kategorisi DEĞİLDİR: sadece filtre sekmesidir.
        const BESIN_KATEGORILERI = [
            { key: 'et', ad: 'Et & Tavuk' },
            { key: 'balik', ad: 'Balık & Deniz Ürünleri' },
            { key: 'sut', ad: 'Süt & Yumurta' },
            { key: 'tahil', ad: 'Tahıl & Bakliyat' },
            { key: 'sebze_meyve', ad: 'Sebze & Meyve' },
            { key: 'yag', ad: 'Kuruyemiş & Yağ' },
            { key: 'yemek', ad: 'Yemek & Çorba' },
            { key: 'tatli', ad: 'Tatlı & Atıştırmalık' },
            { key: 'icecek', ad: 'İçecekler' },
            { key: 'diger', ad: 'Diğer' }
        ];
        const GECERLI_KATEGORI_ANAHTARLARI = new Set(BESIN_KATEGORILERI.map(k => k.key));
        const KATEGORI_ADI = Object.fromEntries(BESIN_KATEGORILERI.map(k => [k.key, k.ad]));

        // FAZ 11 — protein kaynağı sınıflandırması: YAKLAŞIK bir kategori-bazlı tahmindir;
        // besin bazlı hassas veri yoktur (besinler.js'e dokunulmadığı için kategori üzerinden sınıflandırılır).
        // null = sınıflandırma dışı, protein oranı hesabına katılmaz.
        const BESIN_KATEGORI_PROTEIN_KAYNAGI = {
            et: 'hayvansal',
            balik: 'hayvansal',
            sut: 'hayvansal',
            tahil: 'bitkisel',
            sebze_meyve: 'bitkisel',
            yag: 'bitkisel',
            yemek: null,
            tatli: null,
            icecek: null,
            diger: null
        };

        // ÖĞÜN ETİKETLERİ — tüketim kayıtlarında öğün seçimi (eski kayıtlar 'belirsiz')
        const OJUN_ETIKETLERI = [
            { key: 'kahvalti', ad: 'Kahvaltı' },
            { key: 'ogle', ad: 'Öğle' },
            { key: 'aksam', ad: 'Akşam' },
            { key: 'ara_ogun', ad: 'Ara Öğün' }
        ];
        const OJUN_ADI = Object.fromEntries(OJUN_ETIKETLERI.map(o => [o.key, o.ad]));
        const OJUN_SIRASI = ['kahvalti', 'ogle', 'aksam', 'ara_ogun', 'belirsiz'];

        // TÜRKÇE ALFABETİK SIRALAMA — tüm besin listeleri bu tek yardımcıyı kullanır.
        // Öncelik: 1) favoriler önce (kendi içinde alfabetik), 2) sonra alfabetik.
        const trCollator = new Intl.Collator('tr-TR', { sensitivity: 'base', numeric: true });

        function besinSiralamaKarsilastir(a, b) {
            const aFav = favoriler.includes(a.id) ? 0 : 1;
            const bFav = favoriler.includes(b.id) ? 0 : 1;
            if (aFav !== bFav) return aFav - bFav;
            return trCollator.compare(gorunenAd(a), gorunenAd(b));
        }

        // FAZ 17 — besin listelerinde kalori/proteine göre sıralama seçeneği
        let besinSiralamaModu = 'varsayilan';
        function besinSiralamaSec(mod) {
            besinSiralamaModu = mod;
            const kSel = document.getElementById('k-siralama');
            const tSel = document.getElementById('t-siralama');
            if (kSel) kSel.value = mod;
            if (tSel) tSel.value = mod;
            if (document.getElementById('kutuphane-listesi')) kListele();
            if (document.getElementById('t-secim-listesi')) tListele();
        }

        function besinleriSirala(liste) {
            if (besinSiralamaModu === 'varsayilan') return [...liste].sort(besinSiralamaKarsilastir);
            const alan = besinSiralamaModu.indexOf('kalori') === 0 ? 'cal' : 'pro';
            const yon = besinSiralamaModu.indexOf('artan') !== -1 ? 1 : -1;
            return [...liste].sort((a, b) => (parseFloat(a[alan]) - parseFloat(b[alan])) * yon);
        }

        // MODAL SİSTEMİ — Nutrio özel modal (native prompt/confirm yerine).
        // modalOnay(baslik, aciklama) -> Promise<boolean>
        // modalGirdi(baslik, aciklama, varsayilanDeger) -> Promise<string|null>
        // modalUyari(baslik, aciklama) -> Promise<void> (sadece Tamam)
        function modalKapat() {
            const overlay = document.getElementById('nutrio-modal-overlay');
            if (overlay) overlay.remove();
        }

        function modalTemelOlustur(baslik, aciklama, govdeHtml) {
            modalKapat();
            const overlay = document.createElement('div');
            overlay.id = 'nutrio-modal-overlay';
            overlay.innerHTML = `
                <div class="nutrio-modal">
                    <h3>${esc(baslik)}</h3>
                    ${aciklama ? '<p>' + esc(aciklama) + '</p>' : ''}
                    ${govdeHtml}
                </div>`;
            document.body.appendChild(overlay);
            // overlay'e tıklayınca kapatma — tehlikeli işlemlerde yanlışlıkla kapanmasın
            return overlay;
        }

        function modalOnay(baslik, aciklama, tehlikeliMi) {
            return new Promise(resolve => {
                const btnClass = tehlikeliMi ? 'btn-tehlike' : '';
                const govde = `
                    <div class="nutrio-modal-btnler">
                        <button class="btn-ikincil" data-sonuc="iptal">İptal</button>
                        <button class="${btnClass}" data-sonuc="onay">${tehlikeliMi ? 'Evet, Sil' : 'Onayla'}</button>
                    </div>`;
                const overlay = modalTemelOlustur(baslik, aciklama, govde);
                overlay.querySelectorAll('[data-sonuc]').forEach(btn => {
                    btn.onclick = () => {
                        modalKapat();
                        resolve(btn.dataset.sonuc === 'onay');
                    };
                });
            });
        }

        function modalGirdi(baslik, aciklama, varsayilanDeger, placeholder) {
            return new Promise(resolve => {
                const govde = `
                    <input type="text" id="nutrio-modal-input" value="${esc(varsayilanDeger || '')}" placeholder="${esc(placeholder || '')}">
                    <div class="nutrio-modal-btnler">
                        <button class="btn-ikincil" data-sonuc="iptal">İptal</button>
                        <button data-sonuc="kaydet">Kaydet</button>
                    </div>`;
                const overlay = modalTemelOlustur(baslik, aciklama, govde);
                const input = overlay.querySelector('#nutrio-modal-input');
                const tamamla = sonuc => {
                    modalKapat();
                    resolve(sonuc);
                };
                overlay.querySelectorAll('[data-sonuc]').forEach(btn => {
                    btn.onclick = () => tamamla(btn.dataset.sonuc === 'kaydet' ? input.value : null);
                });
                input.focus();
                input.select();
                input.onkeydown = e => {
                    if (e.key === 'Enter') tamamla(input.value);
                    if (e.key === 'Escape') tamamla(null);
                };
            });
        }

        function modalUyari(baslik, aciklama) {
            return new Promise(resolve => {
                const govde = `
                    <div class="nutrio-modal-btnler">
                        <button data-sonuc="ok">Tamam</button>
                    </div>`;
                const overlay = modalTemelOlustur(baslik, aciklama, govde);
                overlay.querySelector('[data-sonuc]').onclick = () => {
                    modalKapat();
                    resolve();
                };
            });
        }

        // ══════════ FAZ 11 ══════════

        // MADDE 3 — bağlama özel "?" ipuçları (yalnızca 6 ekran; diğer ekranlar kapsam dışı)
        const IPUCU_METINLERI = {
            plan: 'Plan: Beslenme sekmesinde öğünlerini, Antrenman sekmesinde egzersizini bugünden itibaren 7 güne kadar önceden planlarsın. Planladığın bir şey "bugün" ise Ana ekranda bir kart olarak çıkar. Market sekmesi Beslenme planından otomatik alışveriş listesi üretir; "alındı" işaretlediğin madde Stok sekmesine düşer. Dikkat: bir planı kaldırmak market listesinden de düşürür.',
            kilo: 'Kilo Takibi: kilo, hedef kilo ve vücut ölçülerini kaydeder, grafiğini ve haftalık değişim hızını gösterir. Dikkat: en doğru trend için kiloyu her hafta aynı gün ve benzer saatte ölç.',
            ilerleme: 'İlerleme: geçmiş günlerini, trend grafiklerini ve Analiz sekmesindeki kişisel örüntüleri gösterir. Genel sekmesinde arşivdeki her güne dokunarak detayını açabilirsin.',
            sablon: 'Öğün Şablonları: sık yediğin öğünleri kaydeder, tek dokunuşla günlüğüne ekler. Birden fazla porsiyon çıkan tariflerde toplam otomatik bölünür; bir şablona 🔁 verirsen her gün otomatik eklenir.',
            takviye: 'Takviyeler: B12, D3 gibi takviyelerini sıklığına göre planlar ve "Bugünkü Durum" listesinde işaretlemen için bekletir. Hatırlatma saati bildirimi yalnızca uygulama/sekme açıkken çalışır.',
            ayarlar: 'Ayarlar: tema, profil, yedekleme, bildirim ve uygulama bilgileri burada. Dikkat: tarayıcı verisini temizlersen kayıtların gider — düzenli olarak "Verileri Dışa Aktar" ile yedek al.'
        };
        function ipucuGoster(anahtar) {
            const metin = IPUCU_METINLERI[anahtar];
            if (!metin) return;
            modalUyari('❓ Bu Ekran Ne İşe Yarar?', metin);
        }

        // FAZ 15 — avatar: 10 sabit SVG glif anahtarı (emoji yerine), tek renkli rozet
        // içinde gösterilir; tıklanan secili görünür.
        const AVATAR_SECENEKLERI = [
            { anahtar: 'kullanici', ad: 'Kişi', yol: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 4-6 8-6s8 2 8 6"></path>' },
            { anahtar: 'kosucu', ad: 'Koşucu', yol: '<circle cx="15" cy="5" r="2"></circle><path d="M9 21l2-5 4-2-1-5-4 1-2 4"></path><path d="M11 14l4 2 3 5"></path><path d="M13 9l3-2 3 1"></path>' },
            { anahtar: 'agirlik', ad: 'Ağırlık', yol: '<rect x="2" y="9" width="3" height="6" rx="1"></rect><rect x="19" y="9" width="3" height="6" rx="1"></rect><line x1="7" y1="12" x2="17" y2="12"></line><rect x="5" y="7" width="2" height="10" rx="1"></rect><rect x="17" y="7" width="2" height="10" rx="1"></rect>' },
            { anahtar: 'salata', ad: 'Salata', yol: '<path d="M3 12a9 9 0 0 0 18 0z"></path><path d="M12 12V4"></path><path d="M8 6l1 3"></path><path d="M16 6l-1 3"></path>' },
            { anahtar: 'yoga', ad: 'Yoga', yol: '<circle cx="12" cy="5" r="2"></circle><path d="M12 7v6"></path><path d="M12 13c-3 0-6 2-6 5h12c0-3-3-5-6-5z"></path>' },
            { anahtar: 'bisiklet', ad: 'Bisiklet', yol: '<circle cx="6" cy="17" r="3"></circle><circle cx="18" cy="17" r="3"></circle><path d="M6 17l4-8h4l3 8"></path><path d="M10 9h5"></path><path d="M10 9l2-4h3"></path>' },
            { anahtar: 'kupa', ad: 'Kupa', yol: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4z"></path><path d="M8 5H5a3 3 0 0 0 3 5"></path><path d="M16 5h3a3 3 0 0 1-3 5"></path><path d="M12 12v4"></path><path d="M9 20h6"></path><path d="M10 16h4l1 4h-6l1-4z"></path>' },
            { anahtar: 'alev', ad: 'Alev', yol: '<path d="M12 2c2 3-3 5-1 9 1 2 3 2 4 0 1 3-1 6-4 7-4-1-7-4-7-8 0-4 3-6 8-8z"></path>' },
            { anahtar: 'kalp', ad: 'Kalp', yol: '<path d="M12 21s-7-4.5-9.5-9C1 8 2.5 4 6.5 4c2 0 3.5 1.5 5.5 4 2-2.5 3.5-4 5.5-4 4 0 5.5 4 4 8-2.5 4.5-9.5 9-9.5 9z"></path>' },
            { anahtar: 'yildiz', ad: 'Yıldız', yol: '<path d="M12 2l2.6 6.6L22 9l-5.5 4.6L18 22l-6-4-6 4 1.5-8.4L2 9l7.4-.4L12 2z"></path>' }
        ];
        const AVATAR_VARSAYILAN = 'kullanici';
        let prSeciliAvatar = AVATAR_VARSAYILAN;

        // Belirtilen avatar anahtarını tek renkli, temaya duyarlı bir daire rozet
        // içinde SVG olarak döndürür (bulunamazsa varsayılana düşer).
        function avatarSvgGoster(anahtar, boyut, sade) {
            boyut = boyut || 20;
            const av = AVATAR_SECENEKLERI.find(a => a.anahtar === anahtar) || AVATAR_SECENEKLERI[0];
            if (sade) {
                // Sade mod: renkli daire arka planı YOK, sadece vurgu renginde ince ikon —
                // küçük butonlarda (ör. "Profil") kalabalık göstermemesi için.
                return '<svg width="' + boyut + '" height="' + boyut + '" viewBox="0 0 24 24" fill="none" stroke="var(--vurgu-renk)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;">' + av.yol + '</svg>';
            }
            const icBoyut = Math.round(boyut * 0.6);
            return '<span style="display:inline-flex; align-items:center; justify-content:center; width:' + boyut + 'px; height:' + boyut + 'px; border-radius:50%; background:var(--vurgu-renk); flex:0 0 auto;"><svg width="' + icBoyut + '" height="' + icBoyut + '" viewBox="0 0 24 24" fill="none" stroke="var(--vurgu-yazi)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + av.yol + '</svg></span>';
        }

        function prAvatarSecimiOlustur() {
            const alan = document.getElementById('pr-avatar-secim');
            if (!alan) return;
            alan.innerHTML = AVATAR_SECENEKLERI.map(a =>
                '<button type="button" class="avatar-btn' + (a.anahtar === prSeciliAvatar ? ' secili' : '') + '" onclick="prAvatarSec(\'' + a.anahtar + '\')" aria-label="Avatar ' + esc(a.ad) + '">' + avatarSvgGoster(a.anahtar, 28) + '</button>'
            ).join('');
        }

        function prAvatarSec(anahtar) {
            prSeciliAvatar = anahtar;
            prAvatarSecimiOlustur();
        }

        // MADDE 2 — ana ekran kart sırası: kartSirasi dizisindeki sırayla DOM elemanlarını
        // aynı ebeveynde (ana-ekran) yeniden konumlandırır. Elemanlar TAŞINIR, yeniden OLUŞTURULMAZ
        // (içerik ve event handler'lar korunur); diğer kartların konumu değişmez.
        function anaKartSiraUygula(aktif) {
            const ebeveyn = document.getElementById('ana-ekran');
            if (!ebeveyn || !aktif) return;
            const sira = Array.isArray(aktif.kartSirasi) ? aktif.kartSirasi : ['skor', 'ogunler', 'su', 'aktivite'];
            sira.forEach(anahtar => {
                const el = document.getElementById('kart-' + anahtar);
                if (el && el.parentNode === ebeveyn) ebeveyn.appendChild(el);
            });
        }

        // MADDE 9 — arama geçmişi: en fazla 5 öğe, en yeni başta, duplicate yok.
        function aramaGecmisiGetir() {
            try {
                const liste = JSON.parse(localStorage.getItem('df_arama_gecmisi'));
                return Array.isArray(liste) ? liste.filter(x => typeof x === 'string') : [];
            } catch (e) { return []; }
        }

        function aramaGecmisineEkle(terim) {
            const t = String(terim || '').trim();
            if (!t) return;
            let liste = aramaGecmisiGetir().filter(x => x !== t);
            liste.unshift(t);
            liste = liste.slice(0, 5);
            localStorage.setItem('df_arama_gecmisi', JSON.stringify(liste));
        }

        function aramaGecmisiGoster(inputId, alanId) {
            const alan = document.getElementById(alanId);
            const input = document.getElementById(inputId);
            if (!alan || !input) return;
            if ((input.value || '').trim() !== '') { alan.classList.add('gizli'); return; }
            const liste = aramaGecmisiGetir();
            if (liste.length === 0) { alan.classList.add('gizli'); return; }
            alan.innerHTML = '<span class="arama-gecmis-baslik">Son Aramalar</span>' +
                liste.map(t => '<button type="button" class="arama-gecmis-chip" onclick="aramaGecmisiSec(\'' + esc(t) + '\', \'' + inputId + '\')">' + esc(t) + ' ✕</button>').join('');
            alan.classList.remove('gizli');
        }

        function aramaGecmisiGizle(alanId) {
            // blur ile chip'e tıklama çakışmasın diye küçük gecikme
            setTimeout(() => {
                const alan = document.getElementById(alanId);
                if (alan) alan.classList.add('gizli');
            }, 180);
        }

        function aramaGecmisiSec(terim, inputId) {
            const input = document.getElementById(inputId);
            if (!input) return;
            input.value = terim;
            aramaGecmisineEkle(terim);
            if (inputId === 't-arama') { tListele(); aramaGecmisiGizle('t-arama-gecmis'); }
            else { kListele(); aramaGecmisiGizle('k-arama-gecmis'); }
        }

        // Arama "tamamlandığında" (kayıt/Enter/blur anında) geçmişe yazar — her tuş vuruşunda değil.
        function aramaGecmisiniKaydet(inputId) {
            const input = document.getElementById(inputId);
            if (!input) return;
            const terim = (input.value || '').trim();
            if (terim) aramaGecmisineEkle(terim);
        }

        // MADDE 8 — etiketleme: besinler.js / df_sablonlar'ın şekli DEĞİŞMEZ;
        // etiketler ayrı localStorage anahtarlarında tutulur.
        function besinEtiketleriniGetir() {
            try {
                const obj = JSON.parse(localStorage.getItem('df_besin_etiketleri'));
                return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : {};
            } catch (e) { return {}; }
        }

        function sablonEtiketleriniGetir() {
            try {
                const obj = JSON.parse(localStorage.getItem('df_sablon_etiketleri'));
                return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : {};
            } catch (e) { return {}; }
        }

        function etiketlerEslesiyorMu(etiketler, arama) {
            if (!arama) return false;
            return (etiketler || []).some(e => String(e || '').toLocaleLowerCase('tr-TR').includes(String(arama).toLocaleLowerCase('tr-TR')));
        }

        async function etiketDuzenle(tur, id) {
            const besinModu = tur === 'besin';
            const depo = besinModu ? besinEtiketleriniGetir() : sablonEtiketleriniGetir();
            const mevcut = (depo[id] || []).join(', ');
            const cevap = await modalGirdi(
                '🏷 Etiketler',
                'Virgülle ayırarak etiket gir (örn: ucuz, hızlı). Bu etiketler aramada da eşleşir.',
                mevcut,
                'ucuz, hızlı'
            );
            if (cevap === null) return;
            const temiz = cevap.split(',').map(s => s.trim()).filter(Boolean);
            const anahtar = besinModu ? 'df_besin_etiketleri' : 'df_sablon_etiketleri';
            if (temiz.length === 0) delete depo[id];
            else depo[id] = temiz;
            localStorage.setItem(anahtar, JSON.stringify(depo));
            if (besinModu) kListele(); else sablonListele();
            bildirGoster(temiz.length ? '🏷 Etiketler kaydedildi' : 'Etiketler kaldırıldı');
        }

        // MADDE 6 — sürüm notları (en yeniden eskiye). Statik liste; rozet/bildirim yok.
        const YENILIKLER = [
            { faz: 'Planlama', ad: '7 günlük öğün planlayıcısı, otomatik market listesi, Stoğum stok takibi, toplu meal-prep dağıtımı' },
            { faz: 'İlerleme & Grafikler', ad: 'Trend, Haftalık Karşılaştırma ve Analiz grafikleri, kilo ve vücut ölçüsü takibi, otomatik kalibrasyon önerisi' },
            { faz: 'Günlük Kullanım', ad: 'Toleranslı (fuzzy) arama, sepetle toplu besin ekleme, akıllı öğün varsayılanı, özel gün işaretleme, hızlı sayı ayarlayıcıları' },
            { faz: 'Hatırlatıcılar', ad: 'Su, kayıt, takviye ve kilo ölçümü hatırlatıcıları; hızlı erişim için PWA kısayolları' },
            { faz: 'Kişiselleştirme', ad: '6 tema (açık dahil), profil avatarı, ana ekran kart sırası, metrik/imperial birim seçimi' },
            { faz: 'Güven & Veri', ad: 'Dışa/içe aktarma, paylaşım, otomatik yerel yedek, SSS ve Hata Bildir' }
        ];

        function yeniliklerListele() {
            const alan = document.getElementById('yenilikler-liste');
            if (!alan) return;
            alan.innerHTML = YENILIKLER.map(y =>
                '<div class="liste-elemani" style="flex-direction:column; align-items:stretch;">' +
                '<strong style="font-size:14.5px;">' + esc(y.faz) + '</strong>' +
                '<span class="liste-detay">' + esc(y.ad) + '</span>' +
                '</div>'
            ).join('');
        }

        // MADDE 5 — hata bildir: kullanıcının yazdığı açıklama + teknik bağlam.
        // HİÇBİR kullanıcı verisi (profil/besin/kilo vb.) dahil EDİLMEZ.
        // FAZ 17 — Interval/HIIT zamanlayıcı (bağımsız, hiçbir veri kaydetmez)
        let ivTimer = null;
        let ivState = null;
        function intervalBaslat() {
            const calisma = parseInt(document.getElementById('iv-calisma').value) || 30;
            const dinlenme = parseInt(document.getElementById('iv-dinlenme').value) || 15;
            const tur = parseInt(document.getElementById('iv-tur').value) || 1;
            ivState = { faz: 'calisma', kalan: calisma, tur: 1, toplamTur: tur, calisma: calisma, dinlenme: dinlenme };
            document.getElementById('interval-ayar-karti').classList.add('gizli');
            document.getElementById('interval-calisma-karti').classList.remove('gizli');
            document.getElementById('iv-duraklat-btn').innerText = '⏸ Duraklat';
            intervalGuncelle();
            if (ivTimer) clearInterval(ivTimer);
            ivTimer = setInterval(intervalTick, 1000);
        }
        function intervalTick() {
            if (!ivState) return;
            ivState.kalan--;
            if (ivState.kalan < 0) {
                if (ivState.faz === 'calisma') {
                    if (ivState.tur >= ivState.toplamTur) { intervalDurdur(); bildirGoster('🏁 Tamamlandı!'); return; }
                    ivState.faz = 'dinlenme';
                    ivState.kalan = ivState.dinlenme - 1;
                } else {
                    ivState.faz = 'calisma';
                    ivState.tur++;
                    ivState.kalan = ivState.calisma - 1;
                }
                if (navigator.vibrate) { try { navigator.vibrate(200); } catch (e) { /* yoksay */ } }
            }
            intervalGuncelle();
        }
        function intervalGuncelle() {
            if (!ivState) return;
            document.getElementById('iv-faz-yazi').innerText = ivState.faz === 'calisma' ? '🔥 ÇALIŞMA' : '💤 DİNLENME';
            document.getElementById('iv-sayac-yazi').innerText = ivState.kalan;
            document.getElementById('iv-tur-yazi').innerText = 'Tur ' + ivState.tur + ' / ' + ivState.toplamTur;
        }
        function intervalDuraklat() {
            if (ivTimer) {
                clearInterval(ivTimer);
                ivTimer = null;
                document.getElementById('iv-duraklat-btn').innerText = '▶ Devam';
            } else if (ivState) {
                ivTimer = setInterval(intervalTick, 1000);
                document.getElementById('iv-duraklat-btn').innerText = '⏸ Duraklat';
            }
        }
        function intervalDurdur() {
            if (ivTimer) clearInterval(ivTimer);
            ivTimer = null;
            ivState = null;
            document.getElementById('interval-ayar-karti').classList.remove('gizli');
            document.getElementById('interval-calisma-karti').classList.add('gizli');
        }

        // FAZ 17 — Besin öneri/katkı formu (Hata Bildir ile aynı desen)
        function besinOneriKopyala() {
            const aciklama = (document.getElementById('besin-oneri-metin').value || '').trim();
            if (!aciklama) { bildirGoster('Önce besni kısaca tanımla', 'hata'); return; }
            const rapor = 'Nutrio 3.0 — Besin Kütüphanesi Önerisi\n\n' + aciklama;
            navigator.clipboard.writeText(rapor).then(() => {
                bildirGoster('📋 Öneri panoya kopyalandı');
            }).catch(() => {
                bildirGoster('Panoya kopyalanamadı, öneriyi elle seçip kopyala', 'hata');
            });
        }

        // FAZ 17 — Birim dönüştürücü: uygulamanın kendi birim sisteminden bağımsız,
        // hiçbir yere kaydetmeyen basit bir hesap aracı.
        const BC_KATSAYI = {
            agirlik: { kg: 1, lb: 2.20462, g: 1000, ons: 35.27396 },
            uzunluk: { cm: 1, inc: 0.393701 },
            hacim: { ml: 1, bardak: 1 / 240, flooz: 0.033814 }
        };
        function birimCeviriciHesapla(kategori, kaynakAlan) {
            const alanlar = Object.keys(BC_KATSAYI[kategori]);
            const kaynakInput = document.getElementById('bc-' + kaynakAlan);
            const deger = parseFloat(kaynakInput.value);
            if (isNaN(deger)) { alanlar.forEach(a => { if (a !== kaynakAlan) document.getElementById('bc-' + a).value = ''; }); return; }
            // kaynağı temel birime çevir (agirlik->kg, uzunluk->cm, hacim->ml), sonra diğerlerine
            const temel = deger / BC_KATSAYI[kategori][kaynakAlan];
            alanlar.forEach(a => {
                if (a === kaynakAlan) return;
                const hedefInput = document.getElementById('bc-' + a);
                hedefInput.value = Math.round(temel * BC_KATSAYI[kategori][a] * 100) / 100;
            });
        }

        // FAZ 17 — Besin Karşılaştırma
        let bkSecili = { 1: null, 2: null };
        function besinKarsilastirAra(slot) {
            const arama = (document.getElementById('bk-arama-' + slot).value || '').toLocaleLowerCase('tr-TR');
            const alan = document.getElementById('bk-liste-' + slot);
            if (!arama) { alan.innerHTML = ''; return; }
            const sonuc = besinler.filter(b => besinEslesiyorMu(gorunenAd(b), arama)).slice(0, 8);
            alan.innerHTML = sonuc.map(b =>
                '<div class="liste-elemani" style="cursor:pointer; padding:9px 12px;" onclick="besinKarsilastirSec(' + slot + ',' + b.id + ')"><strong>' + esc(gorunenAd(b)) + '</strong></div>'
            ).join('');
        }
        function besinKarsilastirSec(slot, besinId) {
            bkSecili[slot] = besinler.find(b => b.id === besinId) || null;
            document.getElementById('bk-arama-' + slot).value = bkSecili[slot] ? gorunenAd(bkSecili[slot]) : '';
            document.getElementById('bk-liste-' + slot).innerHTML = '';
            besinKarsilastirGoster();
        }
        function besinKarsilastirGoster() {
            const alan = document.getElementById('bk-sonuc');
            const a = bkSecili[1], b = bkSecili[2];
            if (!a || !b) { alan.innerHTML = ''; return; }
            const satir = (etiket, x, y) => '<div class="mini-satir"><span>' + esc(etiket) + '</span><span>' + x + ' vs ' + y + '</span></div>';
            alan.innerHTML = '<div class="kart">' +
                '<h2 style="text-align:left; font-size:15px;">' + esc(gorunenAd(a)) + ' — ' + esc(gorunenAd(b)) + '</h2>' +
                satir('Kalori', a.cal + ' kcal', b.cal + ' kcal') +
                satir('Protein', a.pro + ' g', b.pro + ' g') +
                satir('Yağ', a.yag + ' g', b.yag + ' g') +
                satir('Karbonhidrat', a.karb + ' g', b.karb + ' g') +
                satir('Porsiyon', a.ref + ' ' + birimEtiket(a.birim), b.ref + ' ' + birimEtiket(b.birim)) +
                '</div>';
        }

        // FAZ 17 — Bağımsız kalori hesap makinesi (günlüğe hiç yazmaz, sadece bellekte)
        let khSeciliBesinId = null;
        let khSepet = [];
        function kaloriHesapAra() {
            const arama = (document.getElementById('kh-arama').value || '').toLocaleLowerCase('tr-TR');
            const alan = document.getElementById('kh-arama-listesi');
            if (!arama) { alan.innerHTML = ''; return; }
            const sonuc = besinler.filter(b => besinEslesiyorMu(gorunenAd(b), arama)).slice(0, 8);
            alan.innerHTML = sonuc.map(b =>
                '<div class="liste-elemani" style="cursor:pointer; padding:9px 12px;" onclick="kaloriHesapSecBesin(' + b.id + ')"><strong>' + esc(gorunenAd(b)) + '</strong></div>'
            ).join('');
        }
        function kaloriHesapSecBesin(besinId) {
            khSeciliBesinId = besinId;
            const b = besinler.find(x => x.id === besinId);
            document.getElementById('kh-arama').value = b ? gorunenAd(b) : '';
            document.getElementById('kh-arama-listesi').innerHTML = '';
        }
        function kaloriHesapEkle() {
            if (!khSeciliBesinId) { bildirGoster('Önce bir besin seç', 'hata'); return; }
            const miktar = parseFloat(document.getElementById('kh-miktar').value);
            if (!miktar || miktar <= 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }
            const b = besinler.find(x => x.id === khSeciliBesinId);
            if (!b) return;
            const oran = miktar / b.ref;
            khSepet.push({ ad: gorunenAd(b), miktar, birim: birimEtiket(b.birim), cal: Math.round(b.cal * oran), pro: Math.round(b.pro * oran * 10) / 10, yag: Math.round(b.yag * oran * 10) / 10, karb: Math.round(b.karb * oran * 10) / 10 });
            khSeciliBesinId = null;
            document.getElementById('kh-arama').value = '';
            document.getElementById('kh-miktar').value = '';
            kaloriHesapGuncelle();
        }
        function kaloriHesapCikar(index) {
            khSepet.splice(index, 1);
            kaloriHesapGuncelle();
        }
        function kaloriHesapTemizle() {
            khSepet = [];
            kaloriHesapGuncelle();
        }
        function kaloriHesapGuncelle() {
            const alan = document.getElementById('kh-sepet');
            if (!alan) return;
            alan.innerHTML = khSepet.map((k, i) =>
                '<div class="mini-satir"><span>' + esc(k.ad) + ' — ' + k.miktar + ' ' + esc(k.birim) + '</span><span>' + k.cal + ' kcal <span class="durum-ikon" style="color:#ff8a8a; cursor:pointer;" onclick="kaloriHesapCikar(' + i + ')">' + ikon('sil', 14) + '</span></span></div>'
            ).join('');
            const toplam = khSepet.reduce((t, k) => ({ cal: t.cal + k.cal, pro: t.pro + k.pro, yag: t.yag + k.yag, karb: t.karb + k.karb }), { cal: 0, pro: 0, yag: 0, karb: 0 });
            const toplamAlan = document.getElementById('kh-toplam');
            if (toplamAlan) toplamAlan.innerText = khSepet.length ? ('Toplam: ' + Math.round(toplam.cal) + ' kcal · P:' + Math.round(toplam.pro) + 'g Y:' + Math.round(toplam.yag) + 'g K:' + Math.round(toplam.karb) + 'g') : '';
        }

        // FAZ 17 — Sağlık hesaplayıcıları (bilgi amaçlı, tıbbi tavsiye değil)
        function vkiHesapla() {
            const kilo = parseFloat(document.getElementById('sh-vki-kilo').value);
            const boy = parseFloat(document.getElementById('sh-vki-boy').value);
            const sonuc = document.getElementById('sh-vki-sonuc');
            if (!sonuc) return;
            if (!kilo || !boy) { sonuc.innerText = ''; return; }
            const boyM = boy / 100;
            const vki = kilo / (boyM * boyM);
            let kategori = 'Normal aralık';
            if (vki < 18.5) kategori = 'Düşük aralık';
            else if (vki >= 25 && vki < 30) kategori = 'Yüksek aralık';
            else if (vki >= 30) kategori = 'Çok yüksek aralık';
            sonuc.innerText = 'VKİ: ' + vki.toFixed(1) + ' — ' + kategori + ' (genel referans, tıbbi tanı değildir)';
        }
        function belKalcaHesapla() {
            const bel = parseFloat(document.getElementById('sh-bk-bel').value);
            const kalca = parseFloat(document.getElementById('sh-bk-kalca').value);
            const sonuc = document.getElementById('sh-bk-sonuc');
            if (!sonuc) return;
            if (!bel || !kalca) { sonuc.innerText = ''; return; }
            const oran = bel / kalca;
            sonuc.innerText = 'Oran: ' + oran.toFixed(2) + ' (genel referans, tıbbi tanı değildir)';
        }

        function hataBildirKopyala() {
            const aciklama = (document.getElementById('hata-bildir-metin').value || '').trim();
            if (!aciklama) { bildirGoster('Önce sorunu kısaca açıkla', 'hata'); return; }
            const rapor = 'Nutrio 3.0 — Hata Bildirimi\n\nAçıklama: ' + aciklama +
                '\n\nTema: ' + (localStorage.getItem('df_tema') || 'lime') +
                '\nTarayıcı: ' + navigator.userAgent;
            navigator.clipboard.writeText(rapor).then(() => {
                bildirGoster('📋 Hata raporu panoya kopyalandı');
            }).catch(() => {
                bildirGoster('Panoya kopyalanamadı, raporu elle seçip kopyala', 'hata');
            });
        }

        // MADDE 10 — Web Share ile yedek paylaşımı. Desteklenmiyorsa normal indirmeye düşer.
        function yedekJsonuOlustur() {
            return {
                df_besinler: JSON.parse(localStorage.getItem('df_besinler') || '[]'),
                df_profiller: JSON.parse(localStorage.getItem('df_profiller') || '[]'),
                df_aktif_profil_id: localStorage.getItem('df_aktif_profil_id'),
                df_favoriler: JSON.parse(localStorage.getItem('df_favoriler') || '[]'),
                df_takviyeler: JSON.parse(localStorage.getItem('df_takviyeler') || '[]'),
                df_sablonlar: JSON.parse(localStorage.getItem('df_sablonlar') || '[]'),
                disaAktarimTarihi: bugununTarihi
            };
        }

        function veriPaylas() {
            const veri = JSON.stringify(yedekJsonuOlustur(), null, 2);
            const dosyaAdi = 'nutrio-yedek-' + bugununTarihi.split('.').join('-') + '.json';
            const destekliyor = navigator.share && navigator.canShare &&
                typeof File !== 'undefined' && navigator.canShare({ files: [new File([veri], dosyaAdi, { type: 'application/json' })] });
            if (!destekliyor) {
                bildirGoster('Bu cihaz paylaşımı desteklemiyor, dosya indiriliyor');
                veriDisaAktar();
                return;
            }
            const dosya = new File([veri], dosyaAdi, { type: 'application/json' });
            navigator.share({ files: [dosya], title: 'Nutrio Yedeği', text: 'Nutrio yedek dosyası — ' + bugununTarihi }).then(() => {
                localStorage.setItem('df_son_yedek_tarihi', bugununTarihi);
                bildirGoster('📤 Yedek paylaşıldı');
            }).catch((e) => {
                if (e && e.name === 'AbortError') return;
                bildirGoster('Paylaşım başarısız oldu, dosya indiriliyor');
                veriDisaAktar();
            });
        }

        // TEMA SİSTEMİ — 5 tema, CSS değişkenleriyle. Varsayılan: Lime + Dark.
        // Seçim localStorage'da df_tema olarak saklanır, sayfa açılışında geri yüklenir.
        const TEMA_LISTESI = ['lime', 'ocean', 'violet', 'energy', 'minimal', 'acik'];
        const TEMA_ADLARI = { lime: 'Lime', ocean: 'Ocean', violet: 'Violet', energy: 'Energy', minimal: 'Minimal', acik: 'Açık' };
        const TEMA_ORNEK_RENKLERI = { lime: '#b8ff4d', ocean: '#4dc3ff', violet: '#b84dff', energy: '#ff8a4d', minimal: '#d4d4d4', acik: '#4a7c15' };
        // Her temanın arka plan rengi — html background + theme-color meta için
        const TEMA_ARKA_PLANLARI = { lime: '#0b0e0c', ocean: '#070d18', violet: '#0d0916', energy: '#120d0a', minimal: '#101012', acik: '#f4f6f2' };
        // Tema önizleme kartı renkleri (Ayarlar ekranı)
        const TEMA_ONIZLEME = {
            lime:   { arka: '#0b0e0c', kart: '#1a201c', vurgu: '#b8ff4d', yazi: '#f5f7f3' },
            ocean:  { arka: '#070d18', kart: '#121c30', vurgu: '#4dc3ff', yazi: '#eef4fb' },
            violet: { arka: '#0d0916', kart: '#1d152e', vurgu: '#b84dff', yazi: '#f6f2fb' },
            energy: { arka: '#120d0a', kart: '#241a15', vurgu: '#ff8a4d', yazi: '#faf4ef' },
            minimal:{ arka: '#101012', kart: '#1d1d21', vurgu: '#e2e2e6', yazi: '#f2f2f4' },
            acik:   { arka: '#f4f6f2', kart: '#ffffff', vurgu: '#4a7c15', yazi: '#1a1f1a' }
        };

        function temaUygula(tema) {
            if (!TEMA_LISTESI.includes(tema)) tema = 'lime';
            document.body.dataset.tema = tema;
            localStorage.setItem('df_tema', tema);
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.content = TEMA_ARKA_PLANLARI[tema];
            document.documentElement.style.background = TEMA_ARKA_PLANLARI[tema];
            document.querySelectorAll('.renk-nokta').forEach(n => {
                n.classList.toggle('secili', n.dataset.tema === tema);
            });
            document.querySelectorAll('.tema-karti').forEach(k => {
                k.classList.toggle('secili', k.dataset.tema === tema);
            });
        }

        function temaBaslangictaYukle() {
            temaUygula(localStorage.getItem('df_tema') || 'lime');
        }

        function temaSeciciOlustur(alanId) {
            const alan = document.getElementById(alanId);
            if (!alan) return;
            const aktifTema = localStorage.getItem('df_tema') || 'lime';
            alan.innerHTML = TEMA_LISTESI.map(t => {
                const o = TEMA_ONIZLEME[t];
                return '<button type="button" class="tema-karti' + (t === aktifTema ? ' secili' : '') + '" data-tema="' + t + '" onclick="temaUygula(\'' + t + '\')">' +
                    '<span class="tema-onizleme" style="background:' + o.arka + ';">' +
                    '<span class="tema-onizleme-kart" style="background:' + o.kart + '; border:1px solid rgba(255,255,255,.08);"></span>' +
                    '<span class="tema-onizleme-cubuk" style="background:' + o.vurgu + '; box-shadow:0 0 8px ' + o.vurgu + ';"></span>' +
                    '</span>' +
                    '<span class="tema-karti-ad" style="color:' + o.yazi + '; background:' + o.kart + ';">' + (t === aktifTema ? '✓ ' : '') + esc(TEMA_ADLARI[t]) + '</span>' +
                    '</button>';
            }).join('');
        }

        // TARİH YARDIMCILARI — gün detay gezinimi için ortak işlemler
        function tarihAyarla(tarihStr, gunFarki) {
            const d = tarihToDate(tarihStr);
            d.setDate(d.getDate() + gunFarki);
            return d.toLocaleDateString('tr-TR');
        }

        function formatTarihUzun(tarihStr) {
            const d = tarihToDate(tarihStr);
            return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        function formatTarihKisa(tarihStr) {
            const d = tarihToDate(tarihStr);
            return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
        }

        function tarihFarkiGun(tarihA, tarihB) {
            return Math.round((tarihToDate(tarihA) - tarihToDate(tarihB)) / 86400000);
        }

        function tarihToDate(str) {
            const [g, a, y] = str.split('.').map(Number);
            return new Date(y, a - 1, g);
        }

        // Benzersiz ID üretici — crypto.randomUUID varsa onu kullanır, yoksa güvenli bir yedek üretir
        function benzersizId() {
            if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                return window.crypto.randomUUID();
            }
            return Date.now() + '-' + Math.random().toString(36).slice(2, 10);
        }

        // ══════════ FAZ 13: İKON MOTORU ══════════
        // 26 kalıcı UI ikonu için inline SVG üretir. Çizgi stili Faz 7 nav ikonlarıyla AYNI:
        // stroke="currentColor" fill="none" — koyu/açık tema ve buton renklerine otomatik uyar.
        // Bilinmeyen ad → boş string (hata fırlatmaz). Toast/rozet/onboarding emoji'leri
        // bilinçli olarak kapsam dışıdır (kişilikli mesajlar emoji kalır).
        const IKON_YOLLARI = {
            ileri: '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
            geri: '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
            onayla: '<polyline points="20 6 9 17 4 12"></polyline>',
            duzenle: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>',
            sil: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
            hedef: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
            su: '<path d="M12 2.7s6.5 7 6.5 11.3a6.5 6.5 0 0 1-13 0C5.5 9.7 12 2.7 12 2.7z"></path>',
            kullanici: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
            etiket: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
            agirlik: '<path d="M6.5 6.5h11L20 21H4L6.5 6.5z"></path><line x1="9" y1="6.5" x2="9" y2="4"></line><line x1="15" y1="6.5" x2="15" y2="4"></line><line x1="9" y1="4" x2="15" y2="4"></line>',
            takvim: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
            tabak: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle>',
            ara: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
            market: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>',
            tekrarla: '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>',
            terazi: '<line x1="12" y1="3" x2="12" y2="21"></line><path d="M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7z"></path><path d="M19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7z"></path><line x1="2" y1="21" x2="22" y2="21"></line><line x1="5" y1="7" x2="19" y2="7"></line>',
            hap: '<rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-45 12 12)"></rect><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"></line>',
            sepet: '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
            trend: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
            'cubuk-grafik': '<line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line><line x1="2" y1="20" x2="22" y2="20"></line>',
            'dusen-trend': '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>',
            ayarlar: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
            adim: '<circle cx="13" cy="4.5" r="1.8"></circle><path d="M10 21l1.5-6-2.5-2.5 1-5L13 9l3 1.5 2 3"></path><path d="M10 21l-2.5-1.5L6 21"></path><path d="M13.5 15.5l3.5 1 1.5 3"></path>',
            zil: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
            soru: '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>',
            cetvel: '<rect x="2" y="9" width="20" height="6" rx="1" transform="rotate(-45 12 12)"></rect><line x1="8.5" y1="9.5" x2="10" y2="8"></line><line x1="11.5" y1="12.5" x2="13" y2="11"></line><line x1="14.5" y1="15.5" x2="16" y2="14"></line>',
            cop: '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
            pano: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>'
        };

        function ikon(ad, boyutPx = 18) {
            const yol = IKON_YOLLARI[ad];
            if (!yol) return '';
            const boyut = typeof boyutPx === 'number' && boyutPx > 0 ? boyutPx : 18;
            return '<svg width="' + boyut + '" height="' + boyut + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px;">' + yol + '</svg>';
        }

        // Kullanıcı verisini HTML'e basmadan önce kaçış (escape) işlemi — basit XSS koruması
        function esc(deger) {
            if (deger === null || deger === undefined) return '';
            return String(deger)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        // FAZ 10 — SAYI STEPPER: input'un etrafına − / + butonları ekler.
        // Mevcut .buton-grubu yapısını bozmaz: input'u <div class="stepper-sarmal"> içine alır.
        // Tıklamada input.value adım kadar değişir (minDeger altına inmez) ve native
        // change + input event'leri dispatch edilir ki mevcut onchange/oninput handler'ları tetiklensin.
        function sayiStepperEkle(inputId, adim, minDeger) {
            const input = document.getElementById(inputId);
            if (!input || input.dataset.stepperBagli === '1') return;
            input.dataset.stepperBagli = '1';
            const sarmal = document.createElement('div');
            sarmal.className = 'stepper-sarmal';
            input.parentNode.insertBefore(sarmal, input);
            sarmal.appendChild(input);
            const butonYap = (etiket, yon) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-ikincil btn-kucuk stepper-btn';
                btn.textContent = etiket;
                btn.setAttribute('aria-label', (yon < 0 ? 'Azalt' : 'Artır') + ' — ' + inputId);
                btn.onclick = () => {
                    let deger = parseFloat(String(input.value).replace(',', '.'));
                    if (isNaN(deger)) deger = Math.max(minDeger, 0);
                    deger = deger + (adim * yon);
                    if (deger < minDeger) deger = minDeger;
                    input.value = Math.round(deger * 100) / 100;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                };
                return btn;
            };
            sarmal.insertBefore(butonYap('−', -1), input);
            sarmal.appendChild(butonYap('+', 1));
        }

        // Faz 6: birleşik empty state şablonu — büyük soluk ikon + başlık + açıklama.
        // Sadece çağrıldığı yerlerde kullanılır; diğer .bos-durum kullanımları aynen kalır.
        function bosDurumHtml(ikon, baslik, aciklama) {
            return '<div class="bos-durum"><div class="bos-durum-ikon">' + ikon + '</div><strong>' + baslik + '</strong><p>' + aciklama + '</p></div>';
        }

        // Bir besin/tüketim/şablon nesnesinin görünen adı — marka varsa "Marka Ad", yoksa sadece "Ad"
        function gorunenAd(obj) {
            if (!obj) return '';
            return obj.marka ? (obj.marka + ' ' + obj.ad) : obj.ad;
        }

        // FAZ 7: Toleranslı besin arama — önce tam alt dizi (includes) eşleşmesi denenir,
        // olmadıysa Damerau-Levenshtein mesafesi <= 1 ile kayan pencere karşılaştırması
        // yapılır (tek harf eksik/fazla/yanlış/yer değişmiş yakalanır).
        // 2 karakterden kısa aramalarda fuzzy devre dışıdır (liste boşalmasın).
        function levenshteinMesafe(a, b) {
            if (a === b) return 0;
            if (!a.length) return b.length;
            if (!b.length) return a.length;
            const oncekiOnceki = [];
            let onceki = Array.from({ length: b.length + 1 }, (_, i) => i);
            for (let i = 1; i <= a.length; i++) {
                const simdiki = [i];
                for (let j = 1; j <= b.length; j++) {
                    let maliyet = Math.min(
                        onceki[j] + 1,
                        simdiki[j - 1] + 1,
                        onceki[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
                    );
                    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                        maliyet = Math.min(maliyet, oncekiOnceki[j - 2] + 1);
                    }
                    simdiki[j] = maliyet;
                }
                oncekiOnceki.length = 0;
                oncekiOnceki.push(...onceki);
                onceki = simdiki;
            }
            return onceki[b.length];
        }

        function besinEslesiyorMu(ad, arama) {
            const adKucuk = String(ad || '').toLocaleLowerCase('tr-TR');
            const aramaKucuk = String(arama || '').toLocaleLowerCase('tr-TR');
            if (!aramaKucuk) return true;
            if (adKucuk.includes(aramaKucuk)) return true;
            if (aramaKucuk.length < 2) return false;
            if (aramaKucuk.length > adKucuk.length) return false;
            for (let i = 0; i + aramaKucuk.length <= adKucuk.length; i++) {
                if (levenshteinMesafe(adKucuk.slice(i, i + aramaKucuk.length), aramaKucuk) <= 1) return true;
            }
            return false;
        }


        // VERİTABANI BAĞLANTILARI
        let besinler;
        try { besinler = JSON.parse(localStorage.getItem('df_besinler')); } catch (e) { besinler = null; }
        if (!Array.isArray(besinler) || besinler.length === 0) {
            // İlk açılış: tüm seed kütüphanesi kopyalanır (tohumVeriler referansı paylaşılmaz)
            besinler = tohumVeriler.map(t => Object.assign({}, t, { marka: '', kaynak: 'seed' }));
            localStorage.setItem('df_besinler', JSON.stringify(besinler));
        }

        let profiller = JSON.parse(localStorage.getItem('df_profiller')) || [];
        let aktifProfilId = localStorage.getItem('df_aktif_profil_id');
        let favoriler = JSON.parse(localStorage.getItem('df_favoriler')) || [];
        let takviyeler = JSON.parse(localStorage.getItem('df_takviyeler')) || [];
        let sablonlar = JSON.parse(localStorage.getItem('df_sablonlar')) || [];

        // Arayüz durum değişkenleri
        let aktifKategori = 'tum';
        let tAktifKategori = 'tum';
        let tSeciliBesinId = null;
        let sbAktifKategori = 'tum';
        let sbTaslakIcerik = [];
        let tkSeciliGunler = [];
        let olcumAktifTur = 'bel';
        let ilerlemeAktifSekme = 'genel';
        let planAktifSekme = 'plan';

        // GÖÇ / MİGRASYON v4 — v3: plan/market alanları; v4: sabit başlangıç kilosu
        // (baslangicKilosu) tüm profillere eklenir. Idempotent: df_migration_version == 4
        // ise tekrar çalışmaz. Kullanıcı verisi (marka, besin değerleri, tüketim geçmişi, favoriler,
        // profiller, kilo/su/egzersiz/takviye kayıtları, şablonlar) korunur.
        const MIGRATION_VERSION = 9;
        // SEED SÜRÜMÜ — besinler.js içindeki NUTRIO_SEED_VERSION'dan gelir (dosyanın başına bak).
        // Seed kütüphanesi değiştiğinde SADECE besinler.js'deki NUTRIO_SEED_VERSION artar.
        // Migration sürümünden BAĞIMSIZDIR: df_migration_version == 2 olan eski kullanıcılarda da
        // eksik seed besinler bir kez daha güvenle eklenir (kullanıcı kayıtları korunur, duplicate oluşmaz).
const NUTRIO_SEED_V3_IZLENIM = {
            "49": "Dana Antrikot||et|g|100|216|19|15|0",
            "51": "Dana Biftek||et|g|100|210|20|14|0",
            "48": "Dana Bonfile||et|g|100|190|21|11|0",
            "47": "Dana Kıyma||et|g|100|215|18.5|15|0",
            "50": "Dana Kuşbaşı||et|g|100|200|20|13|0",
            "46": "Hindi But||et|g|100|140|19|7|0",
            "58": "Hindi Füme||et|g|100|104|17|3|1",
            "45": "Hindi Göğüsü||et|g|100|104|22|1|0",
            "4": "Kırmızı Et||et|g|100|250|26|15|0",
            "55": "Köfte||et|adet|1|55|4|3.5|1.5",
            "54": "Kuzu Kıyma||et|g|100|240|18|18|0",
            "53": "Kuzu Kuşbaşı||et|g|100|225|19|16|0",
            "52": "Kuzu Pirzola||et|g|100|235|20|17|0",
            "57": "Pastırma||et|g|100|380|20|32|1",
            "56": "Sucuk||et|g|100|460|18|40|2",
            "1": "Tavuk||et|g|100|122|16|6|0",
            "43": "Tavuk But||et|g|100|184|18.5|11|0",
            "3": "Tavuk Ciğeri||et|g|100|122|16|6|0",
            "59": "Tavuk Füme||et|g|100|115|17|4.5|1.5",
            "2": "Tavuk Göğüsü||et|g|100|102|23|0.7|0",
            "44": "Tavuk Kanat||et|g|100|203|22|12|0",
            "74": "Ahtapot||balik|g|100|82|15|1|2",
            "67": "Alabalık||balik|g|100|140|19|6.5|0",
            "63": "Çipura||balik|g|100|110|19.5|3|0",
            "65": "Hamsi||balik|g|100|130|18|5.5|0",
            "75": "İstavrit||balik|g|100|145|19|7.5|0",
            "72": "Kalamar||balik|g|100|92|16|1.5|2",
            "71": "Karides||balik|g|100|99|21|1|0",
            "62": "Levrek||balik|g|100|105|20|2.5|0",
            "70": "Lüfer||balik|g|100|150|19|8|0",
            "68": "Mezgit||balik|g|100|90|18|1.5|0",
            "73": "Midye||balik|g|100|86|12|2.5|4",
            "69": "Palamut||balik|g|100|145|19|7|0",
            "66": "Sardalya||balik|g|100|160|19|9|0",
            "60": "Somon||balik|g|100|208|20|13|0",
            "61": "Ton Balığı||balik|g|100|132|28|1|0",
            "64": "Uskumru||balik|g|100|158|18|9|0",
            "85": "Ayran||sut|ml|100|37|1.9|0.9|5",
            "78": "Beyaz Peynir||sut|g|100|264|17|21|2",
            "81": "Cheddar||sut|g|100|402|25|33|1.3",
            "79": "Kaşar Peyniri||sut|g|100|330|25|25|2",
            "84": "Kefir||sut|ml|100|55|3.2|1|4.5",
            "77": "Lor Peyniri||sut|g|100|98|12|4|3",
            "8": "Mozarella Peynir||sut|g|100|247|18|19|1",
            "42": "Mozzarella||sut|g|100|300|22|22|2.2",
            "82": "Ricotta||sut|g|100|138|11|8|3",
            "21": "Ricotta Peynir||sut|g|100|127|7.7|9|3.9",
            "9": "Skyr Yoğurt||sut|g|100|64|11|0.2|4",
            "24": "Süt Yağlı||sut|ml|100|61|3.3|3.3|4.7",
            "22": "Süt Yağsız||sut|ml|100|34|3.4|0|5.1",
            "23": "Süt Yarım Yağlı||sut|ml|100|47|3.3|1.6|4.8",
            "83": "Süzme Yoğurt||sut|g|100|59|10|0.5|3.5",
            "7": "Toz Peynir||sut|g|100|383|34|27|1",
            "80": "Tulum Peyniri||sut|g|100|314|24|23|2",
            "86": "Yoğunlaştırılmış Süt||sut|ml|100|135|6.8|3.5|18",
            "25": "Yoğurt||sut|g|100|67|3.6|3.7|4.7",
            "6": "Yumurta||sut|adet|1|72|6.28|4.75|0.2",
            "76": "Yumurta Beyazı||sut|adet|1|17|3.6|0.1|0.2",
            "103": "Barbunya||tahil|g|100|333|23|0.8|60",
            "11": "Basmati Pirinç||tahil|g|100|358|5.16|1.1|78",
            "105": "Bezelye||tahil|g|100|81|5.4|0.4|14",
            "104": "Börülce||tahil|g|100|340|23|1.5|60",
            "91": "Bulgur||tahil|g|100|342|12|1.3|76",
            "99": "Çavdar Ekmeği||tahil|dilim|1|83|3|0.5|16",
            "13": "Ekmek||tahil|dilim|1|125|2.6|0.5|25",
            "90": "Erişte||tahil|g|100|355|11|1.5|70",
            "87": "Esmer Pirinç||tahil|g|100|362|7.5|2.7|76",
            "17": "Fasülye||tahil|g|100|326|13.8|1.6|46",
            "92": "Karabuğday||tahil|g|100|343|13|3.4|72",
            "100": "Kepekli Ekmek||tahil|dilim|1|75|3.5|1|14",
            "102": "Kırmızı Mercimek||tahil|g|100|352|25|1|60",
            "93": "Kinoa||tahil|g|100|368|14|6|57",
            "10": "Lungo Pirinç||tahil|g|100|354|4.02|0.4|80",
            "12": "Makarna||tahil|g|100|352|7.2|1.3|72",
            "96": "Mısır||tahil|adet|1|90|3|1.5|19",
            "97": "Mısır Unu||tahil|g|100|365|7|1.5|79",
            "16": "Nohut||tahil|g|100|355|12|6.1|48",
            "98": "Tam Buğday Ekmeği||tahil|dilim|1|82|4|1|15",
            "89": "Tam Buğday Makarnası||tahil|g|100|340|13|1.5|68",
            "95": "Tam Buğday Unu||tahil|g|100|340|13|2.5|72",
            "101": "Tortilla||tahil|adet|1|146|4|3.5|24",
            "14": "Un||tahil|g|100|339|6|0.8|72",
            "88": "Yasemin Pirinci||tahil|g|100|356|6.8|0.6|79",
            "18": "Yeşil Mercimek||tahil|g|100|352|24|1|60",
            "15": "Yulaf||tahil|g|100|375|8.4|7|59",
            "94": "Yulaf Ezmesi||tahil|g|100|379|13|6.5|67",
            "138": "Ahududu||sebze_meyve|g|100|52|1.2|0.7|12",
            "131": "Ananas||sebze_meyve|g|100|50|0.5|0.1|13",
            "31": "Armut||sebze_meyve|g|100|57|0.4|0.1|15.2",
            "136": "Avokado||sebze_meyve|g|100|160|2|15|8.5",
            "117": "Biber||sebze_meyve|g|100|26|1|0.3|6",
            "139": "Böğürtlen||sebze_meyve|g|100|43|1.4|0.5|10",
            "109": "Brokoli||sebze_meyve|g|100|34|2.8|0.4|6.6",
            "124": "Brüksel Lahanası||sebze_meyve|g|100|43|3.4|0.3|9",
            "33": "Çilek||sebze_meyve|g|100|32|0.7|0.3|7.7",
            "106": "Domates||sebze_meyve|g|100|18|0.9|0.2|3.9",
            "30": "Elma||sebze_meyve|g|100|52|0.3|0.2|13.8",
            "134": "Greyfurt||sebze_meyve|g|100|42|0.8|0.1|10.7",
            "108": "Havuç||sebze_meyve|g|100|41|0.9|0.2|9.6",
            "111": "Ispanak||sebze_meyve|g|100|23|2.9|0.4|3.6",
            "115": "Kabak||sebze_meyve|g|100|17|1.2|0.3|3.1",
            "118": "Kapya Biber||sebze_meyve|g|100|31|1|0.3|6.9",
            "110": "Karnabahar||sebze_meyve|g|100|25|1.9|0.3|5",
            "34": "Karpuz||sebze_meyve|g|100|30|0.6|0.2|7.6",
            "35": "Kavun||sebze_meyve|g|100|34|0.8|0.2|8.2",
            "36": "Kiraz||sebze_meyve|g|100|50|1|0.3|12.2",
            "37": "Kivi||sebze_meyve|g|100|61|1.1|0.5|14.7",
            "125": "Kuşkonmaz||sebze_meyve|g|100|20|2.2|0.1|3.9",
            "123": "Lahana||sebze_meyve|g|100|25|1.3|0.1|5.8",
            "135": "Limon||sebze_meyve|adet|1|17|0.6|0.2|5.4",
            "38": "Mandalina||sebze_meyve|g|100|53|0.8|0.3|13.3",
            "132": "Mango||sebze_meyve|g|100|60|0.8|0.4|15",
            "122": "Mantar||sebze_meyve|g|100|22|3.1|0.3|3.3",
            "112": "Marul||sebze_meyve|g|100|15|1.4|0.2|2.9",
            "114": "Maydanoz||sebze_meyve|g|100|36|3|0.8|6.3",
            "29": "Meyve||sebze_meyve|g|100|15|0|0|15",
            "32": "Muz||sebze_meyve|g|100|89|1.1|0.3|22.8",
            "133": "Nar||sebze_meyve|g|100|83|1.7|1.2|18",
            "127": "Pancar||sebze_meyve|g|100|43|1.6|0.2|10",
            "129": "Patates||sebze_meyve|g|100|77|2|0.1|17",
            "116": "Patlıcan||sebze_meyve|g|100|25|1|0.2|5.9",
            "126": "Pırasa||sebze_meyve|g|100|61|1.5|0.3|14",
            "39": "Portakal||sebze_meyve|g|100|47|0.9|0.1|11.8",
            "113": "Roka||sebze_meyve|g|100|25|2.6|0.7|3.7",
            "107": "Salatalık||sebze_meyve|g|100|15|0.7|0.1|3.6",
            "121": "Sarımsak||sebze_meyve|g|100|149|6.4|0.5|33",
            "28": "Sebze||sebze_meyve|g|100|28|1.5|0.2|5",
            "119": "Sivri Biber||sebze_meyve|g|100|27|1.1|0.3|6.5",
            "120": "Soğan||sebze_meyve|g|100|40|1.1|0.1|9.3",
            "128": "Şalgam||sebze_meyve|g|100|28|0.9|0.1|6.4",
            "40": "Şeftali||sebze_meyve|g|100|39|0.9|0.3|9.5",
            "130": "Tatlı Patates||sebze_meyve|g|100|86|1.6|0.1|20",
            "41": "Üzüm||sebze_meyve|g|100|69|0.7|0.2|18.1",
            "137": "Yaban Mersini||sebze_meyve|g|100|57|0.7|0.3|14",
            "143": "Antep Fıstığı||yag|g|100|560|20|45|28",
            "156": "Avokado Yağı||yag|ml|100|884|0|100|0",
            "147": "Ay Çekirdeği||yag|g|100|584|21|51|20",
            "155": "Ayçiçek Yağı||yag|ml|100|884|0|100|0",
            "140": "Badem||yag|g|100|579|21|50|22",
            "153": "Badem Ezmesi||yag|g|100|614|21|55|22",
            "141": "Ceviz||yag|g|100|654|15|65|14",
            "148": "Chia Tohumu||yag|g|100|486|17|31|42",
            "142": "Fındık||yag|g|100|628|15|61|17",
            "152": "Fıstık Ezmesi||yag|g|100|588|25|50|20",
            "154": "Hindistan Cevizi Yağı||yag|g|100|892|0|99|0",
            "146": "Kabak Çekirdeği||yag|g|100|559|30|49|11",
            "144": "Kaju||yag|g|100|553|18|44|30",
            "149": "Keten Tohumu||yag|g|100|534|18|42|29",
            "150": "Susam||yag|g|100|573|18|50|23",
            "151": "Tahin||yag|g|100|595|17|54|21",
            "20": "Tereyağı||yag|g|100|717|0.8|81|0.1",
            "145": "Yer Fıstığı||yag|g|100|567|26|49|16",
            "19": "Zeytinyağı||yag|ml|100|900|0|100|0",
            "161": "Domates Çorbası||yemek|porsiyon|1|140|3|5|20",
            "171": "Et Sote||yemek|porsiyon|1|380|28|22|12",
            "165": "Etli Kuru Fasulye||yemek|porsiyon|1|320|16|10|40",
            "158": "Ezogelin Çorbası||yemek|porsiyon|1|210|8|7|26",
            "26": "Fish Fingers||yemek|g|100|179|12|7.9|15",
            "173": "İmam Bayıldı||yemek|adet|1|240|4|16|18",
            "163": "İşkembe Çorbası||yemek|porsiyon|1|220|14|11|10",
            "172": "Karnıyarık||yemek|adet|1|280|12|14|24",
            "174": "Mantı||yemek|porsiyon|1|420|16|12|58",
            "168": "Menemen||yemek|porsiyon|1|260|12|18|10",
            "157": "Mercimek Çorbası||yemek|porsiyon|1|190|9|5|25",
            "166": "Nohut Yemeği||yemek|porsiyon|1|330|14|10|42",
            "169": "Omlet||yemek|adet|1|210|13|16|2",
            "176": "Peynirli Makarna||yemek|porsiyon|1|420|15|16|52",
            "175": "Pişmiş Makarna||yemek|porsiyon|1|280|9|4|48",
            "162": "Sebze Çorbası||yemek|porsiyon|1|120|4|4|15",
            "167": "Sebze Yemeği||yemek|porsiyon|1|180|5|8|20",
            "159": "Tarhana Çorbası||yemek|porsiyon|1|180|5|6|26",
            "160": "Tavuk Çorbası||yemek|porsiyon|1|160|12|6|12",
            "170": "Tavuk Sote||yemek|porsiyon|1|300|28|14|10",
            "164": "Tavuklu Pilav||yemek|porsiyon|1|390|15|10|58",
            "187": "Baklava||tatli|dilim|1|130|2|8|14",
            "179": "Beyaz Çikolata||tatli|g|100|539|5.9|32|59",
            "192": "Bisküvi||tatli|adet|1|48|0.7|2|7",
            "177": "Bitter Çikolata||tatli|g|100|598|7.8|43|46",
            "185": "Cheesecake||tatli|dilim|1|320|5.5|22|26",
            "184": "Dondurma||tatli|porsiyon|1|210|3.5|11|24",
            "180": "Granola||tatli|g|100|471|10|20|64",
            "193": "Kraker||tatli|adet|1|35|0.7|1.5|5",
            "191": "Kurabiye||tatli|adet|1|78|1|4|10",
            "189": "Künefe||tatli|porsiyon|1|380|6|20|44",
            "190": "Lokum||tatli|adet|1|32|0|0|8",
            "194": "Patlamış Mısır||tatli|g|100|387|12|4.5|78",
            "182": "Pirinç Patlağı||tatli|g|100|387|8|3|81",
            "181": "Protein Bar||tatli|adet|1|200|20|6|18",
            "27": "Puding||tatli|porsiyon|1|137|3|5|20",
            "188": "Revani||tatli|dilim|1|240|3|10|36",
            "186": "Sütlaç||tatli|porsiyon|1|230|5|6|38",
            "178": "Sütlü Çikolata||tatli|g|100|535|7.6|30|59",
            "183": "Yulaf Bar||tatli|adet|1|180|4|6|28",
            "198": "Americano||icecek|adet|1|10|0.5|0|1.7",
            "203": "Bitki Çayı||icecek|adet|1|2|0|0|0",
            "200": "Cappuccino||icecek|adet|1|110|6|5.5|9",
            "201": "Çay||icecek|adet|1|2|0|0|0.5",
            "207": "Elma Suyu||icecek|ml|100|46|0.1|0.1|11",
            "214": "Enerji İçeceği||icecek|ml|100|45|0.4|0|11",
            "197": "Espresso||icecek|adet|1|9|0.5|0.2|1.7",
            "196": "Filtre Kahve||icecek|adet|1|5|0.3|0|0",
            "211": "Gazoz||icecek|ml|100|38|0|0|9.5",
            "204": "Kakao||icecek|adet|1|80|3|2|14",
            "209": "Kola||icecek|ml|100|42|0|0|10.6",
            "199": "Latte||icecek|adet|1|135|8|6|11",
            "212": "Maden Suyu||icecek|ml|100|0|0|0|0",
            "208": "Nar Suyu||icecek|ml|100|54|0.4|0.3|13",
            "206": "Portakal Suyu||icecek|ml|100|45|0.7|0.2|10",
            "215": "Protein Shake||icecek|adet|1|160|25|3|5",
            "205": "Sıcak Çikolata||icecek|adet|1|190|5|6|28",
            "213": "Soda||icecek|ml|100|0|0|0|0",
            "210": "Şekersiz Kola||icecek|ml|100|0.3|0|0|0.1",
            "195": "Türk Kahvesi||icecek|adet|1|15|0.2|0|3",
            "202": "Yeşil Çay||icecek|adet|1|2|0|0|0",
            "223": "Acı Sos||diger|g|100|30|1|0.5|5",
            "216": "Bal||diger|g|100|304|0.3|0|82",
            "225": "Balsamik Sirke||diger|g|100|88|0.5|0|17",
            "222": "Barbekü Sos||diger|g|100|172|0.8|0.6|41",
            "226": "Elma Sirkesi||diger|g|100|21|0|0|0.9",
            "221": "Hardal||diger|g|100|66|4|3.3|6",
            "229": "Hindistan Cevizi Sütü||diger|ml|100|197|2|21|3",
            "219": "Ketçap||diger|g|100|101|1.2|0.1|25",
            "220": "Mayonez||diger|g|100|680|1|75|2",
            "218": "Pekmez||diger|g|100|293|1|0.2|74",
            "5": "Protein Tozu||diger|g|100|391|73|5.5|12",
            "217": "Reçel||diger|g|100|278|0.4|0|69",
            "224": "Soya Sosu||diger|g|100|53|8|0.6|5",
            "228": "Şeker||diger|g|100|387|0|0|100",
            "227": "Tuz||diger|g|100|0|0|0|0"
        };

        const ESKI_KATEGORI_MAP = { karb: 'tahil', sebze: 'sebze_meyve', meyve: 'sebze_meyve' };
        // İsim üzerinden güvenli kategori eşleştirme — sadece açıkça balık olan kayıtlar için
        const BALIK_IPUCLARI = ['balık', 'balik', 'somon', 'ton balığı', 'levrek', 'çipura', 'uskumru', 'hamsi', 'sardalya', 'alabalık', 'mezgit', 'palamut', 'lüfer', 'karides', 'kalamar', 'midye', 'ahtapot', 'stavrit', 'i̇stavrit', 'fish'];
        // Kategori düzeltmesi gereken özel isimler (eski seed hataları)
        const OZEL_KATEGORI_DUZELTMELERI = { 'fish fingers': 'yemek', 'puding': 'tatli' };

        function besinMigrasyon() {
            const rapor = { yenidenKategorize: 0, duplicateTemizlenen: 0, geriEklenenSeed: 0, balikDuzeltme: 0, korunanKullaniciKaydi: 0, degismedenBirakilan: 0 };
            let degisti = false;

            // 1) Özel isim düzeltmeleri ÖNCE (eski seed hataları), sonra eski->yeni kategori dönüşümü,
            //    en son eksik/geçersiz kategori için güvenli balık eşleştirme veya diger
            besinler.forEach(b => {
                const adKucuk = (b.ad || '').toLocaleLowerCase('tr-TR');
                let degistiBu = false;
                if (OZEL_KATEGORI_DUZELTMELERI[adKucuk]) {
                    if (b.kategori !== OZEL_KATEGORI_DUZELTMELERI[adKucuk]) {
                        b.kategori = OZEL_KATEGORI_DUZELTMELERI[adKucuk];
                        rapor.yenidenKategorize++;
                        degistiBu = true;
                    }
                } else if (b.kategori && ESKI_KATEGORI_MAP[b.kategori]) {
                    b.kategori = ESKI_KATEGORI_MAP[b.kategori];
                    rapor.yenidenKategorize++;
                    degistiBu = true;
                }
                if (!b.kategori || !GECERLI_KATEGORI_ANAHTARLARI.has(b.kategori)) {
                    if (BALIK_IPUCLARI.some(ip => adKucuk.includes(ip))) {
                        b.kategori = 'balik';
                        rapor.balikDuzeltme++;
                    } else {
                        b.kategori = 'diger';
                    }
                    degistiBu = true;
                }
                if (!b.birim) {
                    const tohum = tohumVeriler.find(t => t.id === b.id);
                    b.birim = tohum ? tohum.birim : (b.ref == 1 ? 'adet' : 'g');
                    degistiBu = true;
                }
                if (b.marka === undefined) { b.marka = ''; degistiBu = true; }
                if (degistiBu) degisti = true; else rapor.degismedenBirakilan++;
            });

            // 2) Duplicate temizliği — aynı id veya aynı ad+marka tekrarları.
            //    Kullanıcı tarafından oluşturulmuş (seed dışı) kayıt her zaman seed kaydını ezer; ilk kayıt kazanır.
            const gorulenId = new Set();
            const gorulenAdMarka = new Set();
            const temizBesinler = [];
            besinler.forEach(b => {
                const anahtarAdMarka = ((b.ad || '') + '|' + (b.marka || '')).toLocaleLowerCase('tr-TR');
                const seedMi = tohumVeriler.some(t => t.id === b.id);
                if (gorulenId.has(b.id) || gorulenAdMarka.has(anahtarAdMarka)) {
                    // duplicate: eğer bu bir seed kaydıysa ve aynı ad+marka zaten varsa güvenle at
                    rapor.duplicateTemizlenen++;
                    degisti = true;
                    return;
                }
                gorulenId.add(b.id);
                gorulenAdMarka.add(anahtarAdMarka);
                if (!seedMi) rapor.korunanKullaniciKaydi++;
                temizBesinler.push(b);
            });
            besinler = temizBesinler;

            // 3) Duplicate Yumurta özel kontrolü — adı tam "Yumurta" olanlar tek (sut kategorili) kayda indirilir
            const yumurtalar = besinler.filter(b => (b.ad || '').toLocaleLowerCase('tr-TR') === 'yumurta');
            if (yumurtalar.length > 1) {
                const tutulacak = yumurtalar.find(b => b.kategori === 'sut') || yumurtalar[0];
                besinler = besinler.filter(b => !(yumurtalar.includes(b) && b !== tutulacak));
                rapor.duplicateTemizlenen += yumurtalar.length - 1;
                degisti = true;
            }

            if (degisti) localStorage.setItem('df_besinler', JSON.stringify(besinler));
            localStorage.setItem('df_migration_version', String(MIGRATION_VERSION));
            console.log('Migration tamamlandı\n- yeniden kategorize edilen: ' + rapor.yenidenKategorize
                + '\n- duplicate temizlenen: ' + rapor.duplicateTemizlenen
                + '\n- Balık düzeltmesi: ' + rapor.balikDuzeltme
                + '\n- korunan kullanıcı kaydı: ' + rapor.korunanKullaniciKaydi
                + '\n- değişmeden bırakılan kayıt: ' + rapor.degismedenBirakilan);
        }

        // SEED SENKRONİZASYONU — merkezi default (besinler.js) ↔ kullanıcı kütüphanesi.
        // Amaç yalnızca "eksik seed ekle" değil: merkezi default DEĞİŞİKLİKLERİNİ
        // kullanıcı özelleştirmelerini koruyarak senkronize etmektir.
        //
        // KAYNAK AYRIMI (metadata):
        //   kaynak: 'seed'      → default seed kaydı (merkezi değişiklikler yansıtılır)
        //   kaynak: 'seed' + ozel: true → kullanıcı tarafından DÜZENLENMİŞ seed (ASLA ezilmez)
        //   kaynak: 'kullanici' → kullanıcı tarafından OLUŞTURULMUŞ besin (ASLA dokunulmaz)
        // Metadata'sız ESKİ kayıtlarda (güvenli migration):
        //   id'si bir seed id'si olan kayıt seed sayılır; ancak alanları default ile birebir
        //   aynıysa "değiştirilmemiş" kabul edilip güncellenebilir, farklıysa kullanıcı
        //   değişikliği OLABİLECEĞİNDEN korunur (yanlış ezme riski sıfır).
        //
        // SİLİNEN SEEDLER — df_seed_silinenler (mezar taşı): kullanıcı bir seed besini
        // sildiğinde id'si buraya yazılır; sonraki senkronizasyonlarda tekrar EKLENMEZ.
        // Kullanıcı besinler.js'ten o ürünü tamamen çıkardıysa mezar taşı temizlenir.
        function seedAlanlariEsitMi(a, b) {
            const alanlar = ['ad', 'marka', 'kategori', 'birim', 'ref', 'cal', 'pro', 'yag', 'karb'];
            return alanlar.every(al => {
                const x = a[al], y = b[al];
                if (al === 'marka') return (x || '') === (y || '');
                if (typeof x === 'number' || typeof y === 'number') return parseFloat(x) === parseFloat(y);
                return x === y;
            });
        }

        function seedSenkronizeEt() {
            const rapor = { eklenen: 0, guncellenen: 0, korunanOzel: 0, kullaniciKaydi: 0, mezarTemizlenen: 0, merkezdenCikan: 0 };

            // Mezar taşı: artık seed'de bulunmayan id'leri temizle (besinler.js'ten silinmiş)
            let mezarTasi = [];
            try { mezarTasi = JSON.parse(localStorage.getItem('df_seed_silinenler')) || []; } catch (e) { mezarTasi = []; }
            const seedIdKumesi = new Set(tohumVeriler.map(t => t.id));
            const temizMezar = mezarTasi.filter(id => seedIdKumesi.has(id));
            if (temizMezar.length !== mezarTasi.length) {
                rapor.mezarTemizlenen = mezarTasi.length - temizMezar.length;
                mezarTasi = temizMezar;
            }
            const mezarKumesi = new Set(mezarTasi);

            const idEndeks = new Map();
            besinler.forEach(b => idEndeks.set(b.id, b));

            tohumVeriler.forEach(t => {
                const mevcut = idEndeks.get(t.id);
                if (!mevcut) {
                    // 1) Kullanıcı bu seed'i sildi → saygı duy, tekrar ekleme
                    if (mezarKumesi.has(t.id)) return;
                    // 2) Eksik seed → ekle (metadata ile)
                    besinler.push({ id: t.id, ad: t.ad, marka: t.marka || '', kategori: t.kategori, birim: t.birim, ref: t.ref, cal: t.cal, pro: t.pro, yag: t.yag, karb: t.karb, kaynak: 'seed' });
                    idEndeks.set(t.id, besinler[besinler.length - 1]);
                    rapor.eklenen++;
                    return;
                }
                // 3) Kullanıcı tarafından düzenlenmiş seed → EZİLMEZ
                if (mevcut.ozel === true) { rapor.korunanOzel++; return; }
                // 4) Kullanıcı besini (id seed'de yoktu ama aynı id'ye rastlandı — teorik durum) → dokunma
                if (mevcut.kaynak === 'kullanici') { rapor.kullaniciKaydi++; return; }
                // 5) Metadata'sız ESKİ kayıt → güvenli migration:
                //    Kayıt, kullanıcının eski sürümdeki default ile BİREBİR aynıysa kullanıcı
                //    değiştirmedi demektir → merkezi default güvenle uygulanır.
                //    FARKLIYSE kullanıcı değişikliği OLABİLECEĞİNDEN korunur (ezilmez, etiketlenir).
                if (!mevcut.kaynak) {
                    const eskiImza = NUTRIO_SEED_V3_IZLENIM[t.id];
                    const mevcutImza = [mevcut.ad, mevcut.marka || '', mevcut.kategori, mevcut.birim, mevcut.ref, mevcut.cal, mevcut.pro, mevcut.yag, mevcut.karb].join('|');
                    const degistirmemis = eskiImza === mevcutImza || seedAlanlariEsitMi(mevcut, t);
                    if (degistirmemis) {
                        mevcut.kaynak = 'seed';
                        // sonra 6. adımda default uygulanır (aşağıda ortak akış)
                    } else {
                        mevcut.kaynak = 'seed';
                        mevcut.ozel = true;
                        rapor.korunanOzel++;
                        return;
                    }
                }
                // 6) Değiştirilmemiş seed → merkezi default uygulanır (ad/kategori/değer değişiklikleri yansır)
                if (!seedAlanlariEsitMi(mevcut, t)) {
                    ['ad', 'marka', 'kategori', 'birim', 'ref', 'cal', 'pro', 'yag', 'karb'].forEach(al => { mevcut[al] = t[al]; });
                    mevcut.kaynak = 'seed';
                    rapor.guncellenen++;
                }
            });

            // Kullanıcı besinlerine metadata etiketi (eksikse) — güvenli etiketleme:
            // yalnızca hiçbir seed id'siyle eşleşmeyen kayıtlar 'kullanici' sayılır.
            besinler.forEach(b => {
                if (!b.kaynak) b.kaynak = seedIdKumesi.has(b.id) ? 'seed' : 'kullanici';
            });

            // MERKEZDEN ÇIKARILAN SEEDLER: besinler.js'ten tamamen silinen bir seed'in
            // kullanıcı kopyası temizlenir (özelleştirilmiş ve kullanıcı besinleri kalır).
            const merkezdeYok = besinler.filter(b => b.kaynak !== 'kullanici' && b.ozel !== true && !seedIdKumesi.has(b.id));
            if (merkezdeYok.length > 0) {
                const cikanIdler = new Set(merkezdeYok.map(b => b.id));
                besinler = besinler.filter(b => !cikanIdler.has(b.id));
                rapor.merkezdenCikan = merkezdeYok.length;
            }

            if (rapor.eklenen > 0 || rapor.guncellenen > 0 || rapor.mezarTemizlenen > 0 || rapor.merkezdenCikan > 0) {
                localStorage.setItem('df_besinler', JSON.stringify(besinler));
            }
            localStorage.setItem('df_seed_silinenler', JSON.stringify(mezarTasi));
            localStorage.setItem('df_seed_version', String(SEED_VERSION));
            if (rapor.eklenen || rapor.guncellenen || rapor.korunanOzel || rapor.mezarTemizlenen || rapor.merkezdenCikan) {
                console.log('Seed senkronizasyonu: +' + rapor.eklenen + ' eklendi, ' + rapor.guncellenen + ' default güncellendi, '
                    + rapor.korunanOzel + ' kullanıcı düzenlemesi korundu, ' + rapor.merkezdenCikan + ' merkezden çıkartıldı, '
                    + rapor.mezarTemizlenen + ' mezar taşı temizlendi.');
            }
            return rapor;
        }

        function profilMigrasyon() {
            let degisti = false;
            profiller.forEach(p => {
                if (!p.girdi) {
                    let bilinenKilo = (p.kiloGecmisi && p.kiloGecmisi.length) ? p.kiloGecmisi[p.kiloGecmisi.length - 1].kilo : 70;
                    p.girdi = { cins: 'erkek', yas: 25, boy: 170, kilo: bilinenKilo, adimFaktor: 1.2, egzGun: 3, egzTip: 'agirlik', egzSure: 45, hedef: 'koruma' };
                    degisti = true;
                }
                if (!p.girdi.antrenmanGunleri) { p.girdi.antrenmanGunleri = []; degisti = true; }
                // FAZ 11 — profil avatarı (emoji): eski profillerde varsayılan 👤
                if (!p.avatar || !AVATAR_SECENEKLERI.some(a => a.anahtar === p.avatar)) { p.avatar = AVATAR_VARSAYILAN; degisti = true; }
                // FAZ 11 — ana ekran kart sırası: sadece skor/aktivite/su/öğünler (diğer kartlar sabit)
                if (!Array.isArray(p.kartSirasi)) { p.kartSirasi = ['skor', 'ogunler', 'su', 'aktivite']; degisti = true; }
                // FAZ 14 — 'ogunler' kartı: eski profillerin mevcut sırası bozulmasın, yeni kart sona eklenir
                if (!p.kartSirasi.includes('ogunler')) { p.kartSirasi.push('ogunler'); degisti = true; }
                // FAZ 17 DÜZELTME — bir önceki fazda kartSirasi varsayılanından 'aktivite' YANLIŞLIKLA
                // düşürülmüştü; bu satır o hatadan etkilenen profillerdeki eksik 'aktivite'yi geri ekler.
                if (!p.kartSirasi.includes('aktivite')) { p.kartSirasi.push('aktivite'); degisti = true; }
                if (!p.kiloGecmisi) {
                    p.kiloGecmisi = [{ id: benzersizId(), tarih: p.aktifTarih || bugununTarihi, kilo: p.girdi.kilo }];
                    degisti = true;
                }
                // Sabit başlangıç kilosu: en eski kayıt silinse bile değişmez (sadece migrasyon/profil oluşturma set eder)
                if (p.baslangicKilosu === undefined) {
                    p.baslangicKilosu = (p.kiloGecmisi && p.kiloGecmisi.length)
                        ? [...p.kiloGecmisi].sort((a, b) => tarihToDate(a.tarih) - tarihToDate(b.tarih))[0].kilo
                        : p.girdi.kilo;
                    degisti = true;
                }
                if (!p.su) { p.su = { tarih: bugununTarihi, miktar: 0 }; degisti = true; }
                if (!p.suHedefMl) { p.suHedefMl = Math.round((p.girdi.kilo * 33) / 250) * 250; degisti = true; }
                // Faz 7: özel su miktarı — null ise "+ Özel Miktar Tanımla" linki gösterilir
                if (p.suOzelMiktar === undefined) { p.suOzelMiktar = null; degisti = true; }
                if (p.hedefKilo === undefined) { p.hedefKilo = null; degisti = true; }
                if (!p.takviyeGecmisi) { p.takviyeGecmisi = {}; degisti = true; }
                if (!p.gunlukAktivite) { p.gunlukAktivite = {}; degisti = true; }
                if (!p.icecekGunlugu) { p.icecekGunlugu = {}; degisti = true; }
                if (!p.bildirimGecmisi) { p.bildirimGecmisi = []; degisti = true; }
                if (!p.otomatikYedekler) { p.otomatikYedekler = []; degisti = true; }
                // Faz 1: plan/market veri modeli altyapısı — henüz kullanılmaz, ileri fazlar için hazır.
                // planEntries: { id, tarih, ogunTuru, kaynakTipi: 'sablon'|'besin', kaynakId, miktar, durum: 'bekliyor'|'yendi'|'atlandi' }
                if (!p.planEntries) { p.planEntries = []; degisti = true; }
                // marketListesi: { id, ad, miktar, kategori, alindiMi, kaynak: 'plan'|'manuel' }
                if (!p.marketListesi) { p.marketListesi = []; degisti = true; }
                // Faz 10: özel günler — istatistik ortalamalarından çıkarılan (SİLİNMEYEN) tarih dizisi
                if (!p.ozelGunler) { p.ozelGunler = []; degisti = true; }
                // Faz 10: otomatik tekrarlar — { id, sablonId, ogunTuru } (her gün yeni güne sessizce eklenir)
                if (!p.otomatikTekrarlar) { p.otomatikTekrarlar = []; degisti = true; }
                // Faz 12: Stoğum (kiler) — { id, ad, kategori, eklenmeTarihi, sktTarihi: null }
                if (!p.stokListesi) { p.stokListesi = []; degisti = true; }
                if (!p.antrenmanPlani) { p.antrenmanPlani = []; degisti = true; }
            });
            if (degisti) localStorage.setItem('df_profiller', JSON.stringify(profiller));
        }

        function takviyeMigrasyon() {
            let degisti = false;
            takviyeler.forEach(t => {
                if (!t.baslangic) { t.baslangic = bugununTarihi; degisti = true; }
                if (!t.gunler) { t.gunler = []; degisti = true; }
            });
            if (degisti) localStorage.setItem('df_takviyeler', JSON.stringify(takviyeler));
        }

        function sablonMigrasyon() {
            let degisti = false;
            sablonlar.forEach(s => {
                if (!s.porsiyonSayisi) { s.porsiyonSayisi = 1; degisti = true; }
            });
            if (degisti) localStorage.setItem('df_sablonlar', JSON.stringify(sablonlar));
        }

        // Migration sadece versiyon değişmişse çalışır (idempotent).
        // Seed senkronizasyonu HER AÇILIŞTA çalışır: eksik seed'leri ekler, merkezi default
        // değişikliklerini kullanıcı özelleştirmelerini koruyarak uygular (yukarıdaki dokümana bak).
        if (localStorage.getItem('df_migration_version') !== String(MIGRATION_VERSION)) {
            besinMigrasyon();
            profilMigrasyon();
            takviyeMigrasyon();
            sablonMigrasyon();
        }
        seedSenkronizeEt();

        // SAYFA VE PROFİL YÖNETİMİ
        function baslangicKontrolu() {
            temaBaslangictaYukle();
            ogunSecenekleriniDoldur();
            ilkKullanimTarihiKaydet();
            // Faz 6: ilk açılışta (hiç profil yokken) onboarding bir kez gösterilir.
            // "Başla"/"Atla" sonrası df_onboarding_gorundu işaretlenir ve bir daha çıkmaz.
            if (profiller.length === 0 && localStorage.getItem('df_onboarding_gorundu') !== '1') {
                sayfaGoster('onboarding-ekrani');
                return;
            }
            if (profiller.length === 0) {
                sayfaGoster('profil-ekrani');
            } else {
                if (!aktifProfilId || !profiller.find(p => p.id == aktifProfilId)) {
                    aktifProfilId = profiller[0].id;
                }
                tarihKontrol(aktifProfilId);
                sayfaGoster('ana-ekran');
            }
        }

        // ══════════ FAZ 6: ONBOARDING ══════════
        let onboardingAdim = 0;
        const ONBOARDING_ADIM_SAYISI = 4;

        function onboardingAdimGoster() {
            for (let i = 0; i < ONBOARDING_ADIM_SAYISI; i++) {
                const adimEl = document.getElementById('ob-adim-' + i);
                if (adimEl) adimEl.classList.toggle('gizli', i !== onboardingAdim);
            }
            document.querySelectorAll('#ob-noktalar .ob-nokta').forEach((n, i) => {
                n.classList.toggle('aktif', i === onboardingAdim);
            });
            const btn = document.getElementById('ob-ileri-btn');
            if (btn) btn.innerText = (onboardingAdim === ONBOARDING_ADIM_SAYISI - 1) ? 'Başla' : 'İleri';
        }

        function onboardingIleri() {
            if (onboardingAdim < ONBOARDING_ADIM_SAYISI - 1) {
                onboardingAdim++;
                onboardingAdimGoster();
            } else {
                onboardingBitir();
            }
        }

        function onboardingAtla() {
            onboardingBitir();
        }

        function onboardingBitir() {
            localStorage.setItem('df_onboarding_gorundu', '1');
            sayfaGoster('profil-ekrani');
        }

        // FAZ 17 — Tanıtım/özellikler turu: onboarding ile AYNI CSS sınıflarını
        // (.ob-ic/.ob-adim/.ob-ikon/.ob-noktalar) kullanır ama zorunlu bir akış
        // değil — istendiğinde Daha Fazla'dan açılır, ileri/geri gezilebilir.
        let tanitimAdimNo = 0;
        const TANITIM_ADIM_SAYISI = 15;
        function tanitimAc() {
            tanitimAdimNo = 0;
            tanitimAdimGoster();
            sayfaGoster('tanitim-ekrani');
        }
        function tanitimAdimGoster() {
            for (let i = 0; i < TANITIM_ADIM_SAYISI; i++) {
                const el = document.getElementById('tn-adim-' + i);
                if (el) el.classList.toggle('gizli', i !== tanitimAdimNo);
            }
            document.querySelectorAll('#tn-noktalar .ob-nokta').forEach((n, i) => {
                n.classList.toggle('aktif', i === tanitimAdimNo);
            });
            const ileriBtn = document.getElementById('tn-ileri-btn');
            if (ileriBtn) ileriBtn.innerText = (tanitimAdimNo === TANITIM_ADIM_SAYISI - 1) ? 'Bitir' : 'İleri';
            const geriBtn = document.getElementById('tn-geri-btn');
            if (geriBtn) geriBtn.classList.toggle('gizli', tanitimAdimNo === 0);
        }
        function tanitimIleri() {
            if (tanitimAdimNo < TANITIM_ADIM_SAYISI - 1) {
                tanitimAdimNo++;
                tanitimAdimGoster();
            } else {
                tanitimKapat();
            }
        }
        function tanitimGeri() {
            if (tanitimAdimNo > 0) {
                tanitimAdimNo--;
                tanitimAdimGoster();
            }
        }
        function tanitimKapat() {
            sayfaGoster('daha-fazla-ekrani');
        }

        // ══════════ FAZ 6: YEDEK HATIRLATICISI ══════════
        // İlk kullanım referansı: hiç yoksa bugünün tarihiyle bir kez set edilir.
        function ilkKullanimTarihiKaydet() {
            if (!localStorage.getItem('df_ilk_kullanim_tarihi')) {
                localStorage.setItem('df_ilk_kullanim_tarihi', bugununTarihi);
            }
        }

        // Referans tarih: son yedek tarihi varsa o, yoksa ilk kullanım tarihi.
        // 14+ gün geçtiyse ve son 7 günde ertelenmediyse Ana ekranda banner göster.
        function yedekHatirlaticisiKontrolEt() {
            const alan = document.getElementById('yedek-hatirlatici-alan');
            if (!alan) return;
            const referans = localStorage.getItem('df_son_yedek_tarihi') || localStorage.getItem('df_ilk_kullanim_tarihi');
            if (!referans) { alan.classList.add('gizli'); return; }
            const gecenGun = tarihFarkiGun(bugununTarihi, referans);
            const ertelenen = localStorage.getItem('df_yedek_hatirlatma_ertelendi');
            const ertelemeGecerli = ertelenen && tarihFarkiGun(bugununTarihi, ertelenen) < 7;
            if (gecenGun < 14 || ertelemeGecerli) {
                alan.classList.add('gizli');
                alan.innerHTML = '';
                return;
            }
            alan.innerHTML =
                '<div class="yedek-banner">' +
                '<span class="yedek-metin">'+'Son yedeğini <strong>' + gecenGun + '</strong> gün önce aldın. Verilerini güvenceye al.'+'</span>' +
                '<button class="btn-kucuk" style="flex:0 0 auto; margin:0;" onclick="veriDisaAktar()">Şimdi Yedekle</button>' +
                '<button class="yedek-kapat" onclick="yedekHatirlaticisiErtele()" title="7 gün sonra hatırlat">✕</button>' +
                '</div>';
            alan.classList.remove('gizli');
        }

        // ✕ — 7 gün ertele: bugünün tarihi yazılır, banner gizlenir.
        function yedekHatirlaticisiErtele() {
            localStorage.setItem('df_yedek_hatirlatma_ertelendi', bugununTarihi);
            const alan = document.getElementById('yedek-hatirlatici-alan');
            if (alan) { alan.classList.add('gizli'); alan.innerHTML = ''; }
        }

        // ══════════ FAZ 6: YEREL BİLDİRİMLER ══════════
        // ÖNEMLİ KISIT: Nutrio sunucusuz bir PWA olduğu için uygulama kapalıyken arka planda
        // bildirim göndermek güvenilir DEĞİLDİR (özellikle iOS Safari'de garanti edilemez).
        // Bu yüzden bildirimler SADECE uygulama/sekme açıkken çalışan basit bir hatırlatıcı
        // olarak kurulmuştur; "her zaman gelir" gibi bir vaat yaratılmaz.
        function bildirimIzinDurumu() {
            if (typeof Notification === 'undefined') return 'desteklenmiyor';
            return Notification.permission;
        }

        function bildirimKartGuncelle() {
            const yaziEl = document.getElementById('bildirim-izin-durum');
            if (yaziEl) {
                const durum = bildirimIzinDurumu();
                const etiketler = {
                    granted: 'İzin verildi ✓',
                    denied: 'Reddedildi',
                    default: 'İzin bekliyor',
                    desteklenmiyor: 'Bu tarayıcı desteklemiyor'
                };
                yaziEl.innerText = etiketler[durum] || durum;
            }
            const btnEl = document.getElementById('bildirim-izin-btn');
            if (btnEl) btnEl.classList.toggle('gizli', bildirimIzinDurumu() !== 'default');
            const cbEl = document.getElementById('su-hatirlatici-checkbox');
            if (cbEl) cbEl.checked = localStorage.getItem('df_su_hatirlatici_aktif') === '1';
            // FAZ 10 — yeni hatırlatıcı toggle'ları + kilo günü seçici + antrenman su artışı
            const kayitCb = document.getElementById('kayit-hatirlatici-checkbox');
            if (kayitCb) kayitCb.checked = localStorage.getItem('df_kayit_hatirlatici_aktif') === '1';
            const takviyeCb = document.getElementById('takviye-hatirlatici-checkbox');
            if (takviyeCb) takviyeCb.checked = localStorage.getItem('df_takviye_hatirlatici_aktif') === '1';
            const kiloCb = document.getElementById('kilo-hatirlatici-checkbox');
            if (kiloCb) kiloCb.checked = localStorage.getItem('df_kilo_hatirlatici_aktif') === '1';
            const kiloGunSel = document.getElementById('kilo-hatirlatma-gunu');
            if (kiloGunSel) {
                kiloGunSel.innerHTML = gunAdlari.map((ad, i) => '<option value="' + i + '">' + esc(ad) + '</option>').join('');
                const kayitli = localStorage.getItem('df_kilo_hatirlatma_gunu');
                kiloGunSel.value = (kayitli !== null && kayitli !== '') ? kayitli : '6';
            }
            const suArtisCb = document.getElementById('su-antrenman-artis-checkbox');
            if (suArtisCb) suArtisCb.checked = localStorage.getItem('df_su_antrenman_artis') !== '0';
        }

        async function bildirimIzinIste() {
            if (typeof Notification === 'undefined') {
                bildirGoster('Bu tarayıcı bildirimleri desteklemiyor', 'hata');
                return;
            }
            const sonuc = await Notification.requestPermission();
            bildirimKartGuncelle();
            if (sonuc === 'granted') bildirGoster('🔔 Bildirim izni verildi');
            else if (sonuc === 'denied') bildirGoster('Bildirim izni reddedildi', 'hata');
        }

        function suHatirlaticiDegisti(el) {
            localStorage.setItem('df_su_hatirlatici_aktif', el.checked ? '1' : '0');
            if (el.checked && bildirimIzinDurumu() !== 'granted') {
                bildirGoster('Önce bildirim izni vermen gerekiyor', 'hata');
                el.checked = false;
                localStorage.setItem('df_su_hatirlatici_aktif', '0');
            }
        }

        // FAZ 17 — Bildirim/Aktivite Merkezi: OS bildirimi gösterilen her yerde AYRICA
        // kalıcı bir geçmişe kaydedilir (aktif.bildirimGecmisi, en fazla son 50).
        // Sadece gerçek Notification() çağrılarını loglar — bildirGoster()'ın binlerce
        // rutin toast'ını (besin eklendi vb.) DOKUNMADAN bırakır.
        function bildirimMerkeziEkle(baslik, mesaj) {
            try {
                const aktif = aktifProfiliGetir();
                if (!aktif) return;
                if (!aktif.bildirimGecmisi) aktif.bildirimGecmisi = [];
                aktif.bildirimGecmisi.unshift({
                    id: benzersizId(), tarih: bugununTarihi,
                    saat: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                    baslik: baslik, mesaj: mesaj
                });
                if (aktif.bildirimGecmisi.length > 50) aktif.bildirimGecmisi = aktif.bildirimGecmisi.slice(0, 50);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
            } catch (e) { /* sessizce yoksay */ }
        }
        function bildirimMerkeziListele() {
            const alan = document.getElementById('bm-liste');
            if (!alan) return;
            const aktif = aktifProfiliGetir();
            const liste = (aktif && aktif.bildirimGecmisi) || [];
            alan.innerHTML = liste.length === 0
                ? '<div class="bos-durum">Henüz bildirim gönderilmedi.</div>'
                : liste.map(b => `<div class="mini-satir"><span><strong>${esc(b.baslik)}</strong><br><span class="liste-detay">${esc(b.mesaj)}</span></span><span class="liste-detay">${esc(b.tarih)} ${esc(b.saat || '')}</span></div>`).join('');
        }
        function bildirimGecmisiTemizle() {
            const aktif = aktifProfiliGetir();
            aktif.bildirimGecmisi = [];
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            bildirimMerkeziListele();
            bildirGoster('Bildirim geçmişi temizlendi');
        }

        // Uygulama açıkken çalışan su hatırlatıcısı (90 dk aralıkla).
        // Notification tanımsızsa sessizce hiçbir şey yapmaz, hata fırlatmaz.
        function suHatirlaticisiKur() {
            if (typeof Notification === 'undefined' || typeof setInterval === 'undefined') return;
            setInterval(() => {
                try {
                    if (localStorage.getItem('df_su_hatirlatici_aktif') !== '1') return;
                    if (Notification.permission !== 'granted') return;
                    const aktif = aktifProfiliGetir();
                    if (!aktif) return;
                    suGunKontrol(aktif);
                    const hedefEtkin = suGunlukHedefEtkin(aktif);
                    if (aktif.su.miktar >= hedefEtkin) return;
                    const kalan = Math.max(0, hedefEtkin - aktif.su.miktar);
                    new Notification('💧 Su içmeyi unutma', {
                        body: 'Hedefine ' + kalan + ' ml kaldı. Bir bardak su içmelisin.'
                    });
                    bildirimMerkeziEkle('💧 Su içmeyi unutma', 'Hedefine ' + kalan + ' ml kaldı.');
                } catch (e) { /* sessizce yoksay */ }
            }, 90 * 60 * 1000);
        }

        // FAZ 10 — antrenman gününde su hedefi görüntülenirken +500 ml (kalıcı değer DEĞİŞMEZ)
        function suGunlukHedefEtkin(aktif) {
            const antrenmanGunleri = (aktif.girdi && aktif.girdi.antrenmanGunleri) || [];
            const antrenmanGunuMu = antrenmanGunleri.includes(new Date().getDay());
            return aktif.suHedefMl + (antrenmanGunuMu && localStorage.getItem('df_su_antrenman_artis') !== '0' ? 500 : 0);
        }

        // FAZ 10 — hatırlatıcı toggle'ları için ortak davranış (su hatırlatıcısıyla AYNI desen)
        function hatirlaticiDegisti(el, anahtar) {
            localStorage.setItem(anahtar, el.checked ? '1' : '0');
            if (el.checked && bildirimIzinDurumu() !== 'granted') {
                bildirGoster('Önce bildirim izni vermen gerekiyor', 'hata');
                el.checked = false;
                localStorage.setItem(anahtar, '0');
            }
        }

        function suHatirlaticiDegisti(el) { hatirlaticiDegisti(el, 'df_su_hatirlatici_aktif'); }
        function kayitHatirlaticiDegisti(el) { hatirlaticiDegisti(el, 'df_kayit_hatirlatici_aktif'); }
        function takviyeHatirlaticiDegisti(el) { hatirlaticiDegisti(el, 'df_takviye_hatirlatici_aktif'); }
        function kiloHatirlaticiDegisti(el) { hatirlaticiDegisti(el, 'df_kilo_hatirlatici_aktif'); }

        function suAntrenmanArtisDegisti(el) {
            localStorage.setItem('df_su_antrenman_artis', el.checked ? '1' : '0');
        }

        function kiloHatirlatmaGunuDegisti(el) {
            localStorage.setItem('df_kilo_hatirlatma_gunu', el.value);
        }

        // FAZ 10a — "Bugün henüz kayıt girmedin" hatırlatıcısı (30 dk aralıkla, 19:00-23:00 arası)
        function kayitHatirlaticisiKur() {
            if (typeof Notification === 'undefined' || typeof setInterval === 'undefined') return;
            setInterval(() => {
                try {
                    if (localStorage.getItem('df_kayit_hatirlatici_aktif') !== '1') return;
                    if (Notification.permission !== 'granted') return;
                    const saat = new Date().getHours();
                    if (saat < 19 || saat > 22) return;
                    const aktif = aktifProfiliGetir();
                    if (!aktif || aktif.gunluk.length !== 0) return;
                    new Notification('🍽 Bugün henüz kayıt girmedin', {
                        body: 'Günün öğünlerini Nutrio\'ya eklemeyi unutma.'
                    });
                    bildirimMerkeziEkle('🍽 Bugün henüz kayıt girmedin', 'Günün öğünlerini eklemeyi unutma.');
                } catch (e) { /* sessizce yoksay */ }
            }, 30 * 60 * 1000);
        }

        // FAZ 10b — takviye saati hatırlatıcısı (15 dk aralıkla, ±15 dk penceresi)
        function takviyeHatirlaticisiKur() {
            if (typeof Notification === 'undefined' || typeof setInterval === 'undefined') return;
            setInterval(() => {
                try {
                    if (localStorage.getItem('df_takviye_hatirlatici_aktif') !== '1') return;
                    if (Notification.permission !== 'granted') return;
                    const aktif = aktifProfiliGetir();
                    if (!aktif) return;
                    const simdi = new Date();
                    const dakika = simdi.getHours() * 60 + simdi.getMinutes();
                    const gunKayit = (aktif.takviyeGecmisi && aktif.takviyeGecmisi[bugununTarihi]) || {};
                    takviyeler.forEach(t => {
                        if (!t.saat) return;
                        const [s, d] = String(t.saat).split(':').map(Number);
                        if (isNaN(s) || isNaN(d)) return;
                        const hedefDk = s * 60 + d;
                        const fark = Math.abs(dakika - hedefDk);
                        if (fark > 15 && fark > (24 * 60 - 15)) return;
                        if (gunKayit[t.id]) return;
                        if (!takviyeBugunDuzenliMi(t, bugununTarihi)) return;
                        new Notification('💊 Takviye saati: ' + t.tur, {
                            body: t.doz ? (t.doz + ' almayı unutma.') : (t.tur + ' almayı unutma.')
                        });
                        bildirimMerkeziEkle('💊 Takviye saati: ' + t.tur, t.doz ? (t.doz + ' almayı unutma.') : (t.tur + ' almayı unutma.'));
                    });
                } catch (e) { /* sessizce yoksay */ }
            }, 15 * 60 * 1000);
        }

        // FAZ 10c — kilo ölçüm hatırlatıcısı (60 dk aralıkla, seçili günde kayıt yoksa)
        function kiloHatirlaticisiKur() {
            if (typeof Notification === 'undefined' || typeof setInterval === 'undefined') return;
            setInterval(() => {
                try {
                    if (localStorage.getItem('df_kilo_hatirlatici_aktif') !== '1') return;
                    if (Notification.permission !== 'granted') return;
                    const seciliGun = parseInt(localStorage.getItem('df_kilo_hatirlatma_gunu'), 10);
                    if (isNaN(seciliGun) || seciliGun < 0 || seciliGun > 6) return;
                    if (new Date().getDay() !== seciliGun) return;
                    const aktif = aktifProfiliGetir();
                    if (!aktif) return;
                    const kayitVar = (aktif.kiloGecmisi || []).some(k => k.tarih === bugununTarihi);
                    if (kayitVar) return;
                    new Notification('⚖ Kilo ölçüm günü', {
                        body: 'Bugün kilo ölçümü yapmayı unutma.'
                    });
                    bildirimMerkeziEkle('⚖ Kilo ölçüm günü', 'Bugün kilo ölçümü yapmayı unutma.');
                } catch (e) { /* sessizce yoksay */ }
            }, 60 * 60 * 1000);
        }

        // FAZ 12 — SKT hatırlatıcısı (60 dk aralıkla): Stoğum'da SKT'si 3 gün içinde
        // dolan ya da dolmuş maddeler için bildirim. Aynı gün aynı madde TEKRAR
        // bildirilmez (df_skt_bildirilen_<id>_<tarih> anahtarıyla işaretlenir).
        function stokSktHatirlaticisiKur() {
            if (typeof Notification === 'undefined' || typeof setInterval === 'undefined') return;
            setInterval(() => {
                try {
                    if (Notification.permission !== 'granted') return;
                    const aktif = aktifProfiliGetir();
                    if (!aktif || !aktif.stokListesi) return;
                    aktif.stokListesi.forEach(m => {
                        if (!m.sktTarihi) return;
                        const kalanGun = -tarihFarkiGun(m.sktTarihi, bugununTarihi);
                        if (kalanGun > 3) return;
                        const anahtar = 'df_skt_bildirilen_' + m.id + '_' + bugununTarihi;
                        if (localStorage.getItem(anahtar) === '1') return;
                        localStorage.setItem(anahtar, '1');
                        new Notification('🗓 Son kullanma tarihi yaklaşıyor: ' + m.ad, {
                            body: kalanGun < 0 ? 'SKT geçmiş: ' + m.sktTarihi : 'Kalan süre: ' + kalanGun + ' gün'
                        });
                        bildirimMerkeziEkle('🗓 SKT yaklaşıyor: ' + m.ad, kalanGun < 0 ? 'SKT geçmiş: ' + m.sktTarihi : 'Kalan süre: ' + kalanGun + ' gün');
                    });
                } catch (e) { /* sessizce yoksay */ }
            }, 60 * 60 * 1000);
        }

        function navGit(id) { sayfaGoster(id); }

        function navAktifIsaretle(id) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('aktif'));
            const eslesme = {
                'ana-ekran': 'nav-ana',
                'tuketim-ekrani': 'nav-ekle',
                'gecmis-ekrani': 'nav-ilerleme',
                'gun-detay-ekrani': 'nav-ilerleme',
                'plan-ekrani': 'nav-plan',
                'plan-secici-ekrani': 'nav-plan',
                'daha-fazla-ekrani': 'nav-daha',
                'ayarlar-ekrani': 'nav-daha',
                'kutuphane-ekrani': 'nav-daha',
                'besin-form-ekrani': 'nav-daha',
                'kilo-ekrani': 'nav-daha',
                'takviye-ekrani': 'nav-daha',
                'takviye-form-ekrani': 'nav-daha',
                'sablon-ekrani': 'nav-daha',
                'sablon-form-ekrani': 'nav-daha'
            };
            const navId = eslesme[id];
            if (navId) document.getElementById(navId).classList.add('aktif');
        }

        function sayfaGoster(id) {
            // FAZ 17 — Interval zamanlayıcı çalışırken başka ekrana geçilirse arka planda
            // sessizce çalışmaya devam etmesin diye durdurulur.
            if (id !== 'interval-ekrani' && typeof ivTimer !== 'undefined' && ivTimer) {
                clearInterval(ivTimer);
                ivTimer = null;
                ivState = null;
            }
            document.querySelectorAll('#sayfa-govde > div').forEach(d => d.classList.add('gizli'));
            document.getElementById(id).classList.remove('gizli');
            navAktifIsaretle(id);
            window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

            if (id === 'ana-ekran') arayuzGuncelle();
            if (id === 'kutuphane-ekrani') kListele();
            if (id === 'tuketim-ekrani') tListele();
            if (id === 'profil-ekrani') prHedefAciklamaGuncelle();
            if (id === 'gecmis-ekrani') { gecmisGosterilenGunSayisi = 20; ilerlemeSekmesiGuncelle(); }
            if (id === 'plan-ekrani') planSekmesiGuncelle();
            if (id === 'plan-secici-ekrani') planSeciciAktifYenile();
            if (id === 'gun-detay-ekrani') gunDetayGuncelle();
            if (id === 'kilo-ekrani') kiloEkraniGuncelle();
            if (id === 'takviye-ekrani') takviyeEkraniGuncelle();
            if (id === 'sablon-ekrani') sablonListele();
            if (id === 'yenilikler-ekrani') yeniliklerListele();
            if (id === 'ayarlar-ekrani') { temaSeciciOlustur('tema-secici-ayarlar'); pwaKurulumBilgiGuncelle(); bildirimKartGuncelle(); kartSiraListesiGuncelle(); birimSistemiSekmeleriniGuncelle(); depolamaDurumuGoster(); otomatikYedekTarihiGoster(); }
            if (id === 'kalori-hesap-ekrani') kaloriHesapGuncelle();
            if (id === 'saglik-hesap-ekrani') { vkiHesapla(); belKalcaHesapla(); }
            if (id === 'bildirim-merkezi-ekrani') bildirimMerkeziListele();
            if (id === 'otomatik-yedek-ekrani') otomatikYedekGecmisiCiz();
            if (id === 'profil-ekrani') birimEtiketleriGuncelle();
            if (id === 'kilo-ekrani') birimEtiketleriGuncelle();
        }

        // TOAST BİLDİRİMLERİ
        function bildirGoster(mesaj, tur, geriAlFn) {
            const konteyner = document.getElementById('toast-konteyner');
            const toast = document.createElement('div');
            toast.className = 'toast' + (tur === 'hata' ? ' toast-hata' : '');
            const metinSpan = document.createElement('span');
            metinSpan.textContent = mesaj;
            metinSpan.style.flex = '1';
            toast.appendChild(metinSpan);

            let sureMs = 2600;
            if (typeof geriAlFn === 'function') {
                sureMs = 5000;
                const geriAlBtn = document.createElement('button');
                geriAlBtn.className = 'toast-geri-al';
                geriAlBtn.textContent = 'Geri Al';
                geriAlBtn.onclick = () => {
                    geriAlFn();
                    toast.classList.remove('goster');
                    setTimeout(() => toast.remove(), 300);
                };
                toast.appendChild(geriAlBtn);
            }

            konteyner.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('goster'));
            setTimeout(() => {
                toast.classList.remove('goster');
                setTimeout(() => toast.remove(), 300);
            }, sureMs);
        }

        // ⋮ MENÜ AÇMA/KAPAMA
        function menuAcKapa(event, id) {
            event.stopPropagation();
            document.querySelectorAll('.kucuk-menu').forEach(m => { if (m.id !== id) m.classList.add('gizli'); });
            document.getElementById(id).classList.toggle('gizli');
        }
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.menu-sarmal')) {
                document.querySelectorAll('.kucuk-menu').forEach(m => m.classList.add('gizli'));
            }
        });

        // SWIPE (sağa/sola kaydırma) — sola sil, sağa düzenle
        function swipeBagla(elemanId, tuketimId) {
            const el = document.getElementById(elemanId);
            if (!el) return;
            let basX = null, basY = null, dx = 0, surukleniyorMu = false, yonKarari = null;

            el.addEventListener('touchstart', (e) => {
                if (e.target.closest('.menu-sarmal')) return;
                basX = e.touches[0].clientX; basY = e.touches[0].clientY;
                dx = 0; yonKarari = null;
                el.classList.add('surukleniyor');
            }, { passive: true });

            el.addEventListener('touchmove', (e) => {
                if (basX === null) return;
                let curX = e.touches[0].clientX, curY = e.touches[0].clientY;
                let deltaX = curX - basX, deltaY = curY - basY;
                if (yonKarari === null) {
                    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
                        yonKarari = Math.abs(deltaX) > Math.abs(deltaY) ? 'yatay' : 'dikey';
                    }
                }
                if (yonKarari !== 'yatay') return;
                dx = Math.max(-110, Math.min(110, deltaX));
                surukleniyorMu = true;
                el.style.transform = 'translateX(' + dx + 'px)';
                const arka = el.querySelector('.swipe-arka');
                if (arka) {
                    arka.classList.toggle('aktif', Math.abs(dx) > 24);
                    arka.querySelector('.sw-sil') && (arka.querySelector('.sw-sil').style.opacity = dx < -24 ? '1' : '.3');
                    arka.querySelector('.sw-duzenle') && (arka.querySelector('.sw-duzenle').style.opacity = dx > 24 ? '1' : '.3');
                }
            }, { passive: true });

            el.addEventListener('touchend', () => {
                el.classList.remove('surukleniyor');
                el.style.transform = '';
                const arka = el.querySelector('.swipe-arka');
                if (arka) arka.classList.remove('aktif');
                if (surukleniyorMu && dx < -60) { tuketimSil(tuketimId); }
                else if (surukleniyorMu && dx > 60) { tuketimDuzenleAc(tuketimId); }
                basX = null; basY = null; dx = 0; surukleniyorMu = false; yonKarari = null;
            });
        }

        // GRAFİK MOTORU — çok serili SVG çizgi grafiği (eksen/gridline destekli, yeniden kullanılabilir).
        // seriler: [{ degerler: [...], renk: '...', ad: '...', kesikli: true|false }]
        //   kesikli:true → ince/soluk kesikli çizgi (hareketli ortalama gibi ikincil seriler için).
        // secenekler: { etiketler, birim, eksenGoster, gridlineSayisi, xEtiketSayisi, xEtiketler, hedefCizgi }
        //   eksenGoster:true → Y'de min/orta/max değer etiketi + ince kesikli yatay gridline'lar,
        //   X'te xEtiketSayisi kadar eşit aralıklı tarih etiketi (hepsi değil).
        //   xEtiketler verilirse X ekseninde etiketler yerine o kısa metinler kullanılır (data-tarih yine etiketler'den).
        // Noktalar .grafik-nokta + data-tarih/data-deger/data-birim deseniyle üretilir → grafikTiklamalariBagla uyumlu.
        function svgCokluSeriGrafik(seriler, w, h, secenekler) {
            secenekler = secenekler || {};
            w = w || 320; h = h || 100;
            seriler = (seriler || [])
                .filter(s => s && Array.isArray(s.degerler) && s.degerler.length >= 2)
                .map(s => ({
                    ad: s.ad || '',
                    renk: s.renk || 'var(--vurgu-renk)',
                    kesikli: s.kesikli === true,
                    degerler: s.degerler.map(v => parseFloat(v))
                }));
            if (seriler.length === 0) return '';
            const n = seriler[0].degerler.length;
            if (n < 2) return '';

            const eksenGoster = secenekler.eksenGoster === true;
            const padSol = eksenGoster ? 40 : 10;
            const padSag = eksenGoster ? 12 : 10;
            const padUst = 10;
            const padAlt = eksenGoster ? 20 : 10;
            const rw = w - padSol - padSag, rh = h - padUst - padAlt;
            if (rw <= 10 || rh <= 10) return '';

            const hedefHam = parseFloat(secenekler.hedefCizgi);
            const hedef = secenekler.hedefCizgi && isFinite(hedefHam) && hedefHam > 0 ? hedefHam : null;
            let min = Infinity, max = -Infinity;
            seriler.forEach(s => s.degerler.forEach(v => { if (isFinite(v)) { if (v < min) min = v; if (v > max) max = v; } }));
            if (hedef !== null) { min = Math.min(min, hedef); max = Math.max(max, hedef); }
            if (!isFinite(min) || !isFinite(max)) return '';
            if (min === max) { min -= 1; max += 1; }

            const xAt = i => padSol + (i / (n - 1)) * rw;
            const yAt = v => padUst + rh - ((v - min) / (max - min)) * rh;
            let parcalar = [], gradTanimlari = '';

            // Y ekseni — gridlineSayisi kadar eşit aralıklı ince kesikli yatay çizgi + değer etiketi
            if (eksenGoster) {
                const cizgiSayisi = Math.max(2, secenekler.gridlineSayisi || 3);
                for (let i = 0; i < cizgiSayisi; i++) {
                    const deger = max - (i / (cizgiSayisi - 1)) * (max - min);
                    const y = yAt(deger);
                    parcalar.push('<line x1="' + padSol + '" y1="' + y + '" x2="' + (w - padSag) + '" y2="' + y + '" stroke="var(--yazi-pasif)" stroke-width="1" stroke-dasharray="3 4" opacity=".18"/>');
                    parcalar.push('<text x="' + (padSol - 5) + '" y="' + (y + 3) + '" text-anchor="end" font-size="9" fill="var(--yazi-pasif)">' + esc(sayiKisa(deger)) + '</text>');
                }
            }

            // Hedef çizgisi (ör. kalori hedefi)
            if (hedef !== null) {
                const y = yAt(hedef);
                parcalar.push('<line x1="' + padSol + '" y1="' + y + '" x2="' + (w - padSag) + '" y2="' + y + '" stroke="var(--yazi-pasif)" stroke-width="1" stroke-dasharray="4 4" opacity=".6"/>');
            }

            // X ekseni — xEtiketSayisi kadar eşit aralıklı etiket (ilk/orta/son tarzı)
            const xKaynak = secenekler.xEtiketler || secenekler.etiketler;
            if (eksenGoster && Array.isArray(xKaynak) && xKaynak.length >= n) {
                const etiketSayisi = Math.min(Math.max(2, secenekler.xEtiketSayisi || 4), n);
                const indeksler = new Set();
                for (let i = 0; i < etiketSayisi; i++) indeksler.add(Math.round((i / (etiketSayisi - 1)) * (n - 1)));
                indeksler.forEach(idx => {
                    const hiza = idx === 0 ? 'start' : (idx === n - 1 ? 'end' : 'middle');
                    parcalar.push('<text x="' + xAt(idx) + '" y="' + (h - 5) + '" text-anchor="' + hiza + '" font-size="9" fill="var(--yazi-pasif)">' + esc(xKaynak[idx] || '') + '</text>');
                });
            }

            // Seriler — kesikli olanlar önce çizilir (ana serinin altında kalsın)
            [...seriler].sort((a, b) => (b.kesikli === true) - (a.kesikli === true)).forEach(s => {
                const noktalar = [];
                s.degerler.forEach((v, i) => { if (isFinite(v) && i < n) noktalar.push([xAt(i), yAt(v)]); });
                if (noktalar.length < 2) return;
                const cizgi = noktalar.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
                if (s.kesikli) {
                    parcalar.push('<polyline points="' + cizgi + '" fill="none" stroke="' + s.renk + '" stroke-width="1.6" stroke-dasharray="5 4" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>');
                } else {
                    const gid = 'grad' + Math.random().toString(36).slice(2, 8);
                    gradTanimlari += '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + s.renk + '" stop-opacity=".35"/><stop offset="100%" stop-color="' + s.renk + '" stop-opacity="0"/></linearGradient>';
                    const alanPath = 'M' + noktalar[0][0].toFixed(1) + ',' + (padUst + rh).toFixed(1) + ' L' + cizgi.split(' ').join(' L') + ' L' + noktalar[noktalar.length - 1][0].toFixed(1) + ',' + (padUst + rh).toFixed(1) + ' Z';
                    parcalar.push('<path d="' + alanPath + '" fill="url(#' + gid + ')" stroke="none"/>');
                    parcalar.push('<polyline points="' + cizgi + '" fill="none" stroke="' + s.renk + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>');
                }
            });

            // Tıklama/tooltip noktaları — yalnızca ilk seri (gerçek günlük veri); ikincil seriler karışmasın
            const anaRenk = seriler[0].renk;
            seriler[0].degerler.forEach((v, i) => {
                if (!isFinite(v)) return;
                const tarih = secenekler.etiketler && secenekler.etiketler[i] ? secenekler.etiketler[i] : '';
                const x = xAt(i).toFixed(1), y = yAt(v).toFixed(1);
                parcalar.push('<circle cx="' + x + '" cy="' + y + '" r="7" fill="transparent" data-tarih="' + esc(tarih) + '" data-deger="' + v + '" data-birim="' + esc(secenekler.birim || '') + '" data-idx="' + i + '" class="grafik-nokta" style="cursor:pointer;"/>');
                parcalar.push('<circle cx="' + x + '" cy="' + y + '" r="3" fill="' + anaRenk + '" style="pointer-events:none;"/>');
            });

            return '<svg viewBox="0 0 ' + w + ' ' + h + '" style="width:100%; height:' + h + 'px; overflow:visible;">' +
                '<defs>' + gradTanimlari + '</defs>' +
                parcalar.join('') +
                '</svg>';
        }

        // Eski tek-seri imzası — geriye dönük uyumluluk sarmalayıcısı.
        // Kilo grafiği ve ölçüm grafikleri bu yolu kullanmaya devam eder; görünüm eskisi gibi eksenli değildir.
        function svgCizgiGrafik(degerler, w, h, renk, hedefCizgi, etiketler, birim, tiklamaGeriCagirma) {
            return svgCokluSeriGrafik(
                [{ degerler: degerler, renk: renk }],
                w, h,
                { etiketler: etiketler, birim: birim, hedefCizgi: hedefCizgi, eksenGoster: false }
            );
        }

        // Eksen etiketleri için kısa sayı biçimi (2143.6 → "2.144", 8.35 → "8,4")
        function sayiKisa(v) {
            const yuvarlak = Math.abs(v) >= 10 ? Math.round(v) : Math.round(v * 10) / 10;
            return yuvarlak.toLocaleString('tr-TR');
        }

        // GRUPBAR SVG GRAFİĞİ — kategoriler x ekseninde grup, her serinin çubuğu yan yana.
        // kategoriler: ['Kalori','Protein',...] — seriler: [{ ad, renk, degerler: [...] }]
        // Faz 3'te Haftalık Karşılaştırma kartında kullanılacak; şimdilik yalnızca tanımlı dursun.
        function svgBarGrafik(kategoriler, seriler, w, h, secenekler) {
            secenekler = secenekler || {};
            w = w || 320; h = h || 160;
            kategoriler = kategoriler || [];
            seriler = (seriler || []).filter(s => s && Array.isArray(s.degerler));
            if (kategoriler.length === 0 || seriler.length === 0) return '';
            const padSol = 40, padSag = 10, padUst = secenekler.legendGoster === false ? 10 : 26, padAlt = 20;
            const rw = w - padSol - padSag, rh = h - padUst - padAlt;
            if (rw <= 10 || rh <= 10) return '';

            let max = 0;
            seriler.forEach(s => s.degerler.forEach(v => { const n = parseFloat(v); if (isFinite(n) && n > max) max = n; }));
            if (max <= 0) max = 1;
            max *= 1.1;

            const grupGenisligi = rw / kategoriler.length;
            const cubukGenisligi = Math.min(18, (grupGenisligi * 0.7) / seriler.length);
            const grupIci = cubukGenisligi * seriler.length + 4 * (seriler.length - 1);

            let parcalar = [];
            // Y ekseni gridline'ları
            const cizgiSayisi = Math.max(2, secenekler.gridlineSayisi || 3);
            for (let i = 0; i < cizgiSayisi; i++) {
                const deger = max - (i / (cizgiSayisi - 1)) * max;
                const y = padUst + rh - (deger / max) * rh;
                parcalar.push('<line x1="' + padSol + '" y1="' + y + '" x2="' + (w - padSag) + '" y2="' + y + '" stroke="var(--yazi-pasif)" stroke-width="1" stroke-dasharray="3 4" opacity=".18"/>');
                parcalar.push('<text x="' + (padSol - 5) + '" y="' + (y + 3) + '" text-anchor="end" font-size="9" fill="var(--yazi-pasif)">' + esc(sayiKisa(deger)) + '</text>');
            }

            kategoriler.forEach((kat, k) => {
                const grupBas = padSol + k * grupGenisligi + (grupGenisligi - grupIci) / 2;
                seriler.forEach((s, si) => {
                    const deger = parseFloat(s.degerler[k]);
                    if (!isFinite(deger)) return;
                    const cubukH = (deger / max) * rh;
                    const x = grupBas + si * (cubukGenisligi + 4);
                    parcalar.push('<rect x="' + x.toFixed(1) + '" y="' + (padUst + rh - cubukH).toFixed(1) + '" width="' + cubukGenisligi.toFixed(1) + '" height="' + Math.max(1, cubukH).toFixed(1) + '" rx="3" fill="' + (s.renk || 'var(--vurgu-renk)') + '"/>');
                });
                parcalar.push('<text x="' + (padSol + k * grupGenisligi + grupGenisligi / 2).toFixed(1) + '" y="' + (h - 5) + '" text-anchor="middle" font-size="9.5" fill="var(--yazi-pasif)">' + esc(kat) + '</text>');
            });

            // Legend — üstte küçük renk kutucuğu + seri adı
            if (secenekler.legendGoster !== false) {
                const kutu = 8, bosluk = 5, aralik = 14;
                let genislikler = seriler.map(s => kutu + bosluk + s.ad.length * 5.5);
                const toplam = genislikler.reduce((a, b) => a + b, 0) + aralik * (seriler.length - 1);
                let x = (w - toplam) / 2;
                seriler.forEach((s, i) => {
                    parcalar.push('<rect x="' + x.toFixed(1) + '" y="4" width="' + kutu + '" height="' + kutu + '" rx="2" fill="' + (s.renk || 'var(--vurgu-renk)') + '"/>');
                    parcalar.push('<text x="' + (x + kutu + bosluk).toFixed(1) + '" y="' + (4 + kutu) + '" font-size="9.5" fill="var(--yazi-pasif)">' + esc(s.ad || '') + '</text>');
                    x += genislikler[i] + aralik;
                });
            }

            return '<svg viewBox="0 0 ' + w + ' ' + h + '" style="width:100%; height:' + h + 'px;">' + parcalar.join('') + '</svg>';
        }

        // DONUT SVG GRAFİĞİ — makro dağılımı gibi oran gösterimleri için.
        // dilimler: [{ ad:'Protein', deger: 90, renk:'...' }, ...] — ortada en büyük dilimin yüzdesi yazar.
        // Faz 3'te Analiz sekmesindeki makro dağılımında kullanılacak; şimdilik yalnızca tanımlı dursun.
        function svgDonutGrafik(dilimler, boyut, secenekler) {
            secenekler = secenekler || {};
            boyut = boyut || 140;
            dilimler = (dilimler || []).filter(d => d && isFinite(parseFloat(d.deger)) && parseFloat(d.deger) > 0);
            if (dilimler.length === 0) return '';
            const toplam = dilimler.reduce((t, d) => t + parseFloat(d.deger), 0);
            if (toplam <= 0) return '';

            const yaricap = boyut / 2;
            const icYaricap = yaricap * (secenekler.icOran || 0.62);
            const cizgiKalinligi = yaricap - icYaricap;
            const orta = yaricap;
            const cevre = 2 * Math.PI * ((yaricap + icYaricap) / 2);
            let aci = -Math.PI / 2;
            let parcalar = [];

            dilimler.forEach(d => {
                const oran = parseFloat(d.deger) / toplam;
                const uzunluk = oran * cevre;
                // stroke-dasharray ile daire üzerinde dilim: dönme, grubun transform'uyla yapılır
                parcalar.push('<circle cx="' + orta + '" cy="' + orta + '" r="' + ((yaricap + icYaricap) / 2).toFixed(2) + '" fill="none" stroke="' + (d.renk || 'var(--vurgu-renk)') + '" stroke-width="' + cizgiKalinligi.toFixed(2) + '" stroke-dasharray="' + uzunluk.toFixed(2) + ' ' + (cevre - uzunluk).toFixed(2) + '" transform="rotate(' + ((aci + Math.PI / 2) * 180 / Math.PI).toFixed(3) + ' ' + orta + ' ' + orta + ')" />');
                aci += oran * 2 * Math.PI;
            });

            // Ortadaki metin — en büyük dilimin yüzdesi
            const enBuyuk = dilimler.reduce((a, b) => parseFloat(b.deger) > parseFloat(a.deger) ? b : a, dilimler[0]);
            const yuzde = Math.round((parseFloat(enBuyuk.deger) / toplam) * 100);
            parcalar.push('<text x="' + orta + '" y="' + (orta - 2) + '" text-anchor="middle" font-size="' + (boyut * 0.17).toFixed(0) + '" font-weight="800" fill="var(--yazi-ana)">' + yuzde + '%</text>');
            parcalar.push('<text x="' + orta + '" y="' + (orta + boyut * 0.12) + '" text-anchor="middle" font-size="' + Math.max(8, boyut * 0.08).toFixed(0) + '" fill="var(--yazi-pasif)">' + esc(enBuyuk.ad || '') + '</text>');

            return '<svg viewBox="0 0 ' + boyut + ' ' + boyut + '" style="width:100%; max-width:' + boyut + 'px;">' + parcalar.join('') + '</svg>';
        }

        function grafikTiklamalariBagla(containerId, tamRaporMu) {
            const alan = document.getElementById(containerId);
            if (!alan) return;
            alan.querySelectorAll('.grafik-nokta').forEach(nokta => {
                nokta.addEventListener('click', () => {
                    const tarih = nokta.getAttribute('data-tarih');
                    if (tamRaporMu) { gunDetayAc(tarih); return; }
                    const deger = nokta.getAttribute('data-deger');
                    const birim = nokta.getAttribute('data-birim');
                    bildirGoster(tarih + ': ' + deger + ' ' + birim);
                });
            });
        }

        function hareketliOrtalama(dizi, pencere) {
            let sonuc = [];
            for (let i = 0; i < dizi.length; i++) {
                let bas = Math.max(0, i - pencere + 1);
                let dilim = dizi.slice(bas, i + 1);
                sonuc.push(dilim.reduce((a, b) => a + b, 0) / dilim.length);
            }
            return sonuc;
        }

        // PROFİL (ÇEKMECE) MATEMATİĞİ
        function egzersizAlanGuncelleForm() {
            let gun = parseFloat(document.getElementById('pr-egzersiz-gun').value);
            document.getElementById('pr-egzersiz-detay-alani').classList.toggle('gizli', gun === 0);
            document.getElementById('pr-egzersiz-yok-notu').classList.toggle('gizli', gun !== 0);
        }

        // Profil formundaki "Antrenman Günlerin" gün seçim butonları
        let prSeciliAntrenmanGunleri = [];
        function prAntrenmanGunSecimOlustur() {
            const alan = document.getElementById('pr-antrenman-gun-secim');
            if (!alan) return;
            alan.innerHTML = gunAdlari.map((ad, i) => {
                let secili = prSeciliAntrenmanGunleri.includes(i);
                return '<button type="button" class="btn-kucuk ' + (secili ? '' : 'btn-ikincil') + '" style="flex:0 0 auto;" onclick="prAntrenmanGunToggle(' + i + ')">' + esc(ad.slice(0, 3)) + '</button>';
            }).join('');
        }

        function prAntrenmanGunToggle(i) {
            if (prSeciliAntrenmanGunleri.includes(i)) prSeciliAntrenmanGunleri = prSeciliAntrenmanGunleri.filter(x => x !== i);
            else prSeciliAntrenmanGunleri.push(i);
            prAntrenmanGunSecimOlustur();
        }

        function yeniProfilFormu() {
            document.querySelectorAll('#profil-ekrani input').forEach(inp => inp.value = '');
            document.getElementById('profil-form-baslik').innerText = 'Yeni Kişi Ekle';
            document.getElementById('profil-kaydet-btn').innerText = 'Profili Yarat ve Başla';
            document.getElementById('iptal-profil-btn').classList.remove('gizli');
            document.getElementById('profil-sil-btn').classList.add('gizli');
            prSeciliAntrenmanGunleri = [];
            prAntrenmanGunSecimOlustur();
            egzersizAlanGuncelleForm();
            prHedefAciklamaGuncelle();
            // FAZ 11 — yeni profilde varsayılan avatar ve makro override kapalı başlar
            prSeciliAvatar = AVATAR_VARSAYILAN;
            prAvatarSecimiOlustur();
            const moToggle = document.getElementById('pr-makro-override');
            if (moToggle) moToggle.checked = false;
            prMakroOverrideAcKapa();
            sayfaGoster('profil-ekrani');
        }

        function profilDuzenleAc() {
            let aktif = aktifProfiliGetir();
            if (!aktif || !aktif.girdi) {
                bildirGoster('Bu profilin bilgileri bulunamadı, lütfen yeniden oluşturun.', 'hata');
                return;
            }
            document.getElementById('pr-ad').value = aktif.ad;
            document.getElementById('pr-cinsiyet').value = aktif.girdi.cins;
            document.getElementById('pr-yas').value = aktif.girdi.yas;
            document.getElementById('pr-boy').value = cmSayiGoster(aktif.girdi.boy);
            document.getElementById('pr-kilo').value = kgSayiGoster(aktif.girdi.kilo);
            document.getElementById('pr-adim').value = aktif.girdi.adimFaktor;
            document.getElementById('pr-egzersiz-gun').value = aktif.girdi.egzGun;
            document.getElementById('pr-egzersiz-tip').value = aktif.girdi.egzTip;
            document.getElementById('pr-egzersiz-sure').value = aktif.girdi.egzSure;
            document.getElementById('pr-hedef').value = aktif.girdi.hedef;
            document.getElementById('pr-duzenle-id').value = aktif.id;
            document.getElementById('profil-form-baslik').innerText = 'Profili Düzenle';
            document.getElementById('profil-kaydet-btn').innerText = 'Değişiklikleri Kaydet';
            document.getElementById('iptal-profil-btn').classList.remove('gizli');
            document.getElementById('profil-sil-btn').classList.remove('gizli');
            prSeciliAntrenmanGunleri = [...(aktif.girdi.antrenmanGunleri || [])];
            prAntrenmanGunSecimOlustur();
            egzersizAlanGuncelleForm();
            prHedefAciklamaGuncelle();
            // FAZ 11 — kayıtlı avatarı seç ve makro override alanını ön-doldur
            prSeciliAvatar = aktif.avatar || AVATAR_VARSAYILAN;
            prAvatarSecimiOlustur();
            const moToggle = document.getElementById('pr-makro-override');
            const moAcik = !!(aktif.makroOverride && aktif.makroOverride.acik);
            if (moToggle) moToggle.checked = moAcik;
            if (moAcik) {
                const mo = aktif.makroOverride;
                document.getElementById('pr-makro-pro').value = mo.pro !== null && mo.pro !== undefined ? mo.pro : '';
                document.getElementById('pr-makro-yag').value = mo.yag !== null && mo.yag !== undefined ? mo.yag : '';
                document.getElementById('pr-makro-karb').value = mo.karb !== null && mo.karb !== undefined ? mo.karb : '';
            }
            prMakroOverrideAcKapa();
            sayfaGoster('profil-ekrani');
        }

        // FAZ 11 — makro override toggle'ı açılınca hesaplaHedefler()'in O ANKİ hesabıyla ön-doldurur
        // (hesaplaHedefler()'in kendisine dokunulmaz; sadece kullanıcı değiştirebilsin diye ön-dolum).
        function prMakroOverrideAcKapa() {
            const alan = document.getElementById('pr-makro-override-alani');
            const toggle = document.getElementById('pr-makro-override');
            if (!alan || !toggle) return;
            alan.classList.toggle('gizli', !toggle.checked);
            if (toggle.checked && !document.getElementById('pr-makro-pro').value && !document.getElementById('pr-makro-yag').value && !document.getElementById('pr-makro-karb').value) {
                const cins = document.getElementById('pr-cinsiyet').value;
                const yas = parseFloat(document.getElementById('pr-yas').value);
                const boy = cmParseGirdi(parseFloat(document.getElementById('pr-boy').value));
                const kilo = kgParseGirdi(parseFloat(document.getElementById('pr-kilo').value));
                if (yas && boy && kilo) {
                    const hesap = hesaplaHedefler(cins, yas, boy, kilo,
                        parseFloat(document.getElementById('pr-adim').value),
                        parseFloat(document.getElementById('pr-egzersiz-gun').value),
                        document.getElementById('pr-egzersiz-tip').value,
                        parseFloat(document.getElementById('pr-egzersiz-sure').value),
                        document.getElementById('pr-hedef').value);
                    document.getElementById('pr-makro-pro').value = hesap.pro;
                    document.getElementById('pr-makro-yag').value = hesap.yag;
                    document.getElementById('pr-makro-karb').value = hesap.karb;
                }
            }
        }

        // PROFİL SİL — Nutrio modal onaylı, 5 saniye içinde geri alınabilir.
        // Silinen profil tam nesne olarak saklanır, "Geri Al" ile aynı konuma yeniden eklenir.
        let sonSilinenProfil = null;

        async function profilSil() {
            let duzenleId = document.getElementById('pr-duzenle-id').value;
            if (!duzenleId) { bildirGoster('Silinecek bir profil seçilmedi.', 'hata'); return; }
            let p = profiller.find(x => x.id == duzenleId);
            if (!p) { bildirGoster('Profil bulunamadı.', 'hata'); return; }

            const onay = await modalOnay(
                'Profili Sil',
                '"' + p.ad + '" adlı profil ve bu profile ait tüm günlük, geçmiş, kilo ve takviye kayıtları silinecek. Silme işleminden sonra 5 saniye boyunca geri alabilirsin.',
                true
            );
            if (!onay) return;

            const eskiIndex = profiller.findIndex(x => x.id == duzenleId);
            sonSilinenProfil = { profil: p, index: eskiIndex };

            profiller = profiller.filter(x => x.id != duzenleId);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));

            if (aktifProfilId == duzenleId) {
                aktifProfilId = profiller.length > 0 ? profiller[0].id : null;
                if (aktifProfilId) localStorage.setItem('df_aktif_profil_id', aktifProfilId);
                else localStorage.removeItem('df_aktif_profil_id');
            }

            document.getElementById('pr-duzenle-id').value = '';
            document.getElementById('iptal-profil-btn').classList.add('gizli');
            document.getElementById('profil-sil-btn').classList.add('gizli');

            bildirGoster('Profil silindi', null, () => {
                if (!sonSilinenProfil) return;
                profiller.splice(Math.min(sonSilinenProfil.index, profiller.length), 0, sonSilinenProfil.profil);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                aktifProfilId = sonSilinenProfil.profil.id;
                localStorage.setItem('df_aktif_profil_id', aktifProfilId);
                sonSilinenProfil = null;
                tarihKontrol(aktifProfilId);
                arayuzGuncelle();
                bildirGoster('Profil geri yüklendi');
            });

            if (profiller.length === 0) {
                yeniProfilFormu();
            } else {
                tarihKontrol(aktifProfilId);
                otomatikYedekGerekirseCalistir();
                takviyeStokKontrolEt();
                sayfaGoster('ana-ekran');
            }
        }

        function metDegeri(tip) {
            const metTablosu = { agirlik: 5, kosu: 9.8, futbol: 7, bisiklet: 7.5, kardiyo: 7, karisik: 6.5 };
            return metTablosu[tip] || 5;
        }

        function hesaplaHedefler(cins, yas, boy, kilo, adimFaktor, egzGun, egzTip, egzSure, hedef) {
            let bmr = cins === 'erkek' ? (10 * kilo) + (6.25 * boy) - (5 * yas) + 5 : (10 * kilo) + (6.25 * boy) - (5 * yas) - 161;
            let gunlukYasamKalori = bmr * adimFaktor;
            let met = metDegeri(egzTip);
            let kcalDakika = (met * 3.5 * kilo) / 200;
            let haftalikEgzersizKcal = kcalDakika * egzSure * egzGun;
            let gunlukEgzersizKcal = haftalikEgzersizKcal / 7;
            let tdee = gunlukYasamKalori + gunlukEgzersizKcal;
            let hedefCarpan = hedef === 'kayip' ? 0.85 : (hedef === 'kazanim' ? 1.075 : 1);
            let kalori = Math.round(tdee * hedefCarpan);
            let proteinGkg = hedef === 'kayip' ? 2.0 : 1.8;
            let p_hedef = Math.round(kilo * proteinGkg);
            let yagGkg = 0.8;
            let y_hedef = Math.round(kilo * yagGkg);
            let k_hedef = Math.round((kalori - (p_hedef * 4) - (y_hedef * 9)) / 4);
            if (k_hedef < 0) k_hedef = 0;
            return { kalori: kalori, pro: p_hedef, yag: y_hedef, karb: k_hedef, bmr: bmr };
        }

        // FAZ 8 — Hedef seçiminin altındaki açıklama metni.
        // Metinler hesaplaHedefler() içindeki gerçek çarpanlarla (0.85/1/1.075, 2.0/1.8/1.8 g/kg) tutarlıdır.
        function prHedefAciklamaGuncelle() {
            const aciklamaEl = document.getElementById('pr-hedef-aciklama');
            const secimEl = document.getElementById('pr-hedef');
            if (!aciklamaEl || !secimEl) return;
            const metinler = {
                kayip: "TDEE'nin yaklaşık %15 altında kalori + yüksek protein (2 g/kg) — yağ kaybını hızlandırırken kas kaybını en aza indirir.",
                koruma: "TDEE'ye yakın kalori + dengeli protein (1,8 g/kg) — mevcut kilonu korumaya odaklanır.",
                kazanim: "TDEE'nin yaklaşık %7,5 üstünde kalori + yeterli protein (1,8 g/kg) — kontrollü, yağlanmayı minimize eden kütle alma (lean bulk) sağlar."
            };
            aciklamaEl.innerText = metinler[secimEl.value] || metinler.koruma;
        }

        function profilKaydet() {
            let duzenleId = document.getElementById('pr-duzenle-id').value;
            let ad = document.getElementById('pr-ad').value || "İsimsiz Profil";
            let cins = document.getElementById('pr-cinsiyet').value;
            let yas = parseFloat(document.getElementById('pr-yas').value);
            // Boy/kilo: aktif birimden okunup HER ZAMAN metrik (cm/kg) olarak saklanır
            let boy = cmParseGirdi(parseFloat(document.getElementById('pr-boy').value));
            let kilo = kgParseGirdi(parseFloat(document.getElementById('pr-kilo').value));
            let adimFaktor = parseFloat(document.getElementById('pr-adim').value);
            let egzGun = parseFloat(document.getElementById('pr-egzersiz-gun').value);
            let egzTip = document.getElementById('pr-egzersiz-tip').value;
            let egzSure = parseFloat(document.getElementById('pr-egzersiz-sure').value);
            let hedef = document.getElementById('pr-hedef').value;
            let antrenmanGunleri = [...prSeciliAntrenmanGunleri];

            if (!yas || !boy || !kilo) { bildirGoster('Lütfen yaş, boy ve kilonuzu girin.', 'hata'); return; }

            let hesap = hesaplaHedefler(cins, yas, boy, kilo, adimFaktor, egzGun, egzTip, egzSure, hedef);

            // FAZ 11 — makro override: toggle açıksa girilen değerler ezilir, kalori yeniden hesaplanır.
            // Boş bırakılan makro Nutrio tahmininde kalır. Toggle kapalıysa davranış TAMAMEN eski hâliyle.
            const moToggle = document.getElementById('pr-makro-override');
            let makroOverride = null;
            if (moToggle && moToggle.checked) {
                const moProRaw = document.getElementById('pr-makro-pro').value;
                const moYagRaw = document.getElementById('pr-makro-yag').value;
                const moKarbRaw = document.getElementById('pr-makro-karb').value;
                const moPro = parseFloat(moProRaw);
                const moYag = parseFloat(moYagRaw);
                const moKarb = parseFloat(moKarbRaw);
                if ((!moProRaw || (isFinite(moPro) && moPro >= 0)) &&
                    (!moYagRaw || (isFinite(moYag) && moYag >= 0)) &&
                    (!moKarbRaw || (isFinite(moKarb) && moKarb >= 0))) {
                    const ezPro = moProRaw ? moPro : hesap.pro;
                    const ezYag = moYagRaw ? moYag : hesap.yag;
                    const ezKarb = moKarbRaw ? moKarb : hesap.karb;
                    hesap = { kalori: Math.round(ezPro * 4 + ezYag * 9 + ezKarb * 4), pro: ezPro, yag: ezYag, karb: ezKarb, bmr: hesap.bmr };
                    makroOverride = { acik: true, pro: ezPro, yag: ezYag, karb: ezKarb };
                } else {
                    bildirGoster('Makro değerleri geçersiz — sayı ve 0 veya üzeri olmalı', 'hata');
                    return;
                }
            }
            const secilenAvatar = prSeciliAvatar || AVATAR_VARSAYILAN;

            if (duzenleId) {
                let p = profiller.find(x => x.id == duzenleId);
                let eskiKilo = p.girdi.kilo;
                p.ad = ad; p.kalori = hesap.kalori; p.pro = hesap.pro; p.yag = hesap.yag; p.karb = hesap.karb;
                p.avatar = secilenAvatar;
                p.makroOverride = makroOverride;
                p.girdi = { cins, yas, boy, kilo, adimFaktor, egzGun, egzTip, egzSure, hedef, antrenmanGunleri };
                if (kilo !== eskiKilo) {
                    if (!p.kiloGecmisi) p.kiloGecmisi = [];
                    let bugunkuKayit = p.kiloGecmisi.find(g => g.tarih === bugununTarihi);
                    if (bugunkuKayit) bugunkuKayit.kilo = kilo;
                    else p.kiloGecmisi.push({ id: benzersizId(), tarih: bugununTarihi, kilo: kilo });
                }
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                document.getElementById('pr-duzenle-id').value = '';
                document.getElementById('iptal-profil-btn').classList.add('gizli');
                bildirGoster('Profil güncellendi');
                sayfaGoster('ana-ekran');
                return;
            }

            let yeniProfil = {
                id: benzersizId(), ad: ad, kalori: hesap.kalori, pro: hesap.pro, yag: hesap.yag, karb: hesap.karb,
                avatar: secilenAvatar,
                makroOverride: makroOverride,
                kartSirasi: ['skor', 'ogunler', 'su', 'aktivite'],
                gunluk: [], gecmis: [], aktifTarih: bugununTarihi,
                kiloGecmisi: [{ id: benzersizId(), tarih: bugununTarihi, kilo: kilo }],
                baslangicKilosu: kilo,
                su: { tarih: bugununTarihi, miktar: 0 },
                suHedefMl: Math.round((kilo * 33) / 250) * 250,
                hedefKilo: null,
                takviyeGecmisi: {},
                gunlukAktivite: {},
                otomatikYedekler: [],
                planEntries: [],
                marketListesi: [],
                girdi: { cins, yas, boy, kilo, adimFaktor, egzGun, egzTip, egzSure, hedef, antrenmanGunleri }
            };

            profiller.push(yeniProfil);
            aktifProfilId = yeniProfil.id;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            localStorage.setItem('df_aktif_profil_id', aktifProfilId);

            document.getElementById('iptal-profil-btn').classList.add('gizli');
            bildirGoster('Profil oluşturuldu, hoş geldin!');
            sayfaGoster('ana-ekran');
        }

        function profilDegistir() {
            const secim = document.getElementById('aktif-profil-secim').value;
            if (secim === '__yeni__') {
                // FAZ 17 — dropdown'daki "+ Yeni Kişi Ekle" seçilirse yeni profil formu açılır;
                // seçim eski profile geri alınır ki dropdown yanlışlıkla "yeni" göstermeye devam etmesin.
                document.getElementById('aktif-profil-secim').value = aktifProfilId;
                yeniProfilFormu();
                return;
            }
            aktifProfilId = secim;
            localStorage.setItem('df_aktif_profil_id', aktifProfilId);
            tarihKontrol(aktifProfilId);
            arayuzGuncelle();
        }

        function tarihKontrol(id) {
            let p = profiller.find(x => x.id == id);
            if (p && p.aktifTarih !== bugununTarihi) {
                if (p.gunluk.length > 0 || (p.su && p.su.miktar > 0)) {
                    p.gecmis.push({ tarih: p.aktifTarih, veriler: p.gunluk, su: p.su ? p.su.miktar : 0 });
                }
                p.gunluk = [];
                p.aktifTarih = bugununTarihi;
                // FAZ 10 — otomatik tekrar: gün değiştiğinde işaretli şablonlar yeni güne sessizce yazılır
                (p.otomatikTekrarlar || []).forEach(kayit => {
                    const s = sablonlar.find(x => x.id == kayit.sablonId);
                    if (!s) return;
                    s.icerikler.forEach(o => {
                        const b = besinler.find(x => x.id === o.besinId);
                        if (!b) return;
                        const carpan = o.miktar / b.ref;
                        p.gunluk.push({
                            id: benzersizId(), besinId: b.id, ad: b.ad, marka: b.marka || '',
                            miktar: Math.round(o.miktar * 10) / 10, birim: b.birim, ogun: kayit.ogunTuru || 'belirsiz',
                            cal: Math.round(b.cal * carpan), pro: (b.pro * carpan).toFixed(1),
                            yag: (b.yag * carpan).toFixed(1), karb: (b.karb * carpan).toFixed(1)
                        });
                    });
                });
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
            }
        }

        // FAZ 10 — otomatik tekrar aç/kapat: şablon satırındaki 🔁 butonu öğün türü sorar.
        async function otomatikTekrarToggle(sablonId) {
            const aktif = aktifProfiliGetir();
            if (!aktif.otomatikTekrarlar) aktif.otomatikTekrarlar = [];
            const mevcut = aktif.otomatikTekrarlar.find(k => k.sablonId == sablonId);
            if (mevcut) {
                otomatikTekrarSil(mevcut.id);
                return;
            }
            const secenekler = OJUN_ETIKETLERI.map((o, i) => (i + 1) + ') ' + o.ad).join('  ');
            const cevap = await modalGirdi('🔁 Her Gün Otomatik Ekle', 'Hangi öğüne eklensin? (' + secenekler + ')', 'kahvalti', 'kahvalti / ogle / aksam / ara_ogun');
            if (cevap === null) return;
            const giris = (cevap || '').trim().toLocaleLowerCase('tr-TR');
            const sayiSecim = OJUN_ETIKETLERI[parseInt(giris, 10) - 1];
            const eslesen = OJUN_ETIKETLERI.find(o => o.key === giris || o.ad.toLocaleLowerCase('tr-TR') === giris);
            const ogunTuru = eslesen ? eslesen.key : (sayiSecim ? sayiSecim.key : null);
            if (!ogunTuru) { bildirGoster('Geçerli bir öğün gir (kahvalti, ogle, aksam, ara_ogun)', 'hata'); return; }
            aktif.otomatikTekrarlar.push({ id: benzersizId(), sablonId: sablonId, ogunTuru: ogunTuru });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            sablonListele();
            bildirGoster('🔁 Şablon her gün otomatik eklenecek');
        }

        function otomatikTekrarSil(tekrarId) {
            const aktif = aktifProfiliGetir();
            if (!aktif.otomatikTekrarlar) return;
            aktif.otomatikTekrarlar = aktif.otomatikTekrarlar.filter(k => k.id != tekrarId);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            sablonListele();
            bildirGoster('Otomatik tekrar kapatıldı');
        }

        function aktifProfiliGetir() {
            return profiller.find(p => p.id == aktifProfilId);
        }

        // MADDE 2 — Ayarlar'daki "Ana Ekran Kart Sırası" listesi: ▲▼ ile komşu kartla yer değiştirir,
        // kaydeder ve ana ekranda anında uygular. Drag-drop yok.
        const KART_SIRA_ADLARI = { skor: 'Skor Paneli', aktivite: 'Bugünkü Aktivite', su: 'Su', ogunler: 'Öğünler' };

        function kartSiraListesiGuncelle() {
            const aktif = aktifProfiliGetir();
            const alan = document.getElementById('kart-sira-liste');
            if (!alan || !aktif) return;
            const sira = Array.isArray(aktif.kartSirasi) && aktif.kartSirasi.length >= 3 ? aktif.kartSirasi : ['skor', 'ogunler', 'su', 'aktivite'];
            alan.innerHTML = sira.map((anahtar, i) => `
                <div class="kart-sira-satir">
                    <span class="kart-sira-ad">${esc(KART_SIRA_ADLARI[anahtar] || anahtar)}</span>
                    <span class="kart-sira-btnler">
                        <button type="button" class="btn-ikincil btn-kucuk" style="flex:0 0 auto; padding:7px 11px; margin-top:0;" onclick="kartSiraTasi(${i}, -1)" ${i === 0 ? 'disabled' : ''} aria-label="Yukarı taşı">▲</button>
                        <button type="button" class="btn-ikincil btn-kucuk" style="flex:0 0 auto; padding:7px 11px; margin-top:0;" onclick="kartSiraTasi(${i}, 1)" ${i === sira.length - 1 ? 'disabled' : ''} aria-label="Aşağı taşı">▼</button>
                    </span>
                </div>`).join('');
        }

        function kartSiraTasi(index, yon) {
            const aktif = aktifProfiliGetir();
            if (!aktif) return;
            if (!Array.isArray(aktif.kartSirasi) || aktif.kartSirasi.length < 3) aktif.kartSirasi = ['skor', 'ogunler', 'su', 'aktivite'];
            const hedef = index + yon;
            if (hedef < 0 || hedef >= aktif.kartSirasi.length) return;
            [aktif.kartSirasi[index], aktif.kartSirasi[hedef]] = [aktif.kartSirasi[hedef], aktif.kartSirasi[index]];
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            kartSiraListesiGuncelle();
            anaKartSiraUygula(aktif);
            bildirGoster('↕ Ana ekran kart sırası güncellendi');
        }

        // KÜTÜPHANE İŞLEMLERİ (CRUD)
        // Merkezi kategori sekme üretimi — Tümü + Favoriler filtreleri + BESIN_KATEGORILERI
        // (kütüphane, tüketim ve şablon besin seçimi aynı fonksiyonu kullanır; emoji yok)
        function besinKategoriSekmeleriOlustur(alanId, aktifKey, secimFonkAdi) {
            const kats = [{ key: 'tum', ad: 'Tümü' }, { key: 'favori', ad: 'Favoriler' },
                ...BESIN_KATEGORILERI];
            const alan = document.getElementById(alanId);
            if (!alan) return;
            alan.innerHTML = kats.map(k => '<button class="sekme-btn ' + (aktifKey === k.key ? 'aktif' : '') + '" onclick="' + secimFonkAdi + '(\'' + k.key + '\')">' + esc(k.ad) + '</button>').join('');
        }

        function kategoriSekmeleriOlustur() {
            besinKategoriSekmeleriOlustur('kategori-sekmeler', aktifKategori, 'kategoriSec');
        }

        function kategoriSec(key) { aktifKategori = key; kListele(); }

        // FAZ 11 — kütüphane aramasında Enter/blur anı arama "tamamlandı" sayılır
        (function kutuphaneAramaGecmisiBagla() {
            const input = document.getElementById('k-arama');
            if (!input) return;
            input.addEventListener('keydown', e => { if (e.key === 'Enter') aramaGecmisiniKaydet('k-arama'); });
            input.addEventListener('blur', () => aramaGecmisiniKaydet('k-arama'));
        })();

        function favoriToggle(id) {
            if (favoriler.includes(id)) favoriler = favoriler.filter(x => x !== id);
            else favoriler.push(id);
            localStorage.setItem('df_favoriler', JSON.stringify(favoriler));
            kListele();
        }

        function birimEtiket(birim) {
            return { g: 'g', ml: 'ml', adet: 'adet', porsiyon: 'porsiyon', dilim: 'dilim' }[birim] || 'birim';
        }

        function birimDegistiFormda() {
            let birim = document.getElementById('b-birim').value;
            let refInput = document.getElementById('b-ref');
            if (!refInput.value) refInput.value = (birim === 'g' || birim === 'ml') ? 100 : 1;
        }

        function kListele() {
            kategoriSekmeleriOlustur();
            const arama = (document.getElementById('k-arama').value || '').toLocaleLowerCase('tr-TR');
            const liste = document.getElementById('kutuphane-listesi');
            liste.innerHTML = '';
            const etiketDeposu = besinEtiketleriniGetir();

            let filtreli = besinleriSirala(besinler.filter(b => {
                if (aktifKategori === 'favori' && !favoriler.includes(b.id)) return false;
                if (aktifKategori !== 'tum' && aktifKategori !== 'favori' && b.kategori !== aktifKategori) return false;
                // FAZ 11 — isim eşleşmezse etiketlerden biri aramayla eşleşiyorsa da göster
                if (arama && !besinEslesiyorMu(gorunenAd(b), arama) && !etiketlerEslesiyorMu(etiketDeposu[b.id], arama)) return false;
                return true;
            }));

            if (filtreli.length === 0) {
                liste.innerHTML = '<div class="bos-durum">' + ikon('ara', 16) + ' Bu kritere uyan besin bulunamadı.</div>';
                return;
            }

            liste.innerHTML = filtreli.map(b => {
                const favoriMi = favoriler.includes(b.id);
                const etiketler = etiketDeposu[b.id] || [];
                const etiketGosterim = etiketler.length
                    ? '<button class="btn-duzenle besin-etiket-btn" onclick="etiketDuzenle(\'besin\', ' + b.id + ')" title="Etiketler: ' + esc(etiketler.join(', ')) + '" style="color:var(--vurgu-renk) !important;">🏷' + etiketler.length + '</button>'
                    : '<button class="btn-duzenle besin-etiket-btn" onclick="etiketDuzenle(\'besin\', ' + b.id + ')" title="Etiket ekle" style="color:var(--yazi-pasif) !important;">🏷</button>';
                return `
                    <div class="liste-elemani" data-bid="${b.id}">
                        <div style="flex:1;">
                            <strong style="color:var(--yazi-ana); font-size:16px;">${esc(gorunenAd(b))}</strong>
                            <span class="liste-detay">${b.ref} ${esc(birimEtiket(b.birim))} | ${b.cal} kcal | P:${b.pro} Y:${b.yag}</span>
                        </div>
                        <div class="buton-grubu">
                            ${etiketGosterim}
                            <button class="btn-duzenle" onclick="favoriToggle(${b.id})" style="color:${favoriMi ? 'var(--vurgu-renk)' : 'var(--yazi-pasif)'} !important;">${favoriMi ? '★' : '☆'}</button>
                            <button class="btn-duzenle" onclick="besinDuzenle(${b.id})">${ikon('duzenle', 14)}</button>
                            <button class="btn-tehlike" onclick="besinSil(${b.id})" style="border-radius:12px;">${ikon('sil', 14)}</button>
                        </div>
                    </div>`;
            }).join('');
        }

        function besinFormuAc() {
            document.querySelectorAll('#besin-form-ekrani input').forEach(inp => inp.value = '');
            // kategori select'ini merkezi tanımdan doldur (duplicate tanım yok)
            const kategoriSel = document.getElementById('b-kategori');
            const onceki = kategoriSel.value;
            kategoriSel.innerHTML = BESIN_KATEGORILERI.map(k => '<option value="' + k.key + '">' + esc(k.ad) + '</option>').join('');
            kategoriSel.value = BESIN_KATEGORILERI.some(k => k.key === onceki) ? onceki : 'et';
            document.getElementById('b-birim').value = 'g';
            sayfaGoster('besin-form-ekrani');
        }

        function besinKaydet() {
            let id = document.getElementById('b-id').value;
            let duzenlenen = id ? besinler.find(x => x.id == id) : null;
            // Metadata: seed kaydı düzenleniyorsa 'seed + ozel' olarak işaretle (senkronizasyon ezmesin),
            // yeni eklenen besin 'kullanici' kaynağıyla işaretlenir.
            let kaynak = 'kullanici', ozel;
            if (duzenlenen) {
                kaynak = (duzenlenen.kaynak === 'seed' || tohumVeriler.some(t => t.id === duzenlenen.id)) ? 'seed' : 'kullanici';
                if (kaynak === 'seed') ozel = true;
            }
            let yeni = {
                id: id ? parseInt(id) : Date.now(),
                ad: document.getElementById('b-ad').value,
                marka: (document.getElementById('b-marka').value || '').trim(),
                kategori: document.getElementById('b-kategori').value,
                birim: document.getElementById('b-birim').value,
                ref: parseFloat(document.getElementById('b-ref').value),
                cal: parseFloat(document.getElementById('b-cal').value),
                pro: parseFloat(document.getElementById('b-pro').value),
                yag: parseFloat(document.getElementById('b-yag').value),
                karb: parseFloat(document.getElementById('b-karb').value),
                kaynak: kaynak
            };
            if (ozel) yeni.ozel = true;
            if (id) { besinler[besinler.findIndex(x => x.id == id)] = yeni; } else { besinler.push(yeni); }
            localStorage.setItem('df_besinler', JSON.stringify(besinler));
            bildirGoster(id ? 'Besin güncellendi' : 'Besin eklendi');
            sayfaGoster('kutuphane-ekrani');
        }

        function besinDuzenle(id) {
            // Kategori select'ini her durumda merkezi tanımdan doldur (form ilk kez düzenleme için açılırsa boş kalmasın)
            const kategoriSel = document.getElementById('b-kategori');
            if (!kategoriSel.options.length) {
                kategoriSel.innerHTML = BESIN_KATEGORILERI.map(k => '<option value="' + k.key + '">' + esc(k.ad) + '</option>').join('');
            }
            let b = besinler.find(x => x.id === id);
            document.getElementById('b-id').value = b.id; document.getElementById('b-ad').value = b.ad;
            document.getElementById('b-marka').value = b.marka || '';
            document.getElementById('b-kategori').value = b.kategori || 'diger';
            document.getElementById('b-birim').value = b.birim || 'g';
            document.getElementById('b-ref').value = b.ref; document.getElementById('b-cal').value = b.cal;
            document.getElementById('b-pro').value = b.pro; document.getElementById('b-yag').value = b.yag;
            document.getElementById('b-karb').value = b.karb;
            sayfaGoster('besin-form-ekrani');
        }

        function besinSil(id) {
            const el = document.querySelector('[data-bid="' + id + '"]');
            const silinenBesin = besinler.find(x => x.id === id);
            const eskiIndex = besinler.findIndex(x => x.id === id);
            if (!silinenBesin) return;
            const tamamla = () => {
                besinler = besinler.filter(x => x.id !== id);
                // Seed besini sildiyse mezar taşağına yaz — sonraki seed senkronizasyonu tekrar eklemesin
                if (silinenBesin.kaynak === 'seed' || tohumVeriler.some(t => t.id === id)) {
                    let mezarTasi = [];
                    try { mezarTasi = JSON.parse(localStorage.getItem('df_seed_silinenler')) || []; } catch (e) { mezarTasi = []; }
                    if (!mezarTasi.includes(id)) {
                        mezarTasi.push(id);
                        localStorage.setItem('df_seed_silinenler', JSON.stringify(mezarTasi));
                    }
                }
                localStorage.setItem('df_besinler', JSON.stringify(besinler));
                kListele();
                bildirGoster('Besin silindi', null, () => {
                    besinler.splice(eskiIndex, 0, silinenBesin);
                    // Geri alındıysa mezar taşından çıkar
                    let mezarTasi = [];
                    try { mezarTasi = JSON.parse(localStorage.getItem('df_seed_silinenler')) || []; } catch (e) { mezarTasi = []; }
                    if (mezarTasi.includes(id)) {
                        mezarTasi = mezarTasi.filter(x => x !== id);
                        localStorage.setItem('df_seed_silinenler', JSON.stringify(mezarTasi));
                    }
                    localStorage.setItem('df_besinler', JSON.stringify(besinler));
                    kListele();
                });
            };
            if (el) { el.classList.add('silinecek'); setTimeout(tamamla, 220); } else tamamla();
        }

        // TÜKETİM (KATEGORİ + ARAMA + SEÇ) VE ARAYÜZ
        // ÖĞÜN SEÇİCİLERİ — tüketim formundaki öğün select'ini doldurur
        // FAZ 10 — zamana göre akıllı öğün varsayılanı: "mevcut" boşsa (ilk açılış,
        // düzenleme değil) saate göre seçilir; doluysa eski davranış (değer korunur).
        function ogunSecenekleriniDoldur() {
            const sel = document.getElementById('t-ogun');
            if (!sel) return;
            const mevcut = sel.value;
            sel.innerHTML = '<option value="belirsiz">Belirsiz</option>' +
                OJUN_ETIKETLERI.map(o => '<option value="' + o.key + '">' + esc(o.ad) + '</option>').join('');
            if (mevcut) { sel.value = mevcut; return; }
            const saat = new Date().getHours();
            let varsayilan = 'ara_ogun';
            if (saat >= 7 && saat <= 10) varsayilan = 'kahvalti';
            else if (saat >= 11 && saat <= 15) varsayilan = 'ogle';
            else if (saat >= 18 && saat <= 21) varsayilan = 'aksam';
            sel.value = varsayilan;
        }

        function ogunEtiketi(kayit) {
            return OJUN_ADI[kayit && kayit.ogun] || 'Belirsiz';
        }

        // Kayıtları öğüne göre gruplanmış HTML üretir (Ana ekran ve Gün Detay ekranı ortak bileşeni).
        // bosDurumHtml: liste boşsa gösterilecek TEK empty state (double empty state yok).
        // Ana ekran "Henüz bir şey yemedin" + CTA verir; geçmiş gün detayı nötr metin gösterir.
        function ogunGrupluListeHtml(kayitlar, satirHtml, bosDurumHtml) {
            if (!kayitlar || kayitlar.length === 0) {
                return bosDurumHtml || '<div class="bos-durum">🍽️ Bu gün için kayıt bulunmuyor.</div>';
            }
            const gruplar = new Map();
            kayitlar.forEach(k => {
                const key = OJUN_SIRASI.includes(k.ogun) ? k.ogun : 'belirsiz';
                if (!gruplar.has(key)) gruplar.set(key, []);
                gruplar.get(key).push(k);
            });
            let html = '';
            OJUN_SIRASI.forEach(ogunKey => {
                const kayitlar2 = gruplar.get(ogunKey);
                if (!kayitlar2 || kayitlar2.length === 0) return;
                html += '<div class="ogun-grup-baslik">' + esc(OJUN_ADI[ogunKey] || 'Belirsiz') + '</div>';
                html += kayitlar2.map(satirHtml).join('');
            });
            return html;
        }

        // Hedef tarih: null = bugün (canlı); tarih verilirse o güne yazar (geçmiş gün düzenlenebilir)
        let tuketimHedefTarih = null;

        // FAZ 9 — Toplu besin ekleme sepeti. Bellekte tutulur, kalıcı DEĞİL.
        // "Sepete Ekle" seçili besini sepete atar; "Bugüne Ekle" sepet doluysa
        // hem seçili besini hem sepettekileri tek seferde günlüğe yazar.
        let tuketimSepeti = [];

        function tuketimSepeteEkle() {
            let id = tSeciliBesinId;
            let mik = parseFloat(document.getElementById('t-miktar').value);
            let ogun = document.getElementById('t-ogun') ? document.getElementById('t-ogun').value : 'belirsiz';
            if (!id) { bildirGoster('Lütfen bir besin seç', 'hata'); return; }
            if (!mik || mik <= 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }
            let b = besinler.find(x => x.id == id);
            if (!b) { bildirGoster('Besin bulunamadı', 'hata'); return; }
            let carpan = mik / b.ref;
            tuketimSepeti.push({
                besinId: b.id, ad: b.ad, marka: b.marka || '', miktar: mik, birim: b.birim, ogun: ogun,
                cal: Math.round(b.cal * carpan), pro: (b.pro * carpan).toFixed(1),
                yag: (b.yag * carpan).toFixed(1), karb: (b.karb * carpan).toFixed(1)
            });
            tSeciliBesinId = null;
            document.getElementById('t-miktar').value = '';
            document.getElementById('t-arama').value = '';
            tListele();
            tuketimPorsiyonBtnGuncelle();
            tuketimSepetiAlanGuncelle();
            bildirGoster('🛒 ' + gorunenAd(b) + ' sepete eklendi');
        }

        function tuketimSepetSil(index) {
            const silinen = tuketimSepeti[index];
            if (!silinen) return;
            tuketimSepeti.splice(index, 1);
            tuketimSepetiAlanGuncelle();
            bildirGoster('Sepetten çıkarıldı', null, () => {
                tuketimSepeti.splice(Math.min(index, tuketimSepeti.length), 0, silinen);
                tuketimSepetiAlanGuncelle();
            });
        }

        function tuketimSepetiAlanGuncelle() {
            const alan = document.getElementById('tuketim-sepeti-alani');
            if (!alan) return;
            if (tuketimSepeti.length === 0) {
                alan.classList.add('gizli');
                alan.innerHTML = '';
                return;
            }
            alan.classList.remove('gizli');
            alan.innerHTML = '<div style="border:1px solid var(--kenar); border-radius:14px; padding:10px 14px; margin-bottom:12px; background:var(--kart-2);">' +
                '<strong style="font-size:12.5px; text-transform:uppercase; letter-spacing:.06em; color:var(--vurgu-renk);">🛒 Sepetim (' + tuketimSepeti.length + ')</strong>' +
                tuketimSepeti.map((u, i) =>
                    '<div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:6px 0; border-top:1px solid var(--kenar); font-size:13px; font-weight:600;">' +
                    '<span>' + esc(gorunenAd(u)) + ' — ' + u.miktar + ' ' + esc(birimEtiket(u.birim)) + '</span>' +
                    '<button class="btn-tehlike btn-kucuk" style="padding:3px 9px;" onclick="tuketimSepetSil(' + i + ')" aria-label="Sepetten çıkar">' + ikon('sil', 13) + '</button>' +
                    '</div>'
                ).join('') +
                '</div>';
        }

        function tuketimSepetiTemizle() { tuketimSepeti = []; tuketimSepetiAlanGuncelle(); }

        // FAZ 8 — tuketim-ekrani iç sekmeleri: Besin Ara | Şablonlar
        let tuketimAktifSekme = 'besin';

        function tuketimSekmeSec(sekme) {
            if (!['besin', 'sablon'].includes(sekme)) sekme = 'besin';
            tuketimAktifSekme = sekme;
            ['besin', 'sablon'].forEach(s => {
                const sekmeBtn = document.getElementById('tuketim-sekme-' + s);
                if (sekmeBtn) sekmeBtn.classList.toggle('aktif', s === sekme);
                const panel = document.getElementById('tuketim-panel-' + s);
                if (panel) panel.classList.toggle('gizli', s !== sekme);
            });
            // Şablon sekmesinde miktar/öğün formu anlamsız; Kaydet ve Sepete Ekle butonları yalnızca Besin Ara sekmesinde görünür
            const kaydetBtn = document.getElementById('tuketim-kaydet-btn');
            if (kaydetBtn) kaydetBtn.classList.toggle('gizli', sekme !== 'besin');
            const sepetBtn = document.getElementById('tuketim-sepete-ekle-btn');
            if (sepetBtn) sepetBtn.classList.toggle('gizli', sekme !== 'besin');
            if (sekme === 'sablon') tuketimSablonListele();
        }

        // Şablonların hızlı uygulama listesi (sablonListele'deki bilgi gösterimi + tek dokunuşla uygulama).
        // Oluşturma/düzenleme/silme bağımsız sablon-ekrani'nda kalır; burada sadece "hızlı uygulama" var.
        function tuketimSablonListele() {
            const alan = document.getElementById('tuketim-sablon-listesi');
            if (!alan) return;
            if (sablonlar.length === 0) {
                alan.innerHTML = '<div class="bos-durum">Henüz bir öğün şablonu yok. "Daha Fazla → Öğün Şablonları"ndan oluşturabilirsin.</div>';
                return;
            }
            alan.innerHTML = sablonlar.map(s => {
                let toplamKcal = 0;
                s.icerikler.forEach(o => {
                    let b = besinler.find(x => x.id === o.besinId);
                    if (b) toplamKcal += b.cal * (o.miktar / o.ref);
                });
                let porsiyonSayisi = s.porsiyonSayisi || 1;
                let icerikMetni = s.icerikler.map(o => o.miktar + ' ' + birimEtiket(o.birim) + ' ' + gorunenAd(o)).join(', ');
                let porsiyonMetni = porsiyonSayisi > 1 ? (' · ' + porsiyonSayisi + ' porsiyon, 1 porsiyon ≈ ' + Math.round(toplamKcal / porsiyonSayisi) + ' kcal') : '';
                return `<div class="liste-elemani" style="flex-direction:column; align-items:stretch;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                        <div>
                            <strong style="font-size:15px;">${esc(sablonKategoriAdlari[s.kategori] || '')} ${esc(s.ad)}</strong>
                            <span class="liste-detay">${esc(icerikMetni)}</span>
                            <span class="liste-detay">≈ ${Math.round(toplamKcal)} kcal${esc(porsiyonMetni)}</span>
                        </div>
                    </div>
                    <div class="buton-grubu" style="margin-top:10px;">
                        <button onclick="tuketimSablonUygula('${s.id}', 1)">${porsiyonSayisi > 1 ? '1 Porsiyon Ekle' : esc(s.ad) + ' Ekle'}</button>
                        ${porsiyonSayisi > 1 ? `<button class="btn-ikincil" onclick="tuketimSablonUygula('${s.id}', ${porsiyonSayisi})">Tümünü Ekle (${porsiyonSayisi}x)</button>` : ''}
                    </div>
                </div>`;
            }).join('');
        }

        // Tuketim ekranından şablon uygula: kaydı günlüğe/arşive yaz, ekranı kapat, ana ekrana dön.
        function tuketimSablonUygula(id, porsiyonAdedi) {
            let s = sablonlar.find(x => x.id == id);
            if (!s) return;
            let toplamPorsiyon = s.porsiyonSayisi || 1;
            let carpanPorsiyon = (porsiyonAdedi || 1) / toplamPorsiyon;
            let aktif = aktifProfiliGetir();

            // Hedef gün: bugünse canlı günlüğe, geçmiş günse arşive yazar (tuketimKaydet ile aynı model)
            const gecmisHedef = tuketimHedefTarih && tuketimHedefTarih !== bugununTarihi ? tuketimHedefTarih : null;
            let hedefKayitlar;
            if (gecmisHedef) {
                let gun = aktif.gecmis.find(g => g.tarih === gecmisHedef);
                if (!gun) { gun = { tarih: gecmisHedef, veriler: [], su: null }; aktif.gecmis.push(gun); }
                hedefKayitlar = gun.veriler;
            } else {
                hedefKayitlar = aktif.gunluk;
            }

            s.icerikler.forEach(o => {
                let b = besinler.find(x => x.id === o.besinId);
                if (!b) return;
                let miktar = o.miktar * carpanPorsiyon;
                let carpan = miktar / b.ref;
                hedefKayitlar.push({
                    id: benzersizId(), besinId: b.id, ad: b.ad, marka: b.marka || '', miktar: Math.round(miktar * 10) / 10, birim: b.birim,
                    cal: Math.round(b.cal * carpan), pro: (b.pro * carpan).toFixed(1),
                    yag: (b.yag * carpan).toFixed(1), karb: (b.karb * carpan).toFixed(1)
                });
            });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            tuketimHedefTarih = null;
            bildirGoster('✓ ' + s.ad + ' günlüğüne eklendi');
            stokEksikMalzemeUyariGoster(s);
            sayfaGoster('ana-ekran');
        }

        function tuketimEkranAc(hedefTarih) {
            tuketimHedefTarih = hedefTarih || null;
            document.getElementById('t-duzenle-id').value = '';
            document.getElementById('t-miktar').value = '';
            document.getElementById('t-arama').value = '';
            tSeciliBesinId = null;
            tAktifKategori = 'tum';
            tuketimSepetiTemizle();
            // FAZ 10 — akıllı öğün varsayılanı: önceki seçimi temizle ki doldurucu saate göre seçsin
            const tOgun0 = document.getElementById('t-ogun');
            if (tOgun0) tOgun0.value = '';
            ogunSecenekleriniDoldur();
            const gecmisMi = tuketimHedefTarih && tuketimHedefTarih !== bugununTarihi;
            document.getElementById('tuketim-form-baslik').innerText = gecmisMi ? 'Ne Yedin? — ' + formatTarihKisa(tuketimHedefTarih) : 'Ne Yedin?';
            document.getElementById('tuketim-kaydet-btn').innerText = gecmisMi ? 'O Güne Ekle' : 'Bugüne Ekle';
            tuketimSekmeSec('besin');
            sayfaGoster('tuketim-ekrani');
        }

        function tKategoriSekmeleriOlustur() {
            besinKategoriSekmeleriOlustur('t-kategori-sekmeler', tAktifKategori, 'tKategoriSec');
        }

        function tKategoriSec(key) { tAktifKategori = key; tListele(); }

        function tListele() {
            tKategoriSekmeleriOlustur();
            const arama = (document.getElementById('t-arama').value || '').toLocaleLowerCase('tr-TR');
            const alan = document.getElementById('t-secim-listesi');
            const etiketDeposu = besinEtiketleriniGetir();
            let filtreli = besinleriSirala(besinler.filter(b => {
                if (tAktifKategori === 'favori' && !favoriler.includes(b.id)) return false;
                if (tAktifKategori !== 'tum' && tAktifKategori !== 'favori' && b.kategori !== tAktifKategori) return false;
                // FAZ 11 — isim eşleşmezse etiketlerden biri aramayla eşleşiyorsa da göster
                if (arama && !besinEslesiyorMu(gorunenAd(b), arama) && !etiketlerEslesiyorMu(etiketDeposu[b.id], arama)) return false;
                return true;
            }));

            if (filtreli.length === 0) {
                alan.innerHTML = '<div class="bos-durum">' + ikon('ara', 16) + ' Eşleşen besin yok.</div>';
                return;
            }

            alan.innerHTML = filtreli.map(b => {
                const secili = tSeciliBesinId == b.id;
                const favoriMi = favoriler.includes(b.id);
                const etiketler = etiketDeposu[b.id] || [];
                const etiketBtn = '<button type="button" class="besin-etiket-btn' + (etiketler.length ? ' etiketli' : '') + '" style="flex:0 0 auto; margin-top:0;" title="' + (etiketler.length ? 'Etiketler: ' + esc(etiketler.join(', ')) : 'Etiket ekle') + '" onclick="event.stopPropagation(); etiketDuzenle(\'besin\', ' + b.id + ')">🏷</button>';
                return `<div class="liste-elemani ${secili ? 'secili-oge' : ''}" style="cursor:pointer; padding:12px 14px;" onclick="tuketimSecBesin(${b.id})">
                    <div style="display:flex; align-items:center; gap:8px; min-width:0;">
                        ${etiketBtn}
                        <div style="min-width:0;"><strong style="font-size:14.5px;">${favoriMi ? '★ ' : ''}${esc(gorunenAd(b))}</strong><span class="liste-detay">${b.ref} ${esc(birimEtiket(b.birim))} | ${b.cal} kcal${etiketler.length ? ' · 🏷 ' + esc(etiketler.join(', ')) : ''}</span></div>
                    </div>
                    ${secili ? '<span style="color:var(--vurgu-renk); font-size:18px;">✓</span>' : ''}
                </div>`;
            }).join('');
        }

        function tuketimPorsiyonBtnGuncelle() {
            const grid = document.getElementById('t-porsiyon-grid');
            if (!tSeciliBesinId) { grid.innerHTML = ''; return; }
            let b = besinler.find(x => x.id == tSeciliBesinId);
            if (!b) { grid.innerHTML = ''; return; }
            let secenekler = (b.birim === 'g' || b.birim === 'ml') ? [50, 100, 150, 200] : [1, 2, 3, 4];
            grid.innerHTML = secenekler.map(v => '<button onclick="tuketimMiktarSec(' + v + ')">' + v + (b.birim === 'g' || b.birim === 'ml' ? '' : 'x') + '</button>').join('');
        }

        function tuketimMiktarSec(v) { document.getElementById('t-miktar').value = v; }

        // FAZ 12 — göz kararı birim ön ayarları (SADECE birim 'g' veya 'ml' olan besinlerde görünür):
        // t-miktar'ı yaklaşık değerlere hızlıca dolduran kolaylık butonları. Besin birim
        // sisteminde hiçbir şey değişmez; mevcut tuketimMiktarSec mekanizması çağrılır.
        function tuketimGozKarariButonlariGuncelle() {
            const alan = document.getElementById('t-goz-karari-alani');
            if (!alan) return;
            const b = tSeciliBesinId ? besinler.find(x => x.id == tSeciliBesinId) : null;
            if (b && (b.birim === 'g' || b.birim === 'ml')) {
                const onAyarlar = [
                    { etiket: '1 tutam (~5)', deger: 5 },
                    { etiket: '1 y.kaşığı (~15)', deger: 15 },
                    { etiket: '1 ç.kaşığı (~5)', deger: 5 },
                    { etiket: '1 avuç (~30)', deger: 30 }
                ];
                alan.innerHTML = onAyarlar.map(o =>
                    `<button class="btn-ikincil btn-kucuk" style="width:auto; padding:6px 10px; font-size:12px;" onclick="tuketimMiktarSec(${o.deger})">${o.etiket}</button>`
                ).join('');
                alan.classList.remove('gizli');
            } else {
                alan.innerHTML = '';
                alan.classList.add('gizli');
            }
        }

        function tuketimSecBesin(id) { tSeciliBesinId = id; tListele(); tuketimPorsiyonBtnGuncelle(); tuketimGozKarariButonlariGuncelle(); }

        // FAZ 11 — besin seçilince arama "tamamlanmış" sayılır ve geçmişe yazılır (her tuş vuruşunda değil)
        (function tuketimSecBesinAramaKaydi() {
            const orijinal = tuketimSecBesin;
            tuketimSecBesin = function (id) {
                aramaGecmisiniKaydet('t-arama');
                orijinal(id);
            };
        })();

        function tuketimKaydet() {
            // FAZ 11 — arama tamamlandığında geçmişe yaz (besin seçimi/sepet/kayıt anı)
            aramaGecmisiniKaydet('t-arama');
            let id = tSeciliBesinId;
            let mik = parseFloat(document.getElementById('t-miktar').value);
            let ogun = document.getElementById('t-ogun') ? document.getElementById('t-ogun').value : 'belirsiz';

            let aktif = aktifProfiliGetir();
            let duzenleId = document.getElementById('t-duzenle-id').value;

            // FAZ 9 — sepet doluysa: seçili besin (varsa) önce sepete, sonra TÜMÜ tek yazımda günlüğe.
            // Hiç besin seçili değilken de sepeti yatırabilsin (Sepete Ekle seçimi zaten sıfırlıyor).
            if (!duzenleId && tuketimSepeti.length > 0) {
                if (id) {
                    if (!mik || mik <= 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }
                    let b0 = besinler.find(x => x.id == id);
                    if (!b0) { bildirGoster('Besin bulunamadı', 'hata'); return; }
                    let carpan0 = mik / b0.ref;
                    tuketimSepeti.push({
                        besinId: b0.id, ad: b0.ad, marka: b0.marka || '', miktar: mik, birim: b0.birim, ogun: ogun,
                        cal: Math.round(b0.cal * carpan0), pro: (b0.pro * carpan0).toFixed(1),
                        yag: (b0.yag * carpan0).toFixed(1), karb: (b0.karb * carpan0).toFixed(1)
                    });
                }
                const gecmisHedef0 = tuketimHedefTarih && tuketimHedefTarih !== bugununTarihi ? tuketimHedefTarih : null;
                let hedefKayitlar0;
                if (gecmisHedef0) {
                    let gun0 = aktif.gecmis.find(g => g.tarih === gecmisHedef0);
                    if (!gun0) { gun0 = { tarih: gecmisHedef0, veriler: [], su: null }; aktif.gecmis.push(gun0); }
                    hedefKayitlar0 = gun0.veriler;
                } else {
                    hedefKayitlar0 = aktif.gunluk;
                }
                tuketimSepeti.forEach(u => {
                    hedefKayitlar0.push({
                        id: benzersizId(), besinId: u.besinId, ad: u.ad, marka: u.marka || '', miktar: u.miktar, birim: u.birim, ogun: u.ogun,
                        cal: u.cal, pro: u.pro, yag: u.yag, karb: u.karb
                    });
                });
                const adet = tuketimSepeti.length;
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                tuketimSepetiTemizle();
                document.getElementById('t-miktar').value = '';
                document.getElementById('t-duzenle-id').value = '';
                tSeciliBesinId = null;
                bildirGoster('✓ ' + adet + ' besin eklendi' + (gecmisHedef0 ? ' (' + formatTarihKisa(gecmisHedef0) + ')' : ''));
                if (gecmisHedef0) {
                    gunDetayAktifTarih = gecmisHedef0;
                    sayfaGoster('gun-detay-ekrani');
                } else {
                    sayfaGoster('ana-ekran');
                }
                return;
            }

            if (!id) { bildirGoster('Lütfen bir besin seç', 'hata'); return; }
            if (!mik || mik <= 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }

            let b = besinler.find(x => x.id == id);
            if (!b) { bildirGoster('Besin bulunamadı', 'hata'); return; }
            let carpan = mik / b.ref;

            // Hedef gün: bugünse canlı günlüğe, geçmiş günse arşive yazar (GÜN = tarih)
            const gecmisHedef = tuketimHedefTarih && tuketimHedefTarih !== bugununTarihi ? tuketimHedefTarih : null;
            let hedefKayitlar;
            if (gecmisHedef) {
                let gun = aktif.gecmis.find(g => g.tarih === gecmisHedef);
                if (!gun) { gun = { tarih: gecmisHedef, veriler: [], su: null }; aktif.gecmis.push(gun); }
                hedefKayitlar = gun.veriler;
            } else {
                hedefKayitlar = aktif.gunluk;
            }

            if (duzenleId) {
                let kayit = hedefKayitlar.find(x => x.id == duzenleId) || aktif.gunluk.find(x => x.id == duzenleId);
                if (!kayit) { bildirGoster('Düzenlenecek kayıt bulunamadı', 'hata'); return; }
                kayit.besinId = b.id; kayit.ad = b.ad; kayit.marka = b.marka || ''; kayit.miktar = mik; kayit.birim = b.birim;
                kayit.ogun = ogun;
                kayit.cal = Math.round(b.cal * carpan); kayit.pro = (b.pro * carpan).toFixed(1);
                kayit.yag = (b.yag * carpan).toFixed(1); kayit.karb = (b.karb * carpan).toFixed(1);
                bildirGoster('✓ ' + gorunenAd(b) + ' güncellendi');
            } else {
                hedefKayitlar.push({
                    id: benzersizId(), besinId: b.id, ad: b.ad, marka: b.marka || '', miktar: mik, birim: b.birim, ogun: ogun,
                    cal: Math.round(b.cal * carpan), pro: (b.pro * carpan).toFixed(1),
                    yag: (b.yag * carpan).toFixed(1), karb: (b.karb * carpan).toFixed(1)
                });
                bildirGoster('✓ ' + gorunenAd(b) + ' ' + mik + ' ' + birimEtiket(b.birim) + ' olarak eklendi' + (gecmisHedef ? ' (' + formatTarihKisa(gecmisHedef) + ')' : ''));
            }

            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('t-miktar').value = '';
            document.getElementById('t-duzenle-id').value = '';
            tSeciliBesinId = null;
            if (gecmisHedef) {
                gunDetayAktifTarih = gecmisHedef;
                sayfaGoster('gun-detay-ekrani');
            } else {
                sayfaGoster('ana-ekran');
            }
        }

        function tuketimDuzenleAc(kayitId) {
            let aktif = aktifProfiliGetir();
            let kayit = aktif.gunluk.find(x => x.id == kayitId);
            if (!kayit) return;
            document.getElementById('t-duzenle-id').value = kayitId;
            document.getElementById('t-miktar').value = kayit.miktar;
            tSeciliBesinId = kayit.besinId || null;
            tAktifKategori = 'tum';
            tuketimSepetiTemizle();
            ogunSecenekleriniDoldur();
            const tOgun = document.getElementById('t-ogun');
            if (tOgun) tOgun.value = OJUN_SIRASI.includes(kayit.ogun) ? kayit.ogun : 'belirsiz';
            document.getElementById('t-arama').value = gorunenAd(kayit);
            document.getElementById('tuketim-form-baslik').innerText = 'Kaydı Düzenle';
            document.getElementById('tuketim-kaydet-btn').innerText = 'Değişiklikleri Kaydet';
            sayfaGoster('tuketim-ekrani');
            tuketimPorsiyonBtnGuncelle();
        }

        function tuketimSil(kayitId) {
            const el = document.querySelector('[data-tid="' + kayitId + '"]');
            let aktif = aktifProfiliGetir();
            const eskiIndex = aktif.gunluk.findIndex(x => x.id == kayitId);
            const silinenKayit = aktif.gunluk[eskiIndex];
            if (!silinenKayit) return;
            const tamamla = () => {
                aktif.gunluk = aktif.gunluk.filter(x => x.id !== kayitId);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                arayuzGuncelle();
                bildirGoster('Kayıt silindi', null, () => {
                    aktif.gunluk.splice(Math.min(eskiIndex, aktif.gunluk.length), 0, silinenKayit);
                    localStorage.setItem('df_profiller', JSON.stringify(profiller));
                    arayuzGuncelle();
                });
            };
            if (el) { el.classList.add('silinecek'); setTimeout(tamamla, 220); } else tamamla();
        }

        // SU TAKİBİ
        function suGunKontrol(aktif) {
            if (!aktif.su || aktif.su.tarih !== bugununTarihi) { aktif.su = { tarih: bugununTarihi, miktar: 0 }; }
            if (!aktif.suHedefMl) { aktif.suHedefMl = Math.round((aktif.girdi.kilo * 33) / 250) * 250; }
        }

        function suEkle(deger) {
            let aktif = aktifProfiliGetir();
            suGunKontrol(aktif);
            aktif.su.miktar = Math.max(0, aktif.su.miktar + deger);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            arayuzGuncelle();
            if (deger > 0) bildirGoster('💧 ' + mlGoster(deger) + ' eklendi');
        }

        // FAZ 17 — İçecek Günlüğü: su takibinin genişletilmiş hali. Su'nun KENDİSİNE
        // (aktif.su, suEkle, suHedefMl) DOKUNMUYOR — bu sadece su DIŞINDAKİ içecekleri
        // ayrıca kaydeden, tarihe göre keyed bağımsız bir modül.
        const ICECEK_ADLARI = { cay: 'Çay', kahve_filtre: 'Kahve (filtre)', kahve_espresso: 'Kahve (espresso)', enerji: 'Enerji İçeceği', gazli: 'Gazlı İçecek', diger: 'Diğer' };
        const ICECEK_KAFEIN_100ML = { cay: 20, kahve_filtre: 40, kahve_espresso: 212, enerji: 32, gazli: 10, diger: 0 };
        let icecekHedefTarih = bugununTarihi;
        function icecekGunluguAc(tarih) {
            icecekHedefTarih = tarih || bugununTarihi;
            document.getElementById('ig-miktar').value = '';
            icecekListeGuncelle();
            sayfaGoster('icecek-gunlugu-ekrani');
        }
        function icecekSuDegeriGetir(tarih) {
            const aktif = aktifProfiliGetir();
            if (tarih === bugununTarihi) return aktif.su.miktar || 0;
            const gun = (aktif.gecmis || []).find(g => g.tarih === tarih);
            return (gun && gun.su) || 0;
        }
        function icecekEkle() {
            const tur = document.getElementById('ig-tur').value;
            const miktar = parseFloat(document.getElementById('ig-miktar').value);
            if (!miktar || miktar <= 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }
            const aktif = aktifProfiliGetir();
            if (!aktif.icecekGunlugu) aktif.icecekGunlugu = {};
            if (!aktif.icecekGunlugu[icecekHedefTarih]) aktif.icecekGunlugu[icecekHedefTarih] = [];
            const kafein = Math.round((ICECEK_KAFEIN_100ML[tur] || 0) / 100 * miktar);
            aktif.icecekGunlugu[icecekHedefTarih].push({ id: benzersizId(), tur: tur, miktar: miktar, kafein: kafein });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('ig-miktar').value = '';
            bildirGoster('🥤 ' + (ICECEK_ADLARI[tur] || tur) + ' eklendi');
            icecekListeGuncelle();
        }
        function icecekSil(id) {
            const aktif = aktifProfiliGetir();
            const liste = (aktif.icecekGunlugu && aktif.icecekGunlugu[icecekHedefTarih]) || [];
            const eskiIndex = liste.findIndex(x => x.id == id);
            const silinen = liste[eskiIndex];
            if (!silinen) return;
            aktif.icecekGunlugu[icecekHedefTarih] = liste.filter(x => x.id != id);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            icecekListeGuncelle();
            bildirGoster('İçecek silindi', null, () => {
                const g = aktifProfiliGetir();
                if (!g.icecekGunlugu) g.icecekGunlugu = {};
                if (!g.icecekGunlugu[icecekHedefTarih]) g.icecekGunlugu[icecekHedefTarih] = [];
                g.icecekGunlugu[icecekHedefTarih].splice(Math.min(eskiIndex, g.icecekGunlugu[icecekHedefTarih].length), 0, silinen);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                icecekListeGuncelle();
            });
        }
        function icecekListeGuncelle() {
            const liste1 = document.getElementById('ig-liste');
            if (!liste1) return;
            const aktif = aktifProfiliGetir();
            const gunun = (aktif.icecekGunlugu && aktif.icecekGunlugu[icecekHedefTarih]) || [];
            if (gunun.length === 0) {
                liste1.innerHTML = '<div class="bos-durum">Henüz içecek eklenmedi.</div>';
            } else {
                liste1.innerHTML = gunun.map(i =>
                    '<div class="mini-satir"><span>' + esc(ICECEK_ADLARI[i.tur] || i.tur) + ' — ' + i.miktar + ' ml' + (i.kafein ? ' · ' + i.kafein + ' mg kafein' : '') + '</span><span class="durum-ikon" style="color:#ff8a8a; cursor:pointer;" onclick="icecekSil(\'' + i.id + '\')">' + ikon('sil', 14) + '</span></div>'
                ).join('');
            }
            const suMiktar = icecekSuDegeriGetir(icecekHedefTarih);
            const icecekToplamMl = gunun.reduce((t, i) => t + i.miktar, 0);
            const toplamKafein = gunun.reduce((t, i) => t + i.kafein, 0);
            document.getElementById('ig-ozet').innerText = 'Toplam Sıvı: ' + (suMiktar + icecekToplamMl) + ' ml (Su: ' + suMiktar + ' ml + Diğer: ' + icecekToplamMl + ' ml) · Toplam Kafein: ' + toplamKafein + ' mg';
        }

        function suHedefDuzenleAc() {
            document.getElementById('su-hedef-alani').classList.toggle('gizli');
        }

        function suHedefKaydet() {
            let aktif = aktifProfiliGetir();
            let deger = parseInt(document.getElementById('su-hedef-input').value);
            if (!deger || deger <= 0) { bildirGoster('Geçerli bir hedef gir', 'hata'); return; }
            aktif.suHedefMl = deger;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('su-hedef-input').value = '';
            document.getElementById('su-hedef-alani').classList.add('gizli');
            arayuzGuncelle();
            bildirGoster('💧 Su hedefi güncellendi');
        }

        // FAZ 7: Özel su miktarı — suHedef akışıyla aynı desen (aç/kapat input + kaydet)
        function suOzelMiktarDuzenleAc() {
            const alan = document.getElementById('su-ozel-alani');
            const input = document.getElementById('su-ozel-input');
            if (input && aktifProfiliGetir().suOzelMiktar) input.value = aktifProfiliGetir().suOzelMiktar;
            alan.classList.toggle('gizli');
        }

        function suOzelMiktarKaydet() {
            let aktif = aktifProfiliGetir();
            let deger = parseInt(document.getElementById('su-ozel-input').value);
            if (!deger || deger <= 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }
            aktif.suOzelMiktar = deger;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('su-ozel-input').value = '';
            document.getElementById('su-ozel-alani').classList.add('gizli');
            suOzelButonGuncelle(aktif);
            bildirGoster('💧 Özel su miktarı güncellendi');
        }

        function suOzelButonGuncelle(aktif) {
            const yer = document.getElementById('su-ozel-buton-alani');
            if (!yer) return;
            if (aktif.suOzelMiktar) {
                // Buton metni gösterim amaçlı biçimlenir; suEkle()'ye geçilen değer HER ZAMAN ml'dir
                yer.innerHTML = `<button class="btn-kucuk" onclick="suEkle(${parseInt(aktif.suOzelMiktar, 10)})" title="Düzenlemek için kalem simgesine dokun">+ ${mlGoster(parseInt(aktif.suOzelMiktar, 10))}</button>`
                    + `<button class="btn-ikincil btn-kucuk su-ozel-duzenle" style="width:auto; flex:0 0 auto; padding:9px 10px;" onclick="suOzelMiktarDuzenleAc()" aria-label="Özel miktarı düzenle">${ikon('duzenle', 14)}</button>`;
            } else {
                yer.innerHTML = '<span class="hedef-yazi su-ozel-link" style="margin-top:0; cursor:pointer; text-decoration:underline;" onclick="suOzelMiktarDuzenleAc()">+ Özel Miktar Tanımla</span>';
            }
        }

        // BUGÜNKÜ AKTİVİTE (adım) — profildeki ortalamadan sapmayı kalori hedefine ekler
        function gunTipiRozetGoster(aktif) {
            const alan = document.getElementById('gun-tipi-rozet-alani');
            if (!alan) return;
            const antrenmanGunleri = (aktif.girdi && aktif.girdi.antrenmanGunleri) || [];
            if (antrenmanGunleri.length === 0) { alan.innerHTML = ''; return; }
            const bugunIndex = new Date().getDay();
            const antrenmanGunuMu = antrenmanGunleri.includes(bugunIndex);
            alan.innerHTML = antrenmanGunuMu
                ? '<span class="gun-tipi-rozet antrenman">🏋️ Antrenman Günü</span>'
                : '<span class="gun-tipi-rozet dinlenme">🛋️ Dinlenme Günü</span>';
        }

        function bugunAktiviteGetir(aktif) {
            return (aktif.gunlukAktivite && aktif.gunlukAktivite[bugununTarihi]) || null;
        }

        function ortalamaGunlukAdim(adimFaktor) {
            // adımFaktor seçeneklerinin orta noktalarına kabaca karşılık gelir
            const tablo = { 1.15: 2000, 1.2: 5500, 1.275: 8500, 1.35: 11250, 1.425: 13000 };
            let enYakin = Object.keys(tablo).reduce((a, b) => Math.abs(b - adimFaktor) < Math.abs(a - adimFaktor) ? b : a);
            return tablo[enYakin];
        }

        // FAZ 8 — tarih parametresi opsiyoneldir, varsayılanı bugün: ana ekrandaki parametresiz
        // çağrılar eski davranışı birebir korur, Gün Detayı ise gunDetayAktifTarih geçirir.
        function bugunAdimKaydet(tarih = bugununTarihi) {
            let aktif = aktifProfiliGetir();
            // FAZ 15 — Gün Detayı'nda da adım girilebilsin diye, o ekran açıkken
            // gd-adim-input'tan okunur; aksi halde ana ekrandaki bugun-adim-input'tan.
            const gdEkrani = document.getElementById('gun-detay-ekrani');
            const gdInput = document.getElementById('gd-adim-input');
            const gdAcik = gdEkrani && !gdEkrani.classList.contains('gizli');
            const inputEl = (gdAcik && gdInput) ? gdInput : document.getElementById('bugun-adim-input');
            let deger = parseFloat(inputEl.value);
            if (!aktif.gunlukAktivite) aktif.gunlukAktivite = {};
            let mevcut = aktif.gunlukAktivite[tarih] || {};
            if (!deger || deger < 0) {
                delete mevcut.adim;
                bildirGoster(tarih === bugununTarihi ? 'Bugünkü adım kaydı temizlendi, ortalama kullanılacak' : 'Adım kaydı temizlendi, ortalama kullanılacak');
            } else {
                mevcut.adim = deger;
                bildirGoster('👟 Adım kaydedildi (' + formatTarihKisa(tarih) + ')');
            }
            aktif.gunlukAktivite[tarih] = mevcut;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            if (tarih === bugununTarihi) arayuzGuncelle();
            if (gdAcik) gunDetayGuncelle();
        }

        function bugunEgzersizAlaniAcKapa() {
            document.getElementById('bugun-egzersiz-form').classList.toggle('gizli');
        }

        function bugunEgzersizEkle(tarih = bugununTarihi) {
            let aktif = aktifProfiliGetir();
            let tip = document.getElementById('beg-tip').value;
            let sure = parseFloat(document.getElementById('beg-sure').value);
            if (!sure || sure <= 0) { bildirGoster('Geçerli bir süre gir', 'hata'); return; }
            if (!aktif.gunlukAktivite) aktif.gunlukAktivite = {};
            let mevcut = aktif.gunlukAktivite[tarih] || {};
            if (!mevcut.egzersizler) mevcut.egzersizler = [];
            mevcut.egzersizler.push({ id: benzersizId(), tip: tip, sure: sure });
            aktif.gunlukAktivite[tarih] = mevcut;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('beg-sure').value = '';
            document.getElementById('bugun-egzersiz-form').classList.add('gizli');
            bildirGoster('🏋️ Egzersiz eklendi (' + formatTarihKisa(tarih) + ')');
            if (tarih === bugununTarihi) arayuzGuncelle(); else gunDetayGuncelle();
        }

        // Günlük egzersiz durumu: 'yapildi' | 'planli_degil' | 'yapmadi'
        function bugunEgzersizDurumAyarla(durum, tarih = bugununTarihi) {
            let aktif = aktifProfiliGetir();
            if (!aktif.gunlukAktivite) aktif.gunlukAktivite = {};
            let mevcut = aktif.gunlukAktivite[tarih] || {};
            mevcut.durum = durum;
            aktif.gunlukAktivite[tarih] = mevcut;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            if (tarih === bugununTarihi) arayuzGuncelle(); else gunDetayGuncelle();
        }

        function bugunEgzersizSil(id, tarih = bugununTarihi) {
            let aktif = aktifProfiliGetir();
            let mevcut = aktif.gunlukAktivite && aktif.gunlukAktivite[tarih];
            if (!mevcut || !mevcut.egzersizler) return;
            const eskiIndex = mevcut.egzersizler.findIndex(e => e.id == id);
            const silinen = mevcut.egzersizler[eskiIndex];
            if (!silinen) return;
            mevcut.egzersizler = mevcut.egzersizler.filter(e => e.id != id);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            if (tarih === bugununTarihi) arayuzGuncelle(); else gunDetayGuncelle();
            bildirGoster('🏋️ Egzersiz silindi', null, () => {
                let m = aktif.gunlukAktivite && aktif.gunlukAktivite[tarih];
                if (!m) return;
                if (!m.egzersizler) m.egzersizler = [];
                m.egzersizler.splice(Math.min(eskiIndex, m.egzersizler.length), 0, silinen);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                if (tarih === bugununTarihi) arayuzGuncelle(); else gunDetayGuncelle();
            });
        }

        const egzersizAdlari = { agirlik: 'Ağırlık', kosu: 'Koşu', futbol: 'Futbol', bisiklet: 'Bisiklet', kardiyo: 'Kardiyo', karisik: 'Karışık' };

        // FAZ 17 — Egzersiz Kütüphanesi: besin kütüphanesinin egzersiz karşılığı.
        // Her hareketin kendi MET değeri var; kcal = (met * 3.5 * kilo / 200) * dakika
        // (mevcut egzersizKcalHesapla ile AYNI formül, sadece metOverride ile besleniyor).
        // "kategori" alanı mevcut 6 "tip" değerinden biriyle AYNI (agirlik/kosu/futbol/
        // bisiklet/kardiyo/karisik) — yeni bir sınıflandırma sistemi İCAT EDİLMEDİ,
        // geriye dönük uyumluluk ve istatistik tutarlılığı için.
        // FAZ 17 — Egzersiz Kütüphanesi: besin kütüphanesinin egzersiz karşılığı.
        // Her hareketin kendi MET değeri var; kcal = (met * 3.5 * kilo / 200) * dakika
        // (mevcut egzersizKcalHesapla ile AYNI formül, sadece metOverride ile besleniyor).
        // "kategori" alanı mevcut 6 "tip" değerinden biriyle AYNI (agirlik/kosu/futbol/
        // bisiklet/kardiyo/karisik) — yeni bir sınıflandırma sistemi İCAT EDİLMEDİ,
        // geriye dönük uyumluluk ve istatistik tutarlılığı için. "kasGrubu" alanı ise
        // SADECE kütüphanede filtrelemek/gruplamak için, başka hiçbir hesaba katılmıyor.
        const EGZERSIZ_KUTUPHANESI = [
            // Göğüs
            { id: 1, ad: 'Bench Press', kategori: 'agirlik', met: 5.0, kasGrubu: 'Göğüs' },
            { id: 2, ad: 'Incline Bench Press', kategori: 'agirlik', met: 5.0, kasGrubu: 'Göğüs' },
            { id: 3, ad: 'Decline Bench Press', kategori: 'agirlik', met: 5.0, kasGrubu: 'Göğüs' },
            { id: 4, ad: 'Dumbbell Fly', kategori: 'agirlik', met: 4.0, kasGrubu: 'Göğüs' },
            { id: 5, ad: 'Şınav (Push-up)', kategori: 'agirlik', met: 3.8, kasGrubu: 'Göğüs' },
            { id: 6, ad: 'Cable Crossover', kategori: 'agirlik', met: 4.0, kasGrubu: 'Göğüs' },
            { id: 7, ad: 'Chest Dip', kategori: 'agirlik', met: 6.0, kasGrubu: 'Göğüs' },
            // Sırt
            { id: 8, ad: 'Deadlift', kategori: 'agirlik', met: 6.0, kasGrubu: 'Sırt' },
            { id: 9, ad: 'Barfiks (Pull-up)', kategori: 'agirlik', met: 8.0, kasGrubu: 'Sırt' },
            { id: 10, ad: 'Lat Pulldown', kategori: 'agirlik', met: 4.5, kasGrubu: 'Sırt' },
            { id: 11, ad: 'Bent-over Row', kategori: 'agirlik', met: 5.0, kasGrubu: 'Sırt' },
            { id: 12, ad: 'Seated Cable Row', kategori: 'agirlik', met: 4.5, kasGrubu: 'Sırt' },
            { id: 13, ad: 'T-Bar Row', kategori: 'agirlik', met: 5.0, kasGrubu: 'Sırt' },
            { id: 14, ad: 'Face Pull', kategori: 'agirlik', met: 3.5, kasGrubu: 'Sırt' },
            { id: 15, ad: 'Hyperextension', kategori: 'agirlik', met: 4.0, kasGrubu: 'Sırt' },
            // Bacak
            { id: 16, ad: 'Squat', kategori: 'agirlik', met: 5.0, kasGrubu: 'Bacak' },
            { id: 17, ad: 'Leg Press', kategori: 'agirlik', met: 5.0, kasGrubu: 'Bacak' },
            { id: 18, ad: 'Lunge', kategori: 'agirlik', met: 4.0, kasGrubu: 'Bacak' },
            { id: 19, ad: 'Bulgarian Split Squat', kategori: 'agirlik', met: 4.5, kasGrubu: 'Bacak' },
            { id: 20, ad: 'Leg Extension', kategori: 'agirlik', met: 3.5, kasGrubu: 'Bacak' },
            { id: 21, ad: 'Leg Curl', kategori: 'agirlik', met: 3.5, kasGrubu: 'Bacak' },
            { id: 22, ad: 'Romanian Deadlift', kategori: 'agirlik', met: 5.5, kasGrubu: 'Bacak' },
            { id: 23, ad: 'Hip Thrust', kategori: 'agirlik', met: 4.5, kasGrubu: 'Bacak' },
            { id: 24, ad: 'Calf Raise', kategori: 'agirlik', met: 3.0, kasGrubu: 'Bacak' },
            // Omuz
            { id: 25, ad: 'Overhead Press', kategori: 'agirlik', met: 4.5, kasGrubu: 'Omuz' },
            { id: 26, ad: 'Arnold Press', kategori: 'agirlik', met: 4.5, kasGrubu: 'Omuz' },
            { id: 27, ad: 'Lateral Raise', kategori: 'agirlik', met: 3.0, kasGrubu: 'Omuz' },
            { id: 28, ad: 'Front Raise', kategori: 'agirlik', met: 3.0, kasGrubu: 'Omuz' },
            { id: 29, ad: 'Rear Delt Fly', kategori: 'agirlik', met: 3.0, kasGrubu: 'Omuz' },
            { id: 30, ad: 'Shrug', kategori: 'agirlik', met: 3.5, kasGrubu: 'Omuz' },
            // Kol
            { id: 31, ad: 'Barbell Curl', kategori: 'agirlik', met: 3.5, kasGrubu: 'Kol' },
            { id: 32, ad: 'Dumbbell Curl', kategori: 'agirlik', met: 3.5, kasGrubu: 'Kol' },
            { id: 33, ad: 'Hammer Curl', kategori: 'agirlik', met: 3.5, kasGrubu: 'Kol' },
            { id: 34, ad: 'Tricep Pushdown', kategori: 'agirlik', met: 3.5, kasGrubu: 'Kol' },
            { id: 35, ad: 'Overhead Tricep Extension', kategori: 'agirlik', met: 3.5, kasGrubu: 'Kol' },
            { id: 36, ad: 'Skull Crusher', kategori: 'agirlik', met: 3.5, kasGrubu: 'Kol' },
            { id: 37, ad: 'Close-Grip Bench Press', kategori: 'agirlik', met: 5.0, kasGrubu: 'Kol' },
            // Karın / Core
            { id: 38, ad: 'Plank', kategori: 'agirlik', met: 3.8, kasGrubu: 'Karın' },
            { id: 39, ad: 'Mekik (Sit-up)', kategori: 'agirlik', met: 3.8, kasGrubu: 'Karın' },
            { id: 40, ad: 'Crunch', kategori: 'agirlik', met: 3.5, kasGrubu: 'Karın' },
            { id: 41, ad: 'Russian Twist', kategori: 'agirlik', met: 4.0, kasGrubu: 'Karın' },
            { id: 42, ad: 'Leg Raise', kategori: 'agirlik', met: 3.8, kasGrubu: 'Karın' },
            { id: 43, ad: 'Hanging Leg Raise', kategori: 'agirlik', met: 5.0, kasGrubu: 'Karın' },
            { id: 44, ad: 'Ab Wheel Rollout', kategori: 'agirlik', met: 4.5, kasGrubu: 'Karın' },
            { id: 45, ad: 'Mountain Climber', kategori: 'kardiyo', met: 8.0, kasGrubu: 'Karın' },
            // Kardiyo
            { id: 46, ad: 'Koşu (hafif tempo)', kategori: 'kosu', met: 8.0, kasGrubu: 'Kardiyo' },
            { id: 47, ad: 'Koşu (hızlı tempo)', kategori: 'kosu', met: 11.0, kasGrubu: 'Kardiyo' },
            { id: 48, ad: 'Yürüyüş (tempolu)', kategori: 'kardiyo', met: 4.3, kasGrubu: 'Kardiyo' },
            { id: 49, ad: 'Bisiklet (orta tempo)', kategori: 'bisiklet', met: 7.5, kasGrubu: 'Kardiyo' },
            { id: 50, ad: 'Yüzme', kategori: 'kardiyo', met: 7.0, kasGrubu: 'Kardiyo' },
            { id: 51, ad: 'İp Atlama', kategori: 'kardiyo', met: 11.8, kasGrubu: 'Kardiyo' },
            { id: 52, ad: 'Merdiven Çıkma', kategori: 'kardiyo', met: 8.8, kasGrubu: 'Kardiyo' },
            { id: 53, ad: 'Eliptik Bisiklet', kategori: 'kardiyo', met: 5.0, kasGrubu: 'Kardiyo' },
            { id: 54, ad: 'Rowing Machine (Kürek)', kategori: 'kardiyo', met: 7.0, kasGrubu: 'Kardiyo' },
            { id: 55, ad: 'Burpee', kategori: 'kardiyo', met: 8.0, kasGrubu: 'Kardiyo' },
            // Spor
            { id: 56, ad: 'Basketbol', kategori: 'futbol', met: 6.5, kasGrubu: 'Spor' },
            { id: 57, ad: 'Tenis', kategori: 'futbol', met: 7.3, kasGrubu: 'Spor' },
            { id: 58, ad: 'Futbol', kategori: 'futbol', met: 7.0, kasGrubu: 'Spor' },
            // Esneklik
            { id: 59, ad: 'Yoga', kategori: 'karisik', met: 2.5, kasGrubu: 'Esneklik' },
            { id: 60, ad: 'Pilates', kategori: 'karisik', met: 3.0, kasGrubu: 'Esneklik' },
            { id: 61, ad: 'Stretching', kategori: 'karisik', met: 2.3, kasGrubu: 'Esneklik' }
        ];
        let egzKutupHedefTarih = null;
        let egzKutupGeriEkran = 'ana-ekran';
        let egzKutupMod = 'gunluk'; // 'gunluk' (o gün doğrudan günlüğe) | 'plan' (antrenman planına)
        let egzKutupSecili = null;
        // Filtre durumunu varsayılana döndürür — kütüphane her açılışta temiz başlasın.
        function egzersizKutuphaneFiltreSifirla() {
            ekUstKategori = 'tumu';
            ekAltGrup = '';
            document.querySelectorAll('#ek-ust-sekmeler .sekme-btn').forEach((b, i) => b.classList.toggle('aktif', i === 0));
            const altAlan = document.getElementById('ek-alt-sekmeler');
            if (altAlan) {
                altAlan.classList.add('gizli');
                altAlan.querySelectorAll('.sekme-btn').forEach((b, i) => b.classList.toggle('aktif', i === 0));
            }
        }
        function egzersizKutuphaneAc(tarih, geriEkran) {
            egzKutupHedefTarih = tarih || bugununTarihi;
            egzKutupGeriEkran = geriEkran || 'ana-ekran';
            egzKutupMod = 'gunluk';
            egzKutupSecili = null;
            document.getElementById('ek-arama').value = '';
            document.getElementById('ek-ekle-karti').classList.add('gizli');
            egzersizKutuphaneFiltreSifirla();
            egzersizKutuphaneListele();
            sayfaGoster('egzersiz-kutuphane-ekrani');
        }
        function egzersizKutuphaneGeriDon() {
            sayfaGoster(egzKutupGeriEkran || 'ana-ekran');
        }
        function egzersizKutuphaneListele() {
            const arama = (document.getElementById('ek-arama').value || '').toLocaleLowerCase('tr-TR');
            let liste = arama ? EGZERSIZ_KUTUPHANESI.filter(e => besinEslesiyorMu(e.ad, arama)) : EGZERSIZ_KUTUPHANESI;
            if (ekUstKategori === 'gym') {
                liste = liste.filter(e => EK_GYM_GRUPLARI.includes(e.kasGrubu));
                if (ekAltGrup) liste = liste.filter(e => e.kasGrubu === ekAltGrup);
            } else if (ekUstKategori !== 'tumu') {
                liste = liste.filter(e => e.kasGrubu === ekUstKategori);
            }
            const alan = document.getElementById('ek-liste');
            alan.innerHTML = liste.map(e =>
                '<div class="liste-elemani" style="cursor:pointer; padding:11px 13px;" onclick="egzersizKutuphaneSec(' + e.id + ')"><strong>' + esc(e.ad) + '</strong><span class="liste-detay">' + esc(e.kasGrubu || egzersizAdlari[e.kategori] || e.kategori) + '</span></div>'
            ).join('');
        }
        // FAZ 17 — Egzersiz Kütüphanesi 2 aşamalı filtre: önce Tümü/Gym/Kardiyo/Spor/
        // Esneklik, "Gym" seçilirse altına kas grubu (Göğüs/Sırt/Bacak/Omuz/Kol/Karın) çıkar.
        const EK_GYM_GRUPLARI = ['Göğüs', 'Sırt', 'Bacak', 'Omuz', 'Kol', 'Karın'];
        let ekUstKategori = 'tumu';
        let ekAltGrup = '';
        function egzersizUstKategoriSec(kategori, btn) {
            ekUstKategori = kategori;
            ekAltGrup = '';
            document.querySelectorAll('#ek-ust-sekmeler .sekme-btn').forEach(b => b.classList.remove('aktif'));
            if (btn) btn.classList.add('aktif');
            const altAlan = document.getElementById('ek-alt-sekmeler');
            altAlan.classList.toggle('gizli', kategori !== 'gym');
            altAlan.querySelectorAll('.sekme-btn').forEach((b, i) => b.classList.toggle('aktif', i === 0));
            egzersizKutuphaneListele();
        }
        function egzersizAltGrupSec(grup, btn) {
            ekAltGrup = grup;
            document.querySelectorAll('#ek-alt-sekmeler .sekme-btn').forEach(b => b.classList.remove('aktif'));
            if (btn) btn.classList.add('aktif');
            egzersizKutuphaneListele();
        }
        function egzersizKutuphaneSec(id) {
            egzKutupSecili = EGZERSIZ_KUTUPHANESI.find(e => e.id === id);
            if (!egzKutupSecili) return;
            document.getElementById('ek-secili-ad').innerText = egzKutupSecili.ad;
            document.getElementById('ek-sure').value = '';
            document.getElementById('ek-not').value = '';
            document.getElementById('ek-ekle-karti').classList.remove('gizli');
        }
        // Gerçek günlüğe (gunlukAktivite) yazan çekirdek — hem doğrudan ekleme hem
        // antrenman planından "Yaptım" işaretlemesi AYNI fonksiyonu kullanır.
        function egzersizGunlugeEkleCekirdek(tarih, hareketAdi, kategori, met, sure) {
            const aktif = aktifProfiliGetir();
            if (!aktif.gunlukAktivite) aktif.gunlukAktivite = {};
            let mevcut = aktif.gunlukAktivite[tarih] || {};
            if (!mevcut.egzersizler) mevcut.egzersizler = [];
            mevcut.egzersizler.push({ id: benzersizId(), tip: kategori, sure: sure, met: met, hareketAdi: hareketAdi });
            aktif.gunlukAktivite[tarih] = mevcut;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            if (tarih === bugununTarihi) arayuzGuncelle();
        }
        function egzersizKutuphaneEkle() {
            if (!egzKutupSecili) { bildirGoster('Önce bir hareket seç', 'hata'); return; }
            const sure = parseFloat(document.getElementById('ek-sure').value);
            if (!sure || sure <= 0) { bildirGoster('Geçerli bir süre gir', 'hata'); return; }
            const not1 = (document.getElementById('ek-not').value || '').trim();
            const tarih = egzKutupHedefTarih || bugununTarihi;
            const ad = egzKutupSecili.ad + (not1 ? ' (' + not1 + ')' : '');

            if (egzKutupMod === 'plan') {
                const aktif = aktifProfiliGetir();
                if (!aktif.antrenmanPlani) aktif.antrenmanPlani = [];
                aktif.antrenmanPlani.push({
                    id: benzersizId(), tarih: tarih, hareketAdi: ad,
                    kategori: egzKutupSecili.kategori, met: egzKutupSecili.met, sure: sure, durum: 'bekliyor'
                });
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                bildirGoster('📅 ' + egzKutupSecili.ad + ' plana eklendi (' + formatTarihKisa(tarih) + ')');
                if (tarih === bugununTarihi) arayuzGuncelle();
                sayfaGoster('plan-ekrani');
                return;
            }

            egzersizGunlugeEkleCekirdek(tarih, ad, egzKutupSecili.kategori, egzKutupSecili.met, sure);
            bildirGoster('🏋️ ' + egzKutupSecili.ad + ' eklendi (' + formatTarihKisa(tarih) + ')');
            if (egzKutupGeriEkran === 'gun-detay-ekrani') gunDetayGuncelle();
            sayfaGoster(egzKutupGeriEkran);
        }

        // ══════════ FAZ 17: ANTRENMAN PROGRAMI PLANLAYICI ══════════
        // Plan & Market ekranındaki "Antrenman" sekmesi — Egzersiz Kütüphanesi'nin
        // üstüne inşa edilir, Plan'ın (öğün) egzersiz karşılığıdır.
        function antrenmanPlaniCiz() {
            const alan = document.getElementById('antrenman-gunler-alani');
            if (!alan) return;
            const aktif = aktifProfiliGetir();
            const planlar = aktif.antrenmanPlani || [];
            let html = '';
            for (let i = 0; i < 7; i++) {
                const d = tarihToDate(bugununTarihi);
                d.setDate(d.getDate() + i);
                const tarih = d.toLocaleDateString('tr-TR');
                const bugunMu = i === 0;
                const gunKayitlari = planlar.filter(k => k.tarih === tarih);
                html += `<div class="kart kart-kompakt" style="margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="font-size:15px;">${gunAdlari[d.getDay()]}${bugunMu ? ' (Bugün)' : ''}</strong>
                        <span class="hedef-yazi" style="margin-top:0;">${tarihEtiketKisa(tarih)}</span>
                    </div>`;
                if (gunKayitlari.length === 0) {
                    html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                        <span style="font-size:13px; color:var(--yazi-pasif); font-weight:600;">Planlanmadı</span>
                        <button class="btn-ikincil btn-kucuk" onclick="antrenmanSeciciAc('${tarih}')">+ Ekle</button>
                    </div>`;
                } else {
                    gunKayitlari.forEach(k => {
                        const yapildi = k.durum === 'yapildi';
                        html += `<div class="liste-elemani ${yapildi ? 'tamamlandi' : ''}" style="margin-top:6px; padding:10px 12px;">
                            <div>
                                <strong style="font-size:13.5px;">${esc(k.hareketAdi)}</strong>
                                <span class="liste-detay">${k.sure} dk · ${yapildi ? '✓ yapıldı' : '⏳ bekliyor'}</span>
                            </div>
                            <button class="btn-tehlike btn-kucuk" onclick="antrenmanKayitKaldir('${k.id}')">${ikon('sil', 13)} Kaldır</button>
                        </div>`;
                    });
                    html += `<div style="text-align:right; margin-top:6px;"><button class="btn-ikincil btn-kucuk" onclick="antrenmanSeciciAc('${tarih}')">+ Ekle</button></div>`;
                }
                html += `</div>`;
            }
            alan.innerHTML = html;
        }
        function antrenmanSeciciAc(tarih) {
            egzKutupHedefTarih = tarih;
            egzKutupGeriEkran = 'plan-ekrani';
            egzKutupMod = 'plan';
            egzKutupSecili = null;
            document.getElementById('ek-arama').value = '';
            document.getElementById('ek-ekle-karti').classList.add('gizli');
            egzersizKutuphaneFiltreSifirla();
            egzersizKutuphaneListele();
            sayfaGoster('egzersiz-kutuphane-ekrani');
        }
        function antrenmanKayitKaldir(id) {
            const aktif = aktifProfiliGetir();
            const eskiIndex = (aktif.antrenmanPlani || []).findIndex(x => x.id == id);
            const silinen = aktif.antrenmanPlani[eskiIndex];
            if (!silinen) return;
            aktif.antrenmanPlani = aktif.antrenmanPlani.filter(x => x.id != id);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            antrenmanPlaniCiz();
            anaAntrenmanKartiGuncelle(aktif);
            bildirGoster('Plan kaydı kaldırıldı', null, () => {
                if (!aktif.antrenmanPlani) aktif.antrenmanPlani = [];
                aktif.antrenmanPlani.splice(Math.min(eskiIndex, aktif.antrenmanPlani.length), 0, silinen);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                antrenmanPlaniCiz();
                anaAntrenmanKartiGuncelle(aktif);
            });
        }
        // Ana ekrandaki "Bugün için planlı antrenmanın var" kartı — sadece bugüne
        // ait ve henüz "yapıldı" işaretlenmemiş planlar için görünür.
        function anaAntrenmanKartiGuncelle(aktif) {
            const kart = document.getElementById('ana-antrenman-karti');
            if (!kart) return;
            const bugununPlanlari = (aktif.antrenmanPlani || []).filter(k => k.tarih === bugununTarihi && k.durum === 'bekliyor');
            if (bugununPlanlari.length === 0) {
                kart.innerHTML = '';
                kart.classList.add('gizli');
                return;
            }
            kart.classList.remove('gizli');
            kart.innerHTML = `
                <div class="kart" style="margin-bottom:18px;">
                    <h2 style="text-align:left; font-size:15px;">🏋️ Bugün için planlı antrenmanın var</h2>
                    ${bugununPlanlari.map(p => `
                        <div class="liste-elemani" style="margin-top:8px; padding:11px 13px;">
                            <div>
                                <strong style="font-size:13.5px;">${esc(p.hareketAdi)}</strong>
                                <span class="liste-detay">${p.sure} dk</span>
                            </div>
                            <div class="buton-grubu" style="margin:0; max-width:158px;">
                                <button class="btn-kucuk" onclick="antrenmanYapildiIsaretle('${p.id}')">Yaptım</button>
                                <button class="btn-ikincil btn-kucuk" onclick="antrenmanAtla('${p.id}')">Atla</button>
                            </div>
                        </div>`).join('')}
                </div>`;
        }
        function antrenmanYapildiIsaretle(id) {
            const aktif = aktifProfiliGetir();
            const p = (aktif.antrenmanPlani || []).find(x => x.id == id);
            if (!p) return;
            egzersizGunlugeEkleCekirdek(p.tarih, p.hareketAdi, p.kategori, p.met, p.sure);
            p.durum = 'yapildi';
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            bildirGoster('🏋️ ' + p.hareketAdi + ' günlüğe eklendi');
            anaAntrenmanKartiGuncelle(aktif);
            arayuzGuncelle();
        }
        function antrenmanAtla(id) {
            const aktif = aktifProfiliGetir();
            const p = (aktif.antrenmanPlani || []).find(x => x.id == id);
            if (!p) return;
            p.durum = 'atlandi';
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            anaAntrenmanKartiGuncelle(aktif);
        }

        function egzersizKcalHesapla(tip, sure, kilo, metOverride) {
            let met = (typeof metOverride === 'number' && metOverride > 0) ? metOverride : metDegeri(tip);
            let kcalDakika = (met * 3.5 * kilo) / 200;
            return kcalDakika * sure;
        }

        // Bugünkü aktiviteye göre kalori hedefini ayarlar (çifte sayım yapmadan — sadece ortalamadan/profil planından sapmanın etkisini ekler)
        function bugunkuHedefleriHesapla(aktif) {
            let bazKalori = aktif.kalori, bazPro = aktif.pro, bazYag = aktif.yag, bazKarb = aktif.karb;
            let bugunAktivite = bugunAktiviteGetir(aktif);
            let kilo = aktif.girdi.kilo;

            let adimAyar = 0, ortalamaAdim = null;
            if (bugunAktivite && bugunAktivite.adim) {
                ortalamaAdim = ortalamaGunlukAdim(aktif.girdi.adimFaktor);
                let sapmaAdim = bugunAktivite.adim - ortalamaAdim;
                // Kabaca: 1000 ekstra adım ≈ 40 kcal ekstra yakım (basit, muhafazakâr bir tahmin)
                adimAyar = Math.round((sapmaAdim * 0.04) / 10) * 10;
            }

            let egzersizAyar = 0;
            let egzersizListesi = (bugunAktivite && bugunAktivite.egzersizler) || [];
            if (egzersizListesi.length > 0) {
                // Bugün gerçekten yapılan egzersizin toplam kalorisi
                let bugunToplamKcal = egzersizListesi.reduce((t, e) => t + egzersizKcalHesapla(e.tip, e.sure, kilo, e.met), 0);
                // Profildeki planlanan günlük ortalama egzersiz kalorisi (zaten baz hedefin içinde) — farkı ekle, çifte sayma yapma
                let planliGunlukKcal = 0;
                if (aktif.girdi.egzGun > 0) {
                    let planliKcalDakika = (metDegeri(aktif.girdi.egzTip) * 3.5 * kilo) / 200;
                    planliGunlukKcal = (planliKcalDakika * aktif.girdi.egzSure * aktif.girdi.egzGun) / 7;
                }
                egzersizAyar = Math.round((bugunToplamKcal - planliGunlukKcal) / 10) * 10;
            }

            let toplamAyar = adimAyar + egzersizAyar;
            if (toplamAyar === 0) {
                return { kalori: bazKalori, pro: bazPro, yag: bazYag, karb: bazKarb, ayar: 0, adim: bugunAktivite ? bugunAktivite.adim : null, ortalamaAdim: ortalamaAdim, egzersizler: egzersizListesi };
            }

            // Aşırı uçlara gitmesin diye hedefin +-%25'iyle sınırla
            let sinir = Math.round(bazKalori * 0.25);
            toplamAyar = Math.max(-sinir, Math.min(sinir, toplamAyar));
            let yeniKalori = bazKalori + toplamAyar;
            let yeniKarb = Math.max(0, bazKarb + Math.round(toplamAyar / 4));
            return { kalori: yeniKalori, pro: bazPro, yag: bazYag, karb: yeniKarb, ayar: toplamAyar, adim: bugunAktivite ? bugunAktivite.adim : null, ortalamaAdim: ortalamaAdim, egzersizler: egzersizListesi };
        }

        // ORTAK HAFTALIK KİLO HIZI — kilo ekranı (14 gün) ve kalibrasyon kartı (21 gün)
        // aynı mantığı kullanır: son gunPenceresi günün kayıtlarına 7 günlük hareketli
        // ortalama uygular, yumuşatılmış ilk/son değer farkını güne bölüp haftalık hıza çevirir.
        // En az 2 kayıt yoksa null döner.
        function haftalikKiloHiziHesapla(kiloKayitlari, gunPenceresi) {
            if (!kiloKayitlari || kiloKayitlari.length < 2) return null;
            const simdi = tarihToDate(bugununTarihi);
            const pencereKayitlari = [...kiloKayitlari]
                .sort((a, b) => tarihToDate(a.tarih) - tarihToDate(b.tarih))
                .filter(g => (simdi - tarihToDate(g.tarih)) <= gunPenceresi * 86400000);
            if (pencereKayitlari.length < 2) return null;
            const kiloDegerleri = pencereKayitlari.map(g => g.kilo);
            const yumusatici = hareketliOrtalama(kiloDegerleri, 7);
            const gunFarki = Math.max(1, (tarihToDate(pencereKayitlari[pencereKayitlari.length - 1].tarih) - tarihToDate(pencereKayitlari[0].tarih)) / 86400000);
            return (yumusatici[yumusatici.length - 1] - yumusatici[0]) / gunFarki * 7;
        }

        // OTOMATİK KALİBRASYON ÖNERİSİ — 7 günlük hareketli ortalama kullanır
        function kalibrasyonKontrolEt() {
            let aktif = aktifProfiliGetir();
            const kartEl = document.getElementById('kalibrasyon-karti');
            if (!aktif.kiloGecmisi || aktif.kiloGecmisi.length < 4) { kartEl.classList.add('gizli'); return; }

            const simdi = tarihToDate(bugununTarihi);
            const ilgiliKayitlar = [...aktif.kiloGecmisi]
                .sort((a, b) => tarihToDate(a.tarih) - tarihToDate(b.tarih))
                .filter(g => (simdi - tarihToDate(g.tarih)) <= 21 * 86400000);
            if (ilgiliKayitlar.length < 4) { kartEl.classList.add('gizli'); return; }

            const ilkKayit = ilgiliKayitlar[0], sonKayit = ilgiliKayitlar[ilgiliKayitlar.length - 1];
            const gunFarki = Math.max(1, Math.round((tarihToDate(sonKayit.tarih) - tarihToDate(ilkKayit.tarih)) / 86400000));
            if (gunFarki < 10) { kartEl.classList.add('gizli'); return; }

            // 7 günlük hareketli ortalama ile gürültüyü (su/ödem dalgalanması) azalt
            // (ortak haftalikKiloHiziHesapla fonksiyonuyla aynı mantık, kilo ekranıyla tutarlı)
            const kiloDegisimHizi = haftalikKiloHiziHesapla(aktif.kiloGecmisi, 21);
            if (kiloDegisimHizi === null) { kartEl.classList.add('gizli'); return; }
            const kiloDegisim = kiloDegisimHizi / 7 * gunFarki;

            const araligaGirenGunler = aktif.gecmis.filter(g => {
                const t = tarihToDate(g.tarih);
                return t >= tarihToDate(ilkKayit.tarih) && t <= tarihToDate(sonKayit.tarih);
            });
            if (araligaGirenGunler.length < 5) { kartEl.classList.add('gizli'); return; }

            const ortalamaAlinanKalori = araligaGirenGunler.reduce((t, g) => t + g.veriler.reduce((tt, x) => tt + parseFloat(x.cal), 0), 0) / araligaGirenGunler.length;
            const gercekTDEE = ortalamaAlinanKalori - (kiloDegisim * 7700 / gunFarki);
            const hedefCarpan = aktif.girdi.hedef === 'kayip' ? 0.85 : (aktif.girdi.hedef === 'kazanim' ? 1.075 : 1);
            const oneriKalori = Math.round(gercekTDEE * hedefCarpan / 10) * 10;

            if (Math.abs(oneriKalori - aktif.kalori) < 100 || !isFinite(oneriKalori) || oneriKalori <= 0) { kartEl.classList.add('gizli'); return; }

            document.getElementById('kalibrasyon-metni').innerText = 'Son ' + gunFarki + ' günün 7 günlük hareketli ortalamasına göre gerçek kalori ihtiyacın hesaplanan hedeften farklı görünüyor. Hedefini ' + aktif.kalori + ' yerine ~' + oneriKalori + ' kcal olarak güncellemek ister misin?';
            kartEl.dataset.oneri = oneriKalori;
            // FAZ 11 — kart ilk kez gizli'den çıkarılırken TEK SEFERLİK açıklama göster.
            // Kartın/mantığın kendisi değişmeden kalır; sadece ilk karşılaşmada bilgilendirir.
            if (kartEl.classList.contains('gizli') && localStorage.getItem('df_kalibrasyon_aciklama_gosterildi') !== '1') {
                modalUyari('🎯 Kalibrasyon Nedir?',
                    'Kalibrasyon, Nutrio\'nun hedefini gerçek verilerine göre ince ayarlamasıdır: yediklerin ve kilo değişimin üzerinden gerçek kalori ihtiyacın hesaplanır, hedefin gerekiyorsa güncellenir. Ne kadar kilo alıp verdiğini ve günlük kalorini kaydettikçe bu öneriler zamanla daha isabetli hale gelir.');
                localStorage.setItem('df_kalibrasyon_aciklama_gosterildi', '1');
            }
            kartEl.classList.remove('gizli');
        }

        function kalibrasyonUygula() {
            let aktif = aktifProfiliGetir();
            const yeniKalori = parseInt(document.getElementById('kalibrasyon-karti').dataset.oneri);
            aktif.kalori = yeniKalori;
            aktif.karb = Math.max(0, Math.round((yeniKalori - (aktif.pro * 4) - (aktif.yag * 9)) / 4));
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('kalibrasyon-karti').classList.add('gizli');
            arayuzGuncelle();
            bildirGoster('🎯 Kalori hedefi güncellendi');
        }

        function kalibrasyonReddet() {
            document.getElementById('kalibrasyon-karti').classList.add('gizli');
        }

        // "BUGÜN NE YİYEBİLİRİM" ÖNERİSİ — kalanı kapatmak için birden fazla seçenek üretir
        function oneriKombinasyonuHesapla(proteinKaynagi, karbKaynagi, kalanKcal, kalanPro) {
            let hedefProtein = kalanPro * 0.6;
            let proteinMiktar = Math.round((hedefProtein / proteinKaynagi.pro) * proteinKaynagi.ref / 10) * 10;
            if (proteinMiktar <= 0) proteinMiktar = proteinKaynagi.ref;
            let proteinCarpan = proteinMiktar / proteinKaynagi.ref;
            let proteinKcal = proteinKaynagi.cal * proteinCarpan;

            let kalanKcalKarbIcin = Math.max(0, kalanKcal - proteinKcal);
            let karbMiktar = Math.round((kalanKcalKarbIcin / karbKaynagi.cal) * karbKaynagi.ref / 10) * 10;
            if (karbMiktar <= 0) karbMiktar = karbKaynagi.ref;
            let karbCarpan = karbMiktar / karbKaynagi.ref;

            let toplamCal = Math.round(proteinKaynagi.cal * proteinCarpan + karbKaynagi.cal * karbCarpan);
            let toplamPro = (proteinKaynagi.pro * proteinCarpan + karbKaynagi.pro * karbCarpan).toFixed(1);
            let toplamKarb = (proteinKaynagi.karb * proteinCarpan + karbKaynagi.karb * karbCarpan).toFixed(1);

            return { proteinKaynagi, proteinMiktar, karbKaynagi, karbMiktar, toplamCal, toplamPro, toplamKarb };
        }

        function oneriHesapla() {
            let aktif = aktifProfiliGetir();
            let hedefler = bugunkuHedefleriHesapla(aktif);
            let tCal = 0, tPro = 0, tYag = 0, tKarb = 0;
            aktif.gunluk.forEach(t => { tCal += parseFloat(t.cal); tPro += parseFloat(t.pro); tYag += parseFloat(t.yag); tKarb += parseFloat(t.karb); });

            let kalanKcal = hedefler.kalori - tCal;
            let kalanPro = hedefler.pro - tPro;
            let kalanKarb = hedefler.karb - tKarb;

            const kartEl = document.getElementById('oneri-sonuc-karti');
            const govde = document.getElementById('oneri-sonuc-govde');

            if (kalanKcal < 150 || kalanPro <= 0) {
                govde.innerHTML = '<p style="color:var(--yazi-pasif); margin:0;">Bugün için hedeflerine oldukça yaklaşmışsın, yeni bir öneri üretmek için pek yer kalmadı. 🎉</p>';
                kartEl.classList.remove('gizli');
                kartEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                return;
            }

            // Protein kaynağı adayları: et ve süt/yumurta kategorisinden, kcal-verimliliğine göre sıralı
            let proteinAdaylari = besinler.filter(b => (b.kategori === 'et' || b.kategori === 'sut') && b.pro > 0).sort((a, b) => (b.pro / b.cal) - (a.pro / a.cal));
            let karbAdaylari = besinler.filter(b => b.kategori === 'tahil' && b.karb > 0).sort((a, b) => b.karb - a.karb);

            if (proteinAdaylari.length === 0 || karbAdaylari.length === 0) {
                govde.innerHTML = '<p style="color:var(--yazi-pasif); margin:0;">Öneri üretmek için besin kütüphaneden yeterli çeşit yok. Kütüphaneye biraz daha besin eklersen öneri üretebilirim.</p>';
                kartEl.classList.remove('gizli');
                return;
            }

            // 3 farklı kombinasyon üret: farklı protein/karbonhidrat kaynağı eşleşmeleri
            let eslesmeler = [
                [proteinAdaylari[0], karbAdaylari[0]],
                [proteinAdaylari[1] || proteinAdaylari[0], karbAdaylari[1] || karbAdaylari[0]],
                [proteinAdaylari[2] || proteinAdaylari[0], karbAdaylari[2] || karbAdaylari[0]]
            ];

            // Aynı ikili birden fazla kez düşmesin diye tekilleştir
            let gorulenler = new Set();
            let kombinasyonlar = [];
            eslesmeler.forEach(([p, k]) => {
                let anahtar = p.id + '-' + k.id;
                if (gorulenler.has(anahtar)) return;
                gorulenler.add(anahtar);
                kombinasyonlar.push(oneriKombinasyonuHesapla(p, k, kalanKcal, kalanPro));
            });

            govde.innerHTML = '<p style="color:var(--yazi-pasif); margin:0 0 12px;">Kalanı kapatmak için ' + kombinasyonlar.length + ' seçenek:</p>' +
                kombinasyonlar.map((k, i) => `
                <div style="border:1px solid rgba(255,255,255,.08); border-radius:14px; padding:12px 14px; margin-bottom:10px; background:rgba(255,255,255,.03);">
                    <p style="margin:0 0 8px; font-weight:800; color:var(--yazi-ana); font-size:14.5px;">${k.proteinMiktar} ${esc(birimEtiket(k.proteinKaynagi.birim))} ${esc(gorunenAd(k.proteinKaynagi))} + ${k.karbMiktar} ${esc(birimEtiket(k.karbKaynagi.birim))} ${esc(gorunenAd(k.karbKaynagi))}</p>
                    <p style="margin:0 0 10px; color:var(--yazi-pasif); font-size:12.5px;">≈ ${k.toplamCal} kcal · ${k.toplamPro} g protein · ${k.toplamKarb} g karbonhidrat</p>
                    <button class="btn-ikincil" style="margin-top:0;" onclick="oneriEkle(${k.proteinKaynagi.id}, ${k.proteinMiktar}, ${k.karbKaynagi.id}, ${k.karbMiktar})">Bu Seçeneği Ekle</button>
                </div>`).join('') +
                '<button class="btn-ikincil" style="margin-top:2px;" onclick="document.getElementById(\'oneri-sonuc-karti\').classList.add(\'gizli\')">Kapat</button>';

            kartEl.classList.remove('gizli');
            kartEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function oneriEkle(id1, mik1, id2, mik2) {
            let aktif = aktifProfiliGetir();
            [[id1, mik1], [id2, mik2]].forEach(([id, mik]) => {
                let b = besinler.find(x => x.id === id);
                if (!b) return;
                let carpan = mik / b.ref;
                aktif.gunluk.push({
                    id: benzersizId(), besinId: b.id, ad: b.ad, marka: b.marka || '', miktar: mik, birim: b.birim,
                    cal: Math.round(b.cal * carpan), pro: (b.pro * carpan).toFixed(1),
                    yag: (b.yag * carpan).toFixed(1), karb: (b.karb * carpan).toFixed(1)
                });
            });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('oneri-sonuc-karti').classList.add('gizli');
            bildirGoster('✓ Öneri günlüğüne eklendi');
            arayuzGuncelle();
        }

        // "BUGÜN NE EKSİK?"
        function eksikOlaniGoster() {
            let aktif = aktifProfiliGetir();
            let hedefler = bugunkuHedefleriHesapla(aktif);
            let tCal = 0, tPro = 0, tYag = 0, tKarb = 0;
            aktif.gunluk.forEach(t => { tCal += parseFloat(t.cal); tPro += parseFloat(t.pro); tYag += parseFloat(t.yag); tKarb += parseFloat(t.karb); });
            suGunKontrol(aktif);

            const satirlar = [];
            const durumEkle = (etiket, oran, kalanMetin) => {
                let renk = oran >= 0.9 ? 'yesil' : (oran >= 0.6 ? 'sari' : 'kirmizi');
                let ikon = renk === 'yesil' ? '🟢' : (renk === 'sari' ? '🟡' : '🔴');
                satirlar.push(`<div class="durum-satir"><span class="durum-nokta durum-${renk}"></span><span>${ikon} ${esc(etiket)} — ${esc(kalanMetin)}</span></div>`);
            };

            let kaloriOran = hedefler.kalori > 0 ? tCal / hedefler.kalori : 1;
            durumEkle('Kalori', kaloriOran, kaloriOran >= 0.9 ? ('hedefin %' + Math.round(kaloriOran * 100) + "'i") : (Math.round(hedefler.kalori - tCal) + ' kcal eksik'));

            let proOran = hedefler.pro > 0 ? tPro / hedefler.pro : 1;
            durumEkle('Protein', proOran, proOran >= 0.9 ? 'yeterli' : (Math.round(hedefler.pro - tPro) + ' g eksik'));

            let yagOran = hedefler.yag > 0 ? tYag / hedefler.yag : 1;
            durumEkle('Yağ', yagOran, yagOran >= 0.9 ? 'yeterli' : (Math.round(hedefler.yag - tYag) + ' g eksik'));

            let karbOran = hedefler.karb > 0 ? tKarb / hedefler.karb : 1;
            durumEkle('Karbonhidrat', karbOran, karbOran >= 0.9 ? 'yeterli' : (Math.round(hedefler.karb - tKarb) + ' g eksik'));

            let suOran = aktif.suHedefMl > 0 ? aktif.su.miktar / aktif.suHedefMl : 1;
            durumEkle('Su', suOran, suOran >= 0.9 ? 'yeterli' : ((aktif.suHedefMl - aktif.su.miktar) + ' ml eksik'));

            document.getElementById('eksik-sonuc-govde').innerHTML = satirlar.join('');
            document.getElementById('eksik-sonuc-karti').classList.remove('gizli');
            document.getElementById('eksik-sonuc-karti').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // TAKVİYELER
        function takviyeSiklikAlanGuncelle() {
            let tip = document.getElementById('tk-tur') ? document.getElementById('tk-siklik-tip').value : 'hergun';
            ['tk-haftada-alani', 'tk-belirli-alani', 'tk-xgunde-alani', 'tk-ayda-alani'].forEach(id => document.getElementById(id).classList.add('gizli'));
            if (tip === 'haftada_x') document.getElementById('tk-haftada-alani').classList.remove('gizli');
            if (tip === 'belirli_gunler') document.getElementById('tk-belirli-alani').classList.remove('gizli');
            if (tip === 'x_gunde_bir') document.getElementById('tk-xgunde-alani').classList.remove('gizli');
            if (tip === 'ayda_x') document.getElementById('tk-ayda-alani').classList.remove('gizli');
        }

        function tkGunSecimOlustur() {
            const alan = document.getElementById('tk-gun-secim');
            alan.innerHTML = gunAdlari.map((ad, i) => {
                let secili = tkSeciliGunler.includes(i);
                return '<button type="button" class="btn-kucuk ' + (secili ? '' : 'btn-ikincil') + '" style="flex:0 0 auto;" onclick="tkGunToggle(' + i + ')">' + esc(ad.slice(0, 3)) + '</button>';
            }).join('');
        }

        function tkGunToggle(i) {
            if (tkSeciliGunler.includes(i)) tkSeciliGunler = tkSeciliGunler.filter(x => x !== i);
            else tkSeciliGunler.push(i);
            tkGunSecimOlustur();
        }

        function takviyeFormuAc(id) {
            document.getElementById('tk-id').value = '';
            document.getElementById('tk-doz').value = '';
            document.getElementById('tk-tur').value = 'B12';
            document.getElementById('tk-saat').value = '';
            document.getElementById('tk-kutu-boyutu').value = '';
            document.getElementById('tk-siklik-tip').value = 'hergun';
            document.getElementById('tk-haftada-deger').value = '';
            document.getElementById('tk-xgunde-deger').value = '';
            document.getElementById('tk-ayda-deger').value = '';
            tkSeciliGunler = [];
            document.getElementById('takviye-form-baslik').innerText = 'Takviye Ekle';

            if (id) {
                let t = takviyeler.find(x => x.id == id);
                if (t) {
                    document.getElementById('tk-id').value = t.id;
                    document.getElementById('tk-tur').value = t.tur;
                    document.getElementById('tk-doz').value = t.doz;
                    document.getElementById('tk-saat').value = t.saat || '';
                    document.getElementById('tk-kutu-boyutu').value = t.kutuBoyutu || '';
                    document.getElementById('tk-siklik-tip').value = t.siklikTipi;
                    document.getElementById('tk-haftada-deger').value = t.siklikDeger || '';
                    document.getElementById('tk-xgunde-deger').value = t.siklikDeger || '';
                    document.getElementById('tk-ayda-deger').value = t.siklikDeger || '';
                    tkSeciliGunler = t.gunler || [];
                    document.getElementById('takviye-form-baslik').innerText = 'Takviyeyi Düzenle';
                }
            }
            takviyeSiklikAlanGuncelle();
            tkGunSecimOlustur();
            sayfaGoster('takviye-form-ekrani');
        }

        function takviyeKaydet() {
            let id = document.getElementById('tk-id').value;
            let tip = document.getElementById('tk-siklik-tip').value;
            let siklikDeger = null;
            if (tip === 'haftada_x') siklikDeger = parseInt(document.getElementById('tk-haftada-deger').value) || 1;
            if (tip === 'x_gunde_bir') siklikDeger = parseInt(document.getElementById('tk-xgunde-deger').value) || 1;
            if (tip === 'ayda_x') siklikDeger = parseInt(document.getElementById('tk-ayda-deger').value) || 1;

            let yeni = {
                id: id ? id : benzersizId(),
                tur: document.getElementById('tk-tur').value,
                doz: document.getElementById('tk-doz').value,
                saat: document.getElementById('tk-saat').value || null,
                kutuBoyutu: parseFloat(document.getElementById('tk-kutu-boyutu').value) || null,
                siklikTipi: tip,
                siklikDeger: siklikDeger,
                gunler: tip === 'belirli_gunler' ? [...tkSeciliGunler] : [],
                baslangic: id ? (takviyeler.find(x => x.id == id).baslangic || bugununTarihi) : bugununTarihi
            };

            if (id) { takviyeler[takviyeler.findIndex(x => x.id == id)] = yeni; }
            else { takviyeler.push(yeni); }
            localStorage.setItem('df_takviyeler', JSON.stringify(takviyeler));
            bildirGoster(id ? 'Takviye güncellendi' : 'Takviye eklendi');
            sayfaGoster('takviye-ekrani');
        }

        function takviyeSil(id) {
            const eskiIndex = takviyeler.findIndex(x => x.id == id);
            const silinen = takviyeler[eskiIndex];
            if (!silinen) return;
            takviyeler = takviyeler.filter(x => x.id !== id);
            localStorage.setItem('df_takviyeler', JSON.stringify(takviyeler));
            sayfaGoster('takviye-ekrani');
            bildirGoster('Takviye silindi', null, () => {
                takviyeler.splice(eskiIndex, 0, silinen);
                localStorage.setItem('df_takviyeler', JSON.stringify(takviyeler));
                takviyeEkraniGuncelle();
            });
        }

        function takviyeBugunDuzenliMi(t, tarihStr) {
            if (t.siklikTipi === 'hergun') return true;
            if (t.siklikTipi === 'haftada_x' || t.siklikTipi === 'ayda_x') return true; // her gün hatırlatılır, tamamlanma sayısı takip edilir
            const hedefTarih = tarihToDate(tarihStr);
            if (t.siklikTipi === 'belirli_gunler') {
                return (t.gunler || []).includes(hedefTarih.getDay());
            }
            if (t.siklikTipi === 'x_gunde_bir') {
                const baslangic = tarihToDate(t.baslangic || tarihStr);
                const farkGun = Math.round((hedefTarih - baslangic) / 86400000);
                const x = t.siklikDeger || 1;
                return farkGun >= 0 && farkGun % x === 0;
            }
            return true;
        }

        function takviyeSiklikMetni(t) {
            if (t.siklikTipi === 'hergun') return 'Her gün';
            if (t.siklikTipi === 'haftada_x') return 'Haftada ' + t.siklikDeger + ' gün';
            if (t.siklikTipi === 'belirli_gunler') return (t.gunler || []).map(g => gunAdlari[g].slice(0, 3)).join(', ');
            if (t.siklikTipi === 'x_gunde_bir') return t.siklikDeger + ' günde bir';
            if (t.siklikTipi === 'ayda_x') return 'Ayda ' + t.siklikDeger + ' kez';
            return '';
        }

        function takviyeBugunToggle(id, tarih = bugununTarihi) {
            let aktif = aktifProfiliGetir();
            if (!aktif.takviyeGecmisi) aktif.takviyeGecmisi = {};
            if (!aktif.takviyeGecmisi[tarih]) aktif.takviyeGecmisi[tarih] = {};
            aktif.takviyeGecmisi[tarih][id] = !aktif.takviyeGecmisi[tarih][id];
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            takviyeMiniGuncelle();
            if (document.getElementById('gun-detay-ekrani') && !document.getElementById('gun-detay-ekrani').classList.contains('gizli')) gunDetayGuncelle();
            if (document.getElementById('takviye-ekrani') && !document.getElementById('takviye-ekrani').classList.contains('gizli')) takviyeEkraniGuncelle();
        }

        function takviyeMiniGuncelle() {
            let aktif = aktifProfiliGetir();
            let bugunDuzenli = takviyeler.filter(t => takviyeBugunDuzenliMi(t, bugununTarihi));
            const kart = document.getElementById('takviye-mini-karti');
            if (bugunDuzenli.length === 0) { kart.classList.add('gizli'); return; }
            kart.classList.remove('gizli');
            const gunKayit = (aktif.takviyeGecmisi && aktif.takviyeGecmisi[bugununTarihi]) || {};
            let tamam = bugunDuzenli.filter(t => gunKayit[t.id]).length;
            document.getElementById('takviye-mini-oran').innerText = tamam + ' / ' + bugunDuzenli.length + ' tamamlandı';
            document.getElementById('takviye-mini-liste').innerHTML = bugunDuzenli.map(t => {
                let yapildi = !!gunKayit[t.id];
                return `<div class="mini-satir">
                    <span>${esc(t.tur)} — ${esc(t.doz)}</span>
                    <span class="durum-ikon ${yapildi ? 'yapildi' : ''}" onclick="takviyeBugunToggle('${t.id}')">${yapildi ? '✓' : ''}</span>
                </div>`;
            }).join('');
        }

        function takviyeEkraniGuncelle() {
            let aktif = aktifProfiliGetir();
            let bugunDuzenli = takviyeler.filter(t => takviyeBugunDuzenliMi(t, bugununTarihi));
            const gunKayit = (aktif.takviyeGecmisi && aktif.takviyeGecmisi[bugununTarihi]) || {};
            const bugunAlan = document.getElementById('takviye-bugun-listesi');
            if (bugunDuzenli.length === 0) {
                bugunAlan.innerHTML = '<div class="bos-durum">Bugün için planlanmış takviye yok.</div>';
            } else {
                bugunAlan.innerHTML = bugunDuzenli.map(t => {
                    let yapildi = !!gunKayit[t.id];
                    return `<div class="liste-elemani ${yapildi ? 'tamamlandi' : ''}">
                        <div><strong>${esc(t.tur)}</strong><span class="liste-detay">${esc(t.doz)} · ${esc(takviyeSiklikMetni(t))}</span></div>
                        <span class="durum-ikon ${yapildi ? 'yapildi' : ''}" style="font-size:20px;" onclick="takviyeBugunToggle('${t.id}')">${yapildi ? '✅' : '⬜'}</span>
                    </div>`;
                }).join('');
            }

            const tumAlan = document.getElementById('takviye-tum-liste');
            if (takviyeler.length === 0) {
                tumAlan.innerHTML = '<div class="bos-durum">Henüz takviye eklemedin.</div>';
            } else {
                tumAlan.innerHTML = takviyeler.map(t => `
                    <div class="liste-elemani">
                        <div><strong>${esc(t.tur)}</strong><span class="liste-detay">${esc(t.doz)} · ${esc(takviyeSiklikMetni(t))}</span></div>
                        <div class="buton-grubu">
                            <button class="btn-duzenle" onclick="takviyeFormuAc('${t.id}')">${ikon('duzenle', 14)}</button>
                            <button class="btn-tehlike" onclick="takviyeSil('${t.id}')" style="border-radius:12px;">${ikon('sil', 14)}</button>
                        </div>
                    </div>`).join('');
            }
        }

        // ÖĞÜN ŞABLONLARI (Hazır Öğün / Tarif)
        const sablonKategoriAdlari = { kahvalti: '🍳 Kahvaltı', ogle: '🥗 Öğle', aksam: '🍽 Akşam', antrenman: '💪 Antrenman Sonrası', kendi: '📌 Kendi Öğünlerim' };

        function sablonFormuAc() {
            sbDuzenlenenId = null;
            document.getElementById('sablon-form-baslik').innerText = 'Şablon Oluştur';
            document.getElementById('sablon-kaydet-btn').innerText = 'Şablonu Kaydet';
            document.getElementById('sb-ad').value = '';
            document.getElementById('sb-kategori').value = 'kahvalti';
            document.getElementById('sb-arama').value = '';
            document.getElementById('sb-miktar').value = '';
            document.getElementById('sb-porsiyon-sayisi').value = 1;
            sbTaslakIcerik = [];
            sablonBesinListele();
            sablonIcerikGoster();
            sayfaGoster('sablon-form-ekrani');
        }

        function sablonBesinListele() {
            const arama = (document.getElementById('sb-arama').value || '').toLocaleLowerCase('tr-TR');
            const alan = document.getElementById('sb-besin-listesi');
            let havuz = besinleriSirala(besinler);
            let filtreli = arama ? havuz.filter(b => besinEslesiyorMu(gorunenAd(b), arama)) : havuz.slice(0, 8);
            alan.innerHTML = filtreli.map(b => `<div class="liste-elemani" style="padding:10px 12px; cursor:pointer;" onclick="sablonBesinSec(${b.id})"><strong style="font-size:13.5px;">${esc(gorunenAd(b))}</strong><span class="liste-detay">${b.ref} ${esc(birimEtiket(b.birim))} | ${b.cal} kcal</span></div>`).join('');
        }

        let sbSeciliBesinId = null;
        function sablonBesinSec(id) {
            sbSeciliBesinId = id;
            let b = besinler.find(x => x.id === id);
            document.getElementById('sb-miktar').value = b ? b.ref : '';
            bildirGoster(gorunenAd(b) + ' seçildi, miktarı gir ve Ekle\'ye bas');
        }

        function sablonBesinEkle() {
            if (!sbSeciliBesinId) { bildirGoster('Önce bir besin seç', 'hata'); return; }
            let mik = parseFloat(document.getElementById('sb-miktar').value);
            if (!mik || mik <= 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }
            let b = besinler.find(x => x.id === sbSeciliBesinId);
            sbTaslakIcerik.push({ besinId: b.id, ad: b.ad, marka: b.marka || '', miktar: mik, ref: b.ref, birim: b.birim, cal: b.cal, pro: b.pro, yag: b.yag, karb: b.karb });
            sbSeciliBesinId = null;
            document.getElementById('sb-miktar').value = '';
            sablonIcerikGoster();
        }

        function sablonIcerikOgeSil(i) {
            sbTaslakIcerik.splice(i, 1);
            sablonIcerikGoster();
        }

        function sablonIcerikGoster() {
            const alan = document.getElementById('sb-icerik-listesi');
            if (sbTaslakIcerik.length === 0) {
                alan.innerHTML = '<div class="bos-durum" style="padding:16px;">Henüz malzeme eklenmedi.</div>';
                document.getElementById('sb-toplam').innerText = '';
                return;
            }
            let tCal = 0, tPro = 0;
            alan.innerHTML = sbTaslakIcerik.map((o, i) => {
                let carpan = o.miktar / o.ref;
                tCal += o.cal * carpan; tPro += o.pro * carpan;
                return `<div class="liste-elemani" style="padding:10px 12px;">
                    <span>${o.miktar} ${esc(birimEtiket(o.birim))} ${esc(gorunenAd(o))}</span>
                    <button class="btn-tehlike btn-kucuk" onclick="sablonIcerikOgeSil(${i})">${ikon('sil', 13)}</button>
                </div>`;
            }).join('');
            let porsiyonSayisi = parseFloat(document.getElementById('sb-porsiyon-sayisi').value) || 1;
            let porsiyonBasi = porsiyonSayisi > 1 ? ' (1 porsiyon ≈ ' + Math.round(tCal / porsiyonSayisi) + ' kcal · ' + (tPro / porsiyonSayisi).toFixed(1) + ' g protein)' : '';
            document.getElementById('sb-toplam').innerText = 'Toplam: ≈' + Math.round(tCal) + ' kcal · ' + tPro.toFixed(1) + ' g protein' + porsiyonBasi;
        }

        function sablonKaydet() {
            let ad = document.getElementById('sb-ad').value;
            if (!ad) { bildirGoster('Şablona bir isim ver', 'hata'); return; }
            if (sbTaslakIcerik.length === 0) { bildirGoster('En az bir malzeme ekle', 'hata'); return; }
            let porsiyonSayisi = parseFloat(document.getElementById('sb-porsiyon-sayisi').value) || 1;
            const icerikler = sbTaslakIcerik.map(o => ({ besinId: o.besinId, ad: o.ad, marka: o.marka || '', miktar: o.miktar, ref: o.ref, birim: o.birim }));
            if (sbDuzenlenenId) {
                // Düzenleme modu: mevcut şablonun üzerine yaz (id ve konum korunur)
                const idx = sablonlar.findIndex(x => x.id == sbDuzenlenenId);
                if (idx === -1) { bildirGoster('Düzenlenecek şablon bulunamadı', 'hata'); return; }
                sablonlar[idx] = { ...sablonlar[idx], ad, kategori: document.getElementById('sb-kategori').value, porsiyonSayisi, icerikler };
                localStorage.setItem('df_sablonlar', JSON.stringify(sablonlar));
                bildirGoster('📋 Şablon güncellendi');
            } else {
                sablonlar.push({
                    id: benzersizId(), ad: ad, kategori: document.getElementById('sb-kategori').value,
                    porsiyonSayisi: porsiyonSayisi,
                    icerikler
                });
                localStorage.setItem('df_sablonlar', JSON.stringify(sablonlar));
                bildirGoster('📋 Şablon kaydedildi');
            }
            sbDuzenlenenId = null;
            sayfaGoster('sablon-ekrani');
        }

        function sablonSil(id) {
            const eskiIndex = sablonlar.findIndex(x => x.id == id);
            const silinen = sablonlar[eskiIndex];
            if (!silinen) return;
            sablonlar = sablonlar.filter(x => x.id !== id);
            localStorage.setItem('df_sablonlar', JSON.stringify(sablonlar));
            sablonListele();
            bildirGoster('Şablon silindi', null, () => {
                sablonlar.splice(eskiIndex, 0, silinen);
                localStorage.setItem('df_sablonlar', JSON.stringify(sablonlar));
                sablonListele();
            });
        }

        function sablonKategoriSekmeleriOlustur() {
            const kats = [{ key: 'tum', ad: 'Tümü' }, ...Object.entries(sablonKategoriAdlari).map(([k, v]) => ({ key: k, ad: v }))];
            document.getElementById('sablon-kategori-sekmeler').innerHTML = kats.map(k => '<button class="sekme-btn ' + (sbAktifKategori === k.key ? 'aktif' : '') + '" onclick="sablonKategoriSec(\'' + k.key + '\')">' + esc(k.ad) + '</button>').join('');
        }
        function sablonKategoriSec(key) { sbAktifKategori = key; sablonListele(); }

        function sablonListele() {
            sablonKategoriSekmeleriOlustur();
            let filtreli = sbAktifKategori === 'tum' ? sablonlar : sablonlar.filter(s => s.kategori === sbAktifKategori);
            const alan = document.getElementById('sablon-liste');
            const sablonEtiketDeposu = sablonEtiketleriniGetir();
            if (filtreli.length === 0) {
                alan.innerHTML = '<div class="bos-durum">Henüz bir öğün şablonu yok. Yukarıdan ilk şablonunu oluştur.</div>';
                return;
            }
            alan.innerHTML = filtreli.map(s => {
                let toplamKcal = 0;
                s.icerikler.forEach(o => {
                    let b = besinler.find(x => x.id === o.besinId);
                    if (b) toplamKcal += b.cal * (o.miktar / o.ref);
                });
                let porsiyonSayisi = s.porsiyonSayisi || 1;
                let icerikMetni = s.icerikler.map(o => o.miktar + ' ' + birimEtiket(o.birim) + ' ' + gorunenAd(o)).join(', ');
                let porsiyonMetni = porsiyonSayisi > 1 ? (' · ' + porsiyonSayisi + ' porsiyon, 1 porsiyon ≈ ' + Math.round(toplamKcal / porsiyonSayisi) + ' kcal') : '';
                const aktifProfil = aktifProfiliGetir();
                const tekrarKaydi = ((aktifProfil && aktifProfil.otomatikTekrarlar) || []).find(k => k.sablonId == s.id);
                const tekrarBtn = tekrarKaydi
                    ? '<button class="btn-ikincil btn-kucuk" onclick="otomatikTekrarSil(\'' + tekrarKaydi.id + '\')" style="flex:0 0 auto;">🔁 Otomatik: ' + esc(OJUN_ADI[tekrarKaydi.ogunTuru] || '?') + ' — Kapat</button>'
                    : '<button class="btn-ikincil btn-kucuk" onclick="otomatikTekrarToggle(\'' + s.id + '\')" style="flex:0 0 auto;">🔁 Her Gün Otomatik Ekle</button>';
                // FAZ 11 — şablon etiketi: df_sablon_etiketleri'nde saklanır, df_sablonlar'ın şekli değişmez
                const sEtiketler = sablonEtiketDeposu[s.id] || [];
                const etiketBtn = '<button type="button" class="besin-etiket-btn' + (sEtiketler.length ? ' etiketli' : '') + '" title="' + (sEtiketler.length ? 'Etiketler: ' + esc(sEtiketler.join(', ')) : 'Etiket ekle') + '" onclick="etiketDuzenle(\'sablon\', \'' + s.id + '\')">🏷</button>';
                const etiketMetni = sEtiketler.length ? '<span class="liste-detay">🏷 ' + esc(sEtiketler.join(', ')) + '</span>' : '';
                return `<div class="liste-elemani" style="flex-direction:column; align-items:stretch;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                        <div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                ${etiketBtn}
                                <strong style="font-size:15px;">${esc(sablonKategoriAdlari[s.kategori] || '')} ${esc(s.ad)}</strong>
                            </div>
                            <span class="liste-detay">${esc(icerikMetni)}</span>
                            <span class="liste-detay">≈ ${Math.round(toplamKcal)} kcal${esc(porsiyonMetni)}</span>
                            ${etiketMetni}
                        </div>
                        <div class="buton-grubu" style="margin:0; max-width:90px;">
                            <button class="btn-duzenle" onclick="sablonDuzenleAc('${s.id}')">${ikon('duzenle', 14)}</button>
                            <button class="btn-tehlike btn-kucuk" onclick="sablonSil('${s.id}')">${ikon('sil', 13)}</button>
                        </div>
                    </div>
                    <div class="buton-grubu" style="margin-top:10px;">
                        <button onclick="sablonUygula('${s.id}', 1)">${porsiyonSayisi > 1 ? '1 Porsiyon Ekle' : esc(s.ad) + ' Ekle'}</button>
                        ${porsiyonSayisi > 1 ? `<button class="btn-ikincil" onclick="sablonUygula('${s.id}', ${porsiyonSayisi})">Tümünü Ekle (${porsiyonSayisi}x)</button>` : ''}
                    </div>
                    <div style="margin-top:8px;">${tekrarBtn}</div>
                </div>`;
            }).join('');
        }

        // ŞABLON DÜZENLEME — yeniden adlandır, besin ekle/çıkar, miktar ve porsiyon değiştir.
        // Aynı taslak mekanizması (sbTaslakIcerik) yeniden kullanılır: düzenleme modunda
        // "Kaydet" mevcut şablonun üzerine yazar, yeni şablon oluşturmaz.
        let sbDuzenlenenId = null;

        function sablonDuzenleAc(id) {
            const s = sablonlar.find(x => x.id == id);
            if (!s) return;
            sbDuzenlenenId = id;
            document.getElementById('sb-ad').value = s.ad;
            document.getElementById('sb-kategori').value = s.kategori;
            document.getElementById('sb-arama').value = '';
            document.getElementById('sb-miktar').value = '';
            document.getElementById('sb-porsiyon-sayisi').value = s.porsiyonSayisi || 1;
            sbTaslakIcerik = s.icerikler.map(o => ({ ...o }));
            document.getElementById('sablon-form-baslik').innerText = 'Şablonu Düzenle';
            document.getElementById('sablon-kaydet-btn').innerText = 'Değişiklikleri Kaydet';
            sablonBesinListele();
            sablonIcerikGoster();
            sayfaGoster('sablon-form-ekrani');
        }

        function sablonFormuYeni() {
            sbDuzenlenenId = null;
            document.getElementById('sablon-form-baslik').innerText = 'Şablon Oluştur';
            document.getElementById('sablon-kaydet-btn').innerText = 'Şablonu Kaydet';
        }

        function sablonUygula(id, porsiyonAdedi) {
            let s = sablonlar.find(x => x.id == id);
            if (!s) return;
            let toplamPorsiyon = s.porsiyonSayisi || 1;
            let carpanPorsiyon = (porsiyonAdedi || 1) / toplamPorsiyon;
            let aktif = aktifProfiliGetir();
            s.icerikler.forEach(o => {
                let b = besinler.find(x => x.id === o.besinId);
                if (!b) return;
                let miktar = o.miktar * carpanPorsiyon;
                let carpan = miktar / b.ref;
                aktif.gunluk.push({
                    id: benzersizId(), besinId: b.id, ad: b.ad, marka: b.marka || '', miktar: Math.round(miktar * 10) / 10, birim: b.birim,
                    cal: Math.round(b.cal * carpan), pro: (b.pro * carpan).toFixed(1),
                    yag: (b.yag * carpan).toFixed(1), karb: (b.karb * carpan).toFixed(1)
                });
            });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            bildirGoster('✓ ' + s.ad + ' günlüğüne eklendi');
            stokEksikMalzemeUyariGoster(s);
            sayfaGoster('ana-ekran');
        }

        // Faz 12 — şablon uygulandıktan SONRA ayrı/bilgilendirici uyarı: şablondaki
        // malzemelerden stoğunda görünmeyenleri sayar (küçük harf, kısmi eşleşme yeterli).
        // Ana işlemi ENGELLEMEZ; Stoğum hiç kullanılmadıysa (liste boşsa) hiç göstermez.
        function stokEksikMalzemeUyariGoster(sablon) {
            try {
                const aktif = aktifProfiliGetir();
                const stok = (aktif && aktif.stokListesi) || [];
                if (stok.length === 0) return;
                const stokAdlari = stok.map(m => (m.ad || '').toLocaleLowerCase('tr-TR'));
                const eksikler = [];
                (sablon.icerikler || []).forEach(o => {
                    if (eksikler.length >= 3 || !o.ad) return;
                    const adKucuk = o.ad.toLocaleLowerCase('tr-TR');
                    const stoktaVar = stokAdlari.some(stokAd => stokAd.includes(adKucuk) || adKucuk.includes(stokAd));
                    if (!stoktaVar && !eksikler.includes(o.ad)) eksikler.push(o.ad);
                });
                if (eksikler.length === 0) return;
                let mesaj = '⚠ Stoğunda görünmeyenler: ' + eksikler.join(', ');
                const eksikToplam = (sablon.icerikler || []).filter(o => {
                    if (!o.ad) return false;
                    const adKucuk = o.ad.toLocaleLowerCase('tr-TR');
                    return !stokAdlari.some(stokAd => stokAd.includes(adKucuk) || adKucuk.includes(stokAd));
                }).length;
                const fazlasi = eksikToplam - eksikler.length;
                if (fazlasi > 0) mesaj += ' +' + fazlasi + ' tane daha';
                bildirGoster(mesaj);
            } catch (e) { /* sessizce yoksay — uyarı ana akışı asla bozmasın */ }
        }

        // ANA EKRAN ARAYÜZÜ
        function arayuzGuncelle() {
            let secimKutusu = document.getElementById('aktif-profil-secim');
            secimKutusu.innerHTML = '';
            profiller.forEach(p => {
                let secili = (p.id == aktifProfilId) ? 'selected' : '';
                secimKutusu.innerHTML += `<option value="${p.id}" ${secili}>${esc(p.ad)}</option>`;
            });
            secimKutusu.innerHTML += `<option value="__yeni__">+ Yeni Kişi Ekle</option>`;

            let aktif = aktifProfiliGetir();
            suGunKontrol(aktif);
            // FAZ 17 — "Profil" butonunun ikonu artık genel dişli değil, o profilin
            // kendi avatarı (Ayarlar'daki dişli ile karışmasın diye).
            const profilBtn = document.getElementById('profil-duzenle-btn');
            if (profilBtn) profilBtn.innerHTML = avatarSvgGoster(aktif.avatar, 15, true) + ' Profil';
            document.getElementById('ana-baslik').innerHTML = avatarSvgGoster(aktif.avatar, 26) + ' ' + esc(aktif.ad ? aktif.ad + "'nın" : 'Bugünün') + ' Günlüğü';
            gunTipiRozetGoster(aktif);
            anaOzelGunAlaniGuncelle();

            let hedefler = bugunkuHedefleriHesapla(aktif);

            let tCal = 0, tPro = 0, tYag = 0, tKarb = 0;
            let liste = document.getElementById('yenenler-listesi');
            liste.innerHTML = '';

            aktif.gunluk.forEach(t => {
                tCal += parseFloat(t.cal); tPro += parseFloat(t.pro); tYag += parseFloat(t.yag); tKarb += parseFloat(t.karb);
            });
            // Öğüne göre gruplanmış liste (Kahvaltı/Öğle/Akşam/Ara Öğün/Belirsiz)
            // BUGÜN için TEK empty state: "Henüz bir şey yemedin" + Besin Ekle CTA
            liste.innerHTML = ogunGrupluListeHtml(aktif.gunluk, t => {
                let birimYazi = t.birim ? birimEtiket(t.birim) : 'birim';
                return `
                    <div class="liste-elemani" data-tid="${t.id}" id="tuketim-${t.id}">
                        <div class="swipe-arka"><span class="sw-duzenle">${ikon('duzenle', 14)} Düzenle</span><span class="sw-sil">Sil ${ikon('cop', 14)}</span></div>
                        <div><strong style="font-size:15px;">${esc(gorunenAd(t))}</strong><span class="liste-detay">${t.miktar} ${esc(birimYazi)} · ${esc(ogunEtiketi(t))}</span></div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="text-align:right;">
                                <strong style="color:var(--vurgu-renk); font-size:16px;">${t.cal} kcal</strong>
                                <span class="liste-detay">P:${t.pro} Y:${t.yag}</span>
                            </div>
                            <div class="menu-sarmal">
                                <button class="menu-nokta" onclick="menuAcKapa(event, 'tmenu-${t.id}')">⋮</button>
                                <div class="kucuk-menu gizli" id="tmenu-${t.id}">
                                    <button onclick="tuketimDuzenleAc('${t.id}')">${ikon('duzenle', 14)} Düzenle</button>
                                    <button onclick="tuketimSablonaKaydet('${t.id}')">⭐ Şablon Yap</button>
                                    <button onclick="tuketimSil('${t.id}')">${ikon('cop', 14)} Sil</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }, bosDurumHtml('🍥', 'Henüz bir şey yemedin', 'Bugünkü ilk öğünü ekleyerek günü takip etmeye başla. Üstteki "Günüme Besin Ekle (+)" butonunu kullan.'));
            aktif.gunluk.forEach(t => swipeBagla('tuketim-' + t.id, t.id));

            document.getElementById('gun-kalori').innerText = Math.round(tCal);
            document.getElementById('gun-protein').innerText = Math.round(tPro);
            document.getElementById('gun-yag').innerText = Math.round(tYag);
            document.getElementById('gun-karb').innerText = Math.round(tKarb);

            document.getElementById('hedef-kalori').innerText = `Hedef: ${hedefler.kalori}`;
            document.getElementById('hedef-protein').innerText = `Hedef: ${hedefler.pro}g`;
            document.getElementById('hedef-yag').innerText = `Hedef: ${hedefler.yag}g`;
            document.getElementById('hedef-karb').innerText = `Hedef: ${hedefler.karb}g`;

            let kaloriYuzde = hedefler.kalori > 0 ? Math.min(100, Math.round((tCal / hedefler.kalori) * 100)) : 0;
            document.getElementById('ilerleme-kalori').style.width = kaloriYuzde + '%';

            let proteinYuzde = hedefler.pro > 0 ? Math.min(100, Math.round((tPro / hedefler.pro) * 100)) : 0;
            document.getElementById('ilerleme-protein').style.width = proteinYuzde + '%';

            let yagYuzde = hedefler.yag > 0 ? Math.min(100, Math.round((tYag / hedefler.yag) * 100)) : 0;
            document.getElementById('ilerleme-yag').style.width = yagYuzde + '%';

            let karbYuzde = hedefler.karb > 0 ? Math.min(100, Math.round((tKarb / hedefler.karb) * 100)) : 0;
            document.getElementById('ilerleme-karb').style.width = karbYuzde + '%';

            // Kalan (ne kadar kaldı) kartı
            let kalanKcal = Math.max(0, Math.round(hedefler.kalori - tCal));
            let kalanPro = Math.max(0, Math.round(hedefler.pro - tPro));
            let kalanYag = Math.max(0, Math.round(hedefler.yag - tYag));
            let kalanKarb = Math.max(0, Math.round(hedefler.karb - tKarb));
            document.getElementById('kalan-grid').innerHTML = `
                <div class="kalan-hucre"><strong>${kalanKcal}</strong><span>kcal kaldı</span></div>
                <div class="kalan-hucre"><strong>${kalanPro} g</strong><span>protein kaldı</span></div>
                <div class="kalan-hucre"><strong>${kalanKarb} g</strong><span>karb. kaldı</span></div>
            `;

            // Bugünkü aktivite alanı
            let bugunAktivite = bugunAktiviteGetir(aktif);
            document.getElementById('bugun-adim-input').value = (hedefler.adim !== null && hedefler.adim !== undefined) ? hedefler.adim : '';
            document.getElementById('aktivite-ayar-yazi').innerText = hedefler.ayar !== 0 ? ((hedefler.ayar >= 0 ? '+' : '') + hedefler.ayar + ' kcal') : '';
            if (hedefler.adim !== null && hedefler.adim !== undefined) {
                let fark = hedefler.adim - hedefler.ortalamaAdim;
                document.getElementById('bugun-adim-bilgi').innerText = 'Ortalamandan ' + (fark >= 0 ? '+' : '') + Math.round(fark) + ' adım ' + (fark >= 0 ? 'fazla' : 'az') + '.';
            } else {
                document.getElementById('bugun-adim-bilgi').innerText = 'Girilmezse profilindeki ortalama adım kullanılır.';
            }

            // Bugünkü egzersiz listesi
            let egzersizler = hedefler.egzersizler || [];
            const egzListeEl = document.getElementById('bugun-egzersiz-liste');
            if (egzersizler.length === 0) {
                egzListeEl.innerHTML = '<div class="hedef-yazi" style="margin-top:6px;">Henüz eklenmedi.</div>';
            } else {
                egzListeEl.innerHTML = egzersizler.map(e => {
                    let kcal = Math.round(egzersizKcalHesapla(e.tip, e.sure, aktif.girdi.kilo, e.met));
                    return `<div class="mini-satir"><span>${esc(e.hareketAdi || egzersizAdlari[e.tip] || e.tip)} — ${e.sure} dk (${kcal} kcal)</span><span class="durum-ikon" style="color:#ff8a8a;" onclick="bugunEgzersizSil('${e.id}')" role="button" aria-label="Egzersizi sil">${ikon('sil', 14)}</span></div>`;
                }).join('');
            }

            // Egzersiz durum butonlarını (Yaptım / Planlı değildi / Yapmadım) senkronize et
            const egzDurumGrupEl = document.getElementById('egz-durum-grup');
            if (egzDurumGrupEl) {
                let bugunAkt = bugunAktiviteGetir(aktif);
                let seciliDurum = bugunAkt ? bugunAkt.durum : null;
                const durumSirasi = ['yapildi', 'planli_degil', 'yapmadi'];
                const durumClassAdi = { yapildi: 'aktif-yapildi', planli_degil: 'aktif-planli-degil', yapmadi: 'aktif-yapmadi' };
                Array.from(egzDurumGrupEl.children).forEach((btn, i) => {
                    btn.classList.remove('aktif-yapildi', 'aktif-planli-degil', 'aktif-yapmadi');
                    if (durumSirasi[i] === seciliDurum) btn.classList.add(durumClassAdi[seciliDurum]);
                });
            }

            document.getElementById('su-miktar').innerText = mlGoster(aktif.su.miktar);
            const suHedefEtkin = suGunlukHedefEtkin(aktif);
            document.getElementById('su-hedef-yazi').innerText = 'Hedef: ' + mlGoster(suHedefEtkin) + (suHedefEtkin !== aktif.suHedefMl ? ' (antrenman günü +500)' : '');
            document.getElementById('ilerleme-su').style.width = Math.min(100, Math.round((aktif.su.miktar / suHedefEtkin) * 100)) + '%';
            document.getElementById('su-hedef-input').value = aktif.suHedefMl;
            suOzelButonGuncelle(aktif);

            document.getElementById('oneri-sonuc-karti').classList.add('gizli');
            document.getElementById('eksik-sonuc-karti').classList.add('gizli');

            kalibrasyonKontrolEt();
            takviyeMiniGuncelle();
            anaPlanKartiGuncelle(aktif);
            anaAntrenmanKartiGuncelle(aktif);
            yedekHatirlaticisiKontrolEt();
            // FAZ 11 — skor/aktivite/su kartlarını kullanıcının seçtiği sıraya taşı
            anaKartSiraUygula(aktif);
        }

        // GEÇMİŞ / İLERLEME (okuma + silme + miktar düzenleme + analitik)
        // İlerleme ekranı iç sekmeleri — Genel | Trend | Analiz. Sekme seçimi state'te tutulur;
        // ekran her açıldığında en son aktif olan sekme gösterilir ve o sekmenin içeriği tazelenir.
        function ilerlemeSekmesiGuncelle() {
            ilerlemeSekmeSec(ilerlemeAktifSekme);
        }

        function ilerlemeSekmeSec(sekme) {
            if (!['genel', 'trend', 'analiz'].includes(sekme)) sekme = 'genel';
            ilerlemeAktifSekme = sekme;
            ['genel', 'trend', 'analiz'].forEach(s => {
                const sekmeBtn = document.getElementById('ilerleme-sekme-' + s);
                if (sekmeBtn) sekmeBtn.classList.toggle('aktif', s === sekme);
                const panel = document.getElementById('ilerleme-panel-' + s);
                if (panel) panel.classList.toggle('gizli', s !== sekme);
            });
            if (sekme === 'genel') {
                gecmisListele();
            } else if (sekme === 'trend') {
                trendGuncelle();
                haftalikKarsilastirmaGuncelle();
            } else {
                analizGuncelle();
            }
        }

        // Plan & Market ekranı sekmeleri — Plan | Market. Aktif sekme state'te tutulur;
        // ekran her açıldığında aktif sekme gösterilir ve içeriği tazelenir.
        function planSekmesiGuncelle() {
            planSekmeSec(planAktifSekme);
        }

        function planSekmeSec(sekme) {
            if (!['plan', 'market', 'stok', 'antrenman'].includes(sekme)) sekme = 'plan';
            planAktifSekme = sekme;
            ['plan', 'market', 'stok', 'antrenman'].forEach(s => {
                const sekmeBtn = document.getElementById('plan-sekme-' + s);
                if (sekmeBtn) sekmeBtn.classList.toggle('aktif', s === sekme);
                const panel = document.getElementById('plan-panel-' + s);
                if (panel) panel.classList.toggle('gizli', s !== sekme);
            });
            if (sekme === 'plan') planGunleriCiz();
            else if (sekme === 'market') marketListesiGuncelle();
            else if (sekme === 'stok') stokListesiGuncelle();
            else antrenmanPlaniCiz();
        }

        // ══════════ FAZ 5: PLANLAYICI + MARKET + FAVORİ ÖĞÜN ══════════

        // planEntries kaydının görünen adı (şablon → sablon.ad, besin → besin adı/marka)
        function planKayitAdi(kayit) {
            if (kayit.kaynakTipi === 'sablon') {
                const s = sablonlar.find(x => x.id == kayit.kaynakId);
                return s ? s.ad : '(silinmiş şablon)';
            }
            const b = besinler.find(x => x.id == kayit.kaynakId);
            return b ? gorunenAd(b) : '(silinmiş besin)';
        }

        // planEntries kaydının miktar metni (şablon → porsiyon, besin → miktar + birim)
        function planKayitMiktarMetni(kayit) {
            if (kayit.kaynakTipi === 'sablon') return kayit.miktar + ' porsiyon';
            const b = besinler.find(x => x.id == kayit.kaynakId);
            return kayit.miktar + ' ' + (b ? birimEtiket(b.birim) : 'birim');
        }

        // Şablonun 1 serinin toplam kcal'i (bilgi amaçlı)
        function sablonKcalToplam(s) {
            let toplam = 0;
            (s.icerikler || []).forEach(o => {
                const b = besinler.find(x => x.id === o.besinId);
                if (b) toplam += b.cal * (o.miktar / o.ref);
            });
            return toplam;
        }

        // 7 GÜNLÜK PLANLAYICI — bugünden itibaren 7 gün × 4 öğün
        function planGunleriCiz() {
            const alan = document.getElementById('plan-gunler-alani');
            if (!alan) return;
            const aktif = aktifProfiliGetir();
            const planlar = aktif.planEntries || [];

            let html = '';
            for (let i = 0; i < 7; i++) {
                const d = tarihToDate(bugununTarihi);
                d.setDate(d.getDate() + i);
                const tarih = d.toLocaleDateString('tr-TR');
                const bugunMu = i === 0;

                html += `<div class="kart kart-kompakt" style="margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong style="font-size:15px;">${gunAdlari[d.getDay()]}${bugunMu ? ' (Bugün)' : ''}</strong>
                        <span class="hedef-yazi" style="margin-top:0;">${tarihEtiketKisa(tarih)}</span>
                    </div>`;

                OJUN_ETIKETLERI.forEach(o => {
                    const gunKayitlari = planlar.filter(k => k.tarih === tarih && k.ogunTuru === o.key);
                    const aktifler = gunKayitlari.filter(k => k.durum !== 'atlandi');
                    const atlananlar = gunKayitlari.filter(k => k.durum === 'atlandi');

                    html += `<div style="margin-top:10px; padding-top:8px; border-top:1px solid rgba(255,255,255,.06);">
                        <span style="font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:var(--vurgu-renk);">${esc(o.ad)}</span>`;

                    if (aktifler.length === 0 && atlananlar.length === 0) {
                        html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                            <span style="font-size:13px; color:var(--yazi-pasif); font-weight:600;">Planlanmadı</span>
                            <button class="btn-ikincil btn-kucuk" onclick="planSeciciAc('${tarih}', '${o.key}')">+ Ekle</button>
                        </div>`;
                    } else {
                        aktifler.forEach(k => {
                            const yendi = k.durum === 'yendi';
                            html += `<div class="liste-elemani ${yendi ? 'tamamlandi' : ''}" style="margin-top:6px; padding:10px 12px;">
                                <div>
                                    <strong style="font-size:13.5px;">${esc(planKayitAdi(k))}</strong>
                                    <span class="liste-detay">${esc(planKayitMiktarMetni(k))} · ${yendi ? '✓ yendi' : '⏳ bekliyor'}</span>
                                </div>
                                <button class="btn-tehlike btn-kucuk" onclick="planKayitKaldir('${k.id}')">${ikon('sil', 13)} Kaldır</button>
                            </div>`;
                        });
                        atlananlar.forEach(k => {
                            html += `<div class="liste-elemani" style="margin-top:6px; padding:10px 12px; opacity:.5;">
                                <div>
                                    <strong style="font-size:13.5px; text-decoration:line-through;">${esc(planKayitAdi(k))}</strong>
                                    <span class="liste-detay">${esc(planKayitMiktarMetni(k))} · 🚫 atlandı</span>
                                </div>
                                <button class="btn-tehlike btn-kucuk" onclick="planKayitKaldir('${k.id}')">${ikon('sil', 13)} Kaldır</button>
                            </div>`;
                        });
                        html += `<div style="text-align:right; margin-top:6px;">
                            <button class="btn-ikincil btn-kucuk" onclick="planSeciciAc('${tarih}', '${o.key}')">+ Ekle</button>
                        </div>`;
                    }
                    html += `</div>`;
                });
                html += `</div>`;
            }
            alan.innerHTML = html;
        }

        // Plan panelinden kaydı tamamen kaldır (planEntries'ten siler)
        function planKayitKaldir(kayitId) {
            const aktif = aktifProfiliGetir();
            if (!aktif.planEntries) return;
            const eskiIndex = aktif.planEntries.findIndex(x => x.id == kayitId);
            const silinen = aktif.planEntries[eskiIndex];
            if (!silinen) return;
            aktif.planEntries = aktif.planEntries.filter(x => x.id != kayitId);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            planGunleriCiz();
            if (planAktifSekme === 'market') marketListesiGuncelle();
            bildirGoster('Plan kaydı kaldırıldı', null, () => {
                aktif.planEntries.splice(Math.min(eskiIndex, aktif.planEntries.length), 0, silinen);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                planGunleriCiz();
                if (planAktifSekme === 'market') marketListesiGuncelle();
            });
        }

        // PLAN SEÇİCİ EKRANI — hangi tarih + öğün için açıldığını state'te tutar
        let planSeciciTarih = null;
        let planSeciciOgun = null;
        let planSeciciAktifSekme = 'sablon';
        let psAktifKategori = 'tum';
        let psSeciliBesinId = null;

        function planSeciciAc(tarih, ogunTuru) {
            planSeciciTarih = tarih;
            planSeciciOgun = ogunTuru;
            psSeciliBesinId = null;
            psAktifKategori = 'tum';
            planSeciciDagitimPaneliKapat();
            const d = tarihToDate(tarih);
            document.getElementById('plan-secici-baslik').innerText = gunAdlari[d.getDay()] + ' — ' + (OJUN_ADI[ogunTuru] || ogunTuru);
            document.getElementById('plan-secici-alt-baslik').innerText = formatTarihKisa(tarih) + (tarih === bugununTarihi ? ' (Bugün)' : '') + ' için ne planlıyorsun?';
            document.getElementById('ps-arama').value = '';
            planSeciciSekmeSec(planSeciciAktifSekme);
            sayfaGoster('plan-secici-ekrani');
        }

        // Plan seçici ekranı yeniden gösterildiğinde aktif sekmenin içeriğini tazeler
        // (planSeciciAc zaten sekme + state'i ayarlar; burada sadece liste tazelenir)
        function planSeciciAktifYenile() {
            if (!planSeciciTarih || !planSeciciOgun) return;
            planSeciciSekmeSec(planSeciciAktifSekme);
        }

        function planSeciciSekmeSec(sekme) {
            if (!['sablon', 'besin'].includes(sekme)) sekme = 'sablon';
            planSeciciAktifSekme = sekme;
            ['sablon', 'besin'].forEach(s => {
                const sekmeBtn = document.getElementById('plan-secici-sekme-' + s);
                if (sekmeBtn) sekmeBtn.classList.toggle('aktif', s === sekme);
                const panel = document.getElementById('plan-secici-panel-' + s);
                if (panel) panel.classList.toggle('gizli', s !== sekme);
            });
            planSeciciDagitimPaneliKapat();
            if (sekme === 'sablon') planSeciciSablonListele();
            else {
                planSeciciKategoriSekmeleriOlustur();
                planSeciciBesinListele();
            }
        }

        function planSeciciSablonListele() {
            const alan = document.getElementById('plan-secici-sablon-listesi');
            if (sablonlar.length === 0) {
                alan.innerHTML = '<div class="bos-durum">Henüz bir şablon yok. "Daha Fazla → Öğün Şablonları"ndan oluşturabilirsin.</div>';
                return;
            }
            alan.innerHTML = sablonlar.map(s => {
                const porsiyon = s.porsiyonSayisi || 1;
                return `<div class="liste-elemani" style="cursor:pointer; padding:12px 14px;" onclick="planSeciciSablonSec('${s.id}')">
                    <div>
                        <strong style="font-size:14.5px;">${esc(sablonKategoriAdlari[s.kategori] || '')} ${esc(s.ad)}</strong>
                        <span class="liste-detay">≈ ${Math.round(sablonKcalToplam(s))} kcal · ${porsiyon} porsiyon</span>
                    </div>
                    <span style="color:var(--vurgu-renk); font-size:16px;">＋</span>
                </div>`;
            }).join('');
        }

        async function planSeciciSablonSec(sablonId) {
            const s = sablonlar.find(x => x.id == sablonId);
            if (!s || !planSeciciTarih || !planSeciciOgun) return;
            const varsayilan = s.porsiyonSayisi || 1;
            const cevap = await modalGirdi('Porsiyon Adedi', s.ad + ' — kaç porsiyon planlanacak? (1 porsiyon ≈ ' + Math.round(sablonKcalToplam(s) / varsayilan) + ' kcal)', String(varsayilan), 'Örn: 1');
            if (cevap === null) return;
            const porsiyon = parseFloat(cevap);
            if (!porsiyon || porsiyon <= 0) { bildirGoster('Geçerli bir porsiyon adedi gir', 'hata'); return; }
            planSeciciOnayGoster({ kaynakTipi: 'sablon', kaynakId: s.id, miktar: porsiyon });
        }

        function planSeciciKategoriSekmeleriOlustur() {
            besinKategoriSekmeleriOlustur('ps-kategori-sekmeler', psAktifKategori, 'planSeciciKategoriSec');
        }

        function planSeciciKategoriSec(key) { psAktifKategori = key; psSeciliBesinId = null; planSeciciBesinListele(); }

        function planSeciciBesinListele() {
            const arama = (document.getElementById('ps-arama').value || '').toLocaleLowerCase('tr-TR');
            const alan = document.getElementById('plan-secici-besin-listesi');
            const filtreli = besinleriSirala(besinler.filter(b => {
                if (psAktifKategori === 'favori' && !favoriler.includes(b.id)) return false;
                if (psAktifKategori !== 'tum' && psAktifKategori !== 'favori' && b.kategori !== psAktifKategori) return false;
                if (arama && !besinEslesiyorMu(gorunenAd(b), arama)) return false;
                return true;
            }));
            if (filtreli.length === 0) {
                alan.innerHTML = '<div class="bos-durum">' + ikon('ara', 16) + ' Eşleşen besin yok.</div>';
                return;
            }

            alan.innerHTML = filtreli.map(b => {
                const secili = psSeciliBesinId == b.id;
                const favoriMi = favoriler.includes(b.id);
                return `<div class="liste-elemani ${secili ? 'secili-oge' : ''}" style="cursor:pointer; padding:12px 14px;" onclick="planSeciciBesinSec(${b.id})">
                    <div>
                        <strong style="font-size:14.5px;">${favoriMi ? '★ ' : ''}${esc(gorunenAd(b))}</strong>
                        <span class="liste-detay">${b.ref} ${esc(birimEtiket(b.birim))} | ${b.cal} kcal</span>
                    </div>
                    ${secili ? '<span style="color:var(--vurgu-renk); font-size:18px;">✓</span>' : ''}
                </div>`;
            }).join('');
        }

        function planSeciciBesinSec(id) {
            psSeciliBesinId = id;
            const b = besinler.find(x => x.id == id);
            planSeciciBesinListele();
            planSeciciBesinMiktarGir(b);
        }

        async function planSeciciBesinMiktarGir(b) {
            if (!b) return;
            const cevap = await modalGirdi('Miktar', gorunenAd(b) + ' — ne kadar planlanacak? (' + b.ref + ' ' + birimEtiket(b.birim) + ' = ' + b.cal + ' kcal)', String(b.ref), 'Örn: ' + b.ref);
            if (cevap === null) return;
            const miktar = parseFloat(cevap);
            if (!miktar || miktar <= 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }
            planSeciciOnayGoster({ kaynakTipi: 'besin', kaynakId: b.id, miktar: miktar });
        }

        // Seçim tamamlandı → planEntries'e düşür, kaydet, plan paneline dön ve yenile
        function planSeciciKaydet(detay) {
            const aktif = aktifProfiliGetir();
            if (!aktif.planEntries) aktif.planEntries = [];
            aktif.planEntries.push({
                id: benzersizId(),
                tarih: planSeciciTarih,
                ogunTuru: planSeciciOgun,
                kaynakTipi: detay.kaynakTipi,
                kaynakId: detay.kaynakId,
                miktar: detay.miktar,
                durum: 'bekliyor'
            });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            bildirGoster('✓ ' + (OJUN_ADI[planSeciciOgun] || '') + ' için planlandı');
            planSeciciTarih = null;
            planSeciciOgun = null;
            sayfaGoster('plan-ekrani');
        }

        // FAZ 9 — TOPLU DAĞITIM. Miktar onaylandıktan sonra onay paneli gösterilir;
        // panelde "Birden Fazla Güne Dağıt" işaretlenirse sonraki 7 gün listelenir
        // (varsayılan: yalnızca tıklanan gün), seçilen her güne AYNI kayıt düşürülür.
        let planSeciciBekleyenDetay = null;

        function planSeciciOnayGoster(detay) {
            planSeciciBekleyenDetay = detay;
            const panel = document.getElementById('plan-secici-dagitim-paneli');
            if (!panel) { planSeciciKaydet(detay); return; }
            const chk = document.getElementById('ps-dagit-acik');
            if (chk) chk.checked = false;
            planSeciciDagitGunlerCiz();
            panel.classList.remove('gizli');
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function planSeciciDagitimPaneliKapat() {
            planSeciciBekleyenDetay = null;
            const panel = document.getElementById('plan-secici-dagitim-paneli');
            if (panel) panel.classList.add('gizli');
        }

        // Plan panelindekiyle aynı 7 günlük pencere: bugünden itibaren 7 gün
        function planSeciciSonrakiGunler() {
            const gunler = [];
            for (let i = 0; i < 7; i++) {
                const d = tarihToDate(bugununTarihi);
                d.setDate(d.getDate() + i);
                gunler.push({ tarih: d.toLocaleDateString('tr-TR'), gunAdi: gunAdlari[d.getDay()] });
            }
            return gunler;
        }

        function planSeciciDagitGunlerCiz() {
            const alan = document.getElementById('ps-dagit-gunler');
            if (!alan) return;
            alan.innerHTML = planSeciciSonrakiGunler().map((g, i) =>
                '<label style="display:flex; align-items:center; gap:10px; margin:0 0 2px; padding:7px 4px; border-bottom:1px solid var(--kenar); font-size:13px; font-weight:700; text-transform:none; letter-spacing:0; color:var(--yazi-ana); cursor:pointer;">' +
                '<input type="checkbox" data-ps-tarih="' + esc(g.tarih) + '" ' + (g.tarih === planSeciciTarih ? 'checked' : '') + ' style="width:18px; height:18px; margin:0; flex:0 0 auto; accent-color:var(--vurgu-renk);">' +
                '<span>' + esc(g.gunAdi) + (i === 0 ? ' (Bugün)' : '') + ' — ' + esc(tarihEtiketKisa(g.tarih)) + '</span>' +
                '</label>'
            ).join('');
        }

        function planSeciciDagitAcKapa() {
            const chk = document.getElementById('ps-dagit-acik');
            const alan = document.getElementById('ps-dagit-gunler-alani');
            if (!chk || !alan) return;
            alan.classList.toggle('gizli', !chk.checked);
            if (chk.checked) planSeciciDagitGunlerCiz();
        }

        function planSeciciOnayla() {
            const detay = planSeciciBekleyenDetay;
            if (!detay || !planSeciciTarih || !planSeciciOgun) { planSeciciDagitimPaneliKapat(); return; }
            const chk = document.getElementById('ps-dagit-acik');
            if (chk && chk.checked) {
                const alan = document.getElementById('ps-dagit-gunler');
                const tarihler = alan ? Array.from(alan.querySelectorAll('input[type="checkbox"]:checked')).map(c => c.dataset.psTarih) : [];
                if (tarihler.length === 0) { bildirGoster('En az bir gün seç', 'hata'); return; }
                planSeciciTopluKaydet(detay, tarihler);
            } else {
                planSeciciKaydet(detay);
            }
            planSeciciBekleyenDetay = null;
        }

        // tarihListesi'deki HER tarih için planSeciciKaydet ile AYNI şekle sahip kayıt düşür;
        // ogunTuru sabit kalır, sadece tarih değişir. Tek localStorage yazımı + tek bildirim.
        function planSeciciTopluKaydet(detay, tarihListesi) {
            const aktif = aktifProfiliGetir();
            if (!aktif.planEntries) aktif.planEntries = [];
            const ogun = planSeciciOgun;
            tarihListesi.forEach(tarih => {
                aktif.planEntries.push({
                    id: benzersizId(),
                    tarih: tarih,
                    ogunTuru: ogun,
                    kaynakTipi: detay.kaynakTipi,
                    kaynakId: detay.kaynakId,
                    miktar: detay.miktar,
                    durum: 'bekliyor'
                });
            });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            bildirGoster('✓ ' + tarihListesi.length + ' güne planlandı');
            planSeciciTarih = null;
            planSeciciOgun = null;
            sayfaGoster('plan-ekrani');
        }

        // ANA EKRAN KARTI — bugüne planlanmış ve bekleyen öğünler
        function anaPlanKartiGuncelle(aktif) {
            const kart = document.getElementById('ana-plan-karti');
            if (!kart) return;
            const bugununPlanlari = (aktif.planEntries || []).filter(k => k.tarih === bugununTarihi && k.durum === 'bekliyor');
            if (bugununPlanlari.length === 0) {
                kart.innerHTML = '';
                kart.classList.add('gizli');
                return;
            }
            const sirali = [];
            OJUN_ETIKETLERI.forEach(o => {
                bugununPlanlari.filter(p => p.ogunTuru === o.key).forEach(p => sirali.push(p));
            });
            kart.classList.remove('gizli');
            kart.innerHTML = `
                <div class="kart" style="margin-bottom:18px;">
                    <h2 style="text-align:left; font-size:15px;">${ikon('takvim', 16)} Bugün için planın var</h2>
                    ${sirali.map(p => `
                        <div class="liste-elemani" style="margin-top:8px; padding:11px 13px;">
                            <div>
                                <strong style="font-size:13.5px;">${esc(planKayitAdi(p))}</strong>
                                <span class="liste-detay">${esc(OJUN_ADI[p.ogunTuru] || 'Belirsiz')} · ${esc(planKayitMiktarMetni(p))}</span>
                            </div>
                            <div class="buton-grubu" style="margin:0; max-width:158px;">
                                <button class="btn-kucuk" onclick="planGunlugeEkle('${p.id}')">Günlüğe Ekle</button>
                                <button class="btn-ikincil btn-kucuk" onclick="planAtla('${p.id}')">Atla</button>
                            </div>
                        </div>`).join('')}
                </div>`;
        }

        // "Günlüğe Ekle" — şablon → sablonUygula, besin → planBesinDogrudanEkle; sonra durum='yendi'
        function planGunlugeEkle(kayitId) {
            const aktif = aktifProfiliGetir();
            const kayit = (aktif.planEntries || []).find(x => x.id == kayitId);
            if (!kayit) return;
            if (kayit.kaynakTipi === 'sablon') {
                const s = sablonlar.find(x => x.id == kayit.kaynakId);
                if (!s) { bildirGoster('Şablon bulunamadı', 'hata'); return; }
                sablonUygula(kayit.kaynakId, kayit.miktar);
            } else {
                planBesinDogrudanEkle(kayit.kaynakId, kayit.miktar, kayit.ogunTuru);
            }
            kayit.durum = 'yendi';
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            anaPlanKartiGuncelle(aktif);
            arayuzGuncelle();
        }

        // sablonUygula'nın tek-besin versiyonu — fark: eklediği kayda ogun set eder,
        // böylece gruplu listede doğru öğün grubunda görünür.
        function planBesinDogrudanEkle(besinId, miktar, ogunTuru) {
            const b = besinler.find(x => x.id == besinId);
            if (!b) { bildirGoster('Besin bulunamadı', 'hata'); return; }
            const aktif = aktifProfiliGetir();
            const carpan = miktar / b.ref;
            aktif.gunluk.push({
                id: benzersizId(), besinId: b.id, ad: b.ad, marka: b.marka || '', miktar: miktar, birim: b.birim, ogun: ogunTuru,
                cal: Math.round(b.cal * carpan), pro: (b.pro * carpan).toFixed(1),
                yag: (b.yag * carpan).toFixed(1), karb: (b.karb * carpan).toFixed(1)
            });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            bildirGoster('✓ ' + gorunenAd(b) + ' günlüğüne eklendi');
        }

        // "Atla" — durum='atlandi'; planEntries'ten silinmez, karttan kaybolur,
        // Plan panelinde "atlandı" rozetiyle görünmeye devam eder.
        function planAtla(kayitId) {
            const aktif = aktifProfiliGetir();
            const kayit = (aktif.planEntries || []).find(x => x.id == kayitId);
            if (!kayit) return;
            kayit.durum = 'atlandi';
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            anaPlanKartiGuncelle(aktif);
            bildirGoster('⏭ Plan atlandı');
        }

        // MARKET LİSTESİ — plan kaynaklı maddeler her tazelemede yeniden türetilir
        // (eskileri silinip yeniden hesaplanır, birikmez); manuel maddelere dokunulmaz.
        function marketListesiTazele(aktif) {
            if (!aktif.marketListesi) aktif.marketListesi = [];
            // İşaret durumu tazeleme arasında korunur (ad+birim anahtarıyla) —
            // aksi halde her yeniden çizimde plan maddelerinin işareti kaybolurdu.
            const eskiIsaretler = new Map();
            aktif.marketListesi.filter(m => m.kaynak === 'plan').forEach(m => {
                eskiIsaretler.set(m.ad + '|' + (m.birim || ''), m.alindiMi);
            });
            aktif.marketListesi = aktif.marketListesi.filter(m => m.kaynak === 'manuel');
            const toplar = new Map();
            (aktif.planEntries || []).forEach(k => {
                if (k.durum === 'atlandi') return;
                // Bugün dahil TÜM gelecek planlanmış kayıtlar taranır; geçmiş günler dışlanır
                if (tarihFarkiGun(k.tarih, bugununTarihi) < 0) return;
                if (k.kaynakTipi === 'sablon') {
                    const s = sablonlar.find(x => x.id == k.kaynakId);
                    if (!s) return;
                    const oran = (k.miktar || 1) / (s.porsiyonSayisi || 1);
                    s.icerikler.forEach(ic => {
                        const miktar = ic.miktar * oran;
                        const anahtar = ic.ad + '|' + ic.birim;
                        if (toplar.has(anahtar)) toplar.get(anahtar).miktar += miktar;
                        else toplar.set(anahtar, { ad: ic.ad, miktar: miktar, birim: ic.birim });
                    });
                } else {
                    const b = besinler.find(x => x.id == k.kaynakId);
                    const ad = b ? b.ad : '(silinmiş besin)';
                    const birim = b ? b.birim : 'birim';
                    const anahtar = ad + '|' + birim;
                    if (toplar.has(anahtar)) toplar.get(anahtar).miktar += (k.miktar || 0);
                    else toplar.set(anahtar, { ad: ad, miktar: (k.miktar || 0), birim: birim });
                }
            });
            toplar.forEach(m => {
                aktif.marketListesi.push({
                    id: benzersizId(), ad: m.ad, miktar: m.miktar, birim: m.birim, kategori: '', alindiMi: eskiIsaretler.get(m.ad + '|' + (m.birim || '')) || false, kaynak: 'plan'
                });
            });
        }

        function marketListesiGuncelle() {
            const aktif = aktifProfiliGetir();
            marketListesiTazele(aktif);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            const alan = document.getElementById('market-liste-alani');
            if (!alan) return;
            const liste = aktif.marketListesi;
            marketHarcamaGrafikGuncelle(aktif);
            if (liste.length === 0) {
                alan.innerHTML = '<div class="bos-durum">🛒 Liste boş. Plana öğün ekle, malzemeler buraya otomatik gelsin.</div>';
                const pngBtn = document.getElementById('market-png-btn');
                if (pngBtn) pngBtn.disabled = true;
                return;
            }
            const pngBtn2 = document.getElementById('market-png-btn');
            if (pngBtn2) pngBtn2.disabled = false;
            // İşaretlenmeyenler önce, işaretliler sonra (görsel olarak soluk/üstü çizili)
            liste.sort((a, b) => (a.alindiMi === b.alindiMi) ? 0 : (a.alindiMi ? 1 : -1));
            alan.innerHTML = liste.map(m => {
                const miktarVar = m.miktar !== '' && m.miktar !== undefined && m.miktar !== null && m.miktar !== 0;
                const miktarYazi = miktarVar
                    ? (Math.round(parseFloat(m.miktar) * 10) / 10) + (m.birim ? ' ' + birimEtiket(m.birim) : '')
                    : '';
                const fiyatYazi = m.fiyat ? (Math.round(m.fiyat * 100) / 100 + ' ₺') : '';
                return `<div class="liste-elemani ${m.alindiMi ? 'tamamlandi' : ''}" style="padding:11px 13px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" ${m.alindiMi ? 'checked' : ''} onchange="marketMaddeToggle('${m.id}')" style="width:20px; height:20px; margin:0; flex:0 0 auto; accent-color:var(--vurgu-renk);">
                        <div>
                            <strong style="font-size:14px; ${m.alindiMi ? 'text-decoration:line-through;' : ''}">${esc(m.ad)}</strong>
                            ${miktarYazi ? `<span class="liste-detay">${esc(miktarYazi)}</span>` : ''}
                            ${fiyatYazi ? `<span class="liste-detay">${esc(fiyatYazi)}</span>` : ''}
                        </div>
                    </div>
                    <div class="buton-grubu" style="flex:0 0 auto;">
                        <button class="btn-duzenle btn-kucuk" onclick="marketFiyatDuzenle('${m.id}')" aria-label="Fiyat gir">${ikon('duzenle', 13)}</button>
                        ${m.kaynak === 'manuel' ? `<button class="btn-tehlike btn-kucuk" onclick="marketManuelSil('${m.id}')" aria-label="Sil">${ikon('sil', 13)}</button>` : ''}
                    </div>
                </div>`;
            }).join('');
        }

        // FAZ 17 — market maddesine opsiyonel fiyat girme
        async function marketFiyatDuzenle(id) {
            const aktif = aktifProfiliGetir();
            const m = (aktif.marketListesi || []).find(x => x.id == id);
            if (!m) return;
            const deger = await modalGirdi('Fiyat Gir', esc(m.ad) + ' için tahmini fiyat (₺, opsiyonel)', m.fiyat || '');
            if (deger === null) return;
            const sayi = parseFloat(String(deger).replace(',', '.'));
            m.fiyat = (!isNaN(sayi) && sayi > 0) ? sayi : null;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            marketListesiGuncelle();
        }

        // FAZ 17 — haftalık harcama trendi: bir madde alındı işaretlenip fiyatı varsa
        // harcamaGecmisi'ne kaydedilir; grafik bunun üzerinden haftalık toplanır.
        function marketHarcamaGrafikGuncelle(aktif) {
            const alan = document.getElementById('market-harcama-grafik');
            if (!alan) return;
            const gecmis = aktif.harcamaGecmisi || [];
            if (gecmis.length === 0) { alan.innerHTML = ''; return; }
            const haftaEtiketi = (tarih) => {
                const fark = tarihFarkiGun(bugununTarihi, tarih);
                return Math.floor(fark / 7);
            };
            const haftalar = {};
            gecmis.forEach(h => {
                const idx = haftaEtiketi(h.tarih);
                if (idx < 0 || idx > 7) return;
                haftalar[idx] = (haftalar[idx] || 0) + h.tutar;
            });
            const degerler = [];
            const etiketler = [];
            for (let i = 7; i >= 0; i--) {
                degerler.push(Math.round((haftalar[i] || 0) * 100) / 100);
                etiketler.push(i === 0 ? 'Bu hafta' : i + ' hafta önce');
            }
            alan.innerHTML = '<h2 style="text-align:left; font-size:14px; margin-bottom:6px;">Haftalık Harcama (son 8 hafta)</h2>' +
                svgCokluSeriGrafik([{ degerler: degerler, renk: 'var(--vurgu-renk)', ad: 'Harcama' }], 320, 100,
                    { etiketler: etiketler, birim: '₺', eksenGoster: true, gridlineSayisi: 3, xEtiketSayisi: 3 });
        }

        function marketMaddeToggle(id) {
            const aktif = aktifProfiliGetir();
            const m = (aktif.marketListesi || []).find(x => x.id == id);
            if (!m) return;
            const eskiDurum = m.alindiMi;
            m.alindiMi = !m.alindiMi;
            // Faz 12 — FALSE'dan TRUE'ya geçişte madde Stoğum'a düşer (aynı adda kayıt yoksa).
            // TRUE'dan FALSE'a geçişte otomatik silme YOK: kullanıcı Stoğum'da kendi yönetir.
            if (!eskiDurum && m.alindiMi) {
                if (!aktif.stokListesi) aktif.stokListesi = [];
                const zatenVar = aktif.stokListesi.some(s => (s.ad || '').toLocaleLowerCase('tr-TR') === (m.ad || '').toLocaleLowerCase('tr-TR'));
                if (!zatenVar) {
                    aktif.stokListesi.push({
                        id: benzersizId(), ad: m.ad, kategori: m.kategori || '',
                        eklenmeTarihi: bugununTarihi, sktTarihi: null
                    });
                }
                // FAZ 17 — fiyatı girilmişse harcama geçmişine ekle (haftalık trend için)
                if (m.fiyat) {
                    if (!aktif.harcamaGecmisi) aktif.harcamaGecmisi = [];
                    aktif.harcamaGecmisi.push({ id: benzersizId(), tarih: bugununTarihi, tutar: m.fiyat, ad: m.ad });
                }
            }
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            marketListesiGuncelle();
        }

        function marketManuelEkle() {
            const input = document.getElementById('market-manuel-input');
            const ad = (input.value || '').trim();
            if (!ad) { bildirGoster('Bir madde adı yaz', 'hata'); return; }
            const aktif = aktifProfiliGetir();
            if (!aktif.marketListesi) aktif.marketListesi = [];
            aktif.marketListesi.push({ id: benzersizId(), ad: ad, miktar: '', kategori: '', alindiMi: false, kaynak: 'manuel' });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            input.value = '';
            marketListesiGuncelle();
        }

        function marketManuelSil(id) {
            const aktif = aktifProfiliGetir();
            const eskiIndex = (aktif.marketListesi || []).findIndex(x => x.id == id);
            const silinen = aktif.marketListesi[eskiIndex];
            if (!silinen) return;
            aktif.marketListesi = aktif.marketListesi.filter(x => x.id != id);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            marketListesiGuncelle();
            bildirGoster('Madde silindi', null, () => {
                if (!aktif.marketListesi) aktif.marketListesi = [];
                aktif.marketListesi.splice(Math.min(eskiIndex, aktif.marketListesi.length), 0, silinen);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                marketListesiGuncelle();
            });
        }

        // ══════════ FAZ 12: STOĞUM (KİLER) ══════════
        // Market'te işaretlenen maddeler otomatik düşer, kullanıcı SKT ekleyip silebilir.
        // Liste tamamen manuel yönetilir: market işareti kaldırılsa da kayıt burada kalır.

        // FAZ 17 — Stoğum ↔ Takviyeler: kutu boyutu girilmiş takviyelerin, kullanım
        // sıklığına ve başlangıç tarihine göre TAHMİNİ kalan miktarı hesaplanır;
        // 7 günden az kaldıysa otomatik Stoğum'a düşer (günde bir, otomatikYedek
        // ile aynı çağrı noktasında).
        function takviyeGunlukOrani(t) {
            if (t.siklikTipi === 'hergun') return 1;
            if (t.siklikTipi === 'haftada_x') return (t.siklikDeger || 1) / 7;
            if (t.siklikTipi === 'x_gunde_bir') return 1 / (t.siklikDeger || 1);
            if (t.siklikTipi === 'ayda_x') return (t.siklikDeger || 1) / 30;
            if (t.siklikTipi === 'belirli_gunler') return (t.gunler || []).length / 7;
            return 1;
        }
        function takviyeStokKontrolEt() {
            const aktif = aktifProfiliGetir();
            if (!aktif) return;
            if (!aktif.stokListesi) aktif.stokListesi = [];
            let degisti = false;
            takviyeler.forEach(t => {
                if (!t.kutuBoyutu || t.kutuBoyutu <= 0) return;
                const gecenGun = Math.max(0, tarihFarkiGun(bugununTarihi, t.baslangic));
                const oran = takviyeGunlukOrani(t);
                if (oran <= 0) return;
                const kalanAdet = t.kutuBoyutu - (gecenGun * oran);
                const kalanGun = kalanAdet / oran;
                const ad = t.tur + ' (takviye)';
                const zatenVar = aktif.stokListesi.some(s => (s.ad || '').toLocaleLowerCase('tr-TR') === ad.toLocaleLowerCase('tr-TR'));
                if (kalanGun <= 7 && !zatenVar) {
                    aktif.stokListesi.push({ id: benzersizId(), ad: ad, kategori: '', eklenmeTarihi: bugununTarihi, sktTarihi: null });
                    degisti = true;
                }
            });
            if (degisti) localStorage.setItem('df_profiller', JSON.stringify(profiller));
        }

        function stokListesiGuncelle() {
            const aktif = aktifProfiliGetir();
            if (!aktif.stokListesi) aktif.stokListesi = [];
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            const alan = document.getElementById('stok-liste-alani');
            if (!alan) return;
            const liste = aktif.stokListesi;
            if (liste.length === 0) {
                alan.innerHTML = '<div class="bos-durum">🧺 Stok boş. Market listesinden madde işaretledikçe buraya düşer.</div>';
                return;
            }
            // SKT'si yakın/geçmiş olanlar önce, sonra eklenme tarihine göre (yeni üstte)
            liste.sort((a, b) => {
                const aSkt = a.sktTarihi ? tarihToDate(a.sktTarihi).getTime() : Infinity;
                const bSkt = b.sktTarihi ? tarihToDate(b.sktTarihi).getTime() : Infinity;
                if (aSkt !== bSkt) return aSkt - bSkt;
                return tarihToDate(b.eklenmeTarihi || bugununTarihi) - tarihToDate(a.eklenmeTarihi || bugununTarihi);
            });
            alan.innerHTML = liste.map(m => {
                const sktYazi = m.sktTarihi ? formatTarihKisa(m.sktTarihi) : '';
                const kalanGun = m.sktTarihi ? -tarihFarkiGun(m.sktTarihi, bugununTarihi) : null;
                let sktSinif = '';
                let sktUyari = '';
                if (m.sktTarihi && kalanGun !== null) {
                    if (kalanGun < 0) { sktSinif = 'color:var(--tehlike-renk);'; sktUyari = ' ⚠ geçti'; }
                    else if (kalanGun <= 3) { sktSinif = 'color:#ffb84d;'; sktUyari = ' ⚡ yaklaşıyor'; }
                }
                return `<div class="liste-elemani" style="padding:11px 13px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div>
                            <strong style="font-size:14px;">${esc(m.ad)}</strong>
                            ${sktYazi ? `<span class="liste-detay" style="${sktSinif}">🗓 SKT: ${esc(sktYazi)}${sktUyari}</span>` : ''}
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button class="btn-ikincil btn-kucuk" onclick="stokSktDuzenle('${m.id}')">${ikon('takvim', 14)} SKT Ekle/Düzenle</button>
                        <button class="btn-tehlike btn-kucuk" onclick="stokManuelSil('${m.id}')" aria-label="Sil">${ikon('sil', 13)}</button>
                    </div>
                </div>`;
            }).join('');
        }

        function stokManuelEkle() {
            const input = document.getElementById('stok-manuel-input');
            const ad = (input.value || '').trim();
            if (!ad) { bildirGoster('Bir madde adı yaz', 'hata'); return; }
            const aktif = aktifProfiliGetir();
            if (!aktif.stokListesi) aktif.stokListesi = [];
            aktif.stokListesi.push({ id: benzersizId(), ad: ad, kategori: '', eklenmeTarihi: bugununTarihi, sktTarihi: null });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            input.value = '';
            stokListesiGuncelle();
        }

        function stokManuelSil(id) {
            const aktif = aktifProfiliGetir();
            if (!aktif.stokListesi) aktif.stokListesi = [];
            const eskiIndex = aktif.stokListesi.findIndex(x => x.id == id);
            const silinen = aktif.stokListesi[eskiIndex];
            if (!silinen) return;
            aktif.stokListesi = aktif.stokListesi.filter(x => x.id != id);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            stokListesiGuncelle();
            bildirGoster('Madde silindi', null, () => {
                if (!aktif.stokListesi) aktif.stokListesi = [];
                aktif.stokListesi.splice(Math.min(eskiIndex, aktif.stokListesi.length), 0, silinen);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                stokListesiGuncelle();
            });
        }

        // SKT düzenleme — modalGirdi ile (ISO YYYY-MM-DD beklenir; boş bırakılırsa SKT temizlenir)
        async function stokSktDuzenle(id) {
            const aktif = aktifProfiliGetir();
            const m = (aktif.stokListesi || []).find(x => x.id == id);
            if (!m) return;
            const varsayilan = m.sktTarihi ? trTarihtenIso(m.sktTarihi) : '';
            const sonuc = await modalGirdi('🗓 SKT — ' + m.ad,
                'Son kullanma tarihi (YYYY-AA-GG). Boş bırakıp kaydetmek SKT\'yi temizler.',
                varsayilan, 'Örn: 2026-09-15');
            if (sonuc === null) return;
            const temiz = (sonuc || '').trim();
            if (!temiz) {
                m.sktTarihi = null;
            } else {
                const eslesen = temiz.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
                if (!eslesen) { bildirGoster('Tarih formatı: YYYY-AA-GG olmalı', 'hata'); return; }
                const yil = parseInt(eslesen[1], 10), ay = parseInt(eslesen[2], 10), gun = parseInt(eslesen[3], 10);
                const d = new Date(yil, ay - 1, gun);
                if (d.getFullYear() !== yil || d.getMonth() !== ay - 1 || d.getDate() !== gun) {
                    bildirGoster('Geçerli bir tarih gir', 'hata'); return;
                }
                m.sktTarihi = gun + '.' + ay + '.' + yil;
            }
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            stokListesiGuncelle();
            bildirGoster(m.sktTarihi ? '🗓 SKT kaydedildi' : '🗓 SKT temizlendi');
        }

        // FAZ 9 — Market listesini PNG olarak indir. Renkler getComputedStyle ile aktif
        // temadan okunur; yükseklik satır sayısına göre dinamik hesaplanır (liste ne kadar
        // uzun olursa olsun tamamı tek görsele sığar).
        function marketListesiPngIndir() {
            const aktif = aktifProfiliGetir();
            const liste = [...(aktif.marketListesi || [])];
            if (liste.length === 0) { bildirGoster('Liste boş — önce plana öğün ekle veya madde ekle', 'hata'); return; }

            // marketListesiGuncelle ile AYNI sıralama: işaretsizler önce, işaretliler sonra
            liste.sort((a, b) => (a.alindiMi === b.alindiMi) ? 0 : (a.alindiMi ? 1 : -1));

            // Aktif tema renkleri
            const stil = getComputedStyle(document.body);
            const cKart = (stil.getPropertyValue('--kart-arkaplan') || '#141916').trim();
            const cYazi = (stil.getPropertyValue('--yazi-ana') || '#f5f7f3').trim();
            const cPasif = (stil.getPropertyValue('--yazi-pasif') || '#97a097').trim();
            const cVurgu = (stil.getPropertyValue('--vurgu-renk') || '#b8ff4d').trim();
            const cKenar = (stil.getPropertyValue('--kenar') || 'rgba(255,255,255,.08)').trim();
            const tehlikeRenk = liste.some(m => m.alindiMi) ? cPasif : cYazi;

            const genislik = 640;
            const padding = 32;
            const baslikYukseklik = 58;
            const satirYukseklik = 44;
            const yukseklik = baslikYukseklik + liste.length * satirYukseklik + padding * 2;
            const canvas = document.createElement('canvas');
            canvas.width = genislik;
            canvas.height = yukseklik;
            const ctx = canvas.getContext('2d');
            if (!ctx) { bildirGoster('Görsel oluşturulamadı', 'hata'); return; }

            // Zemin
            ctx.fillStyle = cKart;
            ctx.fillRect(0, 0, genislik, yukseklik);

            // Başlık
            ctx.fillStyle = cVurgu;
            ctx.font = '700 22px Manrope, Segoe UI, sans-serif';
            ctx.textBaseline = 'middle';
            ctx.fillText('🛒 Market Listesi — ' + bugununTarihi, padding, baslikYukseklik / 2 + padding / 2);

            // Başlık altı çizgi
            ctx.strokeStyle = cKenar;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding, baslikYukseklik + padding / 2 - 6);
            ctx.lineTo(genislik - padding, baslikYukseklik + padding / 2 - 6);
            ctx.stroke();

            // Satırlar
            let y = baslikYukseklik + padding + 10;
            liste.forEach(m => {
                const soluk = m.alindiMi;
                ctx.globalAlpha = soluk ? 0.55 : 1;
                ctx.fillStyle = cYazi;
                ctx.font = '600 17px Manrope, Segoe UI, sans-serif';
                ctx.fillText(soluk ? '☑' : '☐', padding, y + satirYukseklik / 2);

                const adMetni = soluk ? m.ad : m.ad;
                ctx.fillText(adMetni, padding + 32, y + satirYukseklik / 2);
                if (soluk) {
                    // Üstü çizili efekti (işaretliler)
                    const w = ctx.measureText(adMetni).width;
                    ctx.strokeStyle = cYazi;
                    ctx.beginPath();
                    ctx.moveTo(padding + 32, y + satirYukseklik / 2);
                    ctx.lineTo(padding + 32 + w, y + satirYukseklik / 2);
                    ctx.stroke();
                }

                const miktarVar = m.miktar !== '' && m.miktar !== undefined && m.miktar !== null && m.miktar !== 0;
                if (miktarVar) {
                    const miktarYazi = (Math.round(parseFloat(m.miktar) * 10) / 10) + (m.birim ? ' ' + birimEtiket(m.birim) : '');
                    ctx.fillStyle = cPasif;
                    ctx.font = '600 15px Manrope, Segoe UI, sans-serif';
                    const mw = ctx.measureText(miktarYazi).width;
                    ctx.fillText(miktarYazi, genislik - padding - mw, y + satirYukseklik / 2);
                }
                ctx.globalAlpha = 1;

                // Satır arası ince çizgi
                ctx.strokeStyle = cKenar;
                ctx.beginPath();
                ctx.moveTo(padding, y + satirYukseklik);
                ctx.lineTo(genislik - padding, y + satirYukseklik);
                ctx.stroke();

                y += satirYukseklik;
            });

            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'market-listesi-' + bugununTarihi.split('.').join('-') + '.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            bildirGoster('📷 Liste görseli indirildi');
        }

        // Tüketim kaydını tek-malzemeli şablon olarak kaydet ("Kendi Öğünlerim" kategorisi)
        function tuketimSablonaKaydet(kayitId) {
            const aktif = aktifProfiliGetir();
            const t = aktif.gunluk.find(x => x.id == kayitId);
            if (!t) return;
            const b = besinler.find(x => x.id === t.besinId);
            sablonlar.push({
                id: benzersizId(), ad: t.ad, kategori: 'kendi', porsiyonSayisi: 1,
                icerikler: [{ besinId: t.besinId, ad: t.ad, marka: t.marka || '', miktar: t.miktar, ref: b ? b.ref : t.miktar, birim: t.birim }]
            });
            localStorage.setItem('df_sablonlar', JSON.stringify(sablonlar));
            bildirGoster('⭐ ' + t.ad + ' şablon olarak kaydedildi');
        }

        // İlerleme / Trend: Kalori/Protein/Karb/Yağ sekmeleri arasında geçiş yapılır
        const TREND_METRIKEN = [
            { key: 'cal', ad: 'Kalori', birim: 'kcal', renk: 'var(--vurgu-renk)' },
            { key: 'pro', ad: 'Protein', birim: 'g', renk: '#4dc3ff' },
            { key: 'karb', ad: 'Karbonhidrat', birim: 'g', renk: '#ffcc4d' },
            { key: 'yag', ad: 'Yağ', birim: 'g', renk: '#ff8a8a' }
        ];
        let trendAktivMetrik = 'cal';

        function trendMetrikSec(key) {
            trendAktivMetrik = key;
            trendGuncelle();
        }

        function trendMetrikSekmeleriOlustur() {
            const alan = document.getElementById('trend-makro-sekmeler');
            if (!alan) return;
            alan.innerHTML = TREND_METRIKEN.map(m =>
                '<button class="sekme-btn ' + (trendAktivMetrik === m.key ? 'aktif' : '') + '" onclick="trendMetrikSec(\'' + m.key + '\')">' + esc(m.ad) + '</button>'
            ).join('');
        }

        // Zaman aralığı seçici — 7/30/90 gün veya tümü. Varsayılan 14 gün (eski davranış).
        let trendZamanAraligi = 14;

        function trendZamanAraligiSec(deger) {
            trendZamanAraligi = deger === 'tumu' ? 'tumu' : (parseInt(deger, 10) || 14);
            trendGuncelle();
        }

        function trendZamanAraligiSekmeleriOlustur() {
            const alan = document.getElementById('trend-zaman-sekmeler');
            if (!alan) return;
            const secenekler = [
                { deger: 7, ad: '7G' },
                { deger: 30, ad: '30G' },
                { deger: 90, ad: '90G' },
                { deger: 'tumu', ad: 'Tümü' }
            ];
            alan.innerHTML = secenekler.map(s =>
                '<button class="sekme-btn ' + (trendZamanAraligi === s.deger ? 'aktif' : '') + '" onclick="trendZamanAraligiSec(\'' + s.deger + '\')">' + s.ad + '</button>'
            ).join('');
        }

        // X ekseni için kısa tarih etiketi ("12 Eyl")
        const AY_KISALTMA = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
        function tarihEtiketKisa(t) {
            const d = tarihToDate(t);
            return d.getDate() + ' ' + (AY_KISALTMA[d.getMonth()] || '');
        }

        function trendGuncelle() {
            let aktif = aktifProfiliGetir();
            trendMetrikSekmeleriOlustur();
            trendZamanAraligiSekmeleriOlustur();
            const baslik = document.getElementById('trend-baslik');
            if (baslik) baslik.innerText = '📈 Trend (' + (trendZamanAraligi === 'tumu' ? 'Tüm Geçmiş' : 'Son ' + trendZamanAraligi + ' Gün') + ')';

            let hepsi = [...aktif.gecmis];
            if (aktif.gunluk.length > 0) hepsi.push({ tarih: bugununTarihi, veriler: aktif.gunluk });
            hepsi = hepsi.filter(g => !gunOzelMi(g.tarih));
            hepsi.sort((a, b) => tarihToDate(a.tarih) - tarihToDate(b.tarih));
            const metrik = TREND_METRIKEN.find(m => m.key === trendAktivMetrik) || TREND_METRIKEN[0];

            // Seçili zaman aralığına göre filtrele ('tumu' hariç)
            let secili = trendZamanAraligi === 'tumu'
                ? hepsi
                : hepsi.filter(g => { const f = tarihFarkiGun(bugununTarihi, g.tarih); return f >= 0 && f < trendZamanAraligi; });

            let degerler = secili.map(g => g.veriler.reduce((t, x) => t + parseFloat(x[metrik.key]), 0));
            let tarihler = secili.map(g => g.tarih);

            // "Tümü"de nokta sayısı okunaksızlaşacak kadar fazlaysa haftalık ortalamaya indirge (sade agregasyon)
            if (trendZamanAraligi === 'tumu' && degerler.length > 120) {
                const ortDegerler = [], ortTarihler = [];
                for (let i = 0; i < degerler.length; i += 7) {
                    const dilim = degerler.slice(i, i + 7);
                    ortDegerler.push(Math.round(dilim.reduce((a, b) => a + b, 0) / dilim.length * 10) / 10);
                    ortTarihler.push(tarihler[i]);
                }
                degerler = ortDegerler;
                tarihler = ortTarihler;
            }

            const alan = document.getElementById('trend-grafik-alan');
            const hedefCizgi = metrik.key === 'cal' ? aktif.kalori : null;
            alan.innerHTML = degerler.length >= 2
                ? svgCokluSeriGrafik([
                    { degerler: degerler, renk: metrik.renk, ad: metrik.ad },
                    { degerler: hareketliOrtalama(degerler, 7), renk: 'var(--yazi-pasif)', ad: 'Hareketli Ort.', kesikli: true }
                ], 320, 130, {
                    etiketler: tarihler,
                    birim: metrik.birim,
                    eksenGoster: true,
                    gridlineSayisi: 3,
                    xEtiketSayisi: 4,
                    xEtiketler: tarihler.map(tarihEtiketKisa),
                    hedefCizgi: hedefCizgi
                })
                : '<div class="bos-durum">📈 Trend görmek için en az 2 günlük geçmiş kaydı gerekli.</div>';
            grafikTiklamalariBagla('trend-grafik-alan', true);
        }

        function analitikGuncelle() {
            let aktif = aktifProfiliGetir();
            let hepsi = [...aktif.gecmis];
            if (aktif.gunluk.length > 0) hepsi.push({ tarih: bugununTarihi, veriler: aktif.gunluk, su: aktif.su.miktar });
            let son7 = hepsi.slice(-7);
            const alan = document.getElementById('analitik-alani');
            if (son7.length === 0) {
                alan.innerHTML = '<div class="bos-durum">Henüz yeterli veri yok.</div>';
                return;
            }
            let gunlukKcalListesi = son7.map(g => ({ tarih: g.tarih, kcal: g.veriler.reduce((tt, x) => tt + parseFloat(x.cal), 0) }));
            let ortKcal = gunlukKcalListesi.reduce((t, g) => t + g.kcal, 0) / son7.length;
            let ortPro = son7.reduce((t, g) => t + g.veriler.reduce((tt, x) => tt + parseFloat(x.pro), 0), 0) / son7.length;
            let suluGunler = son7.filter(g => g.su !== undefined && g.su !== null);
            let ortSu = suluGunler.length ? (suluGunler.reduce((t, g) => t + g.su, 0) / suluGunler.length / 1000) : null;
            let uyum = aktif.kalori > 0 ? Math.round((ortKcal / aktif.kalori) * 100) : 0;

            let enYuksekGun = gunlukKcalListesi.reduce((a, b) => b.kcal > a.kcal ? b : a, gunlukKcalListesi[0]);
            let enDusukGun = gunlukKcalListesi.reduce((a, b) => b.kcal < a.kcal ? b : a, gunlukKcalListesi[0]);

            let kiloDegisimYazi = '-';
            let ortKiloYazi = '-';
            if (aktif.kiloGecmisi && aktif.kiloGecmisi.length >= 2) {
                let sirali = [...aktif.kiloGecmisi].sort((a, b) => tarihToDate(a.tarih) - tarihToDate(b.tarih));
                let simdi = tarihToDate(bugununTarihi);
                let haftaOncesi = sirali.filter(g => (simdi - tarihToDate(g.tarih)) <= 7 * 86400000);
                if (haftaOncesi.length >= 1) {
                    ortKiloYazi = kgGoster(haftaOncesi.reduce((t, g) => t + g.kilo, 0) / haftaOncesi.length);
                }
                if (haftaOncesi.length >= 2) {
                    let d = haftaOncesi[haftaOncesi.length - 1].kilo - haftaOncesi[0].kilo;
                    kiloDegisimYazi = (d >= 0 ? '+' : '') + kgGoster(Math.abs(d));
                }
            }

            alan.innerHTML = `<div class="analitik-grid">
                <div class="analitik-hucre"><strong>${Math.round(ortKcal)} kcal</strong><span>Ort. Kalori</span></div>
                <div class="analitik-hucre"><strong>%${uyum}</strong><span>Hedefe Uyum</span></div>
                <div class="analitik-hucre"><strong>${Math.round(ortPro)} g</strong><span>Ort. Protein</span></div>
                <div class="analitik-hucre"><strong>${ortSu !== null ? ortSu.toFixed(1) + ' L' : '-'}</strong><span>Ort. Su</span></div>
                <div class="analitik-hucre"><strong>${ortKiloYazi}</strong><span>Ort. Kilo</span></div>
                <div class="analitik-hucre"><strong>${kiloDegisimYazi}</strong><span>Haftalık Değişim</span></div>
                <div class="analitik-hucre"><strong>${Math.round(enYuksekGun.kcal)} kcal</strong><span>En Yüksek Gün</span></div>
                <div class="analitik-hucre"><strong>${Math.round(enDusukGun.kcal)} kcal</strong><span>En Düşük Gün</span></div>
            </div>`;
        }

        // HAFTALIK KARŞILAŞTIRMA — bu hafta vs. önceki hafta. Yalnızca gerçek veriler kullanılır;
        // hafta başına yeterli veri yoksa karşılaştırma değeri gösterilmez.
        function haftalikKarsilastirmaGuncelle() {
            let aktif = aktifProfiliGetir();
            const alan = document.getElementById('haftalik-karsilastirma-alan');
            if (!alan) return;

            const simdi = tarihToDate(bugununTarihi);
            const buHaftada = g => tarihFarkiGun(bugununTarihi, g.tarih) < 7 && tarihFarkiGun(bugununTarihi, g.tarih) >= 0;
            const gecenHaftada = g => { const d = tarihFarkiGun(bugununTarihi, g.tarih); return d >= 7 && d < 14; };

            let hepsi = [...aktif.gecmis];
            if (aktif.gunluk.length > 0) hepsi.push({ tarih: bugununTarihi, veriler: aktif.gunluk, su: aktif.su.miktar });
            hepsi = hepsi.filter(g => !gunOzelMi(g.tarih));
            const buHafta = hepsi.filter(buHaftada);
            const gecenHafta = hepsi.filter(gecenHaftada);

            if (buHafta.length < 3 || gecenHafta.length < 3) {
                alan.innerHTML = '<div class="bos-durum">📊 Haftalık karşılaştırma için bu hafta ve geçen hafta en az 3\'er günlük kayıt gerekli.</div>';
                return;
            }

            const metrikDef = [
                { key: 'cal', ad: 'Kalori', birim: 'kcal' },
                { key: 'pro', ad: 'Protein', birim: 'g' },
                { key: 'karb', ad: 'Karbonhidrat', birim: 'g' },
                { key: 'yag', ad: 'Yağ', birim: 'g' }
            ];
            const ort = (gunler, key) => gunler.reduce((t, g) => t + g.veriler.reduce((tt, x) => tt + parseFloat(x[key]), 0), 0) / gunler.length;

            const satirlar = metrikDef.map(m => {
                const a = ort(buHafta, m.key), b = ort(gecenHafta, m.key);
                const diff = a - b;
                const pct = b > 0 ? Math.round((diff / b) * 100) : null;
                const renk = diff > 0 ? 'var(--vurgu-renk)' : 'var(--yazi-pasif)';
                const yon = diff >= 0 ? '+' : '';
                return `<div class="mini-satir"><span>${esc(m.ad)}</span><span style="color:${renk};">${yon}${Math.round(diff)} ${m.birim}${pct !== null ? ' (' + yon + pct + '%)' : ''}</span></div>`;
            });

            // Su — yalnızca her iki haftada da kayıt varsa
            const suBu = buHafta.filter(g => g.su !== undefined && g.su !== null);
            const suGecen = gecenHafta.filter(g => g.su !== undefined && g.su !== null);
            if (suBu.length >= 2 && suGecen.length >= 2) {
                const a = suBu.reduce((t2, g) => t2 + g.su, 0) / suBu.length;
                const b = suGecen.reduce((t2, g) => t2 + g.su, 0) / suGecen.length;
                const diff = Math.round(a - b);
                satirlar.push(`<div class="mini-satir"><span>Su</span><span style="color:${diff >= 0 ? 'var(--vurgu-renk)' : 'var(--yazi-pasif)'};">${diff >= 0 ? '+' : ''}${diff} ml</span></div>`);
            }

            // Kilo — yalnızca her iki haftada da en az 2 ölçüm varsa
            const kiloBu = aktif.kiloGecmisi ? aktif.kiloGecmisi.filter(buHaftada) : [];
            const kiloGecen = aktif.kiloGecmisi ? aktif.kiloGecmisi.filter(gecenHaftada) : [];
            if (kiloBu.length >= 2 && kiloGecen.length >= 2) {
                const a = kiloBu[kiloBu.length - 1].kilo - kiloBu[0].kilo;
                const b = kiloGecen[kiloGecen.length - 1].kilo - kiloGecen[0].kilo;
                const diff = a - b;
                satirlar.push(`<div class="mini-satir"><span>Kilo Değişimi</span><span style="color:${diff <= 0 ? 'var(--basari-renk)' : 'var(--tehlike-renk)'};">${diff >= 0 ? '+' : ''}${diff.toFixed(1)} kg</span></div>`);
            }

            // Gruplu bar chart — Kalori/Protein/Karb/Yağ ortalamaları bu hafta vs. geçen hafta
            const barSeriler = [
                { ad: 'Bu Hafta', renk: 'var(--vurgu-renk)', degerler: metrikDef.map(m => ort(buHafta, m.key)) },
                { ad: 'Geçen Hafta', renk: 'var(--yazi-pasif)', degerler: metrikDef.map(m => ort(gecenHafta, m.key)) }
            ];
            const barGrafik = svgBarGrafik(metrikDef.map(m => m.ad), barSeriler, 320, 160);
            alan.innerHTML = barGrafik + satirlar.join('');
        }

        // ANALİZ — gerçek verilerden kişisel örüntüler. Minimum veri miktarı
        // her analiz için tanımlıdır; yeterli veri yoksa TAHMİN ÜRETİLMEZ.
        function analizGuncelle() {
            icgorulerGuncelle();
            analizOzetGuncelle();
        }

        // Genel özet kartı: kayıt sayısı + ortalama kalori/protein/su (yalnızca gerçek veri)
        function analizOzetGuncelle() {
            const alan = document.getElementById('analiz-ozet-alan');
            if (!alan) return;
            const aktif = aktifProfiliGetir();
            let hepsi = [...aktif.gecmis];
            if (aktif.gunluk.length > 0) hepsi.push({ tarih: bugununTarihi, veriler: aktif.gunluk, su: aktif.su.miktar });
            hepsi = hepsi.filter(g => !gunOzelMi(g.tarih));

            if (hepsi.length === 0) {
                alan.innerHTML = '<div class="bos-durum">Henüz kayıt yok. Günlük kayıtlarını girdikçe analizler burada belirir.</div>';
                return;
            }

            const ort = hesaplaGunOrtalamalari(hepsi);
            const donut = svgDonutGrafik([
                { ad: 'Protein', deger: ort.protein, renk: '#4dc3ff' },
                { ad: 'Karbonhidrat', deger: ort.karb, renk: '#ffcc4d' },
                { ad: 'Yağ', deger: ort.yag, renk: '#ff8a8a' }
            ], 140);
            const hucreler = [
                `<div class="analitik-hucre"><strong>${hepsi.length} gün</strong><span>Kayıtlı Gün</span></div>`,
                `<div class="analitik-hucre"><strong>${Math.round(ort.kalori)} kcal</strong><span>Ort. Günlük Kalori</span></div>`,
                `<div class="analitik-hucre"><strong>${Math.round(ort.protein)} g</strong><span>Ort. Günlük Protein</span></div>`
            ];
            if (ort.su !== null) {
                hucreler.push(`<div class="analitik-hucre"><strong>${(ort.su / 1000).toFixed(1)} L</strong><span>Ort. Günlük Su</span></div>`);
            }
            alan.innerHTML = `<div class="analiz-donut-satir">
                ${donut ? `<div class="analiz-donut-kutu"><div class="analiz-donut-legend">
                    <span><i style="background:#4dc3ff;"></i>Protein</span>
                    <span><i style="background:#ffcc4d;"></i>Karbonhidrat</span>
                    <span><i style="background:#ff8a8a;"></i>Yağ</span>
                </div>${donut}</div>` : ''}
                <div class="analitik-grid">${hucreler.join('')}</div>
            </div>` + proteinKaynagiOraniHtml(hepsi);
        }

        // FAZ 11 — bitkisel/hayvansal protein oranı: son N günün tüketilen besinlerini
        // besinId → kategori → BESIN_KATEGORI_PROTEIN_KAYNAGI eşlemesiyle sınıflandırır,
        // sınıflandırılabilenler (null olmayanlar) üzerinden kalori bazlı yüzde verir.
        function proteinKaynagiOraniHtml(gunler) {
            let hayvansalKcal = 0, bitkiselKcal = 0;
            gunler.forEach(g => g.veriler.forEach(t => {
                const b = besinler.find(x => x.id === t.besinId);
                if (!b) return;
                const kaynak = BESIN_KATEGORI_PROTEIN_KAYNAGI[b.kategori];
                if (kaynak === 'hayvansal') hayvansalKcal += parseFloat(t.cal) || 0;
                else if (kaynak === 'bitkisel') bitkiselKcal += parseFloat(t.cal) || 0;
            }));
            const toplam = hayvansalKcal + bitkiselKcal;
            if (toplam <= 0) {
                return '<p class="form-not" style="margin-top:10px;">🥦 Protein kaynağı dağılımı: henüz sınıflandırılabilir kayıt yok (yemek/tatlı/içecek kategorileri hesaba katılmaz).</p>';
            }
            const hayvansalYuzde = Math.round((hayvansalKcal / toplam) * 100);
            const bitkiselYuzde = 100 - hayvansalYuzde;
            return '<p class="form-not" style="margin-top:10px;">🥦 Protein kaynağın: <strong style="color:var(--yazi-ana);">%' + hayvansalYuzde + ' hayvansal, %' + bitkiselYuzde + ' bitkisel</strong> (kaydettiklerinin kalori ağırlığına göre, kategori bazlı yaklaşık tahmin).</p>';
        }

        // Gün listesinden ortalama hesaplayan ortak yardımcı (Analiz ekranı kullanır)
        function hesaplaGunOrtalamalari(gunler) {
            const toplam = { kalori: 0, protein: 0, yag: 0, karb: 0 };
            let suToplam = 0, suGunSayisi = 0;
            gunler.forEach(g => {
                toplam.kalori += g.veriler.reduce((t, x) => t + parseFloat(x.cal), 0);
                toplam.protein += g.veriler.reduce((t, x) => t + parseFloat(x.pro), 0);
                toplam.yag += g.veriler.reduce((t, x) => t + parseFloat(x.yag), 0);
                toplam.karb += g.veriler.reduce((t, x) => t + parseFloat(x.karb), 0);
                if (g.su !== undefined && g.su !== null) { suToplam += g.su; suGunSayisi++; }
            });
            const n = gunler.length || 1;
            return {
                kalori: toplam.kalori / n,
                protein: toplam.protein / n,
                yag: toplam.yag / n,
                karb: toplam.karb / n,
                su: suGunSayisi > 0 ? suToplam / suGunSayisi : null
            };
        }

        // FAZ 7: Yazdırılabilir rapor — son 7 günün özetini #yazdirma-raporu div'ine yazar.
        // Ortalamalar hesaplaGunOrtalamalari ile, su/egzersiz/kilo mevcut yardımcılarla üretilir.
        function yazdirmaRaporuOlustur() {
            const hedefDiv = document.getElementById('yazdirma-raporu');
            if (!hedefDiv) return;
            const aktif = aktifProfiliGetir();

            const hepsi = [...aktif.gecmis];
            if (aktif.gunluk.length > 0) hepsi.push({ tarih: bugununTarihi, veriler: aktif.gunluk, su: aktif.su ? aktif.su.miktar : null });
            const son7 = hepsi.slice(-7);

            const satirlar = [];
            if (son7.length === 0) {
                satirlar.push('<p class="yr-not">Son 7 güne ait kayıt bulunmuyor.</p>');
            } else {
                const ilkTarih = son7[0].tarih;
                const sonTarih = son7[son7.length - 1].tarih;
                const ort = hesaplaGunOrtalamalari(son7);

                const suluGunler = son7.filter(g => g.su !== undefined && g.su !== null);
                const ortSu = suluGunler.length ? Math.round(suluGunler.reduce((t, g) => t + g.su, 0) / suluGunler.length) : null;

                let egzToplamDk = 0;
                son7.forEach(g => {
                    const aktivite = aktif.gunlukAktivite && aktif.gunlukAktivite[g.tarih];
                    if (aktivite && aktivite.egzersizler) {
                        aktivite.egzersizler.forEach(e => { egzToplamDk += parseFloat(e.sure) || 0; });
                    }
                });
                const ortEgz = son7.length ? Math.round(egzToplamDk / son7.length) : 0;

                let kiloDegisimYazi = null;
                if (aktif.kiloGecmisi && aktif.kiloGecmisi.length >= 2) {
                    const sirali = [...aktif.kiloGecmisi].sort((a, b) => tarihToDate(a.tarih) - tarihToDate(b.tarih));
                    const sinir = tarihToDate(bugununTarihi).getTime() - 7 * 86400000;
                    const haftalik = sirali.filter(k => tarihToDate(k.tarih).getTime() >= sinir);
                    if (haftalik.length >= 2) {
                        const d = haftalik[haftalik.length - 1].kilo - haftalik[0].kilo;
                        kiloDegisimYazi = (d >= 0 ? '+' : '') + kgGoster(Math.abs(d));
                    }
                }

                let ogunSatirlari = '';
                son7.forEach(g => {
                    const kcal = g.veriler.reduce((t, x) => t + parseFloat(x.cal), 0);
                    ogunSatirlari += '<tr><td>' + esc(formatTarihKisa(g.tarih)) + '</td><td>' + Math.round(kcal) + ' kcal</td><td>' + g.veriler.length + '</td></tr>';
                });

                satirlar.push(
                    '<table><tr><th>Tarih aralığı</th><td colspan="2">' + esc(formatTarihKisa(ilkTarih)) + ' – ' + esc(formatTarihKisa(sonTarih)) + ' (' + son7.length + ' gün)</td></tr>'
                    + '<tr><th>Ort. Kalori</th><td colspan="2">' + Math.round(ort.kalori) + ' kcal</td></tr>'
                    + '<tr><th>Ort. Protein</th><td colspan="2">' + Math.round(ort.protein) + ' g</td></tr>'
                    + '<tr><th>Ort. Yağ</th><td colspan="2">' + Math.round(ort.yag) + ' g</td></tr>'
                    + '<tr><th>Ort. Karbonhidrat</th><td colspan="2">' + Math.round(ort.karb) + ' g</td></tr>'
                    + '<tr><th>Ort. Su</th><td colspan="2">' + (ortSu !== null ? mlGoster(ortSu) : 'Kayıt yok') + '</td></tr>'
                    + '<tr><th>Ort. Egzersiz</th><td colspan="2">' + (egzToplamDk > 0 ? ortEgz + ' dk/gün' : 'Kayıt yok') + '</td></tr>'
                    + (kiloDegisimYazi !== null ? '<tr><th>Haftalık Kilo Değişimi</th><td colspan="2">' + kiloDegisimYazi + '</td></tr>' : '')
                    + '</table>'
                    + '<h3>Günlük Özet</h3>'
                    + '<table><tr><th>Gün</th><th>Toplam Kalori</th><th>Kayıt Sayısı</th></tr>' + ogunSatirlari + '</table>'
                );
            }

            hedefDiv.innerHTML =
                '<h2>' + esc(aktif.ad || 'Nutrio') + ' — Son 7 Gün Özet Raporu</h2>'
                + '<p class="yr-not">Rapor tarihi: ' + esc(formatTarihUzun(bugununTarihi)) + '</p>'
                + satirlar.join('');
        }

        function icgorulerGuncelle() {
            let aktif = aktifProfiliGetir();
            const alan = document.getElementById('icgoru-alan');
            if (!alan) return;
            const satirlar = [];

            const hepsi = [...aktif.gecmis];
            if (aktif.gunluk.length > 0) hepsi.push({ tarih: bugununTarihi, veriler: aktif.gunluk, su: aktif.su.miktar });

            if (hepsi.length >= 5) {
                // En sık tüketilen besinler (en az 5 günlük veri, en az 3 kez tüketilen)
                const sayac = new Map();
                hepsi.forEach(g => g.veriler.forEach(t => {
                    const key = (t.marka || '') + ' ' + t.ad;
                    sayac.set(key, (sayac.get(key) || 0) + 1);
                }));
                const top = [...sayac.entries()].filter(([, c]) => c >= 3).sort((a, b) => b[1] - a[1]).slice(0, 3);
                top.forEach(([ad, c]) => satirlar.push(`📊 ${esc(ad)}: son ${hepsi.length} günün ${c} gününde tüketilmiş`));

                // En sık tüketilen kategori
                const katSayac = new Map();
                hepsi.forEach(g => g.veriler.forEach(t => {
                    const b = besinler.find(x => x.id === t.besinId);
                    if (b && b.kategori) katSayac.set(b.kategori, (katSayac.get(b.kategori) || 0) + 1);
                }));
                const topKat = [...katSayac.entries()].sort((a, b) => b[1] - a[1])[0];
                if (topKat && topKat[1] >= 5) {
                    satirlar.push(`🏷 En çok tükettiğin kategori: ${esc(KATEGORI_ADI[topKat[0]] || topKat[0])} (${topKat[1]} kayıt)`);
                }

                // Kalori isabet oranı (en az 5 gün)
                const treffer = hepsi.filter(g => {
                    const kcal = g.veriler.reduce((t2, x) => t2 + parseFloat(x.cal), 0);
                    return aktif.kalori > 0 && kcal >= aktif.kalori * 0.9 && kcal <= aktif.kalori * 1.1;
                }).length;
                satirlar.push(`🎯 Kalori hedefini ±10% aralığında ${hepsi.length} günden ${treffer} gününde tutturmuşsun`);

                // Protein isabet oranı
                const proTreffer = hepsi.filter(g => {
                    const pro = g.veriler.reduce((t2, x) => t2 + parseFloat(x.pro), 0);
                    return aktif.pro > 0 && pro >= aktif.pro;
                }).length;
                satirlar.push(`🥩 Protein hedefini ${hepsi.length} günden ${proTreffer} gününde tutturmuşsun`);

                // Antrenman günleri vs dinlenme günleri kalori farkı (her ikisi için en az 2 gün)
                const antrenmanGunleri = (aktif.girdi && aktif.girdi.antrenmanGunleri) || [];
                if (antrenmanGunleri.length > 0) {
                    const antKal = [], dinKal = [];
                    hepsi.forEach(g => {
                        const kcal = g.veriler.reduce((t2, x) => t2 + parseFloat(x.cal), 0);
                        if (antrenmanGunleri.includes(tarihToDate(g.tarih).getDay())) antKal.push(kcal); else dinKal.push(kcal);
                    });
                    if (antKal.length >= 2 && dinKal.length >= 2) {
                        const fark = Math.round(antKal.reduce((a, b) => a + b, 0) / antKal.length - dinKal.reduce((a, b) => a + b, 0) / dinKal.length);
                        satirlar.push(`🏋️ Antrenman yaptığın günlerde ortalama ${fark >= 0 ? Math.round(fark) + ' kcal daha fazla' : Math.abs(fark) + ' kcal daha az'} yiyorsun.`);
                    }
                }

                // Hafta içi / hafta sonu kalori farkı (her iki grup için en az 2 gün)
                if (hepsi.length >= 8) {
                    const haftaIci = [], haftaSonu = [];
                    hepsi.forEach(g => {
                        const gun = tarihToDate(g.tarih).getDay();
                        const kcal = g.veriler.reduce((t2, x) => t2 + parseFloat(x.cal), 0);
                        if (gun === 0 || gun === 6) haftaSonu.push(kcal); else haftaIci.push(kcal);
                    });
                    if (haftaIci.length >= 2 && haftaSonu.length >= 2) {
                        const fark = Math.round(haftaSonu.reduce((a, b) => a + b, 0) / haftaSonu.length - haftaIci.reduce((a, b) => a + b, 0) / haftaIci.length);
                        if (Math.abs(fark) >= 100) {
                            satirlar.push(`📅 Hafta sonu ortalama ${fark >= 0 ? fark + ' kcal daha fazla' : Math.abs(fark) + ' kcal daha az'} tüketiyorsun.`);
                        }
                    }
                }

                // Haftanın günü analizi (en az 2 kayıtlı gün başına)
                if (hepsi.length >= 10) {
                    const guneGore = new Map();
                    hepsi.forEach(g => {
                        const d = tarihToDate(g.tarih).getDay();
                        const kcal = g.veriler.reduce((t2, x) => t2 + parseFloat(x.cal), 0);
                        if (!guneGore.has(d)) guneGore.set(d, []);
                        guneGore.get(d).push(kcal);
                    });
                    const veriliGunler = [...guneGore.entries()].filter(([, v]) => v.length >= 2);
                    if (veriliGunler.length >= 3) {
                        const min = veriliGunler.reduce((a, b) => b[1].reduce((x, y) => x + y, 0) / b[1].length < a[1].reduce((x, y) => x + y, 0) / a[1].length ? b : a);
                        satirlar.push(`📉 Kalorilerin en düşük kaldığı gün genellikle ${gunAdlari[min[0]]} oluyor.`);
                    }
                }

                // Su tüketim alışkanlığı — kayıtlı en az 5 gün ve fark belirginse
                const suluGunler = hepsi.filter(g => g.su !== undefined && g.su !== null);
                if (suluGunler.length >= 5 && aktif.suHedefMl > 0) {
                    const hedefeUlasan = suluGunler.filter(g => g.su >= aktif.suHedefMl).length;
                    if (hedefeUlasan === 0) {
                        satirlar.push(`💧 Son ${suluGunler.length} kayıtlı günde hiç su hedefine ulaşmamışsın. Su hedefin: ${aktif.suHedefMl} ml.`);
                    } else if (hedefeUlasan === suluGunler.length) {
                        satirlar.push(`💧 Harika: son ${suluGunler.length} kayıtlı günün hepsinde su hedefine ulaşmışsın!`);
                    }
                }

                // En sık tüketilen öğün (kahvaltı/öğle/akşam/ara) — en az 5 kayıt
                const ogunSayac = new Map();
                hepsi.forEach(g => g.veriler.forEach(t => {
                    if (t.ogun && t.ogun !== 'belirsiz') ogunSayac.set(t.ogun, (ogunSayac.get(t.ogun) || 0) + 1);
                }));
                const toplamOgunKaydi = [...ogunSayac.values()].reduce((a, b) => a + b, 0);
                if (toplamOgunKaydi >= 5) {
                    const enSikOgun = [...ogunSayac.entries()].sort((a, b) => b[1] - a[1])[0];
                    satirlar.push(`🍽 En sık kaydettiğin öğün: ${esc(OJUN_ADI[enSikOgun[0]] || enSikOgun[0])} (${enSikOgun[1]} kayıt)`);
                }
            }

            alan.innerHTML = satirlar.length > 0
                ? satirlar.map(s => `<div class="durum-satir"><span>${s}</span></div>`).join('')
                : '<div class="bos-durum">🧠 Kişisel analizler için en az 5 günlük kayıt gerekli. Kaydetmeye devam et, analizler burada belirecek.</div>';
        }

        async function gecmisMiktarDuzenle(gunIndex, ogeId) {
            let aktif = aktifProfiliGetir();
            let gun = aktif.gecmis[gunIndex];
            let oge = gun.veriler.find(x => x.id == ogeId);
            if (!oge.besinId) { bildirGoster('Bu eski kayıt miktar olarak düzenlenemiyor, sadece silinebilir.', 'hata'); return; }
            let besin = besinler.find(b => b.id === oge.besinId);
            if (!besin) { bildirGoster('Bu besin kütüphaneden silinmiş, düzenlenemiyor.', 'hata'); return; }

            const yeniMiktarStr = await modalGirdi(
                'Miktarı Düzenle',
                gorunenAd(oge) + ' — şu an ' + oge.miktar + ' ' + birimEtiket(besin.birim) + ' (' + oge.cal + ' kcal). Yeni miktar gir (' + besin.ref + ' ' + birimEtiket(besin.birim) + ' = ' + besin.cal + ' kcal):',
                String(oge.miktar),
                'Örn: ' + besin.ref
            );
            if (yeniMiktarStr === null) return;
            const yeniMiktar = parseFloat(yeniMiktarStr);
            if (!yeniMiktar || yeniMiktar <= 0) { bildirGoster('Geçersiz miktar', 'hata'); return; }

            const eskiOge = { ...oge };
            let carpan = yeniMiktar / besin.ref;
            oge.miktar = yeniMiktar;
            oge.cal = Math.round(besin.cal * carpan);
            oge.pro = (besin.pro * carpan).toFixed(1);
            oge.yag = (besin.yag * carpan).toFixed(1);
            oge.karb = (besin.karb * carpan).toFixed(1);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            gecmisListele();
            bildirGoster('Kayıt güncellendi', null, () => {
                Object.assign(oge, eskiOge);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                gecmisListele();
            });
        }

        function gecmisOgeSil(gunIndex, ogeId) {
            let aktif = aktifProfiliGetir();
            let gun = aktif.gecmis[gunIndex];
            const eskiOgeIndex = gun.veriler.findIndex(x => x.id == ogeId);
            const silinenOge = gun.veriler[eskiOgeIndex];
            if (!silinenOge) return;
            const gunSilindiMi = gun.veriler.length === 1;
            gun.veriler = gun.veriler.filter(x => x.id !== ogeId);
            if (gun.veriler.length === 0) aktif.gecmis.splice(gunIndex, 1);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            gecmisListele();
            bildirGoster('Kayıt silindi', null, () => {
                if (gunSilindiMi) {
                    aktif.gecmis.splice(gunIndex, 0, { tarih: gun.tarih, veriler: [silinenOge], su: gun.su });
                } else {
                    let guncelGun = aktif.gecmis.find(g => g.tarih === gun.tarih);
                    if (guncelGun) guncelGun.veriler.splice(Math.min(eskiOgeIndex, guncelGun.veriler.length), 0, silinenOge);
                }
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                gecmisListele();
            });
        }

        function gecmisGunuTekrarEt(gunIndex) {
            let aktif = aktifProfiliGetir();
            let gun = aktif.gecmis[gunIndex];
            if (!gun || gun.veriler.length === 0) return;
            gun.veriler.forEach(t => {
                aktif.gunluk.push({
                    id: benzersizId(), besinId: t.besinId, ad: t.ad, marka: t.marka || '', miktar: t.miktar, birim: t.birim,
                    cal: t.cal, pro: t.pro, yag: t.yag, karb: t.karb
                });
            });
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            bildirGoster('🔄 ' + gun.tarih + ' günü bugüne eklendi');
            sayfaGoster('ana-ekran');
        }

        // FAZ 13 — geçmiş sayfalama: ekran her açıldığında resetlenir, "Daha Fazla Yükle"
        // ile 20'şer gün büyür. Trend/Analiz/Karşılaştırma TAM arşivi kendi filtreleriyle
        // kullanmaya devam eder; bu sayaç yalnızca DOM render'ı sınırlar.
        let gecmisGosterilenGunSayisi = 20;

        function gecmisDahaFazlaYukle() {
            gecmisGosterilenGunSayisi += 20;
            gecmisListele();
        }

        function gecmisListele() {
            let aktif = aktifProfiliGetir();
            const liste = document.getElementById('gecmis-listesi');
            document.getElementById('gecmis-isim-bilgi').innerText = `Şu an ${aktif.ad} adlı kişinin arşivindesin.`;
            liste.innerHTML = '';
            trendGuncelle();
            analitikGuncelle();
            haftalikKarsilastirmaGuncelle();
            icgorulerGuncelle();

            if (aktif.gecmis.length === 0) {
                liste.innerHTML = bosDurumHtml('🗂', 'Arşiv boş', 'Geçmiş günlere ait kayıtlar burada birikir. Bugün bir şeyler kaydet ve ilk arşiv gününü oluştur.');
                return;
            }

            let tersArsiv = [...aktif.gecmis].reverse();
            // FAZ 13 — sayfalama: yalnızca en yeni N gün DOM'a basılır (O(n²) innerHTML birleştirme de diziyle değişti)
            const gorunurGunler = tersArsiv.slice(0, gecmisGosterilenGunSayisi);
            const parcalar = [];
            gorunurGunler.forEach(gun => {
                let gunIndexGercek = aktif.gecmis.findIndex(g => g.tarih === gun.tarih);
                parcalar.push(`<span class="gecmis-tarih" onclick="gunDetayAc('${esc(gun.tarih)}')">${esc(gun.tarih)}<button onclick="event.stopPropagation(); gecmisGunuTekrarEt(${gunIndexGercek})">🔄 Tekrar Ekle</button></span>`);
                let topCal = 0;
                gun.veriler.forEach(t => {
                    topCal += parseFloat(t.cal);
                    parcalar.push(`
                        <div class="liste-elemani" style="border-left-color:#3A3A3C; opacity:0.85; padding:12px;">
                            <div><strong>${esc(gorunenAd(t))}</strong><span class="liste-detay">${t.miktar} ${esc(t.birim ? birimEtiket(t.birim) : 'birim')}</span></div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <strong style="color:var(--yazi-ana);">${t.cal} kcal</strong>
                                <button class="btn-duzenle" style="padding:6px 9px;" onclick="gecmisMiktarDuzenle(${gunIndexGercek}, '${t.id}')">${ikon('duzenle', 14)}</button>
                                <button class="btn-tehlike" style="padding:6px 9px; border-radius:10px;" onclick="gecmisOgeSil(${gunIndexGercek}, '${t.id}')">${ikon('sil', 14)}</button>
                            </div>
                        </div>`);
                });
                parcalar.push(`<div style="text-align:right; font-size:14px; font-weight:800; margin-bottom:20px; color:var(--yazi-ana);">Toplam: ${Math.round(topCal)} kcal</div>`);
            });
            const kalanGun = tersArsiv.length - gorunurGunler.length;
            if (kalanGun > 0) {
                parcalar.push(`<button class="btn-ikincil" style="width:100%; margin-bottom:20px;" onclick="gecmisDahaFazlaYukle()">⬇ Daha Fazla Yükle (kalan ${kalanGun} gün)</button>`);
            }
            liste.innerHTML = parcalar.join('');
        }

        // KİLO TAKİBİ
        function olcumAlaniAcKapa() {
            document.getElementById('olcum-alani').classList.toggle('gizli');
            let acik = !document.getElementById('olcum-alani').classList.contains('gizli');
            document.getElementById('olcum-toggle-yazi').innerText = acik ? '− Vücut ölçülerini gizle' : '+ Vücut ölçüleri ekle (opsiyonel)';
        }

        const olcumEtiketleri = { bel: 'Bel', boyun: 'Boyun', gogus: 'Göğüs', kol: 'Kol', kalca: 'Kalça', bacak: 'Bacak' };

        function olcumSekmeleriOlustur(mevcutTurler) {
            const alan = document.getElementById('olcum-sekmeler');
            alan.innerHTML = mevcutTurler.map(k => '<button class="sekme-btn ' + (olcumAktifTur === k ? 'aktif' : '') + '" onclick="olcumTurSec(\'' + k + '\')">' + esc(olcumEtiketleri[k]) + '</button>').join('');
        }

        function olcumTurSec(tur) { olcumAktifTur = tur; kiloEkraniGuncelle(); }

        // Kilo grafiği zaman aralığı — yalnızca görsel pencere; hesaplamalar (başlangıç/
        // bugün/değişim/haftalık/hedef tahmini) her zaman TÜM geçmişe göre yapılır.
        // Kilo verisi seyrek girildiği için varsayılan tüm geçmiş.
        let kiloZamanAraligi = 'tumu';

        function kiloZamanAraligiSec(deger) {
            kiloZamanAraligi = deger === 'tumu' ? 'tumu' : (parseInt(deger, 10) || 'tumu');
            kiloEkraniGuncelle();
        }

        function kiloZamanAraligiSekmeleriOlustur() {
            const alan = document.getElementById('kilo-zaman-sekmeler');
            if (!alan) return;
            const secenekler = [
                { deger: 30, ad: '30G' },
                { deger: 90, ad: '90G' },
                { deger: 365, ad: '1Y' },
                { deger: 'tumu', ad: 'Tümü' }
            ];
            alan.innerHTML = secenekler.map(s =>
                '<button class="sekme-btn ' + (kiloZamanAraligi === s.deger ? 'aktif' : '') + '" onclick="kiloZamanAraligiSec(\'' + s.deger + '\')">' + s.ad + '</button>'
            ).join('');
        }

        function kiloEkraniGuncelle() {
            let aktif = aktifProfiliGetir();
            if (!aktif.kiloGecmisi) aktif.kiloGecmisi = [];
            // Kilo girişi tarih seçici: boşsa bugüne set et (ISO format, <input type="date"> uyumu)
            const kiloTarihInput = document.getElementById('kilo-tarih');
            if (kiloTarihInput && !kiloTarihInput.value) kiloTarihInput.value = trTarihtenIso(bugununTarihi);
            let gecmis = [...aktif.kiloGecmisi].sort((a, b) => tarihToDate(a.tarih) - tarihToDate(b.tarih));
            let baslangic = (aktif.baslangicKilosu !== undefined && aktif.baslangicKilosu !== null)
                ? aktif.baslangicKilosu
                : (gecmis.length ? gecmis[0].kilo : aktif.girdi.kilo);
            let bugun = gecmis.length ? gecmis[gecmis.length - 1].kilo : aktif.girdi.kilo;
            let degisim = bugun - baslangic;

            document.getElementById('kilo-baslangic').innerText = kgGoster(baslangic);
            document.getElementById('kilo-bugun').innerText = kgGoster(bugun);
            document.getElementById('kilo-hedef-nokta').innerText = '🎯 ' + (aktif.hedefKilo ? kgGoster(aktif.hedefKilo) : '-');

            const grafikAlan = document.getElementById('kilo-grafik-alan');
            kiloZamanAraligiSekmeleriOlustur();
            // Zaman aralığı filtresi SADECE grafiği etkiler — kart değerleri tüm geçmişi kullanır
            let grafikVerisi = kiloZamanAraligi === 'tumu'
                ? gecmis
                : gecmis.filter(g => { const f = tarihFarkiGun(bugununTarihi, g.tarih); return f >= 0 && f < kiloZamanAraligi; });
            let tarihler = grafikVerisi.map(g => g.tarih);
            grafikAlan.innerHTML = grafikVerisi.length >= 2
                ? svgCokluSeriGrafik([
                    { degerler: grafikVerisi.map(g => g.kilo), renk: 'var(--vurgu-renk)', ad: 'Kilo' },
                    { degerler: hareketliOrtalama(grafikVerisi.map(g => g.kilo), 7), renk: 'var(--yazi-pasif)', ad: 'Hareketli Ort.', kesikli: true }
                ], 320, 120, {
                    etiketler: tarihler, birim: birimImperialMi() ? 'lb' : 'kg', hedefCizgi: aktif.hedefKilo,
                    eksenGoster: true, gridlineSayisi: 3, xEtiketSayisi: 4,
                    xEtiketler: tarihler.map(tarihEtiketKisa)
                })
                : '<div class="bos-durum">📉 Grafik için en az 2 kayıt gerekli.</div>';
            grafikTiklamalariBagla('kilo-grafik-alan');

            let degisimEl = document.getElementById('kilo-degisim');
            degisimEl.innerText = (degisim >= 0 ? '+' : '') + kgGoster(Math.abs(degisim));
            degisimEl.style.color = degisim > 0 ? 'var(--tehlike-renk)' : (degisim < 0 ? 'var(--basari-renk)' : 'var(--yazi-ana)');

            // Haftalık değişim: son 14 günlük veriden, 7 günlük hareketli ortalama ile
            // yumuşatılmış hız (kalibrasyon kartıyla aynı ortak fonksiyon — tutarlı sayı)
            let simdi = tarihToDate(bugununTarihi);
            let haftalikDegisim = haftalikKiloHiziHesapla(gecmis, 14);
            if (haftalikDegisim === null) haftalikDegisim = 0;
            let haftalikEl = document.getElementById('kilo-haftalik');
            // Haftalık hız kg cinsinden hesaplanır; imperial'de lb/hafta olarak gösterilir
            let haftalikMetin = birimImperialMi()
                ? (haftalikDegisim >= 0 ? '+' : '') + (haftalikDegisim * LB_KG).toFixed(2) + ' lb/hafta'
                : (haftalikDegisim >= 0 ? '+' : '') + haftalikDegisim.toFixed(2) + ' kg/hafta';
            haftalikEl.innerText = haftalikMetin;
            haftalikEl.style.color = haftalikDegisim > 0 ? 'var(--tehlike-renk)' : (haftalikDegisim < 0 ? 'var(--basari-renk)' : 'var(--yazi-ana)');

            document.getElementById('kilo-hedef-input').value = aktif.hedefKilo ? kgSayiGoster(aktif.hedefKilo) : '';
            let hedefYaziEl = document.getElementById('kilo-hedef-bilgi');
            let tahminEl = document.getElementById('kilo-tahmin-bilgi');
            if (aktif.hedefKilo) {
                let kalan = aktif.hedefKilo - bugun;
                hedefYaziEl.innerText = '🎯 Hedef: ' + kgGoster(aktif.hedefKilo) + ' — Kalan: ' + kgGoster(Math.abs(kalan)) + ' ' + (kalan > 0 ? 'almak' : 'vermek') + ' gerekiyor';
                hedefYaziEl.classList.remove('gizli');

                let dogruYonde = (kalan > 0 && haftalikDegisim > 0) || (kalan < 0 && haftalikDegisim < 0);
                if (dogruYonde && Math.abs(haftalikDegisim) > 0.01) {
                    let haftaSayisi = Math.abs(kalan / haftalikDegisim);
                    let tahminiTarih = new Date(simdi.getTime() + haftaSayisi * 7 * 86400000);
                    tahminEl.innerText = '📅 Tahmini hedef tarihi: ' + tahminiTarih.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
                    tahminEl.classList.remove('gizli');
                } else {
                    tahminEl.classList.add('gizli');
                }
            } else {
                hedefYaziEl.classList.add('gizli');
                tahminEl.classList.add('gizli');
            }

            // Vücut ölçüleri grafiği
            let mevcutTurler = Object.keys(olcumEtiketleri).filter(k => gecmis.some(g => g.olcumler && g.olcumler[k] !== undefined));
            const olcumKart = document.getElementById('olcum-grafik-karti');
            if (mevcutTurler.length === 0) {
                olcumKart.style.display = 'none';
            } else {
                olcumKart.style.display = 'block';
                if (!mevcutTurler.includes(olcumAktifTur)) olcumAktifTur = mevcutTurler[0];
                olcumSekmeleriOlustur(mevcutTurler);
                let olcumKayitlari = gecmis.filter(g => g.olcumler && g.olcumler[olcumAktifTur] !== undefined);
                const olcumAlan = document.getElementById('olcum-grafik-alan');
                if (olcumKayitlari.length >= 2) {
                    olcumAlan.innerHTML = svgCokluSeriGrafik([
                        { degerler: olcumKayitlari.map(g => g.olcumler[olcumAktifTur]), renk: 'var(--vurgu-renk)', ad: olcumEtiketleri[olcumAktifTur] }
                    ], 320, 90, {
                        etiketler: olcumKayitlari.map(g => g.tarih), birim: birimImperialMi() ? 'inç' : 'cm',
                        eksenGoster: true, gridlineSayisi: 3, xEtiketSayisi: 3,
                        xEtiketler: olcumKayitlari.map(g => tarihEtiketKisa(g.tarih))
                    });
                    grafikTiklamalariBagla('olcum-grafik-alan');
                } else {
                    olcumAlan.innerHTML = '<div class="bos-durum">📏 Bu ölçüm için en az 2 kayıt gerekli.</div>';
                }
            }

            let liste = document.getElementById('kilo-listesi');
            liste.innerHTML = '';
            if (gecmis.length === 0) {
                liste.innerHTML = '<div class="bos-durum">📉 Henüz kilo kaydı yok. Yukarıdan ilk kaydını ekle.</div>';
                return;
            }
            liste.innerHTML = [...gecmis].reverse().map((g, revIdx) => {
                let olcumMetni = '';
                if (g.olcumler) {
                    let parcalar = [];
                    Object.keys(olcumEtiketleri).forEach(k => { if (g.olcumler[k]) parcalar.push(olcumEtiketleri[k] + ': ' + cmGoster(g.olcumler[k])); });
                    if (parcalar.length) olcumMetni = '<span class="liste-detay">' + esc(parcalar.join(' · ')) + '</span>';
                }
                return `<div class="liste-elemani"><div><strong>${kgGoster(g.kilo)}</strong><span class="liste-detay">${esc(g.tarih)}</span>${olcumMetni}</div><button class="btn-tehlike" style="border-radius:12px;" onclick="kiloSil('${g.id}')" aria-label="Sil">${ikon('sil', 14)}</button></div>`;
            }).join('');
        }

        function kiloEkle() {
            let hamDeger = parseFloat(document.getElementById('kilo-yeni').value);
            if (!hamDeger || hamDeger <= 0) { bildirGoster('Geçerli bir kilo gir', 'hata'); return; }
            // Aktif birimden (lb/inç) okunup HER ZAMAN kg/cm'e çevrilerek kaydedilir
            let deger = kgParseGirdi(hamDeger);
            // Makul aralık kontrolü — açık yanlış girişleri (5, 500 gibi) engeller
            if (deger < 20 || deger > 400) { bildirGoster('Girdiğin değer gerçekçi görünmüyor (20-400 kg arası olmalı)', 'hata'); return; }
            // Tarih: seçildiyse o gün, yoksa bugün (ISO -> tr-TR formatına çevir)
            let kayitTarihi = bugununTarihi;
            const tarihInput = document.getElementById('kilo-tarih');
            if (tarihInput && tarihInput.value) {
                const [y, a, g] = tarihInput.value.split('-').map(Number);
                kayitTarihi = g + '.' + a + '.' + y;
                if (tarihFarkiGun(kayitTarihi, bugununTarihi) > 0) { bildirGoster('İleri bir tarihe kayıt giremezsin', 'hata'); return; }
            }
            let aktif = aktifProfiliGetir();
            if (!aktif.kiloGecmisi) aktif.kiloGecmisi = [];

            let olcumler = {};
            let olcumAlaniVarMi = !document.getElementById('olcum-alani').classList.contains('gizli');
            if (olcumAlaniVarMi) {
                ['bel', 'boyun', 'gogus', 'kol', 'kalca', 'bacak'].forEach(k => {
                    let v = parseFloat(document.getElementById('oc-' + k).value);
                    if (v) olcumler[k] = Math.round(cmParseGirdi(v) * 10) / 10;
                });
            }
            let olcumVarMi = Object.keys(olcumler).length > 0;

            let bugunkuKayit = aktif.kiloGecmisi.find(g => g.tarih === kayitTarihi);
            if (bugunkuKayit) {
                bugunkuKayit.kilo = deger;
                if (olcumVarMi) bugunkuKayit.olcumler = olcumler;
            } else {
                let yeniKayit = { id: benzersizId(), tarih: kayitTarihi, kilo: deger };
                if (olcumVarMi) yeniKayit.olcumler = olcumler;
                aktif.kiloGecmisi.push(yeniKayit);
            }
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('kilo-yeni').value = '';
            if (tarihInput) tarihInput.value = trTarihtenIso(bugununTarihi);
            ['bel', 'boyun', 'gogus', 'kol', 'kalca', 'bacak'].forEach(k => document.getElementById('oc-' + k).value = '');
            kiloEkraniGuncelle();
            bildirGoster('⚖ Kilo kaydedildi');
        }

        // tr-TR (GG.AA.YYYY) -> ISO (YYYY-MM-DD) — <input type="date"> uyumu
        function trTarihtenIso(tarihStr) {
            const [g, a, y] = tarihStr.split('.').map(Number);
            return y + '-' + String(a).padStart(2, '0') + '-' + String(g).padStart(2, '0');
        }

        function kiloSil(id) {
            let aktif = aktifProfiliGetir();
            const eskiIndex = aktif.kiloGecmisi.findIndex(g => g.id == id);
            const silinen = aktif.kiloGecmisi[eskiIndex];
            if (!silinen) return;
            aktif.kiloGecmisi = aktif.kiloGecmisi.filter(g => g.id != id);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            kiloEkraniGuncelle();
            bildirGoster('Kayıt silindi', null, () => {
                aktif.kiloGecmisi.splice(Math.min(eskiIndex, aktif.kiloGecmisi.length), 0, silinen);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                kiloEkraniGuncelle();
            });
        }

        function kiloHedefKaydet() {
            let aktif = aktifProfiliGetir();
            let hamDeger = parseFloat(document.getElementById('kilo-hedef-input').value);
            // Aktif birimden okunup HER ZAMAN kg olarak saklanır
            let deger = hamDeger ? kgParseGirdi(hamDeger) : hamDeger;
            aktif.hedefKilo = deger || null;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            kiloEkraniGuncelle();
            bildirGoster('Hedef kilo kaydedildi');
        }

        // FAZ 13 — localStorage doluluk göstergesi: tipik tarayıcı limiti ~5MB varsayımıyla
        // yüzde hesaplar. %80 üstünde uyarı rengi + "Şimdi Yedekle" linki gösterir.
        function depolamaDurumuGoster() {
            const gosterge = document.getElementById('depolama-durum-alan');
            if (!gosterge) return;
            let toplamKarakter = 0;
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const anahtar = localStorage.key(i);
                    toplamKarakter += (anahtar ? anahtar.length : 0) + (localStorage.getItem(anahtar) || '').length;
                }
            } catch (e) { gosterge.innerHTML = ''; return; }
            const limit = 5 * 1024 * 1024;
            const yuzde = Math.min(100, Math.round((toplamKarakter / limit) * 100));
            let html = '<div class="mini-satir" style="margin-top:10px;"><span>Depolama kullanımı</span><span class="hedef-yazi" style="margin-top:0;">%' + yuzde + '</span></div>';
            if (yuzde >= 80) {
                html += '<p class="form-not" style="margin-top:6px; color:var(--tehlike-renk); font-weight:700;">⚠ Depolama neredeyse dolu — verilerin kaybolmasın diye şimdi yedek al.</p>' +
                    '<span class="hedef-yazi" style="cursor:pointer; text-decoration:underline; display:inline-block; margin-top:4px;" onclick="veriDisaAktar()">Şimdi Yedekle</span>';
            } else {
                html += '<p class="form-not" style="margin-top:6px;">Kayıtların bu tarayıcıda güvenle saklanıyor.</p>';
            }
            gosterge.innerHTML = html;
        }

        // ══════════ FAZ 13: INDEXEDDB OTOMATİK YEREL YEDEK ══════════
        // BULUT yedeği DEĞİLDİR: localStorage ile aynı tarayıcıda İKİNCİ bir yerel kopya tutar
        // (tek slot, üzerine yazar — disk şişirmez). Kullanıcının normal dışa aktarmasının
        // YERİNE geçmez; manuel yedeği unutan kullanıcıya ekstra güvence sağlar.
        // IndexedDB desteklenmiyorsa (çok nadir) sessizce hiçbir şey yapmaz, hata fırlatmaz
        // (diğer hatırlatıcı fonksiyonlarındaki savunmacı try/catch deseniyle AYNI).
        const YEDEK_ANAHTARLARI = ['df_besinler', 'df_profiller', 'df_aktif_profil_id', 'df_favoriler', 'df_takviyeler', 'df_sablonlar'];

        function otomatikYedekDbAc() {
            return new Promise((resolve, reject) => {
                if (typeof indexedDB === 'undefined') { reject(new Error('IndexedDB desteklenmiyor')); return; }
                const istek = indexedDB.open('nutrio-otomatik-yedek', 1);
                istek.onupgradeneeded = () => {
                    if (!istek.result.objectStoreNames.contains('yedekler')) istek.result.createObjectStore('yedekler', { keyPath: 'id' });
                };
                istek.onsuccess = () => resolve(istek.result);
                istek.onerror = () => reject(istek.error || new Error('IndexedDB açılamadı'));
            });
        }

        // FAZ 17 — Tek slot ("son") yerine zaman damgalı çoklu kayıt: her yedek ayrı
        // bir id ile saklanır, en yeni 10 tanesi tutulur, eskiler otomatik budanır.
        async function otomatikYedekKaydet(manuel) {
            try {
                const veri = {};
                YEDEK_ANAHTARLARI.forEach(k => {
                    const v = localStorage.getItem(k);
                    if (v !== null) veri[k] = JSON.parse(v);
                });
                const db = await otomatikYedekDbAc();
                const kayit = { id: Date.now(), veri: veri, tarih: bugununTarihi, saat: new Date().toLocaleTimeString('tr-TR'), tip: manuel ? 'manuel' : 'otomatik' };
                await new Promise((resolve, reject) => {
                    const tx = db.transaction('yedekler', 'readwrite');
                    tx.objectStore('yedekler').put(kayit);
                    tx.oncomplete = resolve;
                    tx.onerror = () => reject(tx.error || new Error('Yedek yazılamadı'));
                    tx.onabort = () => reject(tx.error || new Error('Yedek yazımı durduruldu'));
                });
                // Budama: en yeni 10 kayıt dışındakileri sil
                await new Promise((resolve) => {
                    const tx2 = db.transaction('yedekler', 'readwrite');
                    const store = tx2.objectStore('yedekler');
                    const istek = store.getAllKeys();
                    istek.onsuccess = () => {
                        const anahtarlar = istek.result.slice().sort((a, b) => b - a);
                        anahtarlar.slice(10).forEach(k => store.delete(k));
                        resolve();
                    };
                    istek.onerror = () => resolve();
                });
                db.close();
                localStorage.setItem('df_son_otomatik_yedek_tarihi', bugununTarihi);
            } catch (e) { /* sessizce yoksay — yedek başarısız olsa da uygulama çalışmaya devam eder */ }
        }
        async function otomatikYedekListesiGetir() {
            try {
                const db = await otomatikYedekDbAc();
                const liste = await new Promise((resolve, reject) => {
                    const tx = db.transaction('yedekler', 'readonly');
                    const istek = tx.objectStore('yedekler').getAll();
                    istek.onsuccess = () => resolve(istek.result || []);
                    istek.onerror = () => reject(istek.error);
                });
                db.close();
                return liste.sort((a, b) => b.id - a.id);
            } catch (e) { return []; }
        }
        async function otomatikYedekGecmisiCiz() {
            const alan = document.getElementById('oy-liste');
            if (!alan) return;
            alan.innerHTML = '<div class="bos-durum">Yükleniyor...</div>';
            const liste = await otomatikYedekListesiGetir();
            if (liste.length === 0) { alan.innerHTML = '<div class="bos-durum">Henüz otomatik yedek alınmadı.</div>'; return; }
            alan.innerHTML = liste.map(k =>
                '<div class="mini-satir"><span>' + esc(k.tarih) + ' ' + esc(k.saat || '') + (k.tip === 'manuel' ? ' · manuel' : '') + '</span><button class="btn-kucuk" onclick="otomatikYedekGeriYukle(' + k.id + ')">Geri Yükle</button></div>'
            ).join('');
        }
        async function otomatikYedekGeriYukle(id) {
            if (!confirm('Bu yedeği geri yüklemek şu anki verilerinin üzerine yazacak. Emin misin?')) return;
            try {
                const db = await otomatikYedekDbAc();
                const kayit = await new Promise((resolve, reject) => {
                    const tx = db.transaction('yedekler', 'readonly');
                    const istek = tx.objectStore('yedekler').get(id);
                    istek.onsuccess = () => resolve(istek.result);
                    istek.onerror = () => reject(istek.error);
                });
                db.close();
                if (!kayit) { bildirGoster('Yedek bulunamadı', 'hata'); return; }
                Object.keys(kayit.veri).forEach(k => {
                    localStorage.setItem(k, JSON.stringify(kayit.veri[k]));
                });
                bildirGoster('Yedek geri yüklendi, sayfa yenileniyor...');
                setTimeout(() => location.reload(), 1200);
            } catch (e) {
                bildirGoster('Geri yükleme başarısız oldu', 'hata');
            }
        }
        function otomatikYedekSimdiAl() {
            otomatikYedekKaydet(true).then(() => {
                bildirGoster('🗄 Manuel yedek alındı');
                otomatikYedekTarihiGoster();
                otomatikYedekGecmisiCiz();
            });
        }

        function otomatikYedekTarihiGoster() {
            const alan = document.getElementById('otomatik-yedek-tarih-alan');
            if (!alan) return;
            let tarih = null;
            try { tarih = localStorage.getItem('df_son_otomatik_yedek_tarihi'); } catch (e) { tarih = null; }
            alan.textContent = tarih
                ? 'Son otomatik yedek: ' + tarih + ' (bu, elle dışa aktarmanın yerine geçmez — sadece ikinci bir yerel kopyadır)'
                : 'Son otomatik yedek: henüz alınmadı (bu, elle dışa aktarmanın yerine geçmez — sadece ikinci bir yerel kopyadır)';
        }

        // Günde yalnızca BİR KEZ tetikleme: df_son_otomatik_yedek_tarihi bugünden
        // farklıysa yedekle. baslangicKontrolu'nün tarihKontrol çağrısına bitişik çalışır.
        function otomatikYedekGerekirseCalistir() {
            try {
                if (typeof indexedDB === 'undefined') return;
                if (localStorage.getItem('df_son_otomatik_yedek_tarihi') !== bugununTarihi) {
                    otomatikYedekKaydet();
                }
            } catch (e) { /* sessizce yoksay */ }
        }

        // DIŞA / İÇE AKTARIM
        function veriDisaAktar() {            let veri = {
                df_besinler: JSON.parse(localStorage.getItem('df_besinler') || '[]'),
                df_profiller: JSON.parse(localStorage.getItem('df_profiller') || '[]'),
                df_aktif_profil_id: localStorage.getItem('df_aktif_profil_id'),
                df_favoriler: JSON.parse(localStorage.getItem('df_favoriler') || '[]'),
                df_takviyeler: JSON.parse(localStorage.getItem('df_takviyeler') || '[]'),
                df_sablonlar: JSON.parse(localStorage.getItem('df_sablonlar') || '[]'),
                disaAktarimTarihi: bugununTarihi
            };
            let blob = new Blob([JSON.stringify(veri, null, 2)], { type: 'application/json' });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'nutrio-yedek-' + bugununTarihi.split('.').join('-') + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            localStorage.setItem('df_son_yedek_tarihi', bugununTarihi);
            bildirGoster('⬇ Veriler dışa aktarıldı');
        }

        // İÇE AKTARMA DOĞRULAMA — bozuk/eksik JSON asla localStorage'a yazılmaz.
        // Önce validate, sonra güvenlik yedeği, sonra import. Başarısızsa mevcut veri korunur.
        function veriIceAktarDogrula(veri) {
            const hatalar = [];
            if (veri === null || typeof veri !== 'object' || Array.isArray(veri)) {
                return ['Dosya içeriği beklenen yapıda değil (nesne bekleniyor).'];
            }
            const arrayAlanlari = ['df_besinler', 'df_profiller', 'df_favoriler', 'df_takviyeler', 'df_sablonlar'];
            for (const alan of arrayAlanlari) {
                if (veri[alan] !== undefined && !Array.isArray(veri[alan])) {
                    hatalar.push(alan + ' bir dizi (array) olmalı.');
                }
            }
            if (hatalar.length > 0) return hatalar;

            // besin nesneleri: ad + kategori + sayısal değerler
            (veri.df_besinler || []).forEach((b, i) => {
                if (!b || typeof b !== 'object') { hatalar.push('df_besinler[' + i + '] nesne değil.'); return; }
                if (!b.ad || typeof b.ad !== 'string') hatalar.push('df_besinler[' + i + '].ad eksik veya geçersiz.');
                if (b.id === undefined || b.id === null) hatalar.push('df_besinler[' + i + '].id eksik.');
                ['cal', 'pro', 'yag', 'karb', 'ref'].forEach(alan => {
                    if (b[alan] !== undefined && (typeof b[alan] !== 'number' || b[alan] < 0)) {
                        hatalar.push('df_besinler[' + i + '].' + alan + ' geçersiz (negatif veya sayı değil).');
                    }
                });
            });
            // profil nesneleri: ad + girdi
            (veri.df_profiller || []).forEach((p, i) => {
                if (!p || typeof p !== 'object') { hatalar.push('df_profiller[' + i + '] nesne değil.'); return; }
                if (!p.ad || typeof p.ad !== 'string') hatalar.push('df_profiller[' + i + '].ad eksik veya geçersiz.');
                if (p.id === undefined || p.id === null) hatalar.push('df_profiller[' + i + '].id eksik.');
                if (p.girdi !== undefined && (typeof p.girdi !== 'object' || p.girdi === null)) {
                    hatalar.push('df_profiller[' + i + '].girdi geçersiz.');
                }
            });
            // favoriler: id dizisi
            (veri.df_favoriler || []).forEach((f, i) => {
                if (f === null || f === undefined) hatalar.push('df_favoriler[' + i + '] boş.');
            });
            return hatalar;
        }

        function veriIceAktar(event) {
            let dosya = event.target.files[0];
            if (!dosya) return;
            let okuyucu = new FileReader();
            okuyucu.onload = async function (e) {
                let veri;
                try {
                    veri = JSON.parse(e.target.result);
                } catch (err) {
                    await modalUyari('İçe Aktarma Başarısız', 'Dosya geçerli bir JSON değil. Mevcut verilerine hiçbir şey olmadı.');
                    return;
                }
                const hatalar = veriIceAktarDogrula(veri);
                if (hatalar.length > 0) {
                    await modalUyari('İçe Aktarma Başarısız', 'Dosyada ' + hatalar.length + ' sorun bulundu (ilk sorun: ' + hatalar[0] + '). Mevcut verilerine hiçbir şey yazılmadı.');
                    return;
                }
                const onay = await modalOnay(
                    'Verileri İçe Aktar',
                    'Bu içe aktarma, tarayıcıdaki mevcut verilerin üzerine yazacak. İşlem öncesi otomatik güvenlik yedeği alınacak. Devam edilsin mi?',
                    true
                );
                if (!onay) return;

                // Güvenlik yedeği — mevcut tüm veriyi df_son_yedek anahtarına kaydet
                const yedek = {};
                ['df_besinler', 'df_profiller', 'df_aktif_profil_id', 'df_favoriler', 'df_takviyeler', 'df_sablonlar'].forEach(k => {
                    const v = localStorage.getItem(k);
                    if (v !== null) yedek[k] = v;
                });
                localStorage.setItem('df_son_yedek', JSON.stringify(yedek));

                try {
                    if (veri.df_besinler) localStorage.setItem('df_besinler', JSON.stringify(veri.df_besinler));
                    if (veri.df_profiller) localStorage.setItem('df_profiller', JSON.stringify(veri.df_profiller));
                    if (veri.df_aktif_profil_id) localStorage.setItem('df_aktif_profil_id', veri.df_aktif_profil_id);
                    if (veri.df_favoriler) localStorage.setItem('df_favoriler', JSON.stringify(veri.df_favoriler));
                    if (veri.df_takviyeler) localStorage.setItem('df_takviyeler', JSON.stringify(veri.df_takviyeler));
                    if (veri.df_sablonlar) localStorage.setItem('df_sablonlar', JSON.stringify(veri.df_sablonlar));
                } catch (err) {
                    // import sırasında hata — yedekten geri yükle
                    Object.entries(yedek).forEach(([k, v]) => localStorage.setItem(k, v));
                    await modalUyari('İçe Aktarma Başarısız', 'Yazma sırasında hata oluştu, mevcut verileriniz yedekten geri yüklendi.');
                    return;
                }
                localStorage.setItem('df_son_yedek_tarihi', bugununTarihi);
                bildirGoster('✓ Veriler içe aktarıldı, sayfa yenileniyor...');
                setTimeout(() => location.reload(), 900);
            };
            okuyucu.readAsText(dosya);
        }

        // TÜM VERİLERİ SİL — Nutrio modal çift onaylı, geri alınamaz tehlikeli işlem
        async function veriSifirlaBaslat() {
            const onay1 = await modalOnay(
                'Tüm Verileri Sil',
                'Bu işlem TÜM profilleri, besin kütüphanenizi, geçmişinizi ve ayarlarınızı kalıcı olarak silecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?',
                true
            );
            if (!onay1) return;
            const onay2 = await modalOnay(
                'Son Onay',
                'Son kez soruyoruz: verilerinizi dışa aktardınız mı? Onaylarsanız her şey silinecek ve sıfırdan başlayacaksınız.',
                true
            );
            if (!onay2) return;
            ['df_besinler', 'df_profiller', 'df_aktif_profil_id', 'df_favoriler', 'df_takviyeler', 'df_sablonlar'].forEach(k => localStorage.removeItem(k));
            bildirGoster('🗑 Tüm veriler silindi, sayfa yenileniyor...');
            setTimeout(() => location.reload(), 900);
        }

        // PWA KURULUM BİLGİSİ — tarayıcı "beforeinstallprompt" tetiklediyse yükleme butonu göster
        let pwaBekleyenYukleme = null;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            pwaBekleyenYukleme = e;
            pwaKurulumBilgiGuncelle();
        });
        window.addEventListener('appinstalled', () => {
            pwaBekleyenYukleme = null;
            pwaKurulumBilgiGuncelle();
        });

        function pwaKurulumBilgiGuncelle() {
            const bilgi = document.getElementById('pwa-kurulum-bilgi');
            if (!bilgi) return;
            const baglantiButonu = document.getElementById('pwa-kur-btn');
            const protocol = location.protocol;
            let durum;
            if (protocol === 'file:') {
                durum = 'Uygulama şu an dosya (file://) üzerinden açılmış. Yüklenebilir PWA özellikleri (offline kullanım, ana ekrana ekleme) yalnızca HTTPS veya localhost üzerinden çalışır.';
                if (baglantiButonu) baglantiButonu.classList.add('gizli');
            } else if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
                durum = 'Nutrio uygulama olarak yüklü. 🎉';
                if (baglantiButonu) baglantiButonu.classList.add('gizli');
            } else if (pwaBekleyenYukleme) {
                durum = 'Nutrio\'yu cihazına uygulama olarak yükleyebilirsin: ana ekrana eklenir, tam ekran açılır ve çevrimdışı çalışır.';
                if (baglantiButonu) baglantiButonu.classList.remove('gizli');
            } else {
                durum = 'Yükleme butonu bu tarayıcıda henüz aktif olmadı. iOS Safari: Paylaş → "Ana Ekrana Ekle". Chrome/Edge (mobil): menü → "Uygulamayı yükle". Masaüstü: adres çubuğundaki yükleme simgesi.';
                if (baglantiButonu) baglantiButonu.classList.add('gizli');
            }
            bilgi.innerText = durum;
        }

        async function pwaKur() {
            if (!pwaBekleyenYukleme) return;
            pwaBekleyenYukleme.prompt();
            const sonuc = await pwaBekleyenYukleme.userChoice;
            if (sonuc && sonuc.outcome === 'accepted') bildirGoster('Nutrio yüklendi 🎉');
            pwaBekleyenYukleme = null;
            pwaKurulumBilgiGuncelle();
        }

        // GÜN DETAY — herhangi bir tarihin tam görünümü (geçmiş düzenlenebilir, bugün canlı)
        let gunDetayAktifTarih = null;

        function gunVerisiGetir(aktif, tarih) {
            // GÜN = tarih: bugün canlı veriden, geçmiş arşivden okunur — aynı veri modeli
            if (tarih === bugununTarihi) {
                return { tarih, veriler: aktif.gunluk, su: aktif.su.miktar, bugunMu: true };
            }
            const kayit = aktif.gecmis.find(g => g.tarih === tarih);
            return kayit ? { ...kayit, bugunMu: false } : { tarih, veriler: [], su: null, bugunMu: false };
        }

        function gunDetayAc(tarih) {
            gunDetayAktifTarih = tarih;
            sayfaGoster('gun-detay-ekrani');
        }

        function gunDetayGezin(gunFarki) {
            if (!gunDetayAktifTarih) gunDetayAktifTarih = bugununTarihi;
            gunDetayAc(tarihAyarla(gunDetayAktifTarih, gunFarki));
        }

        function gunDetayTarihSec(deger) {
            if (!deger) return;
            // <input type="date"> ISO (YYYY-MM-DD) verir — tr-TR formatına çevir
            const [y, a, g] = deger.split('-').map(Number);
            gunDetayAc(g + '.' + a + '.' + y);
        }

        function gunDetayGuncelle() {
            const aktif = aktifProfiliGetir();
            const tarih = gunDetayAktifTarih || bugununTarihi;
            gunDetayAktifTarih = tarih;
            const gunVerisi = gunVerisiGetir(aktif, tarih);
            const bugunMu = gunVerisi.bugunMu;

            document.getElementById('gun-detay-baslik').innerText = formatTarihUzun(tarih);
            // FAZ 10 — özel gün toggle'ı: başlığın yanında rozet/kaldırma seçeneği
            const ozelGunAlan = document.getElementById('gun-detay-ozel-gun-alan');
            if (ozelGunAlan) {
                ozelGunAlan.innerHTML = gunOzelMi(tarih)
                    ? '<span style="font-size:13px; font-weight:700; color:var(--vurgu-renk); white-space:nowrap;">✓ Özel Gün</span>' +
                      '<button class="btn-ikincil btn-kucuk" style="flex:0 0 auto;" onclick="gunOzelGunToggle(gunDetayAktifTarih || bugununTarihi)">Kaldır</button>'
                    : '<button class="btn-ikincil btn-kucuk" style="flex:0 0 auto;" onclick="gunOzelGunToggle(gunDetayAktifTarih || bugununTarihi)">🎉 Özel Gün İşaretle</button>';
            }
            const tarihSec = document.getElementById('gun-detay-tarih-sec');
            if (tarihSec) {
                const [g, a, y] = tarih.split('.').map(Number);
                tarihSec.value = y + '-' + String(a).padStart(2, '0') + '-' + String(g).padStart(2, '0');
            }
            // Sonraki gün butonu geleceğe geçmesin
            const sonrakiGunVar = tarihFarkiGun(tarih, bugununTarihi) < 0;
            const butonlar = document.querySelectorAll('#gun-detay-ekrani .buton-grubu .btn-kucuk');
            if (butonlar.length === 3) butonlar[2].disabled = !sonrakiGunVar;

            // Hedefler: bugün dinamik, geçmiş profil baz hedefleri
            const hedefler = bugunMu ? bugunkuHedefleriHesapla(aktif) : { kalori: aktif.kalori, pro: aktif.pro, yag: aktif.yag, karb: aktif.karb };

            let tCal = 0, tPro = 0, tYag = 0, tKarb = 0;
            gunVerisi.veriler.forEach(t => { tCal += parseFloat(t.cal); tPro += parseFloat(t.pro); tYag += parseFloat(t.yag); tKarb += parseFloat(t.karb); });

            document.getElementById('gd-kalori').innerText = Math.round(tCal);
            document.getElementById('gd-protein').innerText = Math.round(tPro);
            document.getElementById('gd-yag').innerText = Math.round(tYag);
            document.getElementById('gd-karb').innerText = Math.round(tKarb);
            document.getElementById('gd-hedef-kalori').innerText = 'Hedef: ' + hedefler.kalori;
            document.getElementById('gd-hedef-protein').innerText = 'Hedef: ' + hedefler.pro + 'g';
            document.getElementById('gd-hedef-yag').innerText = 'Hedef: ' + hedefler.yag + 'g';
            document.getElementById('gd-hedef-karb').innerText = 'Hedef: ' + hedefler.karb + 'g';
            const kaloriYuzde = hedefler.kalori > 0 ? Math.min(100, Math.round((tCal / hedefler.kalori) * 100)) : 0;
            document.getElementById('gd-ilerleme-kalori').style.width = kaloriYuzde + '%';
            document.getElementById('gd-uyum').innerText = hedefler.kalori > 0 ? ('Hedefe uyum: %' + Math.round((tCal / hedefler.kalori) * 100)) : '';

            // Tüketilen besinler — öğün gruplu, düzenlenebilir (bugün ve geçmiş aynı bileşen)
            const listeAlan = document.getElementById('gun-detay-ogun-listesi');
            listeAlan.innerHTML = ogunGrupluListeHtml(gunVerisi.veriler, t => `
                <div class="liste-elemani" style="padding:11px 13px;">
                    <div><strong style="font-size:14px;">${esc(gorunenAd(t))}</strong><span class="liste-detay">${t.miktar} ${esc(t.birim ? birimEtiket(t.birim) : 'birim')} · ${esc(ogunEtiketi(t))}</span></div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <strong style="color:var(--vurgu-renk);">${t.cal} kcal</strong>
                        <button class="btn-duzenle" style="padding:6px 9px;" onclick="gunDetayOgeDuzenle('${t.id}')">${ikon('duzenle', 14)}</button>
                        <button class="btn-tehlike" style="padding:6px 9px; border-radius:10px;" onclick="gunDetayOgeSil('${t.id}')">${ikon('sil', 14)}</button>
                    </div>
                </div>`);
            // Geçmiş günse "besin ekle" bu güne yazar; bugünse tüketim ekranı bugüne yazar
            document.getElementById('gd-ekle-btn').onclick = bugunMu
                ? () => tuketimEkranAc()
                : () => tuketimEkranAc(tarih);

            // Su — ✎ ile inline düzenlenebilir (bugün ve geçmiş dahil her gün)
            const suDeger = gunVerisi.su;
            const suHedef = aktif.suHedefMl || 2500;
            document.getElementById('gd-su').innerText = (suDeger !== null && suDeger !== undefined) ? mlGoster(suDeger) : 'kayıt yok';
            document.getElementById('gd-su-hedef').innerText = 'Hedef: ' + mlGoster(suHedef);
            document.getElementById('gd-su-bar').style.width = (suDeger ? Math.min(100, Math.round((suDeger / suHedef) * 100)) : 0) + '%';
            document.getElementById('gd-su-duzenle-alani').classList.add('gizli');
            document.getElementById('gd-su-input').value = (suDeger !== null && suDeger !== undefined) ? suDeger : '';

            // Egzersiz & adım — ana ekrandakiyle aynı UI, TÜM günler için düzenlenebilir
            const aktivite = bugunMu ? bugunAktiviteGetir(aktif) : ((aktif.gunlukAktivite || {})[tarih] || null);
            const egzListe = (aktivite && aktivite.egzersizler) || [];
            const egzAlan = document.getElementById('gun-detay-egz-liste');
            if (egzListe.length === 0) {
                egzAlan.innerHTML = '<div class="hedef-yazi">Bu gün için egzersiz kaydı yok.</div>';
            } else {
                egzAlan.innerHTML = egzListe.map(e2 => {
                    let kcal = Math.round(egzersizKcalHesapla(e2.tip, e2.sure, aktif.girdi.kilo, e2.met));
                    let silBtn = '<span class="durum-ikon" style="color:#ff8a8a;" onclick="bugunEgzersizSil(\'' + e2.id + '\', \'' + tarih + '\')" role="button" aria-label="Egzersizi sil">' + ikon('sil', 14) + '</span>';
                    return '<div class="mini-satir"><span>' + esc(e2.hareketAdi || egzersizAdlari[e2.tip] || e2.tip) + ' — ' + e2.sure + ' dk</span><span>' + kcal + ' kcal ' + silBtn + '</span></div>';
                }).join('');
            }
            const adim = aktivite && aktivite.adim ? aktivite.adim : null;
            document.getElementById('gd-egz-ozet').innerText = (adim ? Math.round(adim) + ' adım' : 'adım kaydı yok') + (egzListe.length ? ' · ' + egzListe.length + ' egzersiz' : '');
            // FAZ 15 — o günün adım girişi: input'u mevcut değerle ön doldur, altına bilgi yaz
            const gdAdimInput = document.getElementById('gd-adim-input');
            if (gdAdimInput) gdAdimInput.value = adim !== null ? adim : '';
            const gdAdimBilgi = document.getElementById('gd-adim-bilgi');
            if (gdAdimBilgi) gdAdimBilgi.innerText = adim ? ('Bu gün için kayıtlı: ' + Math.round(adim) + ' adım') : 'Bu gün için adım kaydı yok, girilmezse ortalama kullanılır.';

            // Egzersiz durum butonları: seçili durumu senkronize et (tüm günler için)
            const gdEgzForm = document.getElementById('gd-egzersiz-form');
            if (gdEgzForm) gdEgzForm.classList.add('gizli');
            const gdEgzDurumGrupEl = document.getElementById('gd-egz-durum-grup');
            if (gdEgzDurumGrupEl) {
                let seciliDurum = aktivite ? aktivite.durum : null;
                const durumSirasi = ['yapildi', 'planli_degil', 'yapmadi'];
                const durumClassAdi = { yapildi: 'aktif-yapildi', planli_degil: 'aktif-planli-degil', yapmadi: 'aktif-yapmadi' };
                Array.from(gdEgzDurumGrupEl.children).forEach((btn, i) => {
                    btn.classList.remove('aktif-yapildi', 'aktif-planli-degil', 'aktif-yapmadi');
                    if (durumSirasi[i] === seciliDurum) btn.classList.add(durumClassAdi[seciliDurum]);
                });
            }

            // Takviyeler (alınan / alınmayan / planlı) — HER gün tıklanabilir, tarih parametreli
            const planliTakviyeler = takviyeler.filter(t => takviyeBugunDuzenliMi(t, tarih));
            const tkGunKayit = (aktif.takviyeGecmisi && aktif.takviyeGecmisi[tarih]) || {};
            const tkAlan = document.getElementById('gun-detay-takviye-liste');
            const tkOranEl = document.getElementById('gd-takviye-oran');
            if (planliTakviyeler.length === 0) {
                tkAlan.innerHTML = '<div class="hedef-yazi">Bu gün için planlı takviye yok.</div>';
                tkOranEl.innerText = '';
            } else {
                const alinan = planliTakviyeler.filter(t => tkGunKayit[t.id]).length;
                tkOranEl.innerText = alinan + ' / ' + planliTakviyeler.length + ' alındı';
                tkAlan.innerHTML = planliTakviyeler.map(t => {
                    let yapildi = !!tkGunKayit[t.id];
                    return '<div class="mini-satir"><span>' + esc(t.tur) + ' — ' + esc(t.doz) + '</span><span class="durum-ikon ' + (yapildi ? 'yapildi' : '') + '" onclick="takviyeBugunToggle(\'' + t.id + '\', \'' + tarih + '\')">' + (yapildi ? '✓' : '') + '</span></div>';
                }).join('');
            }

            // Kilo geçmişi — o güne ait kayıt varsa göster; ✎ Düzenle kilo ekranına tarih ön-doldurarak yönlenir
            const kiloKaydi = (aktif.kiloGecmisi || []).find(k => k.tarih === tarih);
            document.getElementById('gd-kilo').innerText = kiloKaydi ? kgGoster(kiloKaydi.kilo) : 'kayıt yok';
        }

        // FAZ 10 — Özel gün: işaretlenen gün istatistik ortalamalarından çıkarılır AMA SİLİNMEZ.
        function gunOzelMi(tarih) {
            return (aktifProfiliGetir().ozelGunler || []).includes(tarih);
        }

        // FAZ 17 — Ana ekrandan da bugünü tek tıkla Özel Gün işaretleyebilme.
        function anaOzelGunAlaniGuncelle() {
            const alan = document.getElementById('ana-ozel-gun-alani');
            if (!alan) return;
            const ozel = gunOzelMi(bugununTarihi);
            alan.innerHTML = ozel
                ? '<span class="rozet" style="cursor:pointer;" onclick="gunOzelGunToggle(bugununTarihi)">🎉 Özel Gün — kaldırmak için dokun</span>'
                : '<span class="hedef-yazi" style="cursor:pointer; text-decoration:underline;" onclick="gunOzelGunToggle(bugununTarihi)">+ Bugünü Özel Gün İşaretle</span>';
        }

        function gunOzelGunToggle(tarih) {
            const aktif = aktifProfiliGetir();
            if (!aktif.ozelGunler) aktif.ozelGunler = [];
            if (aktif.ozelGunler.includes(tarih)) {
                aktif.ozelGunler = aktif.ozelGunler.filter(t => t !== tarih);
                bildirGoster('Özel gün işareti kaldırıldı');
            } else {
                aktif.ozelGunler.push(tarih);
                bildirGoster('🎉 Özel gün işaretlendi — ortalamalara dahil edilmez');
            }
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            const gdEkrani = document.getElementById('gun-detay-ekrani');
            if (gdEkrani && !gdEkrani.classList.contains('gizli')) gunDetayGuncelle();
            if (tarih === bugununTarihi) anaOzelGunAlaniGuncelle();
        }

        // FAZ 8 — Gün Detay su düzenleme: ✎ aç/kapat, Kaydet doğru güne yazar
        function gunDetaySuDuzenleAc() {
            document.getElementById('gd-su-duzenle-alani').classList.toggle('gizli');
        }

        function gunDetaySuKaydet(tarih = gunDetayAktifTarih || bugununTarihi, yeniDeger = parseInt(document.getElementById('gd-su-input').value, 10)) {
            if (isNaN(yeniDeger) || yeniDeger < 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }
            const aktif = aktifProfiliGetir();
            if (tarih === bugununTarihi) {
                suGunKontrol(aktif);
                aktif.su.miktar = yeniDeger;
            } else {
                let gun = aktif.gecmis.find(g => g.tarih === tarih);
                if (!gun) { gun = { tarih, veriler: [], su: 0 }; aktif.gecmis.push(gun); }
                gun.su = yeniDeger;
            }
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('gd-su-duzenle-alani').classList.add('gizli');
            gunDetayGuncelle();
            bildirGoster('💧 Su kaydedildi (' + formatTarihKisa(tarih) + ')');
        }

        // FAZ 8 — Gün Detay egzersiz formu aç/kapat + ekleme: ana ekrandaki formun geçmiş güne yazılan hâli
        function gunDetayEgzersizAlaniAcKapa() {
            document.getElementById('gd-egzersiz-form').classList.toggle('gizli');
        }

        function gunDetayEgzersizEkle() {
            document.getElementById('beg-tip').value = document.getElementById('gdeg-tip').value;
            const gdSure = parseFloat(document.getElementById('gdeg-sure').value);
            document.getElementById('beg-sure').value = isNaN(gdSure) ? '' : gdSure;
            bugunEgzersizEkle(gunDetayAktifTarih || bugununTarihi);
            document.getElementById('gdeg-sure').value = '';
        }

        // FAZ 8 — Gün Detay kilo düzenleme: kilo ekranına yönlenir, tarih ön-doldurulur.
        // kiloEkle()'nin kendisine dokunulmaz; sadece tarihi hazırlar.
        function gunDetayKiloDuzenle() {
            const tarih = gunDetayAktifTarih || bugununTarihi;
            sayfaGoster('kilo-ekrani');
            const tarihInput = document.getElementById('kilo-tarih');
            if (tarihInput) tarihInput.value = trTarihtenIso(tarih);
        }

        // Gün detay ekranındaki kaydı düzenle/sil — geçmiş günse arşive, bugünse günlüğe yazar
        function gunDetayKayitBul(tarih, ogeId) {
            const aktif = aktifProfiliGetir();
            if (tarih === bugununTarihi) return { kayitlar: aktif.gunluk, bugunMu: true };
            const gun = aktif.gecmis.find(g => g.tarih === tarih);
            return { kayitlar: gun ? gun.veriler : [], bugunMu: false };
        }

        async function gunDetayOgeDuzenle(ogeId) {
            const tarih = gunDetayAktifTarih || bugununTarihi;
            const { kayitlar } = gunDetayKayitBul(tarih, ogeId);
            const oge = kayitlar.find(x => x.id == ogeId);
            if (!oge) return;
            if (oge.besinId) {
                const besin = besinler.find(b => b.id === oge.besinId);
                if (!besin) { bildirGoster('Bu besin kütüphaneden silinmiş, düzenlenemiyor.', 'hata'); return; }
                const yeniMiktarStr = await modalGirdi('Miktarı Düzenle', gorunenAd(oge) + ' (' + formatTarihKisa(tarih) + ') — yeni miktar:', String(oge.miktar));
                if (yeniMiktarStr === null) return;
                const yeniMiktar = parseFloat(yeniMiktarStr);
                if (!yeniMiktar || yeniMiktar <= 0) { bildirGoster('Geçersiz miktar', 'hata'); return; }
                const eskiOge = { ...oge };
                const carpan = yeniMiktar / besin.ref;
                oge.miktar = yeniMiktar;
                oge.cal = Math.round(besin.cal * carpan);
                oge.pro = (besin.pro * carpan).toFixed(1);
                oge.yag = (besin.yag * carpan).toFixed(1);
                oge.karb = (besin.karb * carpan).toFixed(1);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                gunDetayGuncelle();
                bildirGoster('Kayıt güncellendi', null, () => {
                    Object.assign(oge, eskiOge);
                    localStorage.setItem('df_profiller', JSON.stringify(profiller));
                    gunDetayGuncelle();
                });
            }
        }

        function gunDetayOgeSil(ogeId) {
            const tarih = gunDetayAktifTarih || bugununTarihi;
            const aktif = aktifProfiliGetir();
            const { kayitlar, bugunMu } = gunDetayKayitBul(tarih, ogeId);
            const eskiIndex = kayitlar.findIndex(x => x.id == ogeId);
            const silinen = kayitlar[eskiIndex];
            if (!silinen) return;
            kayitlar.splice(eskiIndex, 1);
            if (!bugunMu) {
                const gun = aktif.gecmis.find(g => g.tarih === tarih);
                if (gun && gun.veriler.length === 0) aktif.gecmis = aktif.gecmis.filter(g => g.tarih !== tarih);
            }
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            gunDetayGuncelle();
            bildirGoster('Kayıt silindi', null, () => {
                if (!bugunMu) {
                    let gun = aktif.gecmis.find(g => g.tarih === tarih);
                    if (!gun) { gun = { tarih, veriler: [], su: null }; aktif.gecmis.push(gun); }
                }
                kayitlar.splice(Math.min(eskiIndex, kayitlar.length), 0, silinen);
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
                gunDetayGuncelle();
            });
        }

        // Su hatırlatıcısı yalnızca uygulama/sekme açıkken çalışır (sunucusuz PWA kısıtı).
        // FAZ 17 — Gün/saat dilimi değişikliği izleyici: bugununTarihi sabit (const)
        // olduğu için sayfa açık kaldığı sürece (gece yarısını geçme, seyahatte saat
        // dilimi değişimi) otomatik güncellenmez. Periyodik olarak gerçek tarihi
        // kontrol edip değiştiyse KULLANICIYA nazikçe yenileme öner (veriyi riske
        // atıp sabit değişkeni canlı değiştirmeye ÇALIŞMIYORUZ — bu çok daha güvenli).
        let gunDegisimiUyarisiGosterildi = false;
        function gunDegisimiIzle() {
            if (typeof setInterval === 'undefined') return;
            setInterval(() => {
                try {
                    if (gunDegisimiUyarisiGosterildi) return;
                    const gercekBugun = new Date().toLocaleDateString('tr-TR');
                    if (gercekBugun !== bugununTarihi) {
                        gunDegisimiUyarisiGosterildi = true;
                        bildirGoster('📅 Gün değişti (veya saat dilimi güncellendi). Güncel görünüm için sayfayı yenile.', 'hata');
                    }
                } catch (e) { /* sessizce yoksay */ }
            }, 5 * 60 * 1000);
        }

        suHatirlaticisiKur();
        // FAZ 10 — hatırlatma çeşitliliği (aynı savunmacı desen)
        kayitHatirlaticisiKur();
        takviyeHatirlaticisiKur();
        kiloHatirlaticisiKur();
        // FAZ 12 — Stoğum SKT hatırlatıcısı
        stokSktHatirlaticisiKur();
        // FAZ 17 — gün/saat dilimi değişikliği izleyici
        gunDegisimiIzle();

        baslangicKontrolu();

        // FAZ 10 — günlük kullanım alanlarına stepper (tek seferlik/nadir alanlar kapsam dışı)
        sayiStepperEkle('t-miktar', 10, 0);
        sayiStepperEkle('beg-sure', 5, 0);
        sayiStepperEkle('gdeg-sure', 5, 0);
        sayiStepperEkle('kilo-yeni', 0.1, 0);
        sayiStepperEkle('bugun-adim-input', 500, 0);
        sayiStepperEkle('gd-su-input', 50, 0);
        sayiStepperEkle('sb-miktar', 10, 0);
        sayiStepperEkle('gd-adim-input', 500, 0);
        // t-miktar stepper adımı besinin birimine göre: g/ml → 10, değilse → 1
        (function tMiktarAdimAyarla() {
            const input = document.getElementById('t-miktar');
            if (!input) return;
            const senkronizeEt = () => {
                const b = besinler.find(x => x.id == tSeciliBesinId);
                const sarmal = input.parentNode;
                if (!sarmal || !sarmal.classList.contains('stepper-sarmal')) return;
                const btnler = sarmal.querySelectorAll('.stepper-btn');
                const adim = (b && (b.birim === 'g' || b.birim === 'ml')) ? 10 : 1;
                btnler.forEach(btn => {
                    btn.onclick = () => {
                        let deger = parseFloat(String(input.value).replace(',', '.'));
                        if (isNaN(deger)) deger = 0;
                        const yon = btn.textContent.trim() === '+' ? 1 : -1;
                        deger = Math.max(0, deger + (adim * yon));
                        input.value = Math.round(deger * 100) / 100;
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    };
                });
            };
            const orijinalSec = tuketimSecBesin;
            tuketimSecBesin = function (id) { orijinalSec(id); senkronizeEt(); };
            senkronizeEt();
        })();
        // FAZ 10 — PWA app shortcuts: manifest'ten gelen ?aksiyon= parametresini işle.
        // İşlem sonrası URL temizlenir ki sayfa yenilenince tekrar tetiklenmesin.
        (function pwaKisayolAksiyonuIsle() {
            try {
                const aksiyon = new URLSearchParams(location.search).get('aksiyon');
                if (!aksiyon) return;
                history.replaceState(null, '', location.pathname);
                if (aksiyon === 'su-ekle') {
                    const aktif = aktifProfiliGetir();
                    if (aktif) {
                        suEkle(aktif.suOzelMiktar || 250);
                        bildirGoster('💧 Hızlı su eklendi');
                    }
                } else if (aksiyon === 'besin-ekle') {
                    tuketimEkranAc();
                }
            } catch (e) { /* sessizce yoksay */ }
        })();
