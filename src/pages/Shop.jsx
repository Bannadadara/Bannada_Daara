export default function Shop({ products, setSelectedProduct }) {
  return (
    <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(p => (
        <div
          key={p.id}
          className="bg-white shadow rounded p-4 cursor-pointer"
          onClick={() => setSelectedProduct(p)}
        >
          <img
            src={p.image}
            alt={p.name}
            className="h-40 w-full object-cover rounded"
          />
          <h3 className="font-bold mt-2">{p.name}</h3>
          <p className="text-purple-600 font-bold">₹{p.price}</p>
        </div>
      ))}
    </div>
  );
}
