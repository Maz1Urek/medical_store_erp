import { useState, useRef } from "react";
import "./index.css";

const sampleImages = [
  "http://5.imimg.com/data5/SELLER/Default/2022/8/CW/BB/DS/129887935/paracetamol-tablets-500-mg.jpeg",
  "https://tse1.mm.bing.net/th/id/OIP.8qBg4OHmkea5H_id88abegHaF2?pid=Api&P=0&h=180",
  "https://tse1.mm.bing.net/th/id/OIP.HTfUyZUMu6ric8npLc17IgHaGZ?pid=Api&P=0&h=180",
  "https://tse2.mm.bing.net/th/id/OIP.-SvKAG7KZwqBlh6XoB2gyQHaHa?pid=Api&P=0&h=180",
];

export default function App() {
  const [page, setPage] = useState("login");
  const [isAdmin, setIsAdmin] = useState(false);
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol", stock: 50, price: 10, category: "Pain Relief", img: sampleImages[0] },
    { id: 2, name: "Ibuprofen", stock: 30, price: 15, category: "Pain Relief", img: sampleImages[1] },
    { id: 3, name: "Amoxicillin", stock: 5, price: 25, category: "Antibiotic", img: sampleImages[2] },
    { id: 4, name: "Vitamin C", stock: 40, price: 12, category: "Vitamin", img: sampleImages[3] },
  ]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState("");
  const [category, setCategory] = useState("All");

  const cartRef = useRef(null);

  const handleLogin = (role) => {
    setIsAdmin(role === "admin");
    setPage("dashboard");
  };

  const handleLogout = () => {
    setPage("login");
    setCart([]);
  };

  const addMedicine = (name, stock, price, category, img) => {
    setMedicines((prev) => [
      ...prev,
      { id: prev.length + 1, name, stock, price, category, img },
    ]);
  };

  const updateStock = (id, newStock) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, stock: newStock } : med))
    );
  };

  const deleteMedicine = (id) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
  };

  const addToCart = (med, quantity, imgRef) => {
    if (quantity <= 0 || quantity > med.stock) {
      alert("Invalid quantity!");
      return;
    }
    const existing = cart.find((item) => item.id === med.id);
    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === med.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...med, quantity }]);
    }
    setNotification(`${med.name} added to cart!`);
    setTimeout(() => setNotification(""), 1500);

    if (!isAdmin && imgRef && cartRef.current) {
      const img = imgRef.current;
      const cartPos = cartRef.current.getBoundingClientRect();
      const clone = img.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.top = img.getBoundingClientRect().top + "px";
      clone.style.left = img.getBoundingClientRect().left + "px";
      clone.style.width = img.offsetWidth + "px";
      clone.style.height = img.offsetHeight + "px";
      clone.style.transition = "all 0.8s ease-in-out";
      clone.style.zIndex = 1000;
      document.body.appendChild(clone);
      setTimeout(() => {
        clone.style.top = cartPos.top + "px";
        clone.style.left = cartPos.left + "px";
        clone.style.width = "30px";
        clone.style.height = "30px";
        clone.style.opacity = 0;
      }, 50);
      setTimeout(() => document.body.removeChild(clone), 900);
    }
  };

  const filteredMedicines = medicines.filter((med) =>
    (category === "All" || med.category === category) &&
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ["All", "Pain Relief", "Antibiotic", "Vitamin"];

  // --- Login Page ---
  if (page === "login") {
    return (
      <div className="w-full min-h-screen bg-gradient-to-r from-blue-100 to-green-100 flex flex-col items-center justify-center p-6">
        <h1 className="text-6xl font-extrabold text-blue-700 mb-6 animate-bounce">
          My Pharmacy 💊
        </h1>
        <p className="mb-6 text-gray-700">Select login type:</p>
        <div className="flex space-x-4">
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition transform hover:scale-105 shadow-md"
            onClick={() => handleLogin("user")}
          >
            Public User
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition transform hover:scale-105 shadow-md"
            onClick={() => handleLogin("admin")}
          >
            Admin
          </button>
        </div>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-green-500 shadow-xl text-white z-50 rounded-b-xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {isAdmin ? "Admin Dashboard" : "Online Pharmacy 💊"}
        </h1>
        <button
          className="mt-3 sm:mt-0 px-5 py-2 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 shadow-md transition transform hover:scale-105"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Add Medicine Form (simpler version) */}
      {isAdmin && (
        <div className="p-6 bg-white shadow-lg rounded-xl m-6">
          <h2 className="text-2xl font-bold mb-4">Add New Medicine</h2>
          <div className="flex gap-3">
            <input type="text" placeholder="Name" className="border rounded-xl px-3 py-2 flex-1" id="med-name" />
            <input type="number" placeholder="Stock" className="border rounded-xl px-3 py-2 w-24" id="med-stock" />
            <input type="number" placeholder="Price" className="border rounded-xl px-3 py-2 w-24" id="med-price" />
            <input type="text" placeholder="Category" className="border rounded-xl px-3 py-2 w-32" id="med-cat" />
            <input type="text" placeholder="Image URL" className="border rounded-xl px-3 py-2 flex-1" id="med-img" />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              onClick={() =>
                addMedicine(
                  document.getElementById("med-name").value,
                  Number(document.getElementById("med-stock").value),
                  Number(document.getElementById("med-price").value),
                  document.getElementById("med-cat").value,
                  document.getElementById("med-img").value
                )
              }
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row justify-between p-6 gap-4">
        <input
          type="text"
          placeholder="Search medicines..."
          className="border rounded-xl px-4 py-3 w-full sm:max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-xl font-medium ${
                category === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-100"
              } transition`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
        {filteredMedicines.map((med) => {
          const imgRef = !isAdmin ? useRef() : null;
          return (
            <div
              key={med.id}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition flex flex-col"
            >
              <img
                ref={imgRef}
                src={med.img}
                alt={med.name}
                className="h-44 w-full object-contain mb-4 rounded-xl"
              />
              <h2 className="font-bold text-xl mb-1 text-gray-800">{med.name}</h2>
              <p className="mb-1 text-sm text-gray-500">{med.category}</p>
              <p className="mb-1 font-semibold text-gray-700">₹{med.price}</p>
              <p className={`mb-3 font-semibold ${med.stock <= 5 ? "text-red-600" : "text-green-600"}`}>
                Stock: {med.stock}
              </p>

              {isAdmin ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="New stock"
                    className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => updateStock(med.id, Number(e.target.value))}
                  />
                  <button
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition"
                    onClick={() => deleteMedicine(med.id)}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    min="1"
                    max={med.stock}
                    placeholder="Quantity"
                    className="border px-3 py-2 rounded-lg"
                    id={`qty-${med.id}`}
                  />
                  <button
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition transform hover:scale-105"
                    onClick={() => {
                      const qty = Number(document.getElementById(`qty-${med.id}`).value);
                      addToCart(med, qty, imgRef);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-up">
          {notification}
        </div>
      )}

      {/* Cart */}
      {!isAdmin && cart.length > 0 && (
        <div ref={cartRef} className="fixed bottom-4 right-4 bg-white shadow-xl rounded-xl p-4 w-80 animate-slide-up">
          <h2 className="font-bold text-lg mb-2">Cart</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-1">
              <img src={item.img} alt={item.name} className="h-10 w-10 object-contain rounded" />
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <p className="font-bold mt-2">
            Total: ₹{cart.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)}
          </p>
        </div>
      )}
    </div>
  );
}
