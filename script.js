
const productos = [
  {
    id: 1,
    nombre: "Nike Air Max 270",
    marca: "Nike",
    precio: 2499,
    anterior: 2999,
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    nombre: "Adidas Ultraboost",
    marca: "Adidas",
    precio: 2199,
    anterior: 2599,
    imagen: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    nombre: "Puma RS-X",
    marca: "Puma",
    precio: 1899,
    anterior: 2199,
    imagen: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    nombre: "New Balance 550",
    marca: "New Balance",
    precio: 2299,
    anterior: 2599,
    imagen: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    nombre: "Nike Dunk Low",
    marca: "Nike",
    precio: 1999,
    anterior: 2399,
    imagen: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    nombre: "Adidas Forum Low",
    marca: "Adidas",
    precio: 1799,
    anterior: 2099,
    imagen: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    nombre: "Puma Suede Classic",
    marca: "Puma",
    precio: 1499,
    anterior: 1799,
    imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    nombre: "New Balance 9060",
    marca: "New Balance",
    precio: 2699,
    anterior: 2999,
    imagen: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=85"
  }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function guardarDatos() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function mostrarProductos(lista = productos) {
  const contenedor = document.getElementById("productos");

  contenedor.innerHTML = lista.map(producto => `
    <div class="col-sm-6 col-lg-3">
      <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="producto-info">
          <button class="favorito" onclick="cambiarFavorito(${producto.id})">
            ${favoritos.includes(producto.id) ? "♥" : "♡"}
          </button>
          <small>${producto.marca}</small>
          <h5>${producto.nombre}</h5>
          <p>
            <span class="precio">$${producto.precio.toLocaleString("es-MX")}</span>
            <span class="precio-anterior">$${producto.anterior.toLocaleString("es-MX")}</span>
          </p>
          <label class="form-label">Talla</label>
          <select class="form-select mb-3" id="talla-${producto.id}">
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27" selected>27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
          </select>
          <button class="btn btn-dark w-100" onclick="agregarCarrito(${producto.id})">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function filtrarProductos() {
  const busqueda = document.getElementById("busqueda").value.toLowerCase();
  const marca = document.getElementById("marca").value;
  const orden = document.getElementById("orden").value;

  let resultado = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda) &&
    (marca === "todos" || producto.marca === marca)
  );

  if (orden === "menor") resultado.sort((a, b) => a.precio - b.precio);
  if (orden === "mayor") resultado.sort((a, b) => b.precio - a.precio);

  mostrarProductos(resultado);
}

function agregarCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const talla = document.getElementById(`talla-${id}`).value;

  const existente = carrito.find(p => p.id === id && p.talla === talla);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      talla,
      cantidad: 1
    });
  }

  guardarDatos();
  actualizarContador();

  bootstrap.Toast.getOrCreateInstance(document.getElementById("aviso")).show();
}

function actualizarContador() {
  const cantidad = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  document.getElementById("contador").textContent = cantidad;
}

function mostrarCarrito() {
  const contenido = document.getElementById("contenidoCarrito");

  if (carrito.length === 0) {
    contenido.innerHTML = "<p>Tu carrito está vacío.</p>";
  } else {
    contenido.innerHTML = carrito.map((producto, indice) => `
      <div class="d-flex justify-content-between align-items-center border-bottom py-3">
        <div>
          <strong>${producto.nombre}</strong><br>
          Talla: ${producto.talla} · Cantidad: ${producto.cantidad}<br>
          $${(producto.precio * producto.cantidad).toLocaleString("es-MX")} MXN
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${indice})">
          Eliminar
        </button>
      </div>
    `).join("");
  }

  const total = carrito.reduce((suma, p) => suma + p.precio * p.cantidad, 0);
  document.getElementById("totalCarrito").textContent =
    `Total: $${total.toLocaleString("es-MX")} MXN`;

  bootstrap.Modal.getOrCreateInstance(document.getElementById("modalCarrito")).show();
}

function eliminarProducto(indice) {
  carrito.splice(indice, 1);
  guardarDatos();
  actualizarContador();
  mostrarCarrito();
}

function cambiarFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(f => f !== id);
  } else {
    favoritos.push(id);
  }

  guardarDatos();
  filtrarProductos();
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  alert("¡Gracias por tu compra! Esta es una demostración escolar, no se realizó ningún pago.");
  carrito = [];
  guardarDatos();
  actualizarContador();

  bootstrap.Modal.getInstance(document.getElementById("modalCarrito")).hide();
}

document.getElementById("formulario").addEventListener("submit", function(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (!nombre || !correo || !mensaje) {
    alert("Completa todos los campos.");
    return;
  }

  alert("¡Gracias por contactarnos! Tu mensaje fue registrado en esta demostración.");
  this.reset();
});

let visitas = Number(localStorage.getItem("visitas")) || 0;
visitas++;
localStorage.setItem("visitas", visitas);

document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  actualizarContador();
});
