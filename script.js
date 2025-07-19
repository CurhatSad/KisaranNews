import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Firebase config kamu
const firebaseConfig = {
  apiKey: "AIzaSyCDrAg88wbUoTyEJKrcRnVQfk-h8rd6g-E",
  authDomain: "skul-f8fa4.firebaseapp.com",
  projectId: "skul-f8fa4",
  storageBucket: "skul-f8fa4.appspot.com",
  messagingSenderId: "1024758740169",
  appId: "1:1024758740169:web:946aade58acb7c0f55c918",
  measurementId: "G-XZWL86JK0X"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Upload berita
const form = document.getElementById("uploadForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const judul = document.getElementById("judul").value;
    const konten = document.getElementById("konten").value;
    const gambar = document.getElementById("gambar").files[0];

    const imgRef = ref(storage, `gambar/${Date.now()}_${gambar.name}`);
    await uploadBytes(imgRef, gambar);
    const imageUrl = await getDownloadURL(imgRef);

    await addDoc(collection(db, "berita"), {
      judul,
      konten,
      imageUrl,
      time: Date.now()
    });

    alert("Berita berhasil di-upload!");
    form.reset();
  });
}

// Tampilkan berita
const beritaList = document.getElementById("beritaList");
if (beritaList) {
  const q = query(collection(db, "berita"), orderBy("time", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow";
    div.innerHTML = `
      <h3 class="text-lg font-bold">${data.judul}</h3>
      <img src="${data.imageUrl}" class="w-full my-2 rounded max-h-64 object-cover" />
      <p>${data.konten}</p>
    `;
    beritaList.appendChild(div);
  });
}