        // TARİH SİSTEMİ
        const bugununTarihi = new Date().toLocaleDateString('tr-TR');
        const gunAdlari = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];

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

        // Bir besin/tüketim/şablon nesnesinin görünen adı — marka varsa "Marka Ad", yoksa sadece "Ad"
        function gorunenAd(obj) {
            if (!obj) return '';
            return obj.marka ? (obj.marka + ' ' + obj.ad) : obj.ad;
        }

        // TOHUM VERİLER (Kütüphane Herkes İçin Ortaktır)
        const tohumVeriler = [
            { "id": 1, "ad": "Tavuk", "kategori": "et", "birim": "g", "ref": 100, "pro": 16, "yag": 6, "karb": 0, "cal": 122 },
            { "id": 2, "ad": "Tavuk Göğüsü", "kategori": "et", "birim": "g", "ref": 100, "pro": 23, "yag": 0.7, "karb": 0, "cal": 102 },
            { "id": 3, "ad": "Tavuk Ciğeri", "kategori": "et", "birim": "g", "ref": 100, "pro": 16, "yag": 6, "karb": 0, "cal": 122 },
            { "id": 4, "ad": "Kırmızı Et", "kategori": "et", "birim": "g", "ref": 100, "pro": 26, "yag": 15, "karb": 0, "cal": 250 },
            { "id": 5, "ad": "Protein Tozu", "kategori": "diger", "birim": "g", "ref": 100, "pro": 73, "yag": 5.5, "karb": 12, "cal": 391 },
            { "id": 6, "ad": "Yumurta", "kategori": "sut", "birim": "adet", "ref": 1, "pro": 6.28, "yag": 4.75, "karb": 0.2, "cal": 72 },
            { "id": 7, "ad": "Toz Peynir", "kategori": "sut", "birim": "g", "ref": 100, "pro": 34, "yag": 27, "karb": 1, "cal": 383 },
            { "id": 8, "ad": "Mozarella Peynir", "kategori": "sut", "birim": "g", "ref": 100, "pro": 18, "yag": 19, "karb": 1, "cal": 247 },
            { "id": 9, "ad": "Skyr Yoğurt", "kategori": "sut", "birim": "g", "ref": 100, "pro": 11, "yag": 0.2, "karb": 4, "cal": 64 },
            { "id": 10, "ad": "Lungo Pirinç", "kategori": "karb", "birim": "g", "ref": 100, "pro": 4.02, "yag": 0.4, "karb": 80, "cal": 354 },
            { "id": 11, "ad": "Basmati Pirinç", "kategori": "karb", "birim": "g", "ref": 100, "pro": 5.16, "yag": 1.1, "karb": 78, "cal": 358 },
            { "id": 12, "ad": "Makarna", "kategori": "karb", "birim": "g", "ref": 100, "pro": 7.2, "yag": 1.3, "karb": 72, "cal": 352 },
            { "id": 13, "ad": "Ekmek", "kategori": "karb", "birim": "dilim", "ref": 1, "pro": 2.6, "yag": 0.5, "karb": 25, "cal": 125 },
            { "id": 14, "ad": "Un", "kategori": "karb", "birim": "g", "ref": 100, "pro": 6, "yag": 0.8, "karb": 72, "cal": 339 },
            { "id": 15, "ad": "Yulaf", "kategori": "karb", "birim": "g", "ref": 100, "pro": 8.4, "yag": 7, "karb": 59, "cal": 375 },
            { "id": 16, "ad": "Nohut", "kategori": "karb", "birim": "g", "ref": 100, "pro": 12, "yag": 6.1, "karb": 48, "cal": 355 },
            { "id": 17, "ad": "Fasülye", "kategori": "karb", "birim": "g", "ref": 100, "pro": 13.8, "yag": 1.6, "karb": 46, "cal": 326 },
            { "id": 18, "ad": "Yeşil Mercimek", "kategori": "karb", "birim": "g", "ref": 100, "pro": 24, "yag": 1, "karb": 60, "cal": 352 },
            { "id": 19, "ad": "Zeytinyağı", "kategori": "yag", "birim": "ml", "ref": 100, "pro": 0, "yag": 100, "karb": 0, "cal": 900 },
            { "id": 20, "ad": "Tereyağı", "kategori": "yag", "birim": "g", "ref": 100, "pro": 0.8, "yag": 81, "karb": 0.1, "cal": 717 },
            { "id": 21, "ad": "Ricotta Peynir", "kategori": "sut", "birim": "g", "ref": 100, "pro": 7.7, "yag": 9, "karb": 3.9, "cal": 127 },
            { "id": 22, "ad": "Süt Yağsız", "kategori": "sut", "birim": "ml", "ref": 100, "pro": 3.4, "yag": 0, "karb": 5.1, "cal": 34 },
            { "id": 23, "ad": "Süt Yarım Yağlı", "kategori": "sut", "birim": "ml", "ref": 100, "pro": 3.3, "yag": 1.6, "karb": 4.8, "cal": 47 },
            { "id": 24, "ad": "Süt Yağlı", "kategori": "sut", "birim": "ml", "ref": 100, "pro": 3.3, "yag": 3.3, "karb": 4.7, "cal": 61 },
            { "id": 25, "ad": "Yoğurt", "kategori": "sut", "birim": "g", "ref": 100, "pro": 3.6, "yag": 3.7, "karb": 4.7, "cal": 67 },
            { "id": 26, "ad": "Fish Fingers", "kategori": "et", "birim": "g", "ref": 100, "pro": 12, "yag": 7.9, "karb": 15, "cal": 179 },
            { "id": 27, "ad": "Puding", "kategori": "diger", "birim": "porsiyon", "ref": 1, "pro": 3, "yag": 5, "karb": 20, "cal": 137 },
            { "id": 28, "ad": "Sebze", "kategori": "sebze", "birim": "g", "ref": 100, "pro": 1.5, "yag": 0.2, "karb": 5, "cal": 28 },
            { "id": 29, "ad": "Meyve", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0, "yag": 0, "karb": 15, "cal": 15 },
            { "id": 30, "ad": "Elma", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0.3, "yag": 0.2, "karb": 13.8, "cal": 52 },
            { "id": 31, "ad": "Armut", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0.4, "yag": 0.1, "karb": 15.2, "cal": 57 },
            { "id": 32, "ad": "Muz", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 1.1, "yag": 0.3, "karb": 22.8, "cal": 89 },
            { "id": 33, "ad": "Çilek", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0.7, "yag": 0.3, "karb": 7.7, "cal": 32 },
            { "id": 34, "ad": "Karpuz", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0.6, "yag": 0.2, "karb": 7.6, "cal": 30 },
            { "id": 35, "ad": "Kavun", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0.8, "yag": 0.2, "karb": 8.2, "cal": 34 },
            { "id": 36, "ad": "Kiraz", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 1, "yag": 0.3, "karb": 12.2, "cal": 50 },
            { "id": 37, "ad": "Kivi", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 1.1, "yag": 0.5, "karb": 14.7, "cal": 61 },
            { "id": 38, "ad": "Mandalina", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0.8, "yag": 0.3, "karb": 13.3, "cal": 53 },
            { "id": 39, "ad": "Portakal", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0.9, "yag": 0.1, "karb": 11.8, "cal": 47 },
            { "id": 40, "ad": "Şeftali", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0.9, "yag": 0.3, "karb": 9.5, "cal": 39 },
            { "id": 41, "ad": "Üzüm", "kategori": "meyve", "birim": "g", "ref": 100, "pro": 0.7, "yag": 0.2, "karb": 18.1, "cal": 69 }
        ];

        // VERİTABANI BAĞLANTILARI
        let besinler = JSON.parse(localStorage.getItem('df_besinler'));
        if (!besinler || besinler.length === 0) {
            besinler = tohumVeriler;
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

        // GÖÇ / MİGRASYON — eski kayıtları yeni alanlarla tamamla
        function besinMigrasyon() {
            let degisti = false;
            besinler.forEach(b => {
                if (!b.kategori) {
                    let tohum = tohumVeriler.find(t => t.id === b.id);
                    b.kategori = tohum ? tohum.kategori : 'diger';
                    degisti = true;
                }
                if (!b.birim) {
                    let tohum = tohumVeriler.find(t => t.id === b.id);
                    b.birim = tohum ? tohum.birim : (b.ref == 1 ? 'adet' : 'g');
                    degisti = true;
                }
                if (b.marka === undefined) {
                    b.marka = '';
                    degisti = true;
                }
            });
            // Kütüphaneden eksilmiş (kaybolmuş) varsayılan besinleri, mevcutları bozmadan geri ekle
            tohumVeriler.forEach(t => {
                if (!besinler.find(b => b.id === t.id)) {
                    besinler.push({ id: t.id, ad: t.ad, marka: '', kategori: t.kategori, birim: t.birim, ref: t.ref, cal: t.cal, pro: t.pro, yag: t.yag, karb: t.karb });
                    degisti = true;
                }
            });
            if (degisti) localStorage.setItem('df_besinler', JSON.stringify(besinler));
        }

        function profilMigrasyon() {
            let degisti = false;
            profiller.forEach(p => {
                if (!p.girdi) {
                    let bilinenKilo = (p.kiloGecmisi && p.kiloGecmisi.length) ? p.kiloGecmisi[p.kiloGecmisi.length - 1].kilo : 70;
                    p.girdi = { cins: 'erkek', yas: 25, boy: 170, kilo: bilinenKilo, adimFaktor: 1.2, egzGun: 3, egzTip: 'agirlik', egzSure: 45, hedef: 'koruma' };
                    degisti = true;
                }
                if (!p.kiloGecmisi) {
                    p.kiloGecmisi = [{ id: benzersizId(), tarih: p.aktifTarih || bugununTarihi, kilo: p.girdi.kilo }];
                    degisti = true;
                }
                if (!p.su) { p.su = { tarih: bugununTarihi, miktar: 0 }; degisti = true; }
                if (!p.suHedefMl) { p.suHedefMl = Math.round((p.girdi.kilo * 33) / 250) * 250; degisti = true; }
                if (p.hedefKilo === undefined) { p.hedefKilo = null; degisti = true; }
                if (!p.takviyeGecmisi) { p.takviyeGecmisi = {}; degisti = true; }
                if (!p.gunlukAktivite) { p.gunlukAktivite = {}; degisti = true; }
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

        besinMigrasyon();
        profilMigrasyon();
        takviyeMigrasyon();
        sablonMigrasyon();

        // SAYFA VE PROFİL YÖNETİMİ
        function baslangicKontrolu() {
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

        function navGit(id) { sayfaGoster(id); }

        function navAktifIsaretle(id) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('aktif'));
            const eslesme = {
                'ana-ekran': 'nav-ana',
                'tuketim-ekrani': 'nav-ekle',
                'gecmis-ekrani': 'nav-istatistik',
                'daha-fazla-ekrani': 'nav-daha',
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
            document.querySelectorAll('#sayfa-govde > div').forEach(d => d.classList.add('gizli'));
            document.getElementById(id).classList.remove('gizli');
            navAktifIsaretle(id);

            if (id === 'ana-ekran') arayuzGuncelle();
            if (id === 'kutuphane-ekrani') kListele();
            if (id === 'tuketim-ekrani') tListele();
            if (id === 'gecmis-ekrani') gecmisListele();
            if (id === 'kilo-ekrani') kiloEkraniGuncelle();
            if (id === 'takviye-ekrani') takviyeEkraniGuncelle();
            if (id === 'sablon-ekrani') sablonListele();
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

        // Bir günün tam raporunu toast olarak gösterir (tarih seçimi ile)
        function gunRaporuGoster(tarih) {
            let aktif = aktifProfiliGetir();
            let kayit = aktif.gecmis.find(g => g.tarih === tarih);
            let suDeger = null;
            if (tarih === bugununTarihi) { kayit = { tarih: bugununTarihi, veriler: aktif.gunluk }; suDeger = aktif.su.miktar; }
            else if (kayit) suDeger = (kayit.su !== undefined && kayit.su !== null) ? kayit.su : null;
            if (!kayit) return;

            let kcal = kayit.veriler.reduce((t, x) => t + parseFloat(x.cal), 0);
            let pro = kayit.veriler.reduce((t, x) => t + parseFloat(x.pro), 0);
            let kiloKaydi = (aktif.kiloGecmisi || []).find(k => k.tarih === tarih);

            const konteyner = document.getElementById('toast-konteyner');
            const toast = document.createElement('div');
            toast.className = 'toast toast-rapor';
            toast.innerHTML = `
                <strong>${esc(tarih)}</strong>
                <span>🔥 ${Math.round(kcal)} kcal</span>
                <span>🥩 ${Math.round(pro)} g protein</span>
                <span>💧 ${suDeger !== null ? (suDeger / 1000).toFixed(1) + ' L' : 'kayıt yok'}</span>
                <span>⚖ ${kiloKaydi ? kiloKaydi.kilo.toFixed(1) + ' kg' : 'kayıt yok'}</span>
            `;
            konteyner.appendChild(toast);
            requestAnimationFrame(() => toast.classList.add('goster'));
            setTimeout(() => {
                toast.classList.remove('goster');
                setTimeout(() => toast.remove(), 300);
            }, 4200);
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

        // BASİT SVG ÇİZGİ GRAFİĞİ — interaktif (noktaya dokununca detay toast'u)
        function svgCizgiGrafik(degerler, w, h, renk, hedefCizgi, etiketler, birim, tiklamaGeriCagirma) {
            w = w || 320; h = h || 90; renk = renk || 'var(--vurgu-renk)';
            if (!degerler || degerler.length < 2) return '';
            const pad = 10;
            let min = Math.min(...degerler), max = Math.max(...degerler);
            if (hedefCizgi) { min = Math.min(min, hedefCizgi); max = Math.max(max, hedefCizgi); }
            if (min === max) { min -= 1; max += 1; }
            const rw = w - pad * 2, rh = h - pad * 2;
            const noktalar = degerler.map((v, i) => {
                const x = pad + (i / (degerler.length - 1)) * rw;
                const y = pad + rh - ((v - min) / (max - min)) * rh;
                return [x, y];
            });
            const polylineStr = noktalar.map(p => p.join(',')).join(' ');
            const alanPath = 'M' + noktalar[0][0] + ',' + (pad + rh) + ' L' + polylineStr.split(' ').join(' L') + ' L' + noktalar[noktalar.length - 1][0] + ',' + (pad + rh) + ' Z';
            let hedefSVG = '';
            if (hedefCizgi) {
                const y = pad + rh - ((hedefCizgi - min) / (max - min)) * rh;
                hedefSVG = '<line x1="' + pad + '" y1="' + y + '" x2="' + (w - pad) + '" y2="' + y + '" stroke="var(--yazi-pasif)" stroke-width="1" stroke-dasharray="4 4" opacity=".6"/>';
            }
            const gid = 'grad' + Math.random().toString(36).slice(2, 8);
            const noktaSVG = noktalar.map((p, i) => {
                const tarih = etiketler && etiketler[i] ? etiketler[i] : '';
                const deger = degerler[i];
                return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" fill="transparent" data-tarih="' + esc(tarih) + '" data-deger="' + deger + '" data-birim="' + esc(birim || '') + '" data-idx="' + i + '" class="grafik-nokta" style="cursor:pointer;"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + renk + '" style="pointer-events:none;"/>';
            }).join('');
            return '<svg viewBox="0 0 ' + w + ' ' + h + '" style="width:100%; height:' + h + 'px; overflow:visible;">' +
                '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + renk + '" stop-opacity=".35"/><stop offset="100%" stop-color="' + renk + '" stop-opacity="0"/></linearGradient></defs>' +
                hedefSVG +
                '<path d="' + alanPath + '" fill="url(#' + gid + ')" stroke="none"/>' +
                '<polyline points="' + polylineStr + '" fill="none" stroke="' + renk + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                noktaSVG +
                '</svg>';
        }

        function grafikTiklamalariBagla(containerId, tamRaporMu) {
            const alan = document.getElementById(containerId);
            if (!alan) return;
            alan.querySelectorAll('.grafik-nokta').forEach(nokta => {
                nokta.addEventListener('click', () => {
                    const tarih = nokta.getAttribute('data-tarih');
                    if (tamRaporMu) { gunRaporuGoster(tarih); return; }
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

        function yeniProfilFormu() {
            document.querySelectorAll('#profil-ekrani input').forEach(inp => inp.value = '');
            document.getElementById('profil-form-baslik').innerText = 'Yeni Kişi Ekle';
            document.getElementById('profil-kaydet-btn').innerText = 'Profili Yarat ve Başla';
            document.getElementById('iptal-profil-btn').classList.remove('gizli');
            egzersizAlanGuncelleForm();
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
            document.getElementById('pr-boy').value = aktif.girdi.boy;
            document.getElementById('pr-kilo').value = aktif.girdi.kilo;
            document.getElementById('pr-adim').value = aktif.girdi.adimFaktor;
            document.getElementById('pr-egzersiz-gun').value = aktif.girdi.egzGun;
            document.getElementById('pr-egzersiz-tip').value = aktif.girdi.egzTip;
            document.getElementById('pr-egzersiz-sure').value = aktif.girdi.egzSure;
            document.getElementById('pr-hedef').value = aktif.girdi.hedef;
            document.getElementById('pr-duzenle-id').value = aktif.id;
            document.getElementById('profil-form-baslik').innerText = 'Profili Düzenle';
            document.getElementById('profil-kaydet-btn').innerText = 'Değişiklikleri Kaydet';
            document.getElementById('iptal-profil-btn').classList.remove('gizli');
            egzersizAlanGuncelleForm();
            sayfaGoster('profil-ekrani');
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

        function profilKaydet() {
            let duzenleId = document.getElementById('pr-duzenle-id').value;
            let ad = document.getElementById('pr-ad').value || "İsimsiz Profil";
            let cins = document.getElementById('pr-cinsiyet').value;
            let yas = parseFloat(document.getElementById('pr-yas').value);
            let boy = parseFloat(document.getElementById('pr-boy').value);
            let kilo = parseFloat(document.getElementById('pr-kilo').value);
            let adimFaktor = parseFloat(document.getElementById('pr-adim').value);
            let egzGun = parseFloat(document.getElementById('pr-egzersiz-gun').value);
            let egzTip = document.getElementById('pr-egzersiz-tip').value;
            let egzSure = parseFloat(document.getElementById('pr-egzersiz-sure').value);
            let hedef = document.getElementById('pr-hedef').value;

            if (!yas || !boy || !kilo) { bildirGoster('Lütfen yaş, boy ve kilonuzu girin.', 'hata'); return; }

            let hesap = hesaplaHedefler(cins, yas, boy, kilo, adimFaktor, egzGun, egzTip, egzSure, hedef);

            if (duzenleId) {
                let p = profiller.find(x => x.id == duzenleId);
                let eskiKilo = p.girdi.kilo;
                p.ad = ad; p.kalori = hesap.kalori; p.pro = hesap.pro; p.yag = hesap.yag; p.karb = hesap.karb;
                p.girdi = { cins, yas, boy, kilo, adimFaktor, egzGun, egzTip, egzSure, hedef };
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
                gunluk: [], gecmis: [], aktifTarih: bugununTarihi,
                kiloGecmisi: [{ id: benzersizId(), tarih: bugununTarihi, kilo: kilo }],
                su: { tarih: bugununTarihi, miktar: 0 },
                suHedefMl: Math.round((kilo * 33) / 250) * 250,
                hedefKilo: null,
                takviyeGecmisi: {},
                gunlukAktivite: {},
                girdi: { cins, yas, boy, kilo, adimFaktor, egzGun, egzTip, egzSure, hedef }
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
            aktifProfilId = document.getElementById('aktif-profil-secim').value;
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
                localStorage.setItem('df_profiller', JSON.stringify(profiller));
            }
        }

        function aktifProfiliGetir() {
            return profiller.find(p => p.id == aktifProfilId);
        }

        // KÜTÜPHANE İŞLEMLERİ (CRUD)
        function kategoriSekmeleriOlustur() {
            const kats = [
                { key: 'tum', ad: 'Tümü' }, { key: 'favori', ad: '★ Favoriler' },
                { key: 'et', ad: 'Et/Tavuk' }, { key: 'sut', ad: 'Süt Ürünleri' },
                { key: 'karb', ad: 'Karbonhidrat' }, { key: 'sebze', ad: 'Sebze' },
                { key: 'meyve', ad: 'Meyve' }, { key: 'yag', ad: 'Yağlar' }, { key: 'diger', ad: 'Diğer' }
            ];
            const alan = document.getElementById('kategori-sekmeler');
            alan.innerHTML = kats.map(k => '<button class="sekme-btn ' + (aktifKategori === k.key ? 'aktif' : '') + '" onclick="kategoriSec(\'' + k.key + '\')">' + esc(k.ad) + '</button>').join('');
        }

        function kategoriSec(key) { aktifKategori = key; kListele(); }

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

            let filtreli = besinler.filter(b => {
                if (aktifKategori === 'favori' && !favoriler.includes(b.id)) return false;
                if (aktifKategori !== 'tum' && aktifKategori !== 'favori' && b.kategori !== aktifKategori) return false;
                if (arama && !gorunenAd(b).toLocaleLowerCase('tr-TR').includes(arama)) return false;
                return true;
            });

            if (filtreli.length === 0) {
                liste.innerHTML = '<div class="bos-durum">🔍 Bu kritere uyan besin bulunamadı.</div>';
                return;
            }

            filtreli.forEach(b => {
                const favoriMi = favoriler.includes(b.id);
                liste.innerHTML += `
                    <div class="liste-elemani" data-bid="${b.id}">
                        <div style="flex:1;">
                            <strong style="color:var(--yazi-ana); font-size:16px;">${esc(gorunenAd(b))}</strong>
                            <span class="liste-detay">${b.ref} ${esc(birimEtiket(b.birim))} | ${b.cal} kcal | P:${b.pro} Y:${b.yag}</span>
                        </div>
                        <div class="buton-grubu">
                            <button class="btn-duzenle" onclick="favoriToggle(${b.id})" style="color:${favoriMi ? 'var(--vurgu-renk)' : 'var(--yazi-pasif)'} !important;">${favoriMi ? '★' : '☆'}</button>
                            <button class="btn-duzenle" onclick="besinDuzenle(${b.id})">✎</button>
                            <button class="btn-tehlike" onclick="besinSil(${b.id})" style="border-radius:12px;">✖</button>
                        </div>
                    </div>`;
            });
        }

        function besinFormuAc() {
            document.querySelectorAll('#besin-form-ekrani input').forEach(inp => inp.value = '');
            document.getElementById('b-kategori').value = 'et';
            document.getElementById('b-birim').value = 'g';
            sayfaGoster('besin-form-ekrani');
        }

        function besinKaydet() {
            let id = document.getElementById('b-id').value;
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
                karb: parseFloat(document.getElementById('b-karb').value)
            };
            if (id) { besinler[besinler.findIndex(x => x.id == id)] = yeni; } else { besinler.push(yeni); }
            localStorage.setItem('df_besinler', JSON.stringify(besinler));
            bildirGoster(id ? 'Besin güncellendi' : 'Besin eklendi');
            sayfaGoster('kutuphane-ekrani');
        }

        function besinDuzenle(id) {
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
                localStorage.setItem('df_besinler', JSON.stringify(besinler));
                kListele();
                bildirGoster('Besin silindi', null, () => {
                    besinler.splice(eskiIndex, 0, silinenBesin);
                    localStorage.setItem('df_besinler', JSON.stringify(besinler));
                    kListele();
                });
            };
            if (el) { el.classList.add('silinecek'); setTimeout(tamamla, 220); } else tamamla();
        }

        // TÜKETİM (KATEGORİ + ARAMA + SEÇ) VE ARAYÜZ
        function tuketimEkranAc() {
            document.getElementById('t-duzenle-id').value = '';
            document.getElementById('t-miktar').value = '';
            document.getElementById('t-arama').value = '';
            tSeciliBesinId = null;
            tAktifKategori = 'tum';
            document.getElementById('tuketim-form-baslik').innerText = 'Ne Yedin?';
            document.getElementById('tuketim-kaydet-btn').innerText = 'Bugüne Ekle';
            sayfaGoster('tuketim-ekrani');
        }

        function tKategoriSekmeleriOlustur() {
            const kats = [
                { key: 'tum', ad: 'Tümü' }, { key: 'favori', ad: '★ Favoriler' },
                { key: 'et', ad: 'Et/Tavuk' }, { key: 'sut', ad: 'Süt Ürünleri' },
                { key: 'karb', ad: 'Karbonhidrat' }, { key: 'sebze', ad: 'Sebze' },
                { key: 'meyve', ad: 'Meyve' }, { key: 'yag', ad: 'Yağlar' }, { key: 'diger', ad: 'Diğer' }
            ];
            const alan = document.getElementById('t-kategori-sekmeler');
            alan.innerHTML = kats.map(k => '<button class="sekme-btn ' + (tAktifKategori === k.key ? 'aktif' : '') + '" onclick="tKategoriSec(\'' + k.key + '\')">' + esc(k.ad) + '</button>').join('');
        }

        function tKategoriSec(key) { tAktifKategori = key; tListele(); }

        function tListele() {
            tKategoriSekmeleriOlustur();
            const arama = (document.getElementById('t-arama').value || '').toLocaleLowerCase('tr-TR');
            const alan = document.getElementById('t-secim-listesi');
            let filtreli = besinler.filter(b => {
                if (tAktifKategori === 'favori' && !favoriler.includes(b.id)) return false;
                if (tAktifKategori !== 'tum' && tAktifKategori !== 'favori' && b.kategori !== tAktifKategori) return false;
                if (arama && !gorunenAd(b).toLocaleLowerCase('tr-TR').includes(arama)) return false;
                return true;
            });
            filtreli.sort((a, b) => (favoriler.includes(a.id) ? 0 : 1) - (favoriler.includes(b.id) ? 0 : 1));

            if (filtreli.length === 0) {
                alan.innerHTML = '<div class="bos-durum">🔍 Eşleşen besin yok.</div>';
                return;
            }

            alan.innerHTML = filtreli.map(b => {
                const secili = tSeciliBesinId == b.id;
                const favoriMi = favoriler.includes(b.id);
                return `<div class="liste-elemani ${secili ? 'secili-oge' : ''}" style="cursor:pointer; padding:12px 14px;" onclick="tuketimSecBesin(${b.id})">
                    <div><strong style="font-size:14.5px;">${favoriMi ? '★ ' : ''}${esc(gorunenAd(b))}</strong><span class="liste-detay">${b.ref} ${esc(birimEtiket(b.birim))} | ${b.cal} kcal</span></div>
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

        function tuketimSecBesin(id) { tSeciliBesinId = id; tListele(); tuketimPorsiyonBtnGuncelle(); }

        function tuketimKaydet() {
            let id = tSeciliBesinId;
            let mik = parseFloat(document.getElementById('t-miktar').value);
            if (!id) { bildirGoster('Lütfen bir besin seç', 'hata'); return; }
            if (!mik || mik <= 0) { bildirGoster('Geçerli bir miktar gir', 'hata'); return; }

            let b = besinler.find(x => x.id == id);
            if (!b) { bildirGoster('Besin bulunamadı', 'hata'); return; }
            let carpan = mik / b.ref;

            let aktif = aktifProfiliGetir();
            let duzenleId = document.getElementById('t-duzenle-id').value;

            if (duzenleId) {
                let kayit = aktif.gunluk.find(x => x.id == duzenleId);
                kayit.besinId = b.id; kayit.ad = b.ad; kayit.marka = b.marka || ''; kayit.miktar = mik; kayit.birim = b.birim;
                kayit.cal = Math.round(b.cal * carpan); kayit.pro = (b.pro * carpan).toFixed(1);
                kayit.yag = (b.yag * carpan).toFixed(1); kayit.karb = (b.karb * carpan).toFixed(1);
                bildirGoster('✓ ' + gorunenAd(b) + ' güncellendi');
            } else {
                aktif.gunluk.push({
                    id: benzersizId(), besinId: b.id, ad: b.ad, marka: b.marka || '', miktar: mik, birim: b.birim,
                    cal: Math.round(b.cal * carpan), pro: (b.pro * carpan).toFixed(1),
                    yag: (b.yag * carpan).toFixed(1), karb: (b.karb * carpan).toFixed(1)
                });
                bildirGoster('✓ ' + gorunenAd(b) + ' ' + mik + ' ' + birimEtiket(b.birim) + ' olarak eklendi');
            }

            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('t-miktar').value = '';
            document.getElementById('t-duzenle-id').value = '';
            tSeciliBesinId = null;
            sayfaGoster('ana-ekran');
        }

        function tuketimDuzenleAc(kayitId) {
            let aktif = aktifProfiliGetir();
            let kayit = aktif.gunluk.find(x => x.id == kayitId);
            if (!kayit) return;
            document.getElementById('t-duzenle-id').value = kayitId;
            document.getElementById('t-miktar').value = kayit.miktar;
            tSeciliBesinId = kayit.besinId || null;
            tAktifKategori = 'tum';
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
            if (deger > 0) bildirGoster('💧 ' + deger + ' ml eklendi');
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

        // BUGÜNKÜ AKTİVİTE (adım) — profildeki ortalamadan sapmayı kalori hedefine ekler
        function bugunAktiviteGetir(aktif) {
            return (aktif.gunlukAktivite && aktif.gunlukAktivite[bugununTarihi]) || null;
        }

        function ortalamaGunlukAdim(adimFaktor) {
            // adımFaktor seçeneklerinin orta noktalarına kabaca karşılık gelir
            const tablo = { 1.15: 2000, 1.2: 5500, 1.275: 8500, 1.35: 11250, 1.425: 13000 };
            let enYakin = Object.keys(tablo).reduce((a, b) => Math.abs(b - adimFaktor) < Math.abs(a - adimFaktor) ? b : a);
            return tablo[enYakin];
        }

        function bugunAdimKaydet() {
            let aktif = aktifProfiliGetir();
            let deger = parseFloat(document.getElementById('bugun-adim-input').value);
            if (!aktif.gunlukAktivite) aktif.gunlukAktivite = {};
            let mevcut = aktif.gunlukAktivite[bugununTarihi] || {};
            if (!deger || deger < 0) {
                delete mevcut.adim;
                bildirGoster('Bugünkü adım kaydı temizlendi, ortalama kullanılacak');
            } else {
                mevcut.adim = deger;
                bildirGoster('👟 Bugünkü adım kaydedildi');
            }
            aktif.gunlukAktivite[bugununTarihi] = mevcut;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            arayuzGuncelle();
        }

        function bugunEgzersizAlaniAcKapa() {
            document.getElementById('bugun-egzersiz-form').classList.toggle('gizli');
        }

        function bugunEgzersizEkle() {
            let aktif = aktifProfiliGetir();
            let tip = document.getElementById('beg-tip').value;
            let sure = parseFloat(document.getElementById('beg-sure').value);
            if (!sure || sure <= 0) { bildirGoster('Geçerli bir süre gir', 'hata'); return; }
            if (!aktif.gunlukAktivite) aktif.gunlukAktivite = {};
            let mevcut = aktif.gunlukAktivite[bugununTarihi] || {};
            if (!mevcut.egzersizler) mevcut.egzersizler = [];
            mevcut.egzersizler.push({ id: benzersizId(), tip: tip, sure: sure });
            aktif.gunlukAktivite[bugununTarihi] = mevcut;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('beg-sure').value = '';
            document.getElementById('bugun-egzersiz-form').classList.add('gizli');
            bildirGoster('🏋️ Egzersiz eklendi');
            arayuzGuncelle();
        }

        function bugunEgzersizSil(id) {
            let aktif = aktifProfiliGetir();
            let mevcut = aktif.gunlukAktivite && aktif.gunlukAktivite[bugununTarihi];
            if (!mevcut || !mevcut.egzersizler) return;
            mevcut.egzersizler = mevcut.egzersizler.filter(e => e.id != id);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            arayuzGuncelle();
        }

        const egzersizAdlari = { agirlik: 'Ağırlık', kosu: 'Koşu', futbol: 'Futbol', bisiklet: 'Bisiklet', kardiyo: 'Kardiyo', karisik: 'Karışık' };

        function egzersizKcalHesapla(tip, sure, kilo) {
            let met = metDegeri(tip);
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
                let bugunToplamKcal = egzersizListesi.reduce((t, e) => t + egzersizKcalHesapla(e.tip, e.sure, kilo), 0);
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
            const kiloDegerleri = ilgiliKayitlar.map(g => g.kilo);
            const ortalamaDizi = hareketliOrtalama(kiloDegerleri, 7);
            const kiloDegisim = ortalamaDizi[ortalamaDizi.length - 1] - ortalamaDizi[0];

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
            let karbAdaylari = besinler.filter(b => b.kategori === 'karb' && b.karb > 0).sort((a, b) => b.karb - a.karb);

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

        function takviyeBugunToggle(id) {
            let aktif = aktifProfiliGetir();
            if (!aktif.takviyeGecmisi) aktif.takviyeGecmisi = {};
            if (!aktif.takviyeGecmisi[bugununTarihi]) aktif.takviyeGecmisi[bugununTarihi] = {};
            aktif.takviyeGecmisi[bugununTarihi][id] = !aktif.takviyeGecmisi[bugununTarihi][id];
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            takviyeMiniGuncelle();
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
                            <button class="btn-duzenle" onclick="takviyeFormuAc('${t.id}')">✎</button>
                            <button class="btn-tehlike" onclick="takviyeSil('${t.id}')" style="border-radius:12px;">✖</button>
                        </div>
                    </div>`).join('');
            }
        }

        // ÖĞÜN ŞABLONLARI (Hazır Öğün / Tarif)
        const sablonKategoriAdlari = { kahvalti: '🍳 Kahvaltı', ogle: '🥗 Öğle', aksam: '🍽 Akşam', antrenman: '💪 Antrenman Sonrası', kendi: '📌 Kendi Öğünlerim' };

        function sablonFormuAc() {
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
            let filtreli = arama ? besinler.filter(b => gorunenAd(b).toLocaleLowerCase('tr-TR').includes(arama)) : besinler.slice(0, 8);
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
                    <button class="btn-tehlike btn-kucuk" onclick="sablonIcerikOgeSil(${i})">✖</button>
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
            sablonlar.push({
                id: benzersizId(), ad: ad, kategori: document.getElementById('sb-kategori').value,
                porsiyonSayisi: porsiyonSayisi,
                icerikler: sbTaslakIcerik.map(o => ({ besinId: o.besinId, ad: o.ad, marka: o.marka || '', miktar: o.miktar, ref: o.ref, birim: o.birim }))
            });
            localStorage.setItem('df_sablonlar', JSON.stringify(sablonlar));
            bildirGoster('📋 Şablon kaydedildi');
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
                return `<div class="liste-elemani" style="flex-direction:column; align-items:stretch;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                        <div>
                            <strong style="font-size:15px;">${esc(sablonKategoriAdlari[s.kategori] || '')} ${esc(s.ad)}</strong>
                            <span class="liste-detay">${esc(icerikMetni)}</span>
                            <span class="liste-detay">≈ ${Math.round(toplamKcal)} kcal${esc(porsiyonMetni)}</span>
                        </div>
                        <button class="btn-tehlike btn-kucuk" onclick="sablonSil('${s.id}')">✖</button>
                    </div>
                    <div class="buton-grubu" style="margin-top:10px;">
                        <button onclick="sablonUygula('${s.id}', 1)">${porsiyonSayisi > 1 ? '1 Porsiyon Ekle' : esc(s.ad) + ' Ekle'}</button>
                        ${porsiyonSayisi > 1 ? `<button class="btn-ikincil" onclick="sablonUygula('${s.id}', ${porsiyonSayisi})">Tümünü Ekle (${porsiyonSayisi}x)</button>` : ''}
                    </div>
                </div>`;
            }).join('');
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
            sayfaGoster('ana-ekran');
        }

        // ANA EKRAN ARAYÜZÜ
        function arayuzGuncelle() {
            let secimKutusu = document.getElementById('aktif-profil-secim');
            secimKutusu.innerHTML = '';
            profiller.forEach(p => {
                let secili = (p.id == aktifProfilId) ? 'selected' : '';
                secimKutusu.innerHTML += `<option value="${p.id}" ${secili}>👤 ${esc(p.ad)}</option>`;
            });

            let aktif = aktifProfiliGetir();
            suGunKontrol(aktif);
            document.getElementById('ana-baslik').innerText = (aktif.ad ? aktif.ad + "'nın" : 'Bugünün') + ' Günlüğü';

            let hedefler = bugunkuHedefleriHesapla(aktif);

            let tCal = 0, tPro = 0, tYag = 0, tKarb = 0;
            let liste = document.getElementById('yenenler-listesi');
            liste.innerHTML = '';

            if (aktif.gunluk.length === 0) {
                liste.innerHTML = '<div class="bos-durum">🍽️ Henüz bir şey yemedin. Yukarıdan ekleyebilirsin.</div>';
            }

            aktif.gunluk.forEach(t => {
                tCal += parseFloat(t.cal); tPro += parseFloat(t.pro); tYag += parseFloat(t.yag); tKarb += parseFloat(t.karb);
                let birimYazi = t.birim ? birimEtiket(t.birim) : 'birim';
                liste.innerHTML += `
                    <div class="liste-elemani" data-tid="${t.id}" id="tuketim-${t.id}">
                        <div class="swipe-arka"><span class="sw-duzenle">✎ Düzenle</span><span class="sw-sil">Sil 🗑</span></div>
                        <div><strong style="font-size:15px;">${esc(gorunenAd(t))}</strong><span class="liste-detay">${t.miktar} ${esc(birimYazi)}</span></div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="text-align:right;">
                                <strong style="color:var(--vurgu-renk); font-size:16px;">${t.cal} kcal</strong>
                                <span class="liste-detay">P:${t.pro} Y:${t.yag}</span>
                            </div>
                            <div class="menu-sarmal">
                                <button class="menu-nokta" onclick="menuAcKapa(event, 'tmenu-${t.id}')">⋮</button>
                                <div class="kucuk-menu gizli" id="tmenu-${t.id}">
                                    <button onclick="tuketimDuzenleAc('${t.id}')">✎ Düzenle</button>
                                    <button onclick="tuketimSil('${t.id}')">🗑 Sil</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
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
                    let kcal = Math.round(egzersizKcalHesapla(e.tip, e.sure, aktif.girdi.kilo));
                    return `<div class="mini-satir"><span>${esc(egzersizAdlari[e.tip] || e.tip)} — ${e.sure} dk (${kcal} kcal)</span><span class="durum-ikon" style="color:#ff8a8a;" onclick="bugunEgzersizSil('${e.id}')">✖</span></div>`;
                }).join('');
            }

            document.getElementById('su-miktar').innerText = aktif.su.miktar + ' ml';
            document.getElementById('su-hedef-yazi').innerText = 'Hedef: ' + aktif.suHedefMl + ' ml';
            document.getElementById('ilerleme-su').style.width = Math.min(100, Math.round((aktif.su.miktar / aktif.suHedefMl) * 100)) + '%';
            document.getElementById('su-hedef-input').value = aktif.suHedefMl;

            document.getElementById('oneri-sonuc-karti').classList.add('gizli');
            document.getElementById('eksik-sonuc-karti').classList.add('gizli');

            kalibrasyonKontrolEt();
            takviyeMiniGuncelle();
        }

        // GEÇMİŞ (okuma + silme + miktar düzenleme + analitik)
        function trendGuncelle() {
            let aktif = aktifProfiliGetir();
            let hepsi = [...aktif.gecmis];
            if (aktif.gunluk.length > 0) hepsi.push({ tarih: bugununTarihi, veriler: aktif.gunluk });
            let son14 = hepsi.slice(-14);
            let kaloriler = son14.map(g => g.veriler.reduce((t, x) => t + parseFloat(x.cal), 0));
            let tarihler = son14.map(g => g.tarih);
            const alan = document.getElementById('trend-grafik-alan');
            alan.innerHTML = kaloriler.length >= 2
                ? svgCizgiGrafik(kaloriler, 320, 100, 'var(--vurgu-renk)', aktif.kalori, tarihler, 'kcal')
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
                    ortKiloYazi = (haftaOncesi.reduce((t, g) => t + g.kilo, 0) / haftaOncesi.length).toFixed(1) + ' kg';
                }
                if (haftaOncesi.length >= 2) {
                    let d = haftaOncesi[haftaOncesi.length - 1].kilo - haftaOncesi[0].kilo;
                    kiloDegisimYazi = (d >= 0 ? '+' : '') + d.toFixed(1) + ' kg';
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

        function gecmisMiktarDuzenle(gunIndex, ogeId) {
            let aktif = aktifProfiliGetir();
            let gun = aktif.gecmis[gunIndex];
            let oge = gun.veriler.find(x => x.id == ogeId);
            if (!oge.besinId) { bildirGoster('Bu eski kayıt miktar olarak düzenlenemiyor, sadece silinebilir.', 'hata'); return; }
            let besin = besinler.find(b => b.id === oge.besinId);
            if (!besin) { bildirGoster('Bu besin kütüphaneden silinmiş, düzenlenemiyor.', 'hata'); return; }
            let yeniMiktar = prompt(gorunenAd(oge) + ' için yeni miktar (' + besin.ref + ' ' + birimEtiket(besin.birim) + ' = ' + besin.cal + ' kcal):', oge.miktar);
            if (yeniMiktar === null) return;
            yeniMiktar = parseFloat(yeniMiktar);
            if (!yeniMiktar || yeniMiktar <= 0) { bildirGoster('Geçersiz miktar', 'hata'); return; }
            let carpan = yeniMiktar / besin.ref;
            oge.miktar = yeniMiktar;
            oge.cal = Math.round(besin.cal * carpan);
            oge.pro = (besin.pro * carpan).toFixed(1);
            oge.yag = (besin.yag * carpan).toFixed(1);
            oge.karb = (besin.karb * carpan).toFixed(1);
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            gecmisListele();
            bildirGoster('Kayıt güncellendi');
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

        function gecmisListele() {
            let aktif = aktifProfiliGetir();
            const liste = document.getElementById('gecmis-listesi');
            document.getElementById('gecmis-isim-bilgi').innerText = `Şu an ${aktif.ad} adlı kişinin arşivindesin.`;
            liste.innerHTML = '';
            trendGuncelle();
            analitikGuncelle();

            if (aktif.gecmis.length === 0) {
                liste.innerHTML = '<div class="bos-durum" style="margin-top:20px;">🗂 Arşiv boş.</div>';
                return;
            }

            let tersArsiv = [...aktif.gecmis].reverse();
            tersArsiv.forEach(gun => {
                let gunIndexGercek = aktif.gecmis.findIndex(g => g.tarih === gun.tarih);
                liste.innerHTML += `<span class="gecmis-tarih" onclick="gunRaporuGoster('${esc(gun.tarih)}')">${esc(gun.tarih)}<button onclick="event.stopPropagation(); gecmisGunuTekrarEt(${gunIndexGercek})">🔄 Tekrar Ekle</button></span>`;
                let topCal = 0;
                gun.veriler.forEach(t => {
                    topCal += parseFloat(t.cal);
                    liste.innerHTML += `
                        <div class="liste-elemani" style="border-left-color:#3A3A3C; opacity:0.85; padding:12px;">
                            <div><strong>${esc(gorunenAd(t))}</strong><span class="liste-detay">${t.miktar} ${esc(t.birim ? birimEtiket(t.birim) : 'birim')}</span></div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <strong style="color:var(--yazi-ana);">${t.cal} kcal</strong>
                                <button class="btn-duzenle" style="padding:6px 9px;" onclick="gecmisMiktarDuzenle(${gunIndexGercek}, '${t.id}')">✎</button>
                                <button class="btn-tehlike" style="padding:6px 9px; border-radius:10px;" onclick="gecmisOgeSil(${gunIndexGercek}, '${t.id}')">✖</button>
                            </div>
                        </div>`;
                });
                liste.innerHTML += `<div style="text-align:right; font-size:14px; font-weight:800; margin-bottom:20px; color:var(--yazi-ana);">Toplam: ${Math.round(topCal)} kcal</div>`;
            });
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

        function kiloEkraniGuncelle() {
            let aktif = aktifProfiliGetir();
            if (!aktif.kiloGecmisi) aktif.kiloGecmisi = [];
            let gecmis = [...aktif.kiloGecmisi].sort((a, b) => tarihToDate(a.tarih) - tarihToDate(b.tarih));
            let baslangic = gecmis.length ? gecmis[0].kilo : aktif.girdi.kilo;
            let bugun = gecmis.length ? gecmis[gecmis.length - 1].kilo : aktif.girdi.kilo;
            let degisim = bugun - baslangic;

            document.getElementById('kilo-baslangic').innerText = baslangic.toFixed(1) + ' kg';
            document.getElementById('kilo-bugun').innerText = bugun.toFixed(1) + ' kg';
            document.getElementById('kilo-hedef-nokta').innerText = '🎯 ' + (aktif.hedefKilo ? aktif.hedefKilo.toFixed(1) + ' kg' : '-');

            const grafikAlan = document.getElementById('kilo-grafik-alan');
            let tarihler = gecmis.map(g => g.tarih);
            grafikAlan.innerHTML = gecmis.length >= 2 ? svgCizgiGrafik(gecmis.map(g => g.kilo), 320, 100, 'var(--vurgu-renk)', aktif.hedefKilo, tarihler, 'kg') : '<div class="bos-durum">📉 Grafik için en az 2 kayıt gerekli.</div>';
            grafikTiklamalariBagla('kilo-grafik-alan');

            let degisimEl = document.getElementById('kilo-degisim');
            degisimEl.innerText = (degisim >= 0 ? '+' : '') + degisim.toFixed(1) + ' kg';
            degisimEl.style.color = degisim > 0 ? 'var(--tehlike-renk)' : (degisim < 0 ? 'var(--basari-renk)' : 'var(--yazi-ana)');

            // Haftalık değişim: son 14 günlük veriden hesaplanan ortalama hız
            let haftalikDegisim = 0;
            let simdi = tarihToDate(bugununTarihi);
            let son14GunVeri = gecmis.filter(g => (simdi - tarihToDate(g.tarih)) <= 14 * 86400000);
            if (son14GunVeri.length >= 2) {
                let gunFarki = Math.max(1, (tarihToDate(son14GunVeri[son14GunVeri.length - 1].tarih) - tarihToDate(son14GunVeri[0].tarih)) / 86400000);
                haftalikDegisim = (son14GunVeri[son14GunVeri.length - 1].kilo - son14GunVeri[0].kilo) / gunFarki * 7;
            }
            let haftalikEl = document.getElementById('kilo-haftalik');
            haftalikEl.innerText = (haftalikDegisim >= 0 ? '+' : '') + haftalikDegisim.toFixed(2) + ' kg/hafta';
            haftalikEl.style.color = haftalikDegisim > 0 ? 'var(--tehlike-renk)' : (haftalikDegisim < 0 ? 'var(--basari-renk)' : 'var(--yazi-ana)');

            document.getElementById('kilo-hedef-input').value = aktif.hedefKilo || '';
            let hedefYaziEl = document.getElementById('kilo-hedef-bilgi');
            let tahminEl = document.getElementById('kilo-tahmin-bilgi');
            if (aktif.hedefKilo) {
                let kalan = aktif.hedefKilo - bugun;
                hedefYaziEl.innerText = '🎯 Hedef: ' + aktif.hedefKilo.toFixed(1) + ' kg — Kalan: ' + Math.abs(kalan).toFixed(1) + ' kg ' + (kalan > 0 ? 'almak' : 'vermek') + ' gerekiyor';
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
                    olcumAlan.innerHTML = svgCizgiGrafik(olcumKayitlari.map(g => g.olcumler[olcumAktifTur]), 320, 90, 'var(--vurgu-renk)', null, olcumKayitlari.map(g => g.tarih), 'cm');
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
            [...gecmis].reverse().forEach((g, revIdx) => {
                let olcumMetni = '';
                if (g.olcumler) {
                    let parcalar = [];
                    Object.keys(olcumEtiketleri).forEach(k => { if (g.olcumler[k]) parcalar.push(olcumEtiketleri[k] + ': ' + g.olcumler[k] + 'cm'); });
                    if (parcalar.length) olcumMetni = '<span class="liste-detay">' + esc(parcalar.join(' · ')) + '</span>';
                }
                liste.innerHTML += `<div class="liste-elemani"><div><strong>${g.kilo.toFixed(1)} kg</strong><span class="liste-detay">${esc(g.tarih)}</span>${olcumMetni}</div><button class="btn-tehlike" style="border-radius:12px;" onclick="kiloSil('${g.id}')">✖</button></div>`;
            });
        }

        function kiloEkle() {
            let deger = parseFloat(document.getElementById('kilo-yeni').value);
            if (!deger || deger <= 0) { bildirGoster('Geçerli bir kilo gir', 'hata'); return; }
            let aktif = aktifProfiliGetir();
            if (!aktif.kiloGecmisi) aktif.kiloGecmisi = [];

            let olcumler = {};
            let olcumAlaniVarMi = !document.getElementById('olcum-alani').classList.contains('gizli');
            if (olcumAlaniVarMi) {
                ['bel', 'boyun', 'gogus', 'kol', 'kalca', 'bacak'].forEach(k => {
                    let v = parseFloat(document.getElementById('oc-' + k).value);
                    if (v) olcumler[k] = v;
                });
            }
            let olcumVarMi = Object.keys(olcumler).length > 0;

            let bugunkuKayit = aktif.kiloGecmisi.find(g => g.tarih === bugununTarihi);
            if (bugunkuKayit) {
                bugunkuKayit.kilo = deger;
                if (olcumVarMi) bugunkuKayit.olcumler = olcumler;
            } else {
                let yeniKayit = { id: benzersizId(), tarih: bugununTarihi, kilo: deger };
                if (olcumVarMi) yeniKayit.olcumler = olcumler;
                aktif.kiloGecmisi.push(yeniKayit);
            }
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            document.getElementById('kilo-yeni').value = '';
            ['bel', 'boyun', 'gogus', 'kol', 'kalca', 'bacak'].forEach(k => document.getElementById('oc-' + k).value = '');
            kiloEkraniGuncelle();
            bildirGoster('⚖ Kilo kaydedildi');
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
            let deger = parseFloat(document.getElementById('kilo-hedef-input').value);
            aktif.hedefKilo = deger || null;
            localStorage.setItem('df_profiller', JSON.stringify(profiller));
            kiloEkraniGuncelle();
            bildirGoster('Hedef kilo kaydedildi');
        }

        // DIŞA / İÇE AKTARIM
        function veriDisaAktar() {
            let veri = {
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
            bildirGoster('⬇ Veriler dışa aktarıldı');
        }

        function veriIceAktar(event) {
            let dosya = event.target.files[0];
            if (!dosya) return;
            let okuyucu = new FileReader();
            okuyucu.onload = function (e) {
                try {
                    let veri = JSON.parse(e.target.result);
                    if (!confirm('Bu içe aktarma, tarayıcıdaki mevcut verilerin üzerine yazacak. Devam etmek istiyor musun?')) return;
                    if (veri.df_besinler) localStorage.setItem('df_besinler', JSON.stringify(veri.df_besinler));
                    if (veri.df_profiller) localStorage.setItem('df_profiller', JSON.stringify(veri.df_profiller));
                    if (veri.df_aktif_profil_id) localStorage.setItem('df_aktif_profil_id', veri.df_aktif_profil_id);
                    if (veri.df_favoriler) localStorage.setItem('df_favoriler', JSON.stringify(veri.df_favoriler));
                    if (veri.df_takviyeler) localStorage.setItem('df_takviyeler', JSON.stringify(veri.df_takviyeler));
                    if (veri.df_sablonlar) localStorage.setItem('df_sablonlar', JSON.stringify(veri.df_sablonlar));
                    bildirGoster('✓ Veriler içe aktarıldı, sayfa yenileniyor...');
                    setTimeout(() => location.reload(), 900);
                } catch (err) {
                    bildirGoster('Geçersiz dosya, içe aktarılamadı', 'hata');
                }
            };
            okuyucu.readAsText(dosya);
        }

        // TÜM VERİLERİ SİL — çift onaylı, geri alınamaz tehlikeli işlem
        function veriSifirlaBaslat() {
            if (!confirm('Bu işlem TÜM profilleri, besin kütüphaneni, geçmişini ve ayarlarını kalıcı olarak silecek. Bu işlem geri alınamaz. Devam etmek istiyor musun?')) return;
            if (!confirm('Son kez soruyoruz: verilerini dışa aktardın mı? Onaylarsan her şey silinecek ve sıfırdan başlayacaksın.')) return;
            ['df_besinler', 'df_profiller', 'df_aktif_profil_id', 'df_favoriler', 'df_takviyeler', 'df_sablonlar'].forEach(k => localStorage.removeItem(k));
            bildirGoster('🗑 Tüm veriler silindi, sayfa yenileniyor...');
            setTimeout(() => location.reload(), 900);
        }

        baslangicKontrolu();