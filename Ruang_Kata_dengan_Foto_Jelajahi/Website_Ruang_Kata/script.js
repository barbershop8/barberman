const starterNovels = [
 {id:"s1",title:"Senja Terakhir",author:"A. Nara",genre:"Drama",color:"#e7c7a5",ink:"#704a37",synopsis:"Hujan turun perlahan ketika Arka melangkah memasuki toko buku tua di ujung jalan. Di sudut dekat jendela, seorang perempuan membaca buku bersampul cokelat."},
 {id:"s2",title:"Di Balik Hujan",author:"Kirana Putri",genre:"Romansa",color:"#e9b9b5",ink:"#804e53",synopsis:"Setiap hujan menyimpan kenangan yang tak sempat selesai. Bagi Aluna, suara rintik di atap adalah pengingat tentang seseorang yang pernah berjanji untuk kembali."},
 {id:"s3",title:"Dunia Kedua",author:"R. Mahesa",genre:"Fantasi",color:"#c9c5e5",ink:"#514d7e",synopsis:"Di balik pintu perpustakaan yang terkunci, Nara menemukan peta menuju dunia yang hanya muncul saat bintang terakhir bersinar."},
 {id:"s4",title:"Surat Tanpa Nama",author:"Dimas Aruna",genre:"Misteri",color:"#c7d7cf",ink:"#3d6255",synopsis:"Sebuah surat tanpa nama tiba setiap Jumat. Isinya selalu memuat kejadian yang belum terjadi."},
 {id:"s5",title:"Arah Pulang",author:"Nadia Senja",genre:"Drama",color:"#e5d2a9",ink:"#7b6036",synopsis:"Setelah bertahun-tahun pergi, Raka kembali ke kota kecil tempat ia tumbuh dan belajar berdamai dengan masa lalu."},
 {id:"s6",title:"Bintang di Utara",author:"L. Adikara",genre:"Petualangan",color:"#b9cddd",ink:"#3e6078",synopsis:"Seorang penjaga mercusuar muda menerima tugas untuk menyalakan bintang yang padam."}
];
const NOVEL_KEY="ruangKata_userNovels_v1", DRAFT_KEY="ruangKata_writerDraft_v1";
const $=s=>document.querySelector(s);
let activeCategory="Semua";
const coverByGenre={
  "Drama":"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85",
  "Romansa":"https://images.unsplash.com/photo-1518198388390-7d5b5d9b2f6f?auto=format&fit=crop&w=900&q=85",
  "Fantasi":"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85",
  "Misteri":"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
  "Petualangan":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
  "Fiksi ilmiah":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85",
  "Horor":"https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=900&q=85"
};

function getUserNovels(){try{const x=JSON.parse(localStorage.getItem(NOVEL_KEY)||"[]");return Array.isArray(x)?x:[]}catch{return[]}}
function setUserNovels(items){try{localStorage.setItem(NOVEL_KEY,JSON.stringify(items));return true}catch{$("#saveStatus").textContent="Penyimpanan browser tidak tersedia.";return false}}
function allPublished(){return [...getUserNovels().slice().reverse(),...starterNovels]}
function makeCover(novel){
 const button=document.createElement("button");button.className="cover-button";button.type="button";button.setAttribute("aria-label","Buka "+novel.title);
 const cover=document.createElement("div");cover.className="cover-art";cover.style.background=novel.color||"#e7c7a5";cover.style.color=novel.ink||"#704a37";
 const image=document.createElement("img");image.className="cover-photo";image.alt="Sampul novel "+novel.title;image.loading="lazy";image.src=novel.cover||coverByGenre[novel.genre]||coverByGenre.Drama;
 image.onerror=()=>{image.style.display="none";};
 const shade=document.createElement("span");shade.className="cover-shade";
 const title=document.createElement("span");title.className="cover-title";title.textContent=novel.title;
 const author=document.createElement("span");author.className="cover-author";author.textContent=novel.author||novel.penName||"Penulis Ruang Kata";
 cover.append(image,shade,title,author);button.append(cover);button.addEventListener("click",()=>showNovel(novel));return button;
}
function makeCard(novel){
 const article=document.createElement("article");article.className="novel-card";article.append(makeCover(novel));
 const meta=document.createElement("div");meta.className="novel-meta";const info=document.createElement("div");
 const title=document.createElement("h3");title.textContent=novel.title;const author=document.createElement("p");author.textContent=novel.author||novel.penName||"Penulis Ruang Kata";
 info.append(title,author);const genre=document.createElement("span");genre.className="genre-tag";genre.textContent=novel.genre;meta.append(info,genre);article.append(meta);return article;
}
function renderBooks(){
 const all=allPublished(), q=$("#searchInput").value.trim().toLocaleLowerCase("id");
 const visible=all.filter(n=>(activeCategory==="Semua"||n.genre===activeCategory)&&`${n.title} ${n.author||n.penName||""} ${n.genre}`.toLocaleLowerCase("id").includes(q));
 $("#allNovels").replaceChildren(...visible.map(makeCard));
 $("#emptyState").hidden=visible.length>0;
 $("#featuredNovels").replaceChildren(...all.slice(0,3).map(makeCard));
}
function showNovel(n){
 const root=$("#dialogContent");root.replaceChildren();
 const label=document.createElement("p");label.className="eyebrow";label.textContent=(n.genre||"Novel").toUpperCase();
 const title=document.createElement("h2");title.textContent=n.title;
 const author=document.createElement("p");author.className="section-description";author.textContent="Oleh "+(n.author||n.penName||"Penulis Ruang Kata");
 const cover=document.createElement("div");cover.className="dialog-cover";cover.style.background=n.color||"#e7c7a5";cover.style.color=n.ink||"#704a37";cover.textContent=n.title;
 const synopsis=document.createElement("p");synopsis.textContent=n.synopsis||"Belum ada sinopsis.";
 root.append(label,title,author,cover,synopsis);
 if(n.chapterText){const ch=document.createElement("h3");ch.textContent=n.chapterTitle||"Bab 1";const text=document.createElement("p");text.className="reader-text";text.textContent=n.chapterText;root.append(ch,text)}
 $("#novelDialog").showModal();
}
$("#categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;$("#categoryFilters").querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderBooks()});
$("#searchInput").addEventListener("input",renderBooks);
$("#menuToggle").addEventListener("click",e=>{const open=$("#navLinks").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",String(open))});
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("open")));
$("#dialogClose").addEventListener("click",()=>$("#novelDialog").close());
$("#novelDialog").addEventListener("click",e=>{if(e.target===$("#novelDialog"))$("#novelDialog").close()});

const form=$("#novelForm");
const fields={title:$("#novelTitle"),genre:$("#novelGenre"),penName:$("#penName"),synopsis:$("#novelSynopsis"),chapterTitle:$("#chapterTitle"),chapterText:$("#chapterText")};
function formData(){return Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v.value.trim()]))}
function updateWordCount(){const t=fields.chapterText.value.trim();$("#wordCount").textContent=(t?t.split(/\s+/).length:0)+" kata"}
fields.chapterText.addEventListener("input",updateWordCount);
function saveDraft(){try{localStorage.setItem(DRAFT_KEY,JSON.stringify(formData()));$("#saveStatus").textContent="Draf tersimpan di browser ini."}catch{$("#saveStatus").textContent="Draf gagal disimpan."}}
$("#saveDraftButton").addEventListener("click",saveDraft);
function loadDraft(){try{const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");if(d)Object.entries(fields).forEach(([k,v])=>v.value=d[k]||"")}catch{}updateWordCount()}
function renderMyNovels(){
 const novels=getUserNovels();$("#myNovelCount").textContent=novels.length+" karya";const list=$("#myNovelsList");list.replaceChildren();
 if(!novels.length){const p=document.createElement("p");p.className="empty-state";p.textContent="Belum ada novel. Mulai menulis karya pertamamu!";list.append(p);return}
 novels.slice().reverse().forEach(n=>{
  const card=document.createElement("article");card.className="my-novel-item";const status=document.createElement("span");status.className="published-tag";status.textContent="Terbit di perangkat ini";
  const title=document.createElement("h4");title.textContent=n.title;const meta=document.createElement("p");meta.textContent=n.penName+" · "+n.genre;
  const actions=document.createElement("div");actions.className="my-novel-actions";
  const action=(label,fn)=>{const b=document.createElement("button");b.type="button";b.className="small-action";b.textContent=label;b.addEventListener("click",fn);return b};
  actions.append(action("Baca",()=>showNovel(n)),action("Edit",()=>{Object.entries(fields).forEach(([k,v])=>v.value=n[k]||"");form.dataset.editId=n.id;updateWordCount();$("#saveStatus").textContent="Mode edit aktif. Terbitkan ulang untuk menyimpan perubahan.";$("#studio").scrollIntoView({behavior:"smooth"})}),action("Hapus",()=>{if(confirm(`Hapus novel "${n.title}" dari browser ini?`)){setUserNovels(getUserNovels().filter(x=>x.id!==n.id));renderMyNovels();renderBooks()}}));
  card.append(status,title,meta,actions);list.append(card);
 });
}
form.addEventListener("submit",e=>{
 e.preventDefault();const d=formData();if(!Object.values(d).every(Boolean)){alert("Lengkapi semua kolom terlebih dahulu.");return}
 const current=getUserNovels(), editId=form.dataset.editId;
 const index=current.findIndex(n=>n.id===editId);
 const novel={id:editId||String(Date.now()),...d,author:d.penName,color:"#e7c7a5",ink:"#704a37",publishedAt:new Date().toISOString()};
 if(index>=0)current[index]=novel;else current.push(novel);
 if(!setUserNovels(current))return;
 delete form.dataset.editId;localStorage.removeItem(DRAFT_KEY);$("#saveStatus").textContent="Novel berhasil diterbitkan di daftar Novelku pada perangkat ini!";
 renderMyNovels();renderBooks();alert("Novel berhasil diterbitkan di browser ini.");
});
$("#readerClose").addEventListener("click",()=>$("#readerDialog").close());
$("#readerDialog").addEventListener("click",e=>{if(e.target===$("#readerDialog"))$("#readerDialog").close()});
$("#loginButton").addEventListener("click",()=>$("#loginDialog").showModal());
$("#loginClose").addEventListener("click",()=>$("#loginDialog").close());
$("#loginForm").addEventListener("submit",e=>{e.preventDefault();$("#loginMessage").textContent="Form ini masih demo; akun sungguhan memerlukan backend."});
$("#year").textContent=new Date().getFullYear();
loadDraft();renderMyNovels();renderBooks();
