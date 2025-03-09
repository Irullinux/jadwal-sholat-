let idKota = "";

function cariKota() {
    let query = document.getElementById("search").value.trim();
    if (query === "") {
        alert("Masukkan nama kota terlebih dahulu!");
        return;
    }

    fetch(`https://api.myquran.com/v2/sholat/kota/cari/${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.status && data.data.length > 0) {
                let kota = data.data[0]; // Ambil hasil pertama
                idKota = kota.id; // Simpan ID Kota

                document.getElementById("idKota").innerText = kota.id;
                document.getElementById("namaKota").innerText = kota.lokasi;

                document.getElementById("hasilKota").classList.remove("hidden");
            } else {
                alert("Kota tidak ditemukan! Coba masukkan kota lain.");
            }
        })
        .catch(error => console.error("Error:", error));
}

function getJadwal() {
    if (idKota === "") {
        alert("Cari kota terlebih dahulu!");
        return;
    }

    let tanggal = new Date();
    let tahun = tanggal.getFullYear();
    let bulan = ("0" + (tanggal.getMonth() + 1)).slice(-2); // Format 2 digit bulan
    let hari = ("0" + tanggal.getDate()).slice(-2); // Format 2 digit hari
    let hariIni = `${hari}/${bulan}/${tahun}`; // Format yang sesuai dengan API

    fetch(`https://api.myquran.com/v2/sholat/jadwal/${idKota}/${tahun}/${bulan}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                let jadwal = data.data.jadwal;
                let jadwalBody = document.getElementById("jadwalBody");
                jadwalBody.innerHTML = "";

                jadwal.forEach(hari => {
                    let highlight = hari.tanggal === hariIni ? "bg-yellow-highlight" : ""; 

                    let row = `
                        <tr class="text-center ${highlight}">
                            <td class="border p-2">${hari.tanggal}</td>
                            <td class="border p-2">${hari.imsak}</td>
                            <td class="border p-2">${hari.subuh}</td>
                            <td class="border p-2">${hari.dzuhur}</td>
                            <td class="border p-2">${hari.ashar}</td>
                            <td class="border p-2">${hari.maghrib}</td>
                            <td class="border p-2">${hari.isya}</td>
                        </tr>
                    `;
                    jadwalBody.innerHTML += row;
                });

                document.getElementById("jadwalSholat").classList.remove("hidden");
            } else {
                alert("Jadwal sholat tidak ditemukan!");
            }
        })
        .catch(error => console.error("Error:", error));
}